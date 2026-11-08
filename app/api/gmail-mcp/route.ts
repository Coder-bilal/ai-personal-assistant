import { NextRequest, NextResponse } from "next/server";
import { insforge } from "../../lib/insforge";

// Helper to base64url-decode email body parts
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  try {
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch (e) {
    return "";
  }
}

// Recursively extract email body text
function extractBody(payload: any): string {
  if (payload.body?.data) {
    return base64UrlDecode(payload.body.data);
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return base64UrlDecode(part.body.data);
      }
      if (part.mimeType === "text/html" && part.body?.data) {
        return base64UrlDecode(part.body.data).replace(/<[^>]*>/g, ""); 
      }
      if (part.parts) {
        const nested = extractBody(part);
        if (nested) return nested;
      }
    }
  }
  return "";
}

// Authenticated fetch wrapper for Google API
async function fetchGoogleAPI(endpoint: string, token: string, method = "GET", body?: any) {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${endpoint}`, {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Gmail API Error (${res.status}): ${errText}`);
  }
  return res.json();
}

// Refresh Google OAuth token helper (persisting directly to users.bio JSON)
async function getActiveAccessToken(userId: string) {
  const { data: dbUser, error: dbError } = await insforge.database
    .from("users")
    .select("integrations")
    .eq("id", userId)
    .maybeSingle();

  if (dbError || !dbUser) {
    throw new Error("Could not retrieve user integrations from database");
  }

  const gmail = dbUser.integrations?.gmail;
  if (!gmail || gmail.isSimulated || !gmail.refreshToken) {
    return null; // Fallback to simulated/mock data
  }

  // Check if token is still valid (60 seconds buffer)
  if (gmail.accessToken && gmail.expiresAt && gmail.expiresAt > Date.now() + 60000) {
    return gmail.accessToken;
  }

  console.log("[API MCP] Access token expired or expiring soon. Refreshing...");

  // Token is expired. Refresh it!
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === "your_google_client_id_here") {
    console.warn("[API MCP] GOOGLE_CLIENT_ID/SECRET not configured in .env. Falling back.");
    return null;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: gmail.refreshToken,
      grant_type: "refresh_token"
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to refresh Google OAuth token: ${errText}`);
  }

  const data = await res.json();
  const newAccessToken = data.access_token;
  const newExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;

  // Persist updated token to db
  const updatedIntegrations = {
    ...dbUser.integrations,
    gmail: {
      ...gmail,
      accessToken: newAccessToken,
      expiresAt: newExpiresAt
    }
  };

  await insforge.database
    .from("users")
    .update({ integrations: updatedIntegrations })
    .eq("id", userId);

  console.log("[API MCP] Token refreshed and saved successfully.");
  return newAccessToken;
}

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { method, params, userId, id = 1 } = requestBody;
    if (!method || !userId) {
      return NextResponse.json({
        jsonrpc: "2.0",
        error: { code: -32600, message: "Invalid Request: method and userId are required" },
        id
      }, { status: 400 });
    }

    let result: any = null;
    let error: any = null;
    const token = await getActiveAccessToken(userId).catch(err => {
      console.error("[API MCP] Token fetch/refresh exception:", err);
      return null;
    });

    if (token) {
      try {
        switch (method) {
          case "gmail_list_messages": {
            const q = params?.q || "label:inbox";
            const maxResults = params?.maxResults || 10;
            const listData = await fetchGoogleAPI(
              `messages?q=${encodeURIComponent(q)}&maxResults=${maxResults}`,
              token
            );
            const messages = listData.messages || [];
            const detailedMessages = await Promise.all(
              messages.map(async (msg: any) => {
                try {
                  const detail = await fetchGoogleAPI(
                    `messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
                    token
                  );
                  const headers = detail.payload?.headers || [];
                  const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
                  const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "No Subject";
                  const date = headers.find((h: any) => h.name.toLowerCase() === "date")?.value || detail.internalDate;
                  return {
                    id: detail.id,
                    threadId: detail.threadId,
                    from,
                    subject,
                    date: new Date(isNaN(Number(date)) ? date : Number(date)).toISOString(),
                    snippet: detail.snippet,
                    labels: detail.labelIds || []
                  };
                } catch (e) {
                  return null;
                }
              })
            );
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    messages: detailedMessages.filter(Boolean)
                  }, null, 2)
                }
              ]
            };
            break;
          }
          case "gmail_get_message": {
            const messageId = params?.id;
            const detail = await fetchGoogleAPI(`messages/${messageId}?format=full`, token);
            
            const headers = detail.payload?.headers || [];
            const from = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown Sender";
            const toHeader = headers.find((h: any) => h.name.toLowerCase() === "to")?.value || "";
            const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "No Subject";
            const date = headers.find((h: any) => h.name.toLowerCase() === "date")?.value || detail.internalDate;
            const parsedEmail = {
              id: detail.id,
              threadId: detail.threadId,
              from,
              to: toHeader,
              subject,
              date: new Date(isNaN(Number(date)) ? date : Number(date)).toISOString(),
              snippet: detail.snippet,
              body: extractBody(detail.payload) || detail.snippet,
              labels: detail.labelIds || []
            };
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(parsedEmail, null, 2)
                }
              ]
            };
            break;
          }
          case "gmail_send_message": {
            const { to, subject, body } = params || {};
            const rawMessage = [
              `To: ${to}`,
              `Subject: ${subject}`,
              `Content-Type: text/plain; charset=utf-8`,
              `MIME-Version: 1.0`,
              ``,
              body
            ].join("\r\n");
            const encoded = Buffer.from(rawMessage).toString("base64")
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=+$/, "");
            const sendData = await fetchGoogleAPI("messages/send", token, "POST", {
              raw: encoded
            });
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: "Email sent successfully via Gmail API",
                    messageId: sendData.id,
                    threadId: sendData.threadId
                  }, null, 2)
                }
              ]
            };
            break;
          }
          case "gmail_create_draft": {
            const { to, subject, body } = params || {};
            const rawMessage = [
              `To: ${to}`,
              `Subject: ${subject}`,
              `Content-Type: text/plain; charset=utf-8`,
              `MIME-Version: 1.0`,
              ``,
              body
            ].join("\r\n");
            const encoded = Buffer.from(rawMessage).toString("base64")
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=+$/, "");
            const draftData = await fetchGoogleAPI("drafts", token, "POST", {
              message: { raw: encoded }
            });
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    success: true,
                    message: "Draft created successfully via Gmail API",
                    draft: draftData
                  }, null, 2)
                }
              ]
            };
            break;
          }
          case "gmail_get_thread": {
            const threadId = params?.id;
            const threadData = await fetchGoogleAPI(`threads/${threadId}`, token);
            result = {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(threadData, null, 2)
                }
              ]
            };
            break;
          }
          default:
            error = { code: -32601, message: `Method not found: ${method}` };
        }
      } catch (apiErr: any) {
        console.error("[API MCP] Live Gmail API call failed:", apiErr);
        error = { code: -32603, message: apiErr.message || "Google API request failed." };
      }
    } else {
      error = { code: -32000, message: "No active Gmail connection found for simulation fallback in this mode." };
    }

    const responseFrame = error 
      ? { jsonrpc: "2.0", error, id } 
      : { jsonrpc: "2.0", result, id };

    return NextResponse.json({
      requestFrame: requestBody,
      responseFrame,
      result,
      error
    });
  } catch (err: any) {
    console.error("[API MCP] Error in gmail-mcp API route:", err);
    return NextResponse.json({
      jsonrpc: "2.0",
      error: { code: -32603, message: err.message || "Internal Server Error" },
      id: 1
    }, { status: 500 });
  }
}

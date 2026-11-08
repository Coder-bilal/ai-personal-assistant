/**
 * Gmail Integration Service
 * Provides helper functions for Google OAuth, MIME email construction,
 * email body parsing, and direct Google REST API interactions.
 */

/**
 * Generate the Google OAuth URL for Gmail integration.
 */
export const getGmailOAuthUrl = (): string => {
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "your-google-client-id.apps.googleusercontent.com";
  const redirectUri = encodeURIComponent(window.location.origin + "/auth/gmail-callback");
  const scopes = encodeURIComponent(
    [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" ")
  );

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scopes}&state=gmail_connect`;
};

/**
 * Construct a base64url encoded MIME email for Gmail API.
 */
export const makeRawEmail = (to: string, subject: string, body: string): string => {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    body,
  ].join("\r\n");

  const base64 = btoa(unescape(encodeURIComponent(email)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/**
 * Decode a base64url encoded body from a Gmail message payload.
 */
export const getEmailBody = (message: any): string => {
  let body = "";
  if (message.payload?.body?.data) {
    body = message.payload.body.data;
  } else if (message.payload?.parts) {
    const part =
      message.payload.parts.find((p: any) => p.mimeType === "text/plain") ||
      message.payload.parts[0];
    if (part?.body?.data) {
      body = part.body.data;
    }
  }
  if (body) {
    try {
      const base64 = body.replace(/-/g, "+").replace(/_/g, "/");
      return decodeURIComponent(escape(atob(base64)));
    } catch (e) {
      return "Unable to parse body.";
    }
  }
  return message.snippet || "";
};

/**
 * Fetch a list of email messages from the user's Gmail inbox.
 */
export const fetchGmailMessages = async (
  accessToken: string,
  maxResults: number = 5,
  q: string = ""
): Promise<any> => {
  const url = `https://gmail.googleapis.com/v1/users/me/messages?maxResults=${maxResults}${
    q ? `&q=${encodeURIComponent(q)}` : ""
  }`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  return res.json();
};

/**
 * Fetch detailed metadata (Subject, From, Date) for a single Gmail message.
 */
export const fetchGmailMessageMetadata = async (
  accessToken: string,
  id: string
): Promise<any> => {
  const url = `https://gmail.googleapis.com/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  return res.json();
};

/**
 * Fetch the complete details (body, headers, snippet) for a single Gmail message.
 */
export const fetchGmailMessageDetails = async (
  accessToken: string,
  id: string
): Promise<any> => {
  const url = `https://gmail.googleapis.com/v1/users/me/messages/${id}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  return res.json();
};

/**
 * Create a new draft email in the user's Drafts folder.
 */
export const createGmailDraft = async (
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<any> => {
  const raw = makeRawEmail(to, subject, body);
  const res = await fetch("https://gmail.googleapis.com/v1/users/me/drafts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: { raw } }),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  return res.json();
};

/**
 * Send an email message directly from the user's account.
 */
export const sendGmailMessage = async (
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<any> => {
  const raw = makeRawEmail(to, subject, body);
  const res = await fetch("https://gmail.googleapis.com/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  return res.json();
};

/**
 * Fetch user details (email address) from the Google UserInfo endpoint.
 */
export const fetchGoogleUserInfo = async (accessToken: string): Promise<any> => {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};

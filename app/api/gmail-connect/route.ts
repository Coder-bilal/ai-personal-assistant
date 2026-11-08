import { NextRequest, NextResponse } from "next/server";
import { insforge } from "../../lib/insforge";

export async function GET() {
  return NextResponse.json({
    clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
  });
}

export async function POST(req: NextRequest) {
  try {
    const { code, userId } = await req.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: "Authorization code and User ID are required." },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret || clientId === "your_google_client_id_here") {
      return NextResponse.json(
        { error: "Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are not configured in the server's .env file." },
        { status: 500 }
      );
    }

    console.log("[API Connect] Exchanging code for tokens. Redirect URI: http://localhost:3000/auth/gmail-callback");

    // Exchange code for tokens
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: "http://localhost:3000/auth/gmail-callback",
        grant_type: "authorization_code"
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[API Connect] Google OAuth code exchange failed:", errText);
      return NextResponse.json(
        { error: `Google OAuth code exchange failed: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const { access_token, refresh_token, expires_in } = data;

    // Fetch user email to store with integration if possible
    let emailAddress = "";
    try {
      const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        emailAddress = userInfo.email || "";
      }
    } catch (e) {
      console.warn("[API Connect] Failed to fetch user email during exchange:", e);
    }

    // Fetch existing user record to preserve other integrations
    const { data: dbUser, error: dbError } = await insforge.database
      .from("users")
      .select("integrations")
      .eq("id", userId)
      .maybeSingle();

    if (dbError) {
      return NextResponse.json(
        { error: `Failed to fetch user integrations from database: ${dbError.message}` },
        { status: 500 }
      );
    }

    const currentIntegrations = dbUser?.integrations || {};
    const updatedIntegrations = {
      ...currentIntegrations,
      gmail: {
        connected: true,
        accessToken: access_token,
        refreshToken: refresh_token || currentIntegrations.gmail?.refreshToken,
        expiresAt: Date.now() + (expires_in || 3600) * 1000,
        isSimulated: false,
        email: emailAddress || currentIntegrations.gmail?.email || ""
      }
    };

    // Update user integrations column
    const { error: updateError } = await insforge.database
      .from("users")
      .update({ integrations: updatedIntegrations })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to save Gmail integration to database: ${updateError.message}` },
        { status: 500 }
      );
    }
    console.log("[API Connect] Gmail integration successfully saved to database integrations column.");

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("[API Connect] Gmail connect exception:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

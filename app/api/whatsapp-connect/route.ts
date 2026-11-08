import { NextRequest, NextResponse } from "next/server";
import { initWhatsAppConnection, getWhatsAppSession, disconnectWhatsApp } from "../../../lib/whatsapp";
import { insforge } from "../../lib/insforge";
import fs from "fs";
import path from "path";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Internal Server Error";
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      console.warn("Received empty or invalid JSON body in whatsapp-connect POST:", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { action, userId, phoneNumber } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (action === "connect") {
      await disconnectWhatsApp(userId);

      let session = await initWhatsAppConnection(userId, phoneNumber || undefined, { forceNew: true });

      // Wait briefly for pairing code or QR code generation or immediate connection state changes.
      if (session.status === "connecting" && !session.pairingCode && !session.qrCode) {
        for (let attempt = 0; attempt < 16; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          session = getWhatsAppSession(userId) ?? session;

          if (session.status === "connected" || session.pairingCode || session.qrCode) {
            break;
          }
        }
      }

      return NextResponse.json({
        success: true,
        status: session.status,
        pairingCode: session.pairingCode || null,
        qrCode: session.qrCode || null,
      });
    }

    if (action === "status") {
      const session = getWhatsAppSession(userId);

      if (!session) {
        const { data: dbUser } = await insforge.database
          .from("users")
          .select("integrations")
          .eq("id", userId)
          .maybeSingle();

        const integrations = dbUser?.integrations || {};
        const whatsapp = integrations.whatsapp;

        if (whatsapp?.connected) {
          if (whatsapp.isSimulated) {
            return NextResponse.json({
              success: true,
              status: "connected",
              isSimulated: true
            });
          } else {
            // Check if creds.json exists and is registered. If not, the session is cleared, so do not reconnect.
            const credsFile = path.join(process.cwd(), ".whatsapp-sessions", userId, "creds.json");
            let isRegistered = false;
            if (fs.existsSync(credsFile)) {
              try {
                const creds = JSON.parse(fs.readFileSync(credsFile, "utf-8"));
                isRegistered = !!creds.registered;
              } catch (e) {}
            }

            if (!isRegistered) {
              // Update database integrations state to null
              const currentIntegrations = dbUser?.integrations || {};
              const updatedIntegrations = {
                ...currentIntegrations,
                whatsapp: null
              };
              await insforge.database
                .from("users")
                .update({ integrations: updatedIntegrations })
                .eq("id", userId);

              return NextResponse.json({
                success: true,
                status: "disconnected",
              });
            }

            // Auto-reconnect background process
            initWhatsAppConnection(userId, whatsapp.phoneNumber).catch(console.error);
            return NextResponse.json({
              success: true,
              status: "connecting",
            });
          }
        }

        return NextResponse.json({
          success: true,
          status: "disconnected",
        });
      }

      return NextResponse.json({
        success: true,
        status: session.status,
        pairingCode: session.pairingCode || null,
        qrCode: session.qrCode || null,
      });
    }

    if (action === "disconnect") {
      await disconnectWhatsApp(userId);
      return NextResponse.json({ success: true, status: "disconnected" });
    }

    if (action === "connect-simulated") {
      const { data: dbUser } = await insforge.database
        .from("users")
        .select("integrations")
        .eq("id", userId)
        .maybeSingle();

      const currentIntegrations = dbUser?.integrations || {};
      const updatedIntegrations = {
        ...currentIntegrations,
        whatsapp: {
          connected: true,
          phoneNumber: phoneNumber || "+15550199",
          isSimulated: true,
          connectedAt: new Date().toISOString()
        }
      };

      await insforge.database
        .from("users")
        .update({ integrations: updatedIntegrations })
        .eq("id", userId);

      return NextResponse.json({
        success: true,
        status: "connected",
        isSimulated: true
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    console.error("WhatsApp connect API exception:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

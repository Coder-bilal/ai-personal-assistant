import { NextRequest, NextResponse } from "next/server";
import { insforge } from "../../../lib/insforge";
import { GoogleGenAI } from "@google/genai";

type AppActivity = {
  id: string;
  app: string;
  title: string;
  description: string;
  body: string;
  time?: string;
};

type AlertCandidate = {
  activityId: string;
  sourceApp: string;
  title: string;
  description: string;
  fullDetails: string;
  priority: "high" | "medium" | "low";
  requiresResponse: boolean;
  condition: string;
  suggestedAction: string;
};

function normalizePriority(value: unknown): "high" | "medium" | "low" {
  return value === "high" || value === "low" ? value : "medium";
}

function buildHeuristicCandidates(activity: AppActivity[]): AlertCandidate[] {
  const importantTerms = ["urgent", "asap", "deadline", "blocked", "approve", "review", "reply", "respond", "follow up", "follow-up", "invoice", "confirm"];

  return activity
    .filter(item => importantTerms.some(term => `${item.title} ${item.description} ${item.body}`.toLowerCase().includes(term)))
    .slice(0, 5)
    .map(item => ({
      activityId: item.id,
      sourceApp: item.app,
      title: item.app === "gmail" ? "Email may need attention" : "Message may need follow-up",
      description: item.description || item.title,
      fullDetails: item.body || item.description,
      priority: /urgent|asap|deadline|blocked/i.test(`${item.title} ${item.description} ${item.body}`) ? "high" : "medium",
      requiresResponse: /reply|respond|confirm|approve|review|follow/i.test(`${item.title} ${item.description} ${item.body}`),
      condition: "AI auto-monitor detected important connected app activity",
      suggestedAction: "Review this item and respond, resolve, snooze, or convert it into a task."
    }));
}

async function buildAiCandidates(activity: AppActivity[]): Promise<AlertCandidate[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey || activity.length === 0) return buildHeuristicCandidates(activity);

  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are AuraSync's alert monitor. Analyze only this real connected app activity and return important alerts that deserve the user's attention.

Real activity:
${JSON.stringify(activity.slice(0, 25), null, 2)}

Return valid JSON only:
[
  {
    "activityId": "must match one activity id",
    "sourceApp": "gmail or whatsapp",
    "title": "short alert title",
    "description": "one sentence summary",
    "fullDetails": "specific details from the real activity",
    "priority": "high" | "medium" | "low",
    "requiresResponse": boolean,
    "condition": "why this alert was triggered",
    "suggestedAction": "recommended next action"
  }
]

Rules:
- Only create alerts for genuinely important items: deadlines, approvals, unanswered direct asks, urgent language, follow-ups, blockers, invoices, tasks, or commitments.
- Do not invent facts.
- Return [] if nothing is important.`,
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text || "[]");
    if (!Array.isArray(parsed)) return [];

    const activityIds = new Set(activity.map(item => `${item.app}:${item.id}`));
    return parsed
      .filter(item => activityIds.has(`${item.sourceApp}:${item.activityId}`))
      .slice(0, 5)
      .map(item => ({
        activityId: String(item.activityId),
        sourceApp: item.sourceApp === "whatsapp" ? "whatsapp" : "gmail",
        title: String(item.title || "Important app activity"),
        description: String(item.description || ""),
        fullDetails: String(item.fullDetails || item.description || ""),
        priority: normalizePriority(item.priority),
        requiresResponse: Boolean(item.requiresResponse),
        condition: String(item.condition || "AI auto-monitor detected important connected app activity"),
        suggestedAction: String(item.suggestedAction || "Review this item and take the next action.")
      }));
  } catch (error) {
    console.error("[alert-auto-generation] Gemini alert generation failed, falling back to heuristics:", error);
    return buildHeuristicCandidates(activity);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 1. Fetch user integrations from database
    const { data: dbUser, error: dbError } = await insforge.database
      .from("users")
      .select("integrations")
      .eq("id", userId)
      .maybeSingle();

    if (dbError || !dbUser) {
      return NextResponse.json({ error: "User not found or database error" }, { status: 404 });
    }

    const integrations = dbUser?.integrations || {};
    const isGmailConnected = !!integrations.gmail?.connected;
    const isWhatsAppConnected = !!integrations.whatsapp?.connected;

    if (!isGmailConnected && !isWhatsAppConnected) {
      return NextResponse.json({ candidates: [], message: "No connected apps to scan." });
    }

    const origin = req.nextUrl.origin;
    const activity: AppActivity[] = [];

    // 2. Fetch Gmail data if connected
    if (isGmailConnected) {
      try {
        const gmailRes = await fetch(`${origin}/api/gmail-mcp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: "gmail_list_messages",
            params: { q: "label:inbox is:unread", maxResults: 10 },
            userId
          })
        });

        if (gmailRes.ok) {
          const data = await gmailRes.json();
          const text = data.result?.content?.[0]?.text;
          const messages = text ? JSON.parse(text).messages || [] : [];
          for (const message of messages) {
            activity.push({
              id: message.id,
              app: "gmail",
              title: message.subject || "Unread Gmail message",
              description: message.snippet || "",
              body: message.body || message.snippet || "",
              time: message.date
            });
          }
        }
      } catch (e) {
        console.error("Error fetching Gmail messages in alerts generator:", e);
      }
    }

    // 3. Fetch WhatsApp data if connected
    if (isWhatsAppConnected) {
      try {
        const waRes = await fetch(`${origin}/api/whatsapp-mcp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: "whatsapp_get_recent_messages",
            userId
          })
        });

        if (waRes.ok) {
          const data = await waRes.json();
          const text = data.result?.content?.[0]?.text;
          const messages = text ? JSON.parse(text).messages || [] : [];
          for (const message of messages) {
            activity.push({
              id: message.id || `${message.chatName}-${message.timestamp}`,
              app: "whatsapp",
              title: message.chatName || message.from || "WhatsApp message",
              description: message.body || "",
              body: message.body || "",
              time: message.timestamp
            });
          }
        }
      } catch (e) {
        console.error("Error fetching WhatsApp messages in alerts generator:", e);
      }
    }

    // 4. Run AI candidate extraction
    const candidates = await buildAiCandidates(activity);

    return NextResponse.json({ candidates });
  } catch (err: any) {
    console.error("Error in alerts generator API:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { insforge } from "../lib/insforge";

// Import Gmail Integration helpers
import {
  getGmailOAuthUrl,
  makeRawEmail,
  getEmailBody,
  fetchGmailMessages,
  fetchGmailMessageMetadata,
  fetchGmailMessageDetails,
  createGmailDraft,
  sendGmailMessage,
  fetchGoogleUserInfo,
} from "../lib/gmail";

// Import Modular Dashboard Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import OverviewTab from "./components/OverviewTab";
import ChatTab from "./components/ChatTab";
import BriefingTab from "./components/BriefingTab";
import IntegrationsTab from "./components/IntegrationsTab";
import AlertsTab from "./components/AlertsTab";
import SettingsTab from "./components/SettingsTab";
import PricingTab from "./components/PricingTab";
import ConnectModal from "./components/ConnectModal";
import SettingsModal, { PLATFORM_MCP_TOOLS } from "./components/SettingsModal";
import WhatsAppConnectModal from "./components/WhatsAppConnectModal";

// Custom type definitions for state management
interface Message {
  id: string;
  sender: "user" | "aura";
  text: string;
  time: string;
  toolCall?: {
    name: string;
    arguments: Record<string, any>;
    status: "running" | "success" | "error";
    result?: any;
  };
}

interface AlertItem {
  id: string;
  severity: "critical" | "high" | "info";
  source: "Gmail" | "WhatsApp" | "Telegram" | "Outlook" | "Slack";
  title: string;
  content: string;
  time: string;
  resolved: boolean;
}

function DashboardContent() {
  const { user, logout, loading, fetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sidebar collapsible state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Handle URL tab changes reactively
  const handleTabChange = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  // Mobile menu open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);



  // Dynamic Time State for Welcome Banner
  const [currentTime, setCurrentTime] = useState("");

  // AI Agent Tab states removed (handled inside ChatTab component)


  // Integrations Tab connection states
  const [integrations, setIntegrations] = useState({
    gmail: false,
    whatsapp: false,
    slack: false,
    outlook: false,
    discord: false,
    linkedin: false,
    telegram: false,
    other: false,
  });

  // Gmail-specific MCP connection states
  const [gmailAddress, setGmailAddress] = useState("");
  const [gmailDrafts, setGmailDrafts] = useState<any[]>([]);
  const [gmailAccessToken, setGmailAccessToken] = useState("");
  const [gmailError, setGmailError] = useState<string | null>(null);

  // WhatsApp-specific connection states
  const [showWhatsAppConnectModal, setShowWhatsAppConnectModal] = useState(false);
  const [whatsAppPhoneNumber, setWhatsAppPhoneNumber] = useState("");
  const [whatsAppPairingCode, setWhatsAppPairingCode] = useState<string | null>(null);
  const [whatsAppQrCode, setWhatsAppQrCode] = useState<string | null>(null);
  const [whatsAppConnectStatus, setWhatsAppConnectStatus] = useState<string | null>(null);
  const [isConnectingWhatsApp, setIsConnectingWhatsApp] = useState(false);
  const [isDisconnectingWhatsApp, setIsDisconnectingWhatsApp] = useState(false);

  // Modals and tool execution states for MCP
  const [activeSettingsPlatform, setActiveSettingsPlatform] = useState<string | null>(null);
  const [activeConnectPlatform, setActiveConnectPlatform] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  const [connectEmailInput, setConnectEmailInput] = useState("");
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [toolInputs, setToolInputs] = useState<Record<string, Record<string, any>>>({});
  const [toolOutputs, setToolOutputs] = useState<Record<string, any>>({});

  // Briefing Tab states
  const [hasBriefings, setHasBriefings] = useState(false);

  // Alerts Tab states
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

  // Fetch alerts from database
  const fetchAlertsFromDb = async () => {
    if (!user?.id) return;
    try {
      const { data: dbAlerts, error } = await insforge.database
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("triggered_at", { ascending: false });

      if (error) {
        console.error("Error fetching alerts:", error);
        return;
      }

      if (dbAlerts) {
        const mappedAlerts: AlertItem[] = dbAlerts.map((a: any) => {
          let severity: "critical" | "high" | "info" = "info";
          if (a.priority === "high") severity = "critical";
          else if (a.priority === "medium") severity = "high";

          let source: "Gmail" | "WhatsApp" | "Telegram" | "Outlook" | "Slack" = "Gmail";
          const src = a.source_app?.toLowerCase() || "";
          if (src.includes("whatsapp")) source = "WhatsApp";
          else if (src.includes("telegram")) source = "Telegram";
          else if (src.includes("outlook")) source = "Outlook";
          else if (src.includes("slack")) source = "Slack";

          let time = "Just now";
          if (a.triggered_at) {
            const triggeredDate = new Date(a.triggered_at);
            const diffMs = Date.now() - triggeredDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) time = "Just now";
            else if (diffMins < 60) time = `${diffMins} mins ago`;
            else {
              const diffHours = Math.floor(diffMins / 60);
              if (diffHours < 24) time = `${diffHours} hours ago`;
              else time = triggeredDate.toLocaleDateString();
            }
          }

          return {
            id: a.id,
            severity,
            source,
            title: a.title,
            content: a.description || a.full_details || "",
            time,
            resolved: a.status === "resolved",
            // Preserve original database fields for detail panel/AI actions
            created_at: a.triggered_at || a.created_at,
            triggered_at: a.triggered_at,
            source_app: a.source_app,
            priority: a.priority,
            status: a.status,
            full_details: a.full_details || a.description || "",
            description: a.description || "",
            app_logo: a.app_logo,
            requires_response: a.requires_response,
            suggested_action: a.suggested_action,
            last_action: a.last_action,
            condition: a.condition
          };
        });
        setAlerts(mappedAlerts);
      }
    } catch (err) {
      console.error("Exception fetching alerts:", err);
    }
  };

  // Dismiss / resolve alert in database
  const dismissAlertInDb = async (alertId: string) => {
    try {
      const { error } = await insforge.database
        .from("alerts")
        .update({ status: "resolved" })
        .eq("id", alertId);

      if (error) {
        console.error("Error dismissing alert in DB:", error);
        return;
      }

      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
      );
    } catch (err) {
      console.error("Exception dismissing alert:", err);
    }
  };

  // Scan and generate alerts using AI
  const handleScanAlerts = async () => {
    if (!user?.id || autoGenerating) return;
    setAutoGenerating(true);
    setScanMessage("Scanning connected apps with AI...");
    try {
      const res = await fetch("/api/alerts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (res.ok) {
        const data = await res.json();
        const candidates = data.candidates || [];
        
        if (candidates.length > 0) {
          let insertedCount = 0;
          for (const candidate of candidates) {
            const dedupeKey = `auto-ai:${user.id}:${candidate.sourceApp}:${candidate.activityId}`;
            
            // Check if alert already exists in DB
            const { data: existing } = await insforge.database
              .from("alerts")
              .select("id")
              .eq("dedupe_key", dedupeKey)
              .maybeSingle();

            if (existing) continue;

            const { error: insertError } = await insforge.database
              .from("alerts")
              .insert({
                user_id: user.id,
                dedupe_key: dedupeKey,
                title: candidate.title,
                description: candidate.description,
                full_details: candidate.fullDetails,
                source_app: candidate.sourceApp,
                app_logo: candidate.sourceApp === "gmail" ? "/001-gmail.png" : "/002-whatsapp.png",
                priority: candidate.priority,
                status: "triggered",
                condition: candidate.condition,
                requires_response: candidate.requiresResponse,
                suggested_action: candidate.suggestedAction
              });

            if (!insertError) {
              insertedCount++;
            } else {
              console.error("Error inserting alert:", insertError);
            }
          }
          
          await fetchAlertsFromDb();
          setScanMessage(`AI scan completed. Created ${insertedCount} new alerts.`);
        } else {
          setScanMessage("AI scanned connected apps and found no new important alerts.");
        }
      } else {
        const errText = await res.text();
        console.error("Failed to generate alerts:", errText);
        setScanMessage("Failed to run AI scan.");
      }
    } catch (err) {
      console.error("Exception scanning alerts:", err);
      setScanMessage("Error running AI scan.");
    } finally {
      setAutoGenerating(false);
      setTimeout(() => setScanMessage(""), 5000);
    }
  };

  // Dynamic Briefing States
  const [briefData, setBriefData] = useState<any>(user?.dashboard_brief || null);
  const [loadingBrief, setLoadingBrief] = useState(!user?.dashboard_brief);
  const [refreshingBrief, setRefreshingBrief] = useState(false);

  const fetchBriefData = async (isRefresh = false) => {
    if (!user?.id) return;
    if (isRefresh) {
      setRefreshingBrief(true);
    } else if (!briefData) {
      setLoadingBrief(true);
    } else {
      setRefreshingBrief(true);
    }

    try {
      const res = await fetch("/api/dashboard-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          forceRegenerate: isRefresh
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBriefData(data);
      } else {
        console.error("Failed to fetch dashboard brief:", await res.text());
      }
    } catch (err) {
      console.error("Error loading dashboard brief:", err);
    } finally {
      setLoadingBrief(false);
      setRefreshingBrief(false);
    }
  };

  // Sync state if user.dashboard_brief changes (e.g. from authentication fetch)
  useEffect(() => {
    if (user?.dashboard_brief) {
      setBriefData(user.dashboard_brief);
      setLoadingBrief(false);
    }
  }, [user?.dashboard_brief]);

  // Fetch brief data and alerts on mount or when user ID changes
  useEffect(() => {
    if (user?.id) {
      fetchBriefData();
      fetchAlertsFromDb();
    }
  }, [user?.id]);

  // Settings State
  const [profileName, setProfileName] = useState("Bilal Akhtar");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [assistantContext, setAssistantContext] = useState(
    "Personal productivity, communication triage, and executive follow-ups"
  );
  const [summaryDetail, setSummaryDetail] = useState("standard");
  const [replyTone, setReplyTone] = useState("friendly");
  const [autoPrepareReplies, setAutoPrepareReplies] = useState(true);
  const [proactiveActions, setProactiveActions] = useState(true);
  const [briefingCadence, setBriefingCadence] = useState("morning");
  const [deliveryChannels, setDeliveryChannels] = useState<string[]>(["in_app", "email"]);
  const [syncFrequency, setSyncFrequency] = useState("real_time");
  const [priorityThreshold, setPriorityThreshold] = useState("medium_high");
  const [notificationMethods, setNotificationMethods] = useState<string[]>(["in_app", "email", "push"]);
  const [dataRetention, setDataRetention] = useState("90_days");
  const [saveMemory, setSaveMemory] = useState(true);
  const [productAnalytics, setProductAnalytics] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load settings from localStorage on mount, sync with user profile if none exist
  useEffect(() => {
    const saved = localStorage.getItem("aurasync_assistant_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profileName) setProfileName(parsed.profileName);
        if (parsed.timezone) setTimezone(parsed.timezone);
        if (parsed.assistantContext) setAssistantContext(parsed.assistantContext);
        if (parsed.summaryDetail) setSummaryDetail(parsed.summaryDetail);
        if (parsed.replyTone) setReplyTone(parsed.replyTone);
        if (parsed.autoPrepareReplies !== undefined) setAutoPrepareReplies(parsed.autoPrepareReplies);
        if (parsed.proactiveActions !== undefined) setProactiveActions(parsed.proactiveActions);
        if (parsed.briefingCadence) setBriefingCadence(parsed.briefingCadence);
        if (parsed.deliveryChannels) setDeliveryChannels(parsed.deliveryChannels);
        if (parsed.syncFrequency) setSyncFrequency(parsed.syncFrequency);
        if (parsed.priorityThreshold) setPriorityThreshold(parsed.priorityThreshold);
        if (parsed.notificationMethods) setNotificationMethods(parsed.notificationMethods);
        if (parsed.dataRetention) setDataRetention(parsed.dataRetention);
        if (parsed.saveMemory !== undefined) setSaveMemory(parsed.saveMemory);
        if (parsed.productAnalytics !== undefined) setProductAnalytics(parsed.productAnalytics);
        if (parsed.isDarkMode !== undefined) setIsDarkMode(parsed.isDarkMode);
      } catch (e) {
        console.error("Failed to load settings from localStorage", e);
      }
    } else if (user) {
      setProfileName(user.profile?.name || user.metadata?.name || "Bilal Akhtar");
    }
  }, [user]);

  // Set formatted current time
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentTime(new Date().toLocaleDateString("en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);


  // Database load helper
  const loadIntegrationsFromDb = async (userId: string) => {
    try {
      console.log("[DB] Loading integrations for user:", userId);
      const { data: dbUser } = await insforge.database
        .from("users")
        .select("integrations")
        .eq("id", userId)
        .maybeSingle();

      if (dbUser && dbUser.integrations) {
        console.log("[DB] Successfully loaded integrations from users table integrations column.");
        const ints = dbUser.integrations;
        setIntegrations({
          gmail: !!ints.gmail?.connected,
          whatsapp: !!ints.whatsapp?.connected,
          slack: !!ints.slack?.connected,
          outlook: !!ints.outlook?.connected,
          discord: !!ints.discord?.connected,
          linkedin: !!ints.linkedin?.connected,
          telegram: !!ints.telegram?.connected,
          other: !!ints.other?.connected,
        });
        if (ints.gmail?.email) {
          setGmailAddress(ints.gmail.email);
        }
        if (ints.gmail?.accessToken) {
          setGmailAccessToken(ints.gmail.accessToken);
        }
        if (ints.gmail?.drafts) {
          setGmailDrafts(ints.gmail.drafts);
        }
      }
    } catch (err) {
      console.error("[DB] Exception loading integrations:", err);
    }
  };

  // Database save helper
  const saveIntegrationsToDb = async (
    updatedInts: typeof integrations,
    updatedGmail: string,
    updatedDrafts: any[],
    updatedToken: string
  ) => {
    if (!user) return;
    try {
      console.log("[DB] Saving integrations for user:", user.id);
      
      // Fetch current integrations first to preserve other platforms
      const { data: dbUser } = await insforge.database
        .from("users")
        .select("integrations")
        .eq("id", user.id)
        .maybeSingle();

      const currentIntegrations = dbUser?.integrations || {};

      const updatedIntegrations = {
        ...currentIntegrations,
        gmail: updatedInts.gmail ? {
          connected: true,
          accessToken: updatedToken || currentIntegrations.gmail?.accessToken,
          refreshToken: currentIntegrations.gmail?.refreshToken,
          expiresAt: currentIntegrations.gmail?.expiresAt,
          isSimulated: currentIntegrations.gmail?.isSimulated || false,
          email: updatedGmail || currentIntegrations.gmail?.email || "",
          drafts: updatedDrafts || currentIntegrations.gmail?.drafts || []
        } : null,
        whatsapp: updatedInts.whatsapp ? (currentIntegrations.whatsapp || { connected: true, isSimulated: true }) : null,
        slack: updatedInts.slack ? (currentIntegrations.slack || { connected: true, isSimulated: true }) : null,
        outlook: updatedInts.outlook ? (currentIntegrations.outlook || { connected: true, isSimulated: true }) : null,
        discord: updatedInts.discord ? (currentIntegrations.discord || { connected: true, isSimulated: true }) : null,
        linkedin: updatedInts.linkedin ? (currentIntegrations.linkedin || { connected: true, isSimulated: true }) : null,
        telegram: updatedInts.telegram ? (currentIntegrations.telegram || { connected: true, isSimulated: true }) : null,
        other: updatedInts.other ? (currentIntegrations.other || { connected: true, isSimulated: true }) : null,
      };

      const { error: updateError } = await insforge.database
        .from("users")
        .update({ integrations: updatedIntegrations })
        .eq("id", user.id);

      if (updateError) {
        console.error("[DB] Error saving integrations to users table:", updateError);
      } else {
        console.log("[DB] Successfully saved integrations to users table.");
        await fetchUser();
      }
    } catch (err) {
      console.error("[DB] Exception saving integrations:", err);
    }
  };

  // Google OAuth redirect helper
  const handleGmailOAuthConnect = async () => {
    try {
      const res = await fetch("/api/gmail-connect");
      const data = await res.json();
      if (data.clientId && data.clientId !== "your_google_client_id_here") {
        const redirectUri = encodeURIComponent(window.location.origin + "/auth/gmail-callback");
        const scopes = encodeURIComponent([
          "https://www.googleapis.com/auth/gmail.readonly",
          "https://www.googleapis.com/auth/gmail.modify",
          "https://www.googleapis.com/auth/gmail.compose",
          "https://www.googleapis.com/auth/gmail.send",
          "https://www.googleapis.com/auth/userinfo.email"
        ].join(" "));
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${data.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;
        window.location.assign(googleAuthUrl);
      } else {
        alert("Google Client ID is not configured in environment variables.");
      }
    } catch (err) {
      console.error("Failed to start Gmail connection:", err);
      alert("An error occurred while connecting to Google.");
    }
  };

  // Gmail API Error Handler
  const handleGmailApiError = (err: any, toolName: string) => {
    console.error("[Gmail API Error]", err);
    if (err?.message === "UNAUTHORIZED") {
      setGmailError("session_expired");
      setGmailAccessToken("");
      const updated = { ...integrations, gmail: false };
      setIntegrations(updated);
      saveIntegrationsToDb(updated, gmailAddress, gmailDrafts, "");

      setToolOutputs((prev) => ({
        ...prev,
        [toolName]: {
          error: "Gmail authorization expired. Please reconnect to renew your session.",
          code: 401,
        },
      }));
    } else {
      setToolOutputs((prev) => ({
        ...prev,
        [toolName]: {
          error: err.message || "Failed to execute Gmail API command.",
          details: err,
        },
      }));
    }
  };

  // Redirect to sign-in page if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  // Load integrations and configurations from InsForge database on mount / user change
  useEffect(() => {
    if (!loading && user) {
      loadIntegrationsFromDb(user.id);
    }
  }, [user, loading]);

  // Sync active tab from URL query parameter reactively
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["dashboard", "ai-agent", "briefing", "integrations", "alerts", "settings", "pricing"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Polling WhatsApp Connection Status
  useEffect(() => {
    let intervalId: any;
    if (showWhatsAppConnectModal && (whatsAppConnectStatus === "connecting" || whatsAppPairingCode || whatsAppQrCode)) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch("/api/whatsapp-connect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "status", userId: user?.id })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.status === "connected") {
              setWhatsAppConnectStatus("connected");
              setWhatsAppPairingCode(null);
              setWhatsAppQrCode(null);
              setIsConnectingWhatsApp(false);
              clearInterval(intervalId);
              
              const updated = { ...integrations, whatsapp: true };
              setIntegrations(updated);
              await fetchUser();
              
              // Auto-close modal after a brief success message display
              setTimeout(() => {
                setShowWhatsAppConnectModal(false);
              }, 1500);
            } else if (data.status === "disconnected") {
              // If server is disconnected, the session has terminated. Stop polling and clear state.
              setWhatsAppConnectStatus("disconnected");
              setWhatsAppPairingCode(null);
              setWhatsAppQrCode(null);
              setIsConnectingWhatsApp(false);
              clearInterval(intervalId);
            } else {
              if (data.pairingCode) {
                setWhatsAppPairingCode(data.pairingCode);
              }
              if (data.qrCode) {
                setWhatsAppQrCode(data.qrCode);
              }
            }
          }
        } catch (e) {
          console.error("Error polling WhatsApp status:", e);
        }
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showWhatsAppConnectModal, whatsAppConnectStatus, whatsAppPairingCode, whatsAppQrCode, user, integrations, fetchUser]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#080b11] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-20 h-20 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/50 border-t-violet-400 animate-[spin_4s_linear_infinite]" />
          <div className="absolute w-12 h-12 rounded-full bg-violet-950/30 border border-violet-500/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.8)] animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight mb-2">Initializing Dashboard</h3>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          Establishing secure, encrypted connection to Aura.ai sync engines...
        </p>
      </div>
    );
  }



  // Run simulated or real MCP tool execution
  const runSimulatedTool = (platformId: string, toolName: string, inputs: Record<string, any>) => {
    setToolOutputs((prev) => ({
      ...prev,
      [toolName]: null, // loading indicator
    }));

    if (platformId === "gmail" && gmailAccessToken) {
      // Real Gmail REST API calls using extracted service functions
      if (toolName === "gmail_list_messages") {
        const maxResults = Number(inputs.maxResults || 5);
        const q = inputs.q || "";

        fetchGmailMessages(gmailAccessToken, maxResults, q)
          .then(async (data) => {
            if (!data.messages) {
              setToolOutputs((prev) => ({ ...prev, [toolName]: { messages: [], resultCount: 0 } }));
              return;
            }
            const detailPromises = data.messages
              .slice(0, 3)
              .map((m: any) => fetchGmailMessageMetadata(gmailAccessToken, m.id));
            const details = await Promise.all(detailPromises);
            const parsedMessages = details.map((d: any) => {
              const headers = d.payload?.headers || [];
              const subject = headers.find((h: any) => h.name === "Subject")?.value || "(No Subject)";
              const from = headers.find((h: any) => h.name === "From")?.value || "Unknown";
              const date = headers.find((h: any) => h.name === "Date")?.value || "";
              return { id: d.id, from, subject, date, snippet: d.snippet };
            });
            setToolOutputs((prev) => ({
              ...prev,
              [toolName]: {
                messages: parsedMessages,
                resultCount: data.messages.length,
                estimatedSize: data.resultSizeEstimate,
              },
            }));
          })
          .catch((err) => handleGmailApiError(err, toolName));
      } else if (toolName === "gmail_get_message") {
        const msgId = inputs.id;
        if (!msgId) {
          setToolOutputs((prev) => ({ ...prev, [toolName]: { error: "Message ID is required." } }));
          return;
        }
        fetchGmailMessageDetails(gmailAccessToken, msgId)
          .then((data) => {
            const headers = data.payload?.headers || [];
            const subject = headers.find((h: any) => h.name === "Subject")?.value || "(No Subject)";
            const from = headers.find((h: any) => h.name === "From")?.value || "Unknown";
            const to = headers.find((h: any) => h.name === "To")?.value || "";
            const date = headers.find((h: any) => h.name === "Date")?.value || "";
            const body = getEmailBody(data);

            setToolOutputs((prev) => ({
              ...prev,
              [toolName]: {
                id: data.id,
                threadId: data.threadId,
                labelIds: data.labelIds,
                from,
                to,
                subject,
                date,
                body,
                snippet: data.snippet,
              },
            }));
          })
          .catch((err) => handleGmailApiError(err, toolName));
      } else if (toolName === "gmail_create_draft") {
        const { to, subject, body } = inputs;
        if (!to || !subject || !body) {
          setToolOutputs((prev) => ({ ...prev, [toolName]: { error: "to, subject, and body are required." } }));
          return;
        }
        createGmailDraft(gmailAccessToken, to, subject, body)
          .then((data) => {
            const newDraft = {
              id: data.id,
              to,
              subject,
              body,
              createdAt: new Date().toLocaleTimeString(),
            };
            setGmailDrafts((prev) => {
              const updated = [...prev, newDraft];
              saveIntegrationsToDb(integrations, gmailAddress, updated, gmailAccessToken);
              return updated;
            });
            setToolOutputs((prev) => ({
              ...prev,
              [toolName]: {
                status: "success",
                draftId: data.id,
                message: "Gmail draft created successfully in your real inbox.",
                draft: newDraft,
              },
            }));
          })
          .catch((err) => handleGmailApiError(err, toolName));
      } else if (toolName === "gmail_send_message") {
        const { to, subject, body } = inputs;
        if (!to || !subject || !body) {
          setToolOutputs((prev) => ({ ...prev, [toolName]: { error: "to, subject, and body are required." } }));
          return;
        }
        sendGmailMessage(gmailAccessToken, to, subject, body)
          .then((data) => {
            setToolOutputs((prev) => ({
              ...prev,
              [toolName]: {
                status: "success",
                messageId: data.id,
                to,
                subject,
                sentAt: new Date().toISOString(),
                info: "Email sent successfully via real Gmail SMTP.",
              },
            }));
          })
          .catch((err) => handleGmailApiError(err, toolName));
      } else if (toolName === "gmail_search_messages") {
        const q = inputs.query || "";
        if (!q) {
          setToolOutputs((prev) => ({ ...prev, [toolName]: { error: "query is required." } }));
          return;
        }
        fetchGmailMessages(gmailAccessToken, 5, q)
          .then(async (data) => {
            if (!data.messages) {
              setToolOutputs((prev) => ({ ...prev, [toolName]: { messages: [], query: q, resultCount: 0 } }));
              return;
            }
            const detailPromises = data.messages.map((m: any) =>
              fetchGmailMessageMetadata(gmailAccessToken, m.id)
            );
            const details = await Promise.all(detailPromises);
            const parsed = details.map((d: any) => {
              const subject = d.payload?.headers?.find((h: any) => h.name === "Subject")?.value || "(No Subject)";
              return { id: d.id, subject, snippet: d.snippet };
            });
            setToolOutputs((prev) => ({
              ...prev,
              [toolName]: {
                status: "success",
                query: q,
                messages: parsed,
                resultCount: parsed.length,
              },
            }));
          })
          .catch((err) => handleGmailApiError(err, toolName));
      }
      return;
    }

    // Mock execution if no token or other platform
    setTimeout(() => {
      let output: any = {};

      if (platformId === "gmail") {
        if (toolName === "gmail_list_messages") {
          const q = (inputs.q || "").toLowerCase();
          const mockEmails = [
            {
              id: "msg_909",
              from: "sarah.j@company.com",
              subject: "Re: Q2 Budget Review Slides",
              snippet:
                "Hi Bilal, I uploaded the slides. Please check slide 5 for locks. Let me know by 4 PM.",
            },
            {
              id: "msg_301",
              from: "aws-security-alerts@amazon.com",
              subject: "AWS Security Alert: Root Login",
              snippet: "A login to root account detected from IP 192.168.1.45 at 11:10 AM. Confirmed?",
            },
          ];
          const filtered = q ? mockEmails.filter((m) => m.subject.toLowerCase().includes(q)) : mockEmails;
          output = { messages: filtered, resultCount: filtered.length, isSimulated: true };
        } else if (toolName === "gmail_get_message") {
          output = {
            id: inputs.id || "msg_909",
            from: "sarah.j@company.com",
            subject: "Re: Q2 Budget Review Slides",
            body:
              "Hi Bilal,\n\nI uploaded the slides. Please check slide 5 for locks. Let me know by 4 PM.\n\nBest,\nSarah",
            snippet: "Hi Bilal, I uploaded the slides. Please check slide 5 for locks...",
            isSimulated: true,
          };
        } else if (toolName === "gmail_create_draft") {
          output = {
            status: "success",
            draftId: `draft_${Math.random().toString(36).substr(2, 9)}`,
            message: "Simulated draft created successfully.",
            isSimulated: true,
          };
        } else if (toolName === "gmail_send_message") {
          output = {
            status: "success",
            messageId: `msg_${Math.random().toString(36).substr(2, 9)}`,
            message: "Simulated email sent successfully.",
            isSimulated: true,
          };
        } else if (toolName === "gmail_search_messages") {
          output = {
            messages: [
              {
                id: "msg_909",
                subject: "Re: Q2 Budget Review Slides",
                snippet: "Hi Bilal, I uploaded the slides...",
              },
            ],
            explanation: "Search parsed with operators. Returned matched indexed headers.",
            isSimulated: true,
          };
        }
      } else if (platformId === "whatsapp") {
        if (toolName === "whatsapp_list_chats") {
          output = {
            chats: [
              {
                id: "chat_01",
                name: "Mark (Co-Founder)",
                unreadCount: 1,
                lastMessage: "Can we move the sync to 1:30 PM?",
              },
              {
                id: "chat_02",
                name: "Sarah (Product)",
                unreadCount: 0,
                lastMessage: "I sent you the budget slides on Gmail.",
              },
              { id: "chat_03", name: "Family Group", unreadCount: 15, lastMessage: "Dad: See you this weekend!" },
            ],
            status: "synced",
          };
        } else if (toolName === "whatsapp_get_messages") {
          output = {
            phone: inputs.phone,
            messages: [
              { sender: "Mark", text: "Hey Bilal, are you free for our sync today?", time: "9:15 AM" },
              { sender: "Bilal", text: "Yes, standard 3:00 PM works for me.", time: "9:20 AM" },
              {
                sender: "Mark",
                text: "Client requested to move the sync from 3:00 PM to 1:30 PM today. Action required to confirm.",
                time: "10:14 AM",
              },
            ],
          };
        } else if (toolName === "whatsapp_send_message") {
          output = {
            status: "delivered",
            messageId: `wa_msg_${Math.random().toString(36).substr(2, 9)}`,
            phone: inputs.phone,
            timestamp: Date.now(),
          };
        }
      } else if (platformId === "slack") {
        if (toolName === "slack_list_channels") {
          output = {
            channels: [
              { id: "C01", name: "general", topic: "Company-wide announcements" },
              { id: "C02", name: "engineering", topic: "Dev discussions and deployment logs" },
              { id: "C03", name: "marketing", topic: "Q2 campaigns and budget alignments" },
            ],
          };
        } else if (toolName === "slack_get_channel_history") {
          output = {
            channel: inputs.channel,
            messages: [
              { user: "Sarah", text: "Budget slides are ready, posting the link now", ts: "11:43 AM" },
              { user: "Alex", text: "Looks solid. @Bilal let us know when you sign off on these.", ts: "11:50 AM" },
            ],
          };
        } else if (toolName === "slack_post_message") {
          output = {
            ok: true,
            channel: inputs.channel,
            ts: `${Date.now() / 1000}.0001`,
            message: { text: inputs.text, username: "AuraSync Bot" },
          };
        }
      } else {
        output = {
          status: "success",
          platform: platformId,
          tool: toolName,
          executedAt: new Date().toLocaleTimeString(),
          inputs: inputs,
          result: "Simulated output returned successfully.",
        };
      }

      setToolOutputs((prev) => ({
        ...prev,
        [toolName]: output,
      }));
    }, 1200);
  };



  // WhatsApp-specific Handlers
  const handleStartConnectWhatsApp = async (phoneNumber: string) => {
    if (!user) return;
    setIsConnectingWhatsApp(true);
    setWhatsAppPairingCode(null);
    setWhatsAppQrCode(null);
    setWhatsAppConnectStatus("connecting");

    try {
      const res = await fetch("/api/whatsapp-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "connect",
          userId: user.id,
          phoneNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsAppPairingCode(data.pairingCode || null);
        setWhatsAppConnectStatus(data.status);
      } else {
        alert(data.error || "Failed to initiate WhatsApp connection");
        setWhatsAppConnectStatus(null);
        setIsConnectingWhatsApp(false);
      }
    } catch (err) {
      console.error("Error starting WhatsApp connect:", err);
      alert("An error occurred while starting WhatsApp connection");
      setWhatsAppConnectStatus(null);
      setIsConnectingWhatsApp(false);
    }
  };

  const handleStartConnectWhatsAppQR = async () => {
    if (!user) return;
    setIsConnectingWhatsApp(true);
    setWhatsAppPairingCode(null);
    setWhatsAppQrCode(null);
    setWhatsAppConnectStatus("connecting");

    try {
      const res = await fetch("/api/whatsapp-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "connect",
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsAppQrCode(data.qrCode || null);
        setWhatsAppConnectStatus(data.status);
      } else {
        alert(data.error || "Failed to initiate WhatsApp QR connection");
        setWhatsAppConnectStatus(null);
        setIsConnectingWhatsApp(false);
      }
    } catch (err) {
      console.error("Error starting WhatsApp QR connect:", err);
      alert("An error occurred while starting WhatsApp QR connection");
      setWhatsAppConnectStatus(null);
      setIsConnectingWhatsApp(false);
    }
  };

  const handleConnectSimulatedWhatsApp = async () => {
    if (!user) return;
    setIsConnectingWhatsApp(true);

    try {
      const res = await fetch("/api/whatsapp-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "connect-simulated",
          userId: user.id,
          phoneNumber: "+15550199",
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...integrations, whatsapp: true };
        setIntegrations(updated);
        // Refresh auth user data
        await fetchUser();
        setShowWhatsAppConnectModal(false);
      } else {
        alert(data.error || "Failed to connect simulated WhatsApp");
      }
    } catch (err) {
      console.error("Error connecting simulated WhatsApp:", err);
      alert("An error occurred while connecting simulated WhatsApp");
    } finally {
      setIsConnectingWhatsApp(false);
    }
  };

  const handleDisconnectWhatsApp = async () => {
    if (!user) return;
    setIsDisconnectingWhatsApp(true);
    try {
      const res = await fetch("/api/whatsapp-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "disconnect",
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...integrations, whatsapp: false };
        setIntegrations(updated);
        await fetchUser();
      } else {
        alert(data.error || "Failed to disconnect WhatsApp");
      }
    } catch (err) {
      console.error("Error disconnecting WhatsApp:", err);
      alert("An error occurred while disconnecting WhatsApp");
    } finally {
      setIsDisconnectingWhatsApp(false);
    }
  };

  // Handle connection click
  const handleConnectClick = (key: string) => {
    const k = key as keyof typeof integrations;
    if (integrations[k]) {
      // Disconnect
      if (k === "whatsapp") {
        handleDisconnectWhatsApp();
        return;
      }
      const updated = { ...integrations, [k]: false };
      setIntegrations(updated);

      let newGmailAddress = gmailAddress;
      let newGmailDrafts = gmailDrafts;
      if (k === "gmail") {
        newGmailAddress = "";
        setGmailAddress("");
        newGmailDrafts = [];
        setGmailDrafts([]);
        setGmailAccessToken("");
        setGmailError(null);
      }

      saveIntegrationsToDb(updated, newGmailAddress, newGmailDrafts, "");
    } else {
      // Open Connect Modal
      if (k === "whatsapp") {
        setShowWhatsAppConnectModal(true);
        setWhatsAppPhoneNumber("");
        setWhatsAppPairingCode(null);
        setWhatsAppQrCode(null);
        setWhatsAppConnectStatus(null);
        setIsConnectingWhatsApp(false);
        return;
      }
      setActiveConnectPlatform(k);
      setConnectEmailInput(k === "gmail" && user?.email ? user.email : "");
      setConnectionLogs([]);
    }
  };

  // Start MCP Connection log animation
  const startConnectFlow = (email: string) => {
    if (!activeConnectPlatform) return;
    setIsConnecting(true);
    setConnectionLogs([]);

    const logs = [
      `[MCP] Initializing local ${activeConnectPlatform}-mcp gateway...`,
      `[MCP] Checking dependencies...`,
      `[MCP] Loading module "@modelcontextprotocol/server-${
        activeConnectPlatform === "outlook" ? "outlook" : activeConnectPlatform
      }"...`,
      `[MCP] Establishing secure connection to platform endpoints...`,
      `[MCP] Authenticating user "${email || "default"}" via OAuth 2.0 flow...`,
      `[MCP] Exchanging authorization code for access credentials...`,
      `[MCP] OAuth handshake completed. Credentials securely encrypted in local keychain.`,
      `[MCP] Checking server capabilities...`,
      `[MCP] Registered ${PLATFORM_MCP_TOOLS[activeConnectPlatform]?.length || 3} executable tools.`,
      `[MCP] Local server listening on stdio.`,
      `[MCP] Connection established! Syncing initial data cache...`,
      `[MCP] Platform synced successfully. Live event handlers active.`,
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < logs.length) {
        setConnectionLogs((prev) => [...prev, logs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsConnecting(false);
        const updated = { ...integrations, [activeConnectPlatform]: true };
        setIntegrations(updated);
        saveIntegrationsToDb(updated, gmailAddress, gmailDrafts, "");

        // Auto-close after a success delay
        setTimeout(() => {
          setActiveConnectPlatform(null);
        }, 1200);
      }
    }, 250);
  };

  return (
    <div
      className={`min-h-screen bg-[#080b11] text-gray-100 flex flex-row font-sans overflow-hidden select-none ${
        isDarkMode ? "dark" : "light"
      }`}
    >
      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        profileName={profileName}
        user={user}
        logout={logout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeAlertsCount={alerts.filter(a => !a.resolved).length}
      />

      {/* 2. MAIN VIEWPORT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP BAR / NAVIGATION HEADER */}
        <Header
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          logout={logout}
        />

        {/* MAIN CONTENT AREA - CONDITIONAL RENDERING BY TAB */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {activeTab === "dashboard" && (
            <OverviewTab
              profileName={profileName}
              currentTime={currentTime}
              briefData={{
                ...briefData,
                stats: {
                  importantCount: alerts.filter(a => !a.resolved).length,
                  priorityCount: briefData?.stats?.priorityCount || 0,
                  followUpCount: briefData?.stats?.followUpCount || 0,
                }
              }}
              loading={loadingBrief}
              refreshing={refreshingBrief}
              handleRefresh={() => fetchBriefData(true)}
              setActiveTab={handleTabChange}
              integrations={integrations}
            />
          )}

          {activeTab === "ai-agent" && (
            <ChatTab />
          )}

          {activeTab === "briefing" && (
            <BriefingTab hasBriefings={hasBriefings} setHasBriefings={setHasBriefings} />
          )}

          {activeTab === "integrations" && (
            <IntegrationsTab
              integrations={integrations}
              setActiveSettingsPlatform={setActiveSettingsPlatform}
              handleConnectClick={handleConnectClick}
              isDisconnectingWhatsApp={isDisconnectingWhatsApp}
            />
          )}

          {activeTab === "alerts" && (
            <AlertsTab
              alerts={alerts}
              setAlerts={setAlerts}
              onDismissAlert={dismissAlertInDb}
              onRefreshAlerts={fetchAlertsFromDb}
              onScanAlerts={handleScanAlerts}
              autoGenerating={autoGenerating}
              scanMessage={scanMessage}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              profileName={profileName}
              setProfileName={setProfileName}
              timezone={timezone}
              setTimezone={setTimezone}
              assistantContext={assistantContext}
              setAssistantContext={setAssistantContext}
              summaryDetail={summaryDetail}
              setSummaryDetail={setSummaryDetail}
              replyTone={replyTone}
              setReplyTone={setReplyTone}
              autoPrepareReplies={autoPrepareReplies}
              setAutoPrepareReplies={setAutoPrepareReplies}
              proactiveActions={proactiveActions}
              setProactiveActions={setProactiveActions}
              briefingCadence={briefingCadence}
              setBriefingCadence={setBriefingCadence}
              deliveryChannels={deliveryChannels}
              setDeliveryChannels={setDeliveryChannels}
              syncFrequency={syncFrequency}
              setSyncFrequency={setSyncFrequency}
              priorityThreshold={priorityThreshold}
              setPriorityThreshold={setPriorityThreshold}
              notificationMethods={notificationMethods}
              setNotificationMethods={setNotificationMethods}
              dataRetention={dataRetention}
              setDataRetention={setDataRetention}
              saveMemory={saveMemory}
              setSaveMemory={setSaveMemory}
              productAnalytics={productAnalytics}
              setProductAnalytics={setProductAnalytics}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              integrations={integrations}
              setActiveTab={handleTabChange}
              user={user}
              logout={logout}
            />
          )}

          {activeTab === "pricing" && <PricingTab />}
        </main>
      </div>

      {/* 3. MODALS */}
      <ConnectModal
        activeConnectPlatform={activeConnectPlatform}
        setActiveConnectPlatform={setActiveConnectPlatform}
        isConnecting={isConnecting}
        connectionLogs={connectionLogs}
        connectEmailInput={connectEmailInput}
        setConnectEmailInput={setConnectEmailInput}
        handleGmailOAuthConnect={handleGmailOAuthConnect}
        startConnectFlow={startConnectFlow}
      />

      <WhatsAppConnectModal
        isOpen={showWhatsAppConnectModal}
        onClose={() => {
          setShowWhatsAppConnectModal(false);
          if (whatsAppConnectStatus === "connecting" || whatsAppPairingCode || whatsAppQrCode) {
            handleDisconnectWhatsApp();
          }
        }}
        phoneNumber={whatsAppPhoneNumber}
        setPhoneNumber={setWhatsAppPhoneNumber}
        pairingCode={whatsAppPairingCode}
        qrCode={whatsAppQrCode}
        status={whatsAppConnectStatus}
        isConnecting={isConnectingWhatsApp}
        onStartConnect={handleStartConnectWhatsApp}
        onStartConnectQR={handleStartConnectWhatsAppQR}
        onConnectSimulated={handleConnectSimulatedWhatsApp}
      />

      <SettingsModal
        activeSettingsPlatform={activeSettingsPlatform}
        setActiveSettingsPlatform={setActiveSettingsPlatform}
        gmailAddress={gmailAddress}
        expandedTool={expandedTool}
        setExpandedTool={setExpandedTool}
        toolInputs={toolInputs}
        setToolInputs={setToolInputs}
        toolOutputs={toolOutputs}
        setToolOutputs={setToolOutputs}
        runSimulatedTool={runSimulatedTool}
        handleConnectClick={handleConnectClick}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#080b11]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"></div>
          <p className="text-xs text-slate-500 animate-pulse">Loading dashboard environment...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

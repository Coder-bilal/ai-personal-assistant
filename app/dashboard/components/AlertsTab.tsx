"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { insforge } from "../../lib/insforge";
import {
  Bell,
  Clock,
  Flag,
  CheckCircle,
  AlertCircle,
  Plus,
  RefreshCw,
  X,
  Bot,
  Wand2,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  PauseCircle,
  Send
} from "lucide-react";

interface AlertItem {
  id: string;
  severity: "critical" | "high" | "info";
  source: "Gmail" | "WhatsApp" | "Telegram" | "Outlook" | "Slack";
  title: string;
  content: string;
  time: string;
  resolved: boolean;
  created_at?: string;
  triggered_at?: string;
  source_app?: string;
  priority?: string;
  status?: string;
  full_details?: string;
  description?: string;
  app_logo?: string;
  requires_response?: boolean;
  suggested_action?: string;
  last_action?: string;
  condition?: string;
}

interface SuggestedAlert {
  title: string;
  description: string;
  apps: string[];
  condition: string;
  priority: string;
  action: string;
}

interface AlertsTabProps {
  alerts: AlertItem[];
  setAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
  onDismissAlert?: (id: string) => void;
  onRefreshAlerts?: () => void;
  onScanAlerts?: () => void;
  autoGenerating?: boolean;
  scanMessage?: string;
}

const safeFormatDistanceToNow = (dateStr: any) => {
  if (!dateStr) return "recently";
  try {
    const parsed = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    if (isValid(parsed)) {
      return formatDistanceToNow(parsed, { addSuffix: true });
    }
  } catch (e) {}
  return "recently";
};

const safeFormatDate = (dateStr: any) => {
  if (!dateStr) return "";
  try {
    const parsed = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    if (isValid(parsed)) {
      return format(parsed, "MMM d, h:mm a");
    }
  } catch (e) {}
  return dateStr;
};

export default function AlertsTab({
  alerts,
  setAlerts,
  onDismissAlert,
  onRefreshAlerts,
  onScanAlerts,
  autoGenerating = false,
  scanMessage = "",
}: AlertsTabProps) {
  const { user } = useAuth();
  const currentUser = user as any;
  const currentUserId = currentUser?.id;

  const [suggestedAlerts, setSuggestedAlerts] = useState<SuggestedAlert[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [draftReply, setDraftReply] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [aiSuggestedAction, setAiSuggestedAction] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [replyGuidance, setReplyGuidance] = useState("");
  const [alertsError, setAlertsError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    apps: ["gmail"] as string[],
    condition: "",
    priority: "medium",
    notificationMethod: "in_app",
    frequency: "real_time",
    action: "notify"
  });

  const appOptions = [
    { key: "gmail", label: "Gmail", logo: "/001-gmail.png" },
    { key: "whatsapp", label: "WhatsApp", logo: "/002-whatsapp.png" },
    { key: "slack", label: "Slack", logo: "/005-slack.png" },
    { key: "telegram", label: "Telegram", logo: "/004-telegram.png" },
    { key: "discord", label: "Discord", logo: "/006-discord.png" },
  ];

  const connectedApps: Record<string, boolean> = {
    gmail: !!currentUser?.integrations?.gmail?.connected,
    whatsapp: !!currentUser?.integrations?.whatsapp?.connected,
    slack: !!currentUser?.integrations?.slack?.connected,
    telegram: !!currentUser?.integrations?.telegram?.connected,
    discord: !!currentUser?.integrations?.discord?.connected,
  };
  const connectedAppKeys = appOptions.filter(app => connectedApps[app.key]).map(app => app.key);

  const priorityStyle: Record<string, string> = {
    high: "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  const statusStyle: Record<string, string> = {
    active: "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20",
    triggered: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    snoozed: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  const fetchSuggestions = React.useCallback(async () => {
    if (!currentUserId) return;
    setSuggestionsLoading(true);
    try {
      const res = await fetch(`/api/alerts/suggestions?userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestedAlerts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch alert suggestions:", error);
    } finally {
      setSuggestionsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      void fetchSuggestions();
    }
  }, [currentUserId, fetchSuggestions]);

  useEffect(() => {
    if (!currentUserId) return;
    const channel = `alerts:${currentUserId}`;
    let active = true;
    const refreshFromRealtime = () => {
      if (!active) return;
      if (onRefreshAlerts) onRefreshAlerts();
      void fetchSuggestions();
    };

    insforge.realtime.connect()
      .then(() => insforge.realtime.subscribe(channel))
      .catch(error => console.error("Failed to subscribe to alert realtime:", error));

    insforge.realtime.on("alert_created", refreshFromRealtime);
    insforge.realtime.on("alert_updated", refreshFromRealtime);
    insforge.realtime.on("alert_rule_created", refreshFromRealtime);
    insforge.realtime.on("alert_suggestions_updated", refreshFromRealtime);

    return () => {
      active = false;
      insforge.realtime.off("alert_created", refreshFromRealtime);
      insforge.realtime.off("alert_updated", refreshFromRealtime);
      insforge.realtime.off("alert_rule_created", refreshFromRealtime);
      insforge.realtime.off("alert_suggestions_updated", refreshFromRealtime);
      insforge.realtime.unsubscribe(channel);
    };
  }, [currentUserId, onRefreshAlerts, fetchSuggestions]);

  const toggleFormApp = (app: string) => {
    setForm(current => ({
      ...current,
      apps: current.apps.includes(app) ? current.apps.filter(item => item !== app) : [...current.apps, app]
    }));
  };

  const handleCreateAlert = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUserId || creating) return;
    const selectedConnectedApps = form.apps.filter(app => connectedApps[app]);
    if (selectedConnectedApps.length === 0) {
      setAlertsError("Connect at least one app before creating an alert rule.");
      return;
    }
    setCreating(true);
    setAlertsError("");
    try {
      const res = await fetch("/api/alerts/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, ...form, apps: selectedConnectedApps })
      });
      if (res.ok) {
        setShowCreateDialog(false);
        const firstConnected = appOptions.find(app => connectedApps[app.key])?.key || "gmail";
        setForm({
          name: "",
          description: "",
          apps: [firstConnected],
          condition: "",
          priority: "medium",
          notificationMethod: "in_app",
          frequency: "real_time",
          action: "notify"
        });
        if (onRefreshAlerts) onRefreshAlerts();
        await fetchSuggestions();
      } else {
        const data = await res.json().catch(() => null);
        setAlertsError(data?.error || "Unable to create alert rule.");
      }
    } catch (error) {
      console.error("Failed to create alert rule:", error);
      setAlertsError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleAlertAction = async (action: string) => {
    if (!selectedAlert || !currentUserId) return;
    try {
      const res = await fetch("/api/alerts/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, alertId: selectedAlert.id, action })
      });
      if (res.ok) {
        const updated = await res.json();
        
        setSelectedAlert(current => current ? { 
          ...current, 
          status: updated.status || current.status,
          last_action: updated.last_action || current.last_action,
          resolved: updated.status === "resolved" ? true : current.resolved
        } : current);
        
        if (onRefreshAlerts) onRefreshAlerts();
      }
    } catch (error) {
      console.error("Failed to update alert:", error);
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedAlert || drafting) return;
    setDrafting(true);
    try {
      const res = await fetch("/api/alerts/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: selectedAlert.id,
          feature: "reply",
          replyContext: replyGuidance
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDraftReply(data.result || "");
      }
    } catch (error) {
      console.error("Failed to draft alert reply:", error);
    } finally {
      setDrafting(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedAlert || summaryLoading) return;
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/alerts/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: selectedAlert.id,
          feature: "summary"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.result || "");
      }
    } catch (error) {
      console.error("Failed to generate alert summary:", error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGenerateNextAction = async () => {
    if (!selectedAlert || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/alerts/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: selectedAlert.id,
          feature: "next_action"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestedAction(data.result || "");
      }
    } catch (error) {
      console.error("Failed to generate next action:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const applySuggestion = (suggestion: SuggestedAlert) => {
    setForm({
      name: suggestion.title,
      description: suggestion.description,
      apps: suggestion.apps,
      condition: suggestion.condition,
      priority: suggestion.priority,
      notificationMethod: "in_app",
      frequency: "real_time",
      action: suggestion.action
    });
    setShowCreateDialog(true);
  };

  const today = new Date().toDateString();
  const activeCount = alerts.filter(a => !a.resolved).length;
  const triggeredTodayCount = alerts.filter(a => {
    const d = a.created_at || a.triggered_at;
    return d && new Date(d).toDateString() === today;
  }).length;
  const highPriorityCount = alerts.filter(a => (a.priority === "high" || a.severity === "critical") && !a.resolved).length;
  const resolvedCount = alerts.filter(a => a.resolved).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in text-gray-250">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b]/20 pb-4">
        <div className="space-y-1 text-left">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Alerts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Important alerts from your connected apps, monitored in the background by Trigger.dev.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={onScanAlerts}
            disabled={autoGenerating}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {autoGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{autoGenerating ? "Scanning..." : "Scan with AI"}</span>
          </button>
          <button
            onClick={() => {
              const firstConnected = appOptions.find(app => connectedApps[app.key])?.key || "gmail";
              setForm(current => ({ ...current, apps: [firstConnected] }));
              setShowCreateDialog(true);
            }}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Alert</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Alerts */}
        <div className="bg-white dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b]/45 rounded-2xl p-5 shadow-sm relative flex flex-col justify-between overflow-hidden text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-550 dark:text-slate-400">Active Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
              <Bell className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{activeCount}</h3>
          </div>
        </div>

        {/* Triggered Today */}
        <div className="bg-white dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b]/45 rounded-2xl p-5 shadow-sm relative flex flex-col justify-between overflow-hidden text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-555 dark:text-slate-400">Triggered Today</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-550 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{triggeredTodayCount}</h3>
          </div>
        </div>

        {/* High Priority Alerts */}
        <div className="bg-white dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b]/45 rounded-2xl p-5 shadow-sm relative flex flex-col justify-between overflow-hidden text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-555 dark:text-slate-400">High Priority Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-650 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flag className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{highPriorityCount}</h3>
          </div>
        </div>

        {/* Resolved Alerts */}
        <div className="bg-white dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b]/45 rounded-2xl p-5 shadow-sm relative flex flex-col justify-between overflow-hidden text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-555 dark:text-slate-400">Resolved Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{resolvedCount}</h3>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Timeline View */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0d121f]/50 border border-slate-200 dark:border-[#1e293b]/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-start justify-between mb-5">
              <div className="space-y-1 text-left">
                <h4 className="text-base font-black text-slate-900 dark:text-white">Recent Alerts Timeline</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Realtime updates from AI and custom Trigger.dev monitoring jobs.
                </p>
              </div>
              <button
                onClick={onRefreshAlerts}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoGenerating ? "animate-spin" : ""}`} />
              </button>
            </div>

            {scanMessage && (
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 text-xs font-bold text-violet-600 dark:text-violet-400 mt-4 mb-6 text-center animate-pulse">
                {scanMessage}
              </div>
            )}

            {alerts.length > 0 ? (
              <div className="relative space-y-0 mt-6 text-left">
                <div className="absolute left-5 top-4 bottom-4 w-px bg-slate-200 dark:bg-white/10" />
                {alerts.map((alert) => {
                  const app = appOptions.find(option => option.key === alert.source_app?.toLowerCase());
                  const createdAt = alert.created_at || alert.triggered_at;
                  return (
                    <button
                      key={alert.id}
                      onClick={() => {
                        setSelectedAlert(alert);
                        setDraftReply("");
                        setAiSummary("");
                        setAiSuggestedAction("");
                        setReplyGuidance("");
                      }}
                      className="relative w-full text-left pl-14 pb-5 last:pb-0 group border-none bg-transparent cursor-pointer"
                    >
                      <span className="absolute left-0 top-1 w-10 h-10 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                        <img src={alert.app_logo || app?.logo || "/003-email.png"} alt="" className="w-5 h-5 object-contain" />
                      </span>
                      <span className="block rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-4 group-hover:border-rose-400 dark:group-hover:border-rose-500/40 transition">
                        <span className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <span>
                            <span className={`block text-sm font-bold ${alert.resolved ? "text-slate-500 line-through" : "text-slate-900 dark:text-white"}`}>{alert.title}</span>
                            <span className={`block text-xs mt-1 leading-relaxed ${alert.resolved ? "text-slate-400 line-through" : "text-slate-600 dark:text-slate-400"}`}>{alert.content}</span>
                          </span>
                          <span className="text-[11px] font-semibold text-slate-450 dark:text-slate-500 whitespace-nowrap">
                            {safeFormatDistanceToNow(createdAt)}
                          </span>
                        </span>
                        <span className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {app?.label || alert.source_app || "Connected app"}
                          </span>
                          <span className={`inline-flex px-2 py-1 rounded-lg border text-[11px] font-bold capitalize ${priorityStyle[alert.priority || "medium"]}`}>
                            {alert.priority || "medium"}
                          </span>
                          <span className={`inline-flex px-2 py-1 rounded-lg border text-[11px] font-bold capitalize ${statusStyle[alert.status || "active"]}`}>
                            {alert.status || "active"}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-400 border border-dashed border-[#1e293b]/40 rounded-xl mt-6">
                No alerts found in the database. Click "Scan with AI" or connect an integration.
              </div>
            )}
          </div>
        </div>

        {/* AI Suggested Alerts Panel */}
        <div className="bg-white dark:bg-[#0d121f]/50 border border-slate-200 dark:border-[#1e293b]/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">AI Suggested Alerts</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Generated from real connected app activity.
                </p>
              </div>
            </div>

            {suggestionsLoading ? (
              <div className="space-y-3">
                {[1, 2].map(item => (
                  <div key={item} className="h-32 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : suggestedAlerts.length === 0 ? (
              <div className="border border-dashed border-slate-200 dark:border-[#1e293b]/60 rounded-xl p-6 flex flex-col items-center text-center space-y-3 min-h-[190px] justify-center">
                <Bot className="w-8 h-8 text-slate-405" />
                <h5 className="text-xs font-black text-slate-805 dark:text-white">No suggestions yet</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                  Connect Gmail or WhatsApp and sync activity to generate alert recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {suggestedAlerts.map((suggestion) => (
                  <div key={suggestion.title} className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-4 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{suggestion.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{suggestion.description}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold capitalize shrink-0 ${priorityStyle[suggestion.priority]}`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-4">
                      <div className="flex -space-x-2">
                        {suggestion.apps.map((appKey) => {
                          const app = appOptions.find(option => option.key === appKey.toLowerCase());
                          return <img key={appKey} src={app?.logo || "/003-email.png"} alt="" className="w-6.5 h-6.5 rounded-full border-2 border-white dark:border-[#0d111e] bg-white p-0.5 object-contain" />;
                        })}
                      </div>
                      <button
                        onClick={() => applySuggestion(suggestion)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold transition border-none cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Use</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CREATE DIALOG MODAL ── */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateDialog(false)} />
          <form onSubmit={handleCreateAlert} className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0d111e] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-5 text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Alert</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trigger.dev will monitor selected app data and save matches to your alerts feed.</p>
              </div>
              <button type="button" onClick={() => setShowCreateDialog(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition border-none bg-transparent cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {alertsError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 rounded-xl p-3">
                {alertsError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Alert Name *</span>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-rose-500 transition" />
              </label>
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Priority Level *</span>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-rose-500 transition">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </label>
            </div>

            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Description *</span>
              <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-rose-500 resize-none transition" />
            </label>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Selected Apps</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {appOptions.map((app) => {
                  const active = form.apps.includes(app.key);
                  const connected = connectedApps[app.key];
                  return (
                    <button
                      key={app.key}
                      type="button"
                      onClick={() => toggleFormApp(app.key)}
                      disabled={!connected}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition cursor-pointer ${
                        active 
                          ? "border-rose-500 bg-rose-500/10 text-rose-500" 
                          : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5"
                      } ${!connected ? "opacity-40 cursor-not-allowed" : "hover:border-rose-400"}`}
                    >
                      <img src={app.logo} alt="" className="w-4 h-4 object-contain" />
                      <span>{app.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="space-y-1 block">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Alert Condition / Trigger Rule *</span>
              <textarea required value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} rows={3} placeholder="Example: Alert me when Gmail has an unread email containing 'invoice' or 'payment'." className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-rose-500 resize-none transition" />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Notification Method</span>
                <select value={form.notificationMethod} onChange={e => setForm({ ...form, notificationMethod: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-rose-500 transition">
                  <option value="in_app">In-app</option>
                  <option value="email">Email</option>
                  <option value="push">Push</option>
                </select>
              </label>
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Frequency</span>
                <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-rose-500 transition">
                  <option value="real_time">Real-time</option>
                  <option value="15_minutes">Every 15 minutes</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
              </label>
              <label className="space-y-1 block">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Action when Triggered</span>
                <select value={form.action} onChange={e => setForm({ ...form, action: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-rose-500 transition">
                  <option value="notify">Notify me</option>
                  <option value="draft_reply">Draft reply</option>
                  <option value="create_task">Create task</option>
                  <option value="mark_follow_up">Create follow-up</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowCreateDialog(false)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer">Cancel</button>
              <button type="submit" disabled={creating} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer">{creating ? "Creating..." : "Create Alert"}</button>
            </div>
          </form>
        </div>
      )}

      {/* ── ALERTS SIDE-BAR / DETAIL PANEL MODAL ── */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedAlert(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0d111e] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-5 text-left text-slate-800 dark:text-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-11 h-11 rounded-2xl border border-slate-200 dark:border-white/10 bg-white p-2 flex items-center justify-center shadow-sm shrink-0">
                  <img src={selectedAlert.app_logo || "/003-email.png"} alt="" className="w-6.5 h-6.5 object-contain" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">{selectedAlert.title}</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 capitalize">
                    {selectedAlert.source_app || "Connected App"} &bull; {safeFormatDate(selectedAlert.created_at || selectedAlert.triggered_at)}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedAlert(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition border-none bg-transparent cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold capitalize ${priorityStyle[selectedAlert.priority || "medium"]}`}>
                {selectedAlert.priority || "medium"} priority
              </span>
              <span className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold capitalize ${statusStyle[selectedAlert.status || "active"]}`}>
                {selectedAlert.status || "active"}
              </span>
              {selectedAlert.last_action === "task" && (
                <span className="px-2.5 py-0.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-[11px] font-bold text-blue-400 animate-pulse">Converted to Task</span>
              )}
              {selectedAlert.last_action === "follow_up" && (
                <span className="px-2.5 py-0.5 rounded-lg border border-violet-500/30 bg-violet-500/10 text-[11px] font-bold text-violet-400 animate-pulse">Converted to Follow-up</span>
              )}
              {selectedAlert.last_action === "send_reply" && (
                <span className="px-2.5 py-0.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-[11px] font-bold text-emerald-500">Reply Sent</span>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-4 space-y-4">
              <div>
                <span className="block text-xs font-bold text-slate-450 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Alert Content</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selectedAlert.full_details || selectedAlert.content}</p>
              </div>

              {selectedAlert.condition && (
                <div className="text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-white/5">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Trigger Rule:</span> {selectedAlert.condition}
                </div>
              )}

              {/* AI Summary Section */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-750 dark:text-slate-350">AI Summary</span>
                  <button 
                    type="button"
                    onClick={handleGenerateSummary} 
                    disabled={summaryLoading}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/25 text-[10px] font-bold text-violet-600 dark:text-violet-400 disabled:opacity-50 transition cursor-pointer border-none"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{summaryLoading ? "Summarizing..." : aiSummary ? "Regenerate" : "Generate Summary"}</span>
                  </button>
                </div>
                {aiSummary ? (
                  <div className="bg-slate-50 dark:bg-[#030712]/50 rounded-xl p-3 border border-slate-200 dark:border-white/5 text-xs text-slate-650 dark:text-slate-300 space-y-1 animate-fade-in whitespace-pre-line leading-relaxed">
                    {aiSummary}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">Generate an AI summary to get key bullet points instantly.</p>
                )}
              </div>

              {/* AI Next Action Section */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-750 dark:text-slate-350">AI Suggested Action</span>
                  <button 
                    type="button"
                    onClick={handleGenerateNextAction} 
                    disabled={actionLoading}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/25 text-[10px] font-bold text-violet-600 dark:text-violet-400 disabled:opacity-50 transition cursor-pointer border-none"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{actionLoading ? "Thinking..." : aiSuggestedAction ? "Refresh Suggestion" : "Suggest Next Action"}</span>
                  </button>
                </div>
                {(aiSuggestedAction || selectedAlert.suggested_action) ? (
                  <div className="bg-violet-500/5 rounded-xl p-3 border border-violet-500/10 text-xs text-violet-650 dark:text-violet-300 font-semibold animate-fade-in">
                    {aiSuggestedAction || selectedAlert.suggested_action}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No suggestion yet. Ask AI to analyze the next action.</p>
                )}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <button type="button" onClick={() => handleAlertAction("resolved")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/20 transition cursor-pointer"><ClipboardCheck className="w-4 h-4" />Resolve</button>
              <button type="button" onClick={() => handleAlertAction("snoozed")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer"><PauseCircle className="w-4 h-4" />Snooze</button>
              <button type="button" onClick={() => handleAlertAction("task")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-500 hover:bg-blue-500/20 transition cursor-pointer"><CheckCircle className="w-4 h-4" />Task</button>
              <button type="button" onClick={() => handleAlertAction("follow_up")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-xs font-bold text-violet-600 dark:text-violet-500 hover:bg-violet-500/20 transition cursor-pointer"><ArrowRight className="w-4 h-4" />Follow-up</button>
            </div>

            {/* AI Reply Composer Section */}
            {selectedAlert.requires_response && (
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3 bg-slate-50/50 dark:bg-[#030712]/20">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">AI Reply Composer</h4>
                    <p className="text-xs text-slate-550 dark:text-slate-450 font-medium">Draft, edit, and send a reply directly.</p>
                  </div>
                  <button type="button" onClick={handleGenerateDraft} disabled={drafting} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-3.5 py-2 text-xs font-bold text-white transition shadow-lg cursor-pointer border-none">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{drafting ? "Drafting..." : "Generate Draft"}</span>
                  </button>
                </div>
                
                <div className="space-y-1 block">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reply Guidance (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 'Politely decline and suggest next week', 'Acknowledge receipt'" 
                    value={replyGuidance} 
                    onChange={e => setReplyGuidance(e.target.value)} 
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-violet-500 placeholder-slate-500 transition" 
                  />
                </div>

                <div className="space-y-1 block">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Message Draft</label>
                  <textarea value={draftReply} onChange={e => setDraftReply(e.target.value)} rows={4} placeholder="AI generated draft will appear here..." className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-violet-500 resize-none transition" />
                </div>

                <button type="button" onClick={() => handleAlertAction("send_reply")} disabled={!draftReply.trim()} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-50 px-4 py-2.5 text-xs font-bold transition shadow-md border-none cursor-pointer">
                  <Send className="w-4 h-4" />
                  <span>Send Reply</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

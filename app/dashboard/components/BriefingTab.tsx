"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  MessageSquare,
  AtSign,
  CheckCircle,
  ArrowRight,
  Plus,
  RefreshCw,
  Calendar,
  Trash2,
  ChevronRight,
  FileText,
  X,
  Sparkles
} from "lucide-react";

const formatBriefingItemTime = (timeStr: string, id?: string) => {
  if (!timeStr) return "";
  let targetTime = timeStr;
  if (id && id.includes("_")) {
    const parts = id.split("_");
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes("T") && lastPart.includes("Z")) {
      targetTime = lastPart;
    }
  }
  try {
    const parsed = parseISO(targetTime);
    if (isValid(parsed)) {
      const isToday = new Date().toDateString() === parsed.toDateString();
      return isToday ? format(parsed, "h:mm a") : format(parsed, "MMM d, h:mm a");
    }
  } catch (e) {}
  return timeStr;
};

const getBriefingItemTime = (item: any): number => {
  if (!item) return 0;
  if (item.time) {
    const parsed = Date.parse(item.time);
    if (!isNaN(parsed)) return parsed;
  }
  if (item.id && typeof item.id === "string" && item.id.includes("_")) {
    const parts = item.id.split("_");
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes("T") && lastPart.includes("Z")) {
      const parsed = Date.parse(lastPart);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 0;
};

interface BriefingTabProps {
  hasBriefings?: boolean;
  setHasBriefings?: (val: boolean) => void;
}

export default function BriefingTab({ hasBriefings, setHasBriefings }: BriefingTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [briefings, setBriefings] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create dialog form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    apps: [] as string[],
    categories: [] as string[],
    scheduledTime: "09:00",
    frequency: "daily",
    priorityLevel: "medium"
  });

  const [regenError, setRegenError] = useState("");

  const availableApps = [
    { key: "gmail", label: "Gmail", logo: "/001-gmail.png" },
    { key: "whatsapp", label: "WhatsApp", logo: "/002-whatsapp.png" },
    { key: "slack", label: "Slack", logo: "/005-slack.png" },
    { key: "telegram", label: "Telegram", logo: "/004-telegram.png" },
  ];

  const connectedApps: Record<string, boolean> = {
    gmail: !!(user as any)?.integrations?.gmail?.connected,
    whatsapp: !!(user as any)?.integrations?.whatsapp?.connected,
    slack: !!(user as any)?.integrations?.slack?.connected,
    telegram: !!(user as any)?.integrations?.telegram?.connected,
  };
  const availableCategories = ["email", "messages", "mentions", "tasks", "follow_ups"];
  const categoryLabels: Record<string, string> = {
    email: "Email", messages: "Messages", mentions: "Mentions", tasks: "Tasks", follow_ups: "Follow-Ups"
  };
  const categoryIcons: Record<string, any> = {
    email: Mail, messages: MessageSquare, mentions: AtSign, tasks: CheckCircle, follow_ups: ArrowRight
  };
  const categoryColors: Record<string, string> = {
    email: "text-blue-400", messages: "text-emerald-400", mentions: "text-violet-400", tasks: "text-amber-400", follow_ups: "text-rose-400"
  };
  const categoryBg: Record<string, string> = {
    email: "bg-blue-500/10 border-blue-500/20", messages: "bg-emerald-500/10 border-emerald-500/20",
    mentions: "bg-violet-500/10 border-violet-500/20", tasks: "bg-amber-500/10 border-amber-500/20",
    follow_ups: "bg-rose-500/10 border-rose-500/20"
  };

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [briefRes, schedRes] = await Promise.all([
        fetch(`/api/briefings?userId=${user.id}`),
        fetch(`/api/briefings/schedules?userId=${user.id}`)
      ]);
      if (briefRes.ok) {
        const briefData = await briefRes.json();
        setBriefings(briefData);
        if (briefData.length > 0) {
          setHasBriefings?.(true);
        }
      }
      if (schedRes.ok) setSchedules(await schedRes.json());
    } catch (e) {
      console.error("Failed to fetch briefing data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRegenerate = async () => {
    if (!user || regenerating) return;
    setRegenerating(true);
    setRegenError("");
    try {
      const res = await fetch("/api/briefings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const body = await res.json();
      if (res.ok) {
        await fetchData();
      } else {
        setRegenError(body.error || "Failed to generate briefing.");
      }
    } catch (e) {
      console.error("Failed to regenerate briefing:", e);
      setRegenError("Network error. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || creating) return;
    const validApps = form.apps.filter(a => connectedApps[a]);
    if (validApps.length === 0) {
      alert("Please select at least one connected app.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/briefings/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: form.name,
          description: form.description,
          apps: validApps,
          categories: form.categories,
          scheduledTime: form.scheduledTime,
          frequency: form.frequency,
          priorityLevel: form.priorityLevel
        })
      });
      if (res.ok) {
        setShowCreateDialog(false);
        setForm({ name: "", description: "", apps: [], categories: [], scheduledTime: "09:00", frequency: "daily", priorityLevel: "medium" });
        await fetchData();
      }
    } catch (e) {
      console.error("Failed to create schedule:", e);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!user) return;
    setDeletingId(id);
    try {
      await fetch(`/api/briefings/schedules?userId=${user.id}&id=${id}`, { method: "DELETE" });
      await fetchData();
    } catch (e) {
      console.error("Failed to delete schedule:", e);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleArrayItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const latestBriefing = briefings[0] || null;
  const historicalBriefings = briefings.slice(1);

  const priorityBadge: Record<string, string> = {
    high: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-250">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Intelligence Briefing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daily digests generated from all your connected platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
            {regenerating ? "Generating…" : "Regenerate"}
          </button>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 hover:opacity-90 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Custom Briefing
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-40 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />)}
          </div>
        </div>
      ) : (
        <>
          {regenError && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              <span className="font-bold flex-shrink-0">⚠</span>
              <span>{regenError} {regenError.includes("connect") && <button onClick={() => router.push("/dashboard?tab=integrations")} className="underline ml-1 font-semibold hover:text-rose-355 bg-transparent border-none cursor-pointer text-rose-400">Go to Integrations</button>}</span>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ── COLUMN 1: Today's Briefing ── */}
            <div>
              {latestBriefing ? (
                <div className="bg-white dark:bg-[#0d111e]/40 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  {/* Executive Summary Card Header */}
                  <div
                    className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-900/30 dark:via-purple-900/10 dark:to-transparent p-5 cursor-pointer group transition-all duration-300"
                    onClick={() => router.push(`/dashboard/briefing/${latestBriefing.id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Today's Briefing</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
                          {latestBriefing.created_at ? format(parseISO(latestBriefing.created_at), "MMM d, h:mm a") : ""}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-400 transition">{latestBriefing.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-3">{latestBriefing.summary}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 group-hover:underline">
                        Open briefing details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Highlights Feed List */}
                  <div className="p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Highlights Feed</h3>

                    {(() => {
                      const allBriefingItems: any[] = [];
                      if (latestBriefing?.data) {
                        const data = latestBriefing.data;
                        if (data.email) data.email.forEach((item: any) => allBriefingItems.push({ ...item, categoryKey: "email" }));
                        if (data.messages) {
                          data.messages.forEach((item: any) => {
                            if (item.from !== "Me" && item.from !== "Rahul" && item.fromMe !== true) {
                              allBriefingItems.push({ ...item, categoryKey: "messages" });
                            }
                          });
                        }
                        if (data.mentions) data.mentions.forEach((item: any) => allBriefingItems.push({ ...item, categoryKey: "mentions" }));
                        if (data.tasks) data.tasks.forEach((item: any) => allBriefingItems.push({ ...item, categoryKey: "tasks" }));
                        if (data.follow_ups) data.follow_ups.forEach((item: any) => allBriefingItems.push({ ...item, categoryKey: "follow_ups" }));
                      }
                      allBriefingItems.sort((a, b) => getBriefingItemTime(b) - getBriefingItemTime(a));

                      if (allBriefingItems.length === 0) {
                        return (
                          <div className="text-center py-8 text-xs text-slate-400">
                            No items found in today's briefing.
                          </div>
                        );
                      }

                      return (
                        <div className="divide-y divide-slate-100 dark:divide-white/[0.05] max-h-[350px] overflow-y-auto pr-1 space-y-3.5 animate-fade-in">
                          {allBriefingItems.slice(0, 5).map((item, idx) => {
                            const catIcon = categoryIcons[item.categoryKey] || Mail;
                            const catColor = categoryColors[item.categoryKey] || "text-blue-400";
                            const catBg = categoryBg[item.categoryKey] || "bg-blue-500/10 border-blue-500/20";
                            const itemTitle = item.title || item.subject || (item.categoryKey === "messages" ? `Message from ${item.from}` : item.from) || "Untitled Alert";
                            const itemSnippet = item.snippet || item.description || "";
                            const itemApp = item.app || "system";
                            const appSrc = availableApps.find(a => a.key === itemApp.toLowerCase())?.logo;

                            return (
                              <div
                                key={idx}
                                onClick={() => router.push(`/dashboard/briefing/${latestBriefing.id}?category=${item.categoryKey}`)}
                                className="pt-3.5 first:pt-0 group cursor-pointer flex items-start gap-3.5 text-left"
                              >
                                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center flex-shrink-0 relative">
                                  {appSrc ? (
                                    <img src={appSrc} alt={itemApp} className="w-4.5 h-4.5 object-contain" />
                                  ) : (
                                    <FileText className="w-4.5 h-4.5 text-slate-400" />
                                  )}
                                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white dark:border-[#0d111e] flex items-center justify-center ${catBg}`}>
                                    {React.createElement(catIcon, { className: `w-2 h-2 ${catColor}` })}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-400 dark:group-hover:text-indigo-400 transition">{itemTitle}</h4>
                                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                                      {formatBriefingItemTime(item.time, item.id)}
                                    </span>
                                  </div>
                                  {item.from && item.from !== itemTitle && (
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.from}</p>
                                  )}
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-normal">{itemSnippet}</p>
                                </div>
                              </div>
                            );
                          })}
                          {allBriefingItems.length > 5 && (
                            <button
                              onClick={() => router.push(`/dashboard/briefing/${latestBriefing.id}`)}
                              className="w-full text-center pt-3 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition border-none bg-transparent cursor-pointer"
                            >
                              View all {allBriefingItems.length} items →
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-10 text-center bg-white dark:bg-[#0d121f]">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-5 h-5 text-slate-400 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-white mb-1">No briefings yet</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-400 mb-4">Click "Regenerate" to generate your first briefing from connected apps.</p>
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {regenerating ? "Generating…" : "Generate Now"}
                  </button>
                </div>
              )}
            </div>

            {/* ── COLUMN 2: Category List ── */}
            <div>
              {latestBriefing && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d111e]/40 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Category list</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Explore sections in detail</p>
                  </div>
                  <div className="space-y-3">
                    {availableCategories.map(cat => {
                      const Icon = categoryIcons[cat] || Mail;
                      const count = latestBriefing.stats?.[cat] ?? 0;
                      const items = latestBriefing.data?.[cat] ?? [];
                      const firstItem = items[0];
                      const firstItemText = firstItem
                        ? (firstItem.title || firstItem.subject || firstItem.description || firstItem.snippet || "View details")
                        : count === 0 ? "No updates" : "View details";

                      return (
                        <div
                          key={cat}
                          onClick={() => router.push(`/dashboard/briefing/${latestBriefing.id}?category=${cat}`)}
                          className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${categoryBg[cat]}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${categoryColors[cat]}`} />
                              <span className="text-xs font-bold text-slate-800 dark:text-white">{categoryLabels[cat]}</span>
                            </div>
                            {count > 0 && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 dark:bg-black/20 ${categoryColors[cat]}`}>
                                {count}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 pr-2">
                            {firstItemText}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── COLUMN 3: Custom Briefing Section ── */}
            <div className="space-y-6">
              {/* Custom Schedules */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d111e]/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Custom Briefing</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Automated briefing timing</p>
                  </div>
                  <button
                    onClick={() => setShowCreateDialog(true)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-indigo-400 transition border-none bg-transparent cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {schedules.length === 0 ? (
                  <div className="text-center py-6 text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                    No custom schedules yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {schedules.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] group hover:border-slate-300 dark:hover:border-white/10 transition">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${priorityBadge[s.priority_level]}`}>
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                            <p className="text-[9px] text-slate-400 truncate">
                              {s.frequency} @ {s.scheduled_time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleDeleteSchedule(s.id)}
                            disabled={deletingId === s.id}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100 border-none bg-transparent cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Briefings */}
              {historicalBriefings.length > 0 && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d111e]/40 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Past Briefings</h3>
                  <div className="space-y-2">
                    {historicalBriefings.slice(0, 5).map(b => (
                      <div
                        key={b.id}
                        onClick={() => router.push(`/dashboard/briefing/${b.id}`)}
                        className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] cursor-pointer group hover:border-slate-200 dark:hover:border-white/10 transition"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-slate-900 dark:group-hover:text-white transition">{b.title}</p>
                            <p className="text-[9px] text-slate-400">
                              {b.created_at ? format(parseISO(b.created_at), "MMM d, yyyy") : ""}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Create Custom Briefing Dialog ── */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateDialog(false)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0d111e] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.06] bg-white dark:bg-[#0d111e] z-10 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Custom Briefing</h3>
                <p className="text-xs text-slate-400 mt-0.5">Schedule personalized AI-generated briefings</p>
              </div>
              <button onClick={() => setShowCreateDialog(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition border-none bg-transparent cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSchedule} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-1.5">Briefing Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Morning Work Digest"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-650 dark:text-slate-400 mb-1.5">Description / Goal</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Summarize work emails and messages from the team each morning..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition resize-none"
                />
              </div>

              {/* Apps */}
              <div>
                <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-2">Connected Apps</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableApps.map(({ key, label, logo }) => {
                    const isConnected = !!connectedApps[key];
                    const isSelected = form.apps.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={!isConnected}
                        onClick={() => isConnected && setForm(f => ({ ...f, apps: toggleArrayItem(f.apps, key) }))}
                        title={!isConnected ? `${label} is not connected. Connect it from Integrations.` : label}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${!isConnected
                          ? "opacity-40 cursor-not-allowed bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.06] text-slate-400"
                          : isSelected
                            ? "bg-indigo-500 border-indigo-500 text-white"
                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                          }`}
                      >
                        <img src={logo} alt={label} className="w-4 h-4 object-contain flex-shrink-0" />
                        <span className="flex-1 text-left">{label}</span>
                        {!isConnected && (
                          <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Not connected</span>
                        )}
                        {isConnected && isSelected && (
                          <span className="ml-auto w-3.5 h-3.5 rounded-full bg-white/30 flex items-center justify-center text-[9px]">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {availableApps.every(({ key }) => !connectedApps[key]) && (
                  <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
                    ⚠ No apps connected yet. <button onClick={() => { setShowCreateDialog(false); router.push("/dashboard?tab=integrations"); }} className="underline font-semibold bg-transparent border-none text-amber-400 hover:text-amber-300 cursor-pointer">Connect from Integrations</button>
                  </p>
                )}
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, categories: toggleArrayItem(f.categories, cat) }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${form.categories.includes(cat) ? "bg-purple-500 border-purple-500 text-white" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-purple-400"}`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time + Frequency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1.5">Scheduled Time *</label>
                  <input
                    required
                    type="time"
                    value={form.scheduledTime}
                    onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1.5">Frequency *</label>
                  <select
                    required
                    value={form.frequency}
                    onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-slate-655 dark:text-slate-400 mb-2">Priority Level *</label>
                <div className="flex gap-2">
                  {["high", "medium", "low"].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, priorityLevel: level }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border capitalize transition cursor-pointer ${form.priorityLevel === level ? `${priorityBadge[level]} border-current` : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/20"}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !form.name}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                >
                  {creating ? "Creating…" : "Create Briefing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

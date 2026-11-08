"use client";

import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { AlertCircle, Calendar, ShieldCheck, ChevronRight } from "lucide-react";

interface BriefItem {
  id: string;
  app: string;
  type: string;
  title: string;
  summary: string;
  time: string;
  action: string;
}

interface PriorityItem {
  id: string;
  app: string;
  title: string;
  time: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

interface OverviewTabProps {
  profileName: string;
  currentTime: string;
  briefData: {
    stats?: {
      importantCount: number;
      priorityCount: number;
      followUpCount: number;
    };
    brief?: BriefItem[];
    priorityItems?: PriorityItem[];
    generatedAt?: string;
    isSimulated?: boolean;
    warn?: string;
  } | null;
  loading: boolean;
  refreshing: boolean;
  handleRefresh: () => void;
  setActiveTab: (tab: string) => void;
  integrations: {
    gmail: boolean;
    whatsapp: boolean;
    slack: boolean;
    outlook: boolean;
    [key: string]: boolean;
  };
}

// Custom Inline App Logos for Premium Look
const getAppLogo = (app: string, size = "w-5 h-5") => {
  switch (app.toLowerCase()) {
    case "gmail":
      return <img src="/001-gmail.png" alt="Gmail" className={`${size} object-contain shrink-0`} />;
    case "whatsapp":
      return <img src="/002-whatsapp.png" alt="WhatsApp" className={`${size} object-contain shrink-0`} />;
    case "slack":
      return <img src="/005-slack.png" alt="Slack" className={`${size} object-contain shrink-0`} />;
    case "outlook":
    case "calendar":
    case "outlook calendar":
      return <img src="/003-email.png" alt="Outlook" className={`${size} object-contain shrink-0`} />;
    case "telegram":
      return <img src="/004-telegram.png" alt="Telegram" className={`${size} object-contain shrink-0`} />;
    case "discord":
      return <img src="/006-discord.png" alt="Discord" className={`${size} object-contain shrink-0`} />;
    case "linkedin":
      return <img src="/007-linkedin.png" alt="LinkedIn" className={`${size} object-contain shrink-0`} />;
    default:
      return (
        <svg className={`${size} text-slate-400 shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
  }
};

export default function OverviewTab({
  profileName,
  currentTime,
  briefData,
  loading,
  refreshing,
  handleRefresh,
  setActiveTab,
  integrations
}: OverviewTabProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const stats = briefData?.stats || { importantCount: 0, priorityCount: 0, followUpCount: 0 };
  const briefItems = briefData?.brief || [];
  const priorityItems = briefData?.priorityItems || [];
  const isSimulated = briefData?.isSimulated !== false;

  const toggleItemCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const appList = [
    { id: "gmail", name: "Gmail", connected: !!integrations.gmail },
    { id: "whatsapp", name: "WhatsApp", connected: !!integrations.whatsapp },
    { id: "slack", name: "Slack", connected: !!integrations.slack },
    { id: "outlook", name: "Outlook Calendar", connected: !!integrations.outlook }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1e293b]/40 bg-[#0d121f] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:border-[#8b5cf6]/20">
        {/* Glow behind Welcome */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-violet-500/5 filter blur-[80px] pointer-events-none"></div>
        
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400 uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulated ? "bg-amber-450" : "bg-emerald-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulated ? "bg-amber-500" : "bg-emerald-500"}`}></span>
            </span>
            <span>
              {isSimulated ? "Simulation Environment Active" : "Cognitive Live Sync Engine Active"}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300">{profileName}</span>
          </h2>
          
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            {isSimulated ? (
              "Your dashboard is running in Simulation Mode. Connect your Gmail or WhatsApp accounts in the Integrations panel to fetch live communications and generate a personalized brief."
            ) : (
              "Gemini has successfully summarized communications and triage logs across your connected platforms."
            )}
          </p>
          
          <p className="text-slate-500 text-xs font-semibold pt-1">
            {currentTime || format(new Date(), "EEEE, MMMM d, yyyy · h:mm a")}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="relative z-10 px-5 py-3 text-xs font-black rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800/40 text-white transition-all shadow-lg shadow-violet-950/30 flex items-center justify-center gap-2 cursor-pointer self-start md:self-center shrink-0 group active:scale-[0.98]"
        >
          <svg className={`w-4 h-4 text-white ${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
          </svg>
          <span>{refreshing ? "Regenerating..." : "Refresh / Regenerate"}</span>
        </button>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "IMPORTANT",
            value: stats.importantCount,
            subtext: (
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {stats.importantCount > 0 ? "1 high priority" : "0 high priority"}
              </span>
            ),
            iconColor: "bg-purple-100 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-500/25 text-purple-600 dark:text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.12)]",
            targetTab: "alerts",
            icon: <AlertCircle className="w-6 h-6" />
          },
          {
            title: "SCHEDULE",
            value: (stats.importantCount + stats.priorityCount || 5),
            subtext: (
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {stats.importantCount > 0 ? "1 event today" : "0 events today"}
              </span>
            ),
            iconColor: "bg-blue-100 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-500/25 text-blue-600 dark:text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.12)]",
            targetTab: "briefing",
            icon: <Calendar className="w-6 h-6" />
          },
          {
            title: "FOLLOW-UPS",
            value: stats.followUpCount,
            subtext: (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {stats.followUpCount || 3} due today
              </span>
            ),
            iconColor: "bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.12)]",
            targetTab: "alerts",
            icon: <ShieldCheck className="w-6 h-6" />
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            onClick={() => setActiveTab(stat.targetTab)}
            className="bg-[#0d121f] border border-[#1e293b]/40 rounded-2xl p-6 shadow-lg flex items-center justify-between transition-all duration-300 hover:border-[#1e293b]/80 hover:translate-y-[-2px] group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div className="space-y-0.5 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  {loading ? (
                    <div className="w-8 h-8 bg-white/5 animate-pulse rounded mt-1"></div>
                  ) : (
                    stat.value
                  )}
                </h3>
                <p className="text-[11px] mt-1 font-bold">{stat.subtext}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#1e293b]/65 bg-transparent flex items-center justify-center text-slate-400 group-hover:text-white transition-all group-hover:border-violet-500/30">
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* THREE-COLUMN DETAILS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. TODAY'S BRIEF */}
        <div className="bg-[#0d121f] border border-[#1e293b]/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition-all duration-300 hover:border-[#1e293b]/80">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#1e293b]/40 pb-4">
              <h3 className="font-extrabold text-white flex items-center gap-2 text-sm tracking-wide uppercase">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Today&apos;s Brief</span>
              </h3>
              <button
                onClick={() => setActiveTab("briefing")}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#334155]/40 text-slate-300 hover:text-white hover:bg-[#1e293b]/80 transition-all cursor-pointer"
              >
                View all
              </button>
            </div>

            {briefData?.generatedAt && (
              <p className="text-[10px] text-slate-500 font-semibold -mt-3.5">
                Generated {format(parseISO(briefData.generatedAt), "h:mm a")}
              </p>
            )}

            <div className="space-y-3.5 pt-1">
              {loading ? (
                // Shimmer Loader for Today's Brief
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-[#1e293b]/20 bg-[#090d16]/30 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-white/10 rounded w-2/3"></div>
                      <div className="h-2.5 bg-white/5 rounded w-full"></div>
                    </div>
                  </div>
                ))
              ) : briefItems.length > 0 ? (
                briefItems.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-3.5 rounded-xl bg-[#090d16]/50 border border-[#1e293b]/20 hover:border-violet-500/15 hover:bg-[#0d121f]/80 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3 min-w-0 pr-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-105 transition-transform">
                          {getAppLogo(item.app)}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-black truncate transition-colors leading-tight ${
                            isChecked 
                              ? "line-through text-slate-600" 
                              : "text-white group-hover:text-violet-400"
                          }`}>
                            {item.title}
                          </p>
                          <p className={`text-[11px] mt-1 leading-normal ${isChecked ? "text-slate-600" : "text-slate-400"}`}>
                            {item.summary}
                          </p>
                          <span className="text-[10px] text-slate-500 block font-semibold mt-1.5 uppercase tracking-wide">
                            {(() => {
                              if (!item.time) return "";
                              try {
                                const parsed = parseISO(item.time);
                                if (isValid(parsed)) {
                                  const isToday = new Date().toDateString() === parsed.toDateString();
                                  return isToday ? format(parsed, "h:mm a") : format(parsed, "MMM d, h:mm a");
                                }
                              } catch (e) {}
                              return item.time;
                            })()} · {item.action}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleItemCheck(item.id)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? "bg-violet-600 border-violet-500 text-white"
                            : "border-[#1e293b] hover:border-violet-500/50 text-transparent hover:text-violet-400"
                        }`}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 border border-dashed border-[#1e293b]/40 rounded-xl">
                  <svg className="w-8 h-8 text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-3.88l-.76-1.29a2 2 0 00-1.72-1.01H10.36a2 2 0 00-1.72 1.01L7.88 15H4" />
                  </svg>
                  <p className="text-xs text-slate-500 font-semibold">No brief items available</p>
                  <p className="text-[10px] text-slate-600 mt-1">Connect platforms or click regenerate to refresh.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. CONNECTED APPS */}
        <div className="bg-[#0d121f] border border-[#1e293b]/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition-all duration-300 hover:border-[#1e293b]/80">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e293b]/40 pb-4">
              <h3 className="font-extrabold text-white flex items-center gap-2 text-sm tracking-wide uppercase">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>Connected Apps</span>
              </h3>
              <button
                onClick={() => setActiveTab("integrations")}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#334155]/40 text-slate-300 hover:text-white hover:bg-[#1e293b]/80 transition-all cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {appList.map((app) => {
                const isConnected = app.connected;
                return (
                  <div
                    key={app.id}
                    onClick={() => setActiveTab("integrations")}
                    className="group relative bg-[#090d16]/50 border border-[#1e293b]/20 hover:border-violet-500/25 hover:bg-[#090d16]/90 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2.5 transition-all duration-300 cursor-pointer"
                  >
                    {/* Status glowing badge */}
                    {isConnected ? (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-[9px] font-bold shadow-sm animate-pulse-slow">
                        ✓
                      </span>
                    ) : (
                      <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    )}

                    <div className="w-10 h-10 rounded-lg bg-gray-950 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-300">
                      {getAppLogo(app.id, "w-6 h-6")}
                    </div>
                    
                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-white truncate max-w-full px-1 group-hover:text-violet-400 transition-colors">
                        {app.name}
                      </p>
                      <p className={`text-[10px] font-bold ${isConnected ? "text-emerald-400" : "text-slate-500"}`}>
                        {isConnected ? "Connected" : "Disconnected"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. PRIORITY ITEMS */}
        <div className="bg-[#0d121f] border border-[#1e293b]/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition-all duration-300 hover:border-[#1e293b]/80">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e293b]/40 pb-4">
              <h3 className="font-extrabold text-white flex items-center gap-2 text-sm tracking-wide uppercase">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.56-.372-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
                </svg>
                <span>Priority Items</span>
              </h3>
              <button
                onClick={() => setActiveTab("alerts")}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#334155]/40 text-slate-300 hover:text-white hover:bg-[#1e293b]/80 transition-all cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-3.5 pt-1">
              {loading ? (
                // Shimmer Loader for Priority Items
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-[#1e293b]/20 bg-[#090d16]/30 animate-pulse">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-white/10 rounded w-2/3"></div>
                        <div className="h-2 bg-white/5 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : priorityItems.length > 0 ? (
                priorityItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#090d16]/50 border border-[#1e293b]/20 hover:border-violet-500/15 hover:bg-[#0d121f]/80 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-105 transition-transform">
                        {getAppLogo(item.app)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-white truncate group-hover:text-violet-400 transition-colors leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-450 font-bold capitalize mt-1 flex items-center gap-1.5">
                          <span>{item.app}</span>
                          <span>·</span>
                          <span className="text-slate-500 font-semibold leading-normal truncate max-w-[120px]">
                            {item.description}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-black whitespace-nowrap">
                        {(() => {
                          if (!item.time) return "";
                          try {
                            const parsed = parseISO(item.time);
                            if (isValid(parsed)) {
                              const isToday = new Date().toDateString() === parsed.toDateString();
                              return isToday ? format(parsed, "h:mm a") : format(parsed, "MMM d, h:mm a");
                            }
                          } catch (e) {}
                          return item.time;
                        })()}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.priority === "High"
                            ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"
                            : item.priority === "Medium"
                            ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                            : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                        }`}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed border-[#1e293b]/40 rounded-xl">
                  <svg className="w-8 h-8 text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <p className="text-xs text-slate-500 font-semibold">No priority items today</p>
                  <p className="text-[10px] text-slate-600 mt-1">Check back later or sync your connected accounts.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* COGNITIVE CONTEXT CHAT TRIGGER CARD */}
      <div 
        onClick={() => setActiveTab("ai-agent")}
        className="relative overflow-hidden rounded-2xl border border-[#1e293b]/40 bg-[#0d121f]/50 p-5 shadow-lg flex items-center justify-between gap-4 cursor-pointer hover:border-violet-500/20 hover:bg-[#0d121f]/80 transition-all duration-350 group"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-violet-500/0 group-hover:from-violet-600/5 group-hover:via-indigo-500/3 group-hover:to-cyan-500/5 transition-all duration-500"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-violet-950/40 border border-violet-900/30 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0">
            <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.473L22 21V3a2 2 0 00-2-2H4a2 2 0 00-2 2v18l3.813-2.096z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-black text-white group-hover:text-violet-400 transition-colors">
              How can I help you today?
            </h4>
            <p className="text-xs text-slate-450 font-semibold leading-normal">
              Ask Aura to draft email replies, coordinate follow-ups, or search across your platforms.
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full border border-[#1e293b]/60 bg-transparent group-hover:bg-violet-600 text-slate-450 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
          <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

    </div>
  );
}

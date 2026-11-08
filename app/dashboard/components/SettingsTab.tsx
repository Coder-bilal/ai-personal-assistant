"use client";

import React, { useState } from "react";

interface SettingsTabProps {
  profileName: string;
  setProfileName: (val: string) => void;
  timezone: string;
  setTimezone: (val: string) => void;
  assistantContext: string;
  setAssistantContext: (val: string) => void;
  summaryDetail: string;
  setSummaryDetail: (val: string) => void;
  replyTone: string;
  setReplyTone: (val: string) => void;
  autoPrepareReplies: boolean;
  setAutoPrepareReplies: (val: boolean) => void;
  proactiveActions: boolean;
  setProactiveActions: (val: boolean) => void;
  briefingCadence: string;
  setBriefingCadence: (val: string) => void;
  deliveryChannels: string[];
  setDeliveryChannels: (val: string[]) => void;
  syncFrequency: string;
  setSyncFrequency: (val: string) => void;
  priorityThreshold: string;
  setPriorityThreshold: (val: string) => void;
  notificationMethods: string[];
  setNotificationMethods: (val: string[]) => void;
  dataRetention: string;
  setDataRetention: (val: string) => void;
  saveMemory: boolean;
  setSaveMemory: (val: boolean) => void;
  productAnalytics: boolean;
  setProductAnalytics: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  integrations: {
    gmail: boolean;
    whatsapp: boolean;
    slack: boolean;
    outlook: boolean;
    discord: boolean;
    linkedin: boolean;
    telegram: boolean;
    other: boolean;
  };
  setActiveTab: (tab: string) => void;
  user: any;
  logout: () => void;
}

export default function SettingsTab({
  profileName,
  setProfileName,
  timezone,
  setTimezone,
  assistantContext,
  setAssistantContext,
  summaryDetail,
  setSummaryDetail,
  replyTone,
  setReplyTone,
  autoPrepareReplies,
  setAutoPrepareReplies,
  proactiveActions,
  setProactiveActions,
  briefingCadence,
  setBriefingCadence,
  deliveryChannels,
  setDeliveryChannels,
  syncFrequency,
  setSyncFrequency,
  priorityThreshold,
  setPriorityThreshold,
  notificationMethods,
  setNotificationMethods,
  dataRetention,
  setDataRetention,
  saveMemory,
  setSaveMemory,
  productAnalytics,
  setProductAnalytics,
  isDarkMode,
  setIsDarkMode,
  integrations,
  setActiveTab,
  user,
  logout,
}: SettingsTabProps) {
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  const saveSettings = () => {
    const settingsObj = {
      profileName,
      timezone,
      assistantContext,
      summaryDetail,
      replyTone,
      autoPrepareReplies,
      proactiveActions,
      briefingCadence,
      deliveryChannels,
      syncFrequency,
      priorityThreshold,
      notificationMethods,
      dataRetention,
      saveMemory,
      productAnalytics,
      isDarkMode,
    };
    localStorage.setItem("aurasync_assistant_settings", JSON.stringify(settingsObj));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2500);
  };

  const resetSettings = () => {
    setProfileName("Bilal Akhtar");
    setTimezone("Asia/Karachi");
    setAssistantContext(
      "Personal productivity, communication triage, and executive follow-ups"
    );
    setSummaryDetail("standard");
    setReplyTone("friendly");
    setAutoPrepareReplies(true);
    setProactiveActions(true);
    setBriefingCadence("morning");
    setDeliveryChannels(["in_app", "email"]);
    setSyncFrequency("real_time");
    setPriorityThreshold("medium_high");
    setNotificationMethods(["in_app", "email", "push"]);
    setDataRetention("90_days");
    setSaveMemory(true);
    setProductAnalytics(false);
    setIsDarkMode(true);

    const defaults = {
      profileName: "Bilal Akhtar",
      timezone: "Asia/Karachi",
      assistantContext: "Personal productivity, communication triage, and executive follow-ups",
      summaryDetail: "standard",
      replyTone: "friendly",
      autoPrepareReplies: true,
      proactiveActions: true,
      briefingCadence: "morning",
      deliveryChannels: ["in_app", "email"],
      syncFrequency: "real_time",
      priorityThreshold: "medium_high",
      notificationMethods: ["in_app", "email", "push"],
      dataRetention: "90_days",
      saveMemory: true,
      productAnalytics: false,
      isDarkMode: true,
    };
    localStorage.setItem("aurasync_assistant_settings", JSON.stringify(defaults));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2500);
  };

  const connectedAppsList = [
    { id: "gmail", name: "Gmail", icon: "/brand/gmail.png" },
    { id: "whatsapp", name: "WhatsApp", icon: "/brand/whatsapp.png" },
    { id: "slack", name: "Slack", icon: "/brand/slack.png" },
    { id: "telegram", name: "Telegram", icon: "/brand/telegram.png" },
    { id: "discord", name: "Discord", icon: "/brand/discord.png" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b]/20 pb-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white tracking-tight">Settings</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tune how AuraSync.ai summarizes, alerts, syncs data, and protects your workspace.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={resetSettings}
            className="px-3.5 py-2 bg-slate-900 border border-[#1e293b] hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm animate-fade-in"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
            </svg>
            <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            className="px-4 py-2 bg-[#8b5cf6] hover:bg-violet-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (takes 2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Profile */}
          <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-start gap-3 border-b border-[#1e293b]/20 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-950/20 border border-violet-900/30 text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">Account Profile</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Personal context used in briefings, reply drafts, and dashboard greeting.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Display name</label>
                <p className="text-[10px] text-slate-500 mb-1.5">Shown across the dashboard.</p>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 text-white px-4 outline-none transition-all text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Timezone</label>
                <p className="text-[10px] text-slate-500 mb-1.5">Used for alerts and scheduled briefings.</p>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 text-white px-4 outline-none transition-all text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Assistant context</label>
              <p className="text-[10px] text-slate-500 mb-1.5">A short operating brief for AI prioritization.</p>
              <textarea
                value={assistantContext}
                onChange={(e) => setAssistantContext(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 text-white p-4 outline-none transition-all text-xs font-semibold resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* AI Agent Behavior */}
          <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-start gap-3 border-b border-[#1e293b]/20 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-950/20 border border-violet-900/30 text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">AI Agent Behavior</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Control the level of detail, tone, and autonomy for assistant-generated output.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Summary detail</label>
                <p className="text-[10px] text-slate-500 mb-1.5">Default depth for AI summaries.</p>
                <select
                  value={summaryDetail}
                  onChange={(e) => setSummaryDetail(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 text-white px-4 outline-none transition-all text-xs font-semibold cursor-pointer"
                >
                  <option value="minimal">Minimal action items</option>
                  <option value="standard">Standard executive summary</option>
                  <option value="detailed">Detailed context and entities</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Reply tone</label>
                <p className="text-[10px] text-slate-500 mb-1.5">Applied to generated drafts.</p>
                <select
                  value={replyTone}
                  onChange={(e) => setReplyTone(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 text-white px-4 outline-none transition-all text-xs font-semibold cursor-pointer"
                >
                  <option value="direct">Direct and concise</option>
                  <option value="friendly">Friendly and polished</option>
                  <option value="executive">Executive and formal</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-white">Auto-prepare reply drafts</h5>
                  <p className="text-[10px] text-slate-400">Create draft replies when alerts require a response.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoPrepareReplies(!autoPrepareReplies)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    autoPrepareReplies ? "bg-[#8b5cf6]" : "bg-gray-950"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      autoPrepareReplies ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]/10">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-white">Proactive next actions</h5>
                  <p className="text-[10px] text-slate-400">Suggest follow-ups, tasks, and summaries after important messages.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProactiveActions(!proactiveActions)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    proactiveActions ? "bg-[#8b5cf6]" : "bg-gray-950"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      proactiveActions ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Briefings */}
          <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-start gap-3 border-b border-[#1e293b]/20 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-950/20 border border-violet-900/30 text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">Briefings</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose when daily intelligence summaries are generated and where they appear.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Briefing cadence</label>
              <p className="text-[10px] text-slate-500 mb-1.5">Default schedule for dashboard and email digests.</p>
              <select
                value={briefingCadence}
                onChange={(e) => setBriefingCadence(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 text-white px-4 outline-none transition-all text-xs font-semibold cursor-pointer"
              >
                <option value="morning">Morning digest</option>
                <option value="twice_daily">Morning and evening</option>
                <option value="manual">Manual refresh only</option>
              </select>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <h5 className="text-xs font-bold text-white">Delivery channels</h5>
                <p className="text-[10px] text-slate-400 mb-2.5">Where briefings should be shown.</p>
                <div className="flex gap-2">
                  {["in_app", "email", "whatsapp"].map((ch) => {
                    const isActive = deliveryChannels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            setDeliveryChannels(deliveryChannels.filter((c) => c !== ch));
                          } else {
                            setDeliveryChannels([...deliveryChannels, ch]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isActive
                            ? "bg-violet-950/20 text-violet-400 border-violet-900/30"
                            : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
                        } capitalize`}
                      >
                        {ch === "in_app" ? "In-app" : ch === "email" ? "Email" : "WhatsApp"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-start gap-3 border-b border-[#1e293b]/20 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-950/20 border border-violet-900/30 text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">Alerts & Notifications</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Set defaults for Trigger.dev monitoring, urgency filtering, and notification routing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Sync frequency</label>
                <p className="text-[10px] text-slate-500 mb-1.5">How often connected apps are scanned.</p>
                <select
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 text-white px-4 outline-none transition-all text-xs font-semibold cursor-pointer"
                >
                  <option value="real_time">Realtime where available</option>
                  <option value="15_minutes">Every 15 minutes</option>
                  <option value="hourly">Hourly batch</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Priority threshold</label>
                <p className="text-[10px] text-slate-500 mb-1.5">Default filter for generated alerts.</p>
                <select
                  value={priorityThreshold}
                  onChange={(e) => setPriorityThreshold(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 text-white px-4 outline-none transition-all text-xs font-semibold cursor-pointer"
                >
                  <option value="all">All priorities</option>
                  <option value="medium_high">Medium and high only</option>
                  <option value="high">High only</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <h5 className="text-xs font-bold text-white">Notification methods</h5>
                <p className="text-[10px] text-slate-400 mb-2.5">Used as default when creating alert rules.</p>
                <div className="flex gap-2 flex-wrap">
                  {["in_app", "email", "push", "whatsapp"].map((meth) => {
                    const isActive = notificationMethods.includes(meth);
                    return (
                      <button
                        key={meth}
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            setNotificationMethods(notificationMethods.filter((m) => m !== meth));
                          } else {
                            setNotificationMethods([...notificationMethods, meth]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isActive
                            ? "bg-violet-950/20 text-violet-400 border-violet-900/30"
                            : "bg-slate-950 border-white/5 text-slate-400 hover:text-white"
                        } capitalize`}
                      >
                        {meth === "in_app" ? "In-app" : meth === "email" ? "Email" : meth === "push" ? "Push" : "WhatsApp"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-start gap-3 border-b border-[#1e293b]/20 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-950/20 border border-violet-900/30 text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">Privacy & Data</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage memory, retention, and optional analytics for assistant improvement.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Data retention</label>
              <p className="text-[10px] text-slate-500 mb-1.5">How long synced summaries and generated context are kept locally.</p>
              <select
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 text-white px-4 outline-none transition-all text-xs font-semibold cursor-pointer"
              >
                <option value="30_days">30 days</option>
                <option value="90_days">90 days</option>
                <option value="1_year">1 year</option>
              </select>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-white">Save assistant memory</h5>
                  <p className="text-[10px] text-slate-400">Remember preferences that improve future summaries and drafts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveMemory(!saveMemory)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    saveMemory ? "bg-[#8b5cf6]" : "bg-gray-950"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      saveMemory ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]/10">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-white">Product analytics</h5>
                  <p className="text-[10px] text-slate-400">Allow anonymous usage signals for reliability and feature planning.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProductAnalytics(!productAnalytics)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    productAnalytics ? "bg-[#8b5cf6]" : "bg-gray-950"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      productAnalytics ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (takes 1 span) */}
        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-start gap-3 border-b border-[#1e293b]/20 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-950/20 border border-violet-900/30 text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">Appearance</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Theme preference is applied immediately across the app.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-white">Theme</h5>
                <p className="text-[10px] text-slate-400">{isDarkMode ? "Dark" : "Light"} mode active</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  isDarkMode ? "bg-[#8b5cf6]" : "bg-gray-950"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                    isDarkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                >
                  {isDarkMode ? (
                    <svg className="w-2.5 h-2.5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-2.5 h-2.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Connected Apps */}
          <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-start gap-3 border-b border-[#1e293b]/20 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-950/20 border border-violet-900/30 text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">Connected Apps</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {Object.values(integrations).filter(Boolean).length} of 5 integrations active.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {connectedAppsList.map((app) => {
                const isAppSyncing = integrations[app.id as keyof typeof integrations];
                return (
                  <div key={app.id} className="flex items-center justify-between bg-slate-950/30 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <img src={app.icon} alt={app.name} className="w-5 h-5 object-contain shrink-0" />
                      <span className="text-xs font-bold text-white">{app.name}</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${isAppSyncing ? "text-emerald-400 bg-emerald-950/20" : "text-slate-400 bg-slate-950"}`}>
                      {isAppSyncing ? "On" : "Off"}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab("integrations")}
              className="w-full mt-2 py-2.5 border border-[#1e293b]/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Manage Integrations</span>
            </button>
          </div>

          {/* Security */}
          <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-start gap-3 border-b border-[#1e293b]/20 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-950/20 border border-violet-900/30 text-violet-400 flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-white">Security</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Account and export actions for the active session.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/45 p-3 rounded-xl border border-white/5 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">InsForge authentication</p>
              <p className="text-xs font-semibold text-slate-300 truncate">{user?.email || "bilal317699@gmail.com"}</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => alert("Exporting local preferences...")}
                className="w-full py-2.5 border border-[#1e293b]/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export Settings</span>
              </button>
              <button
                onClick={() => alert("Redirecting to Stripe Customer Billing Portal...")}
                className="w-full py-2.5 border border-[#1e293b]/40 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Billing Settings</span>
              </button>
              <button
                onClick={logout}
                className="w-full py-2.5 bg-red-950/20 border border-red-900/30 hover:bg-red-950/30 rounded-xl text-xs font-black text-red-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* InsForge Database Sync */}
          <div className="bg-blue-950/15 border border-blue-900/25 rounded-2xl p-4 flex gap-3 text-slate-300">
            <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8 4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <div className="space-y-1 text-left">
              <h5 className="text-xs font-bold text-white leading-none">InsForge Cloud Database Sync</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                These integrations and settings are securely saved in your InsForge PostgreSQL cloud database and synchronized across your sessions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {saveState === "saved" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl border border-emerald-500/20 bg-emerald-600 text-white px-4 py-3 shadow-xl shadow-emerald-600/25 text-xs font-bold animate-fade-in">
          Settings saved successfully
        </div>
      )}
    </div>
  );
}

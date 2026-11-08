"use client";

import React from "react";

interface IntegrationsTabProps {
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
  setActiveSettingsPlatform: (platform: string | null) => void;
  handleConnectClick: (platform: string) => void;
  isDisconnectingWhatsApp?: boolean;
}

export default function IntegrationsTab({
  integrations,
  setActiveSettingsPlatform,
  handleConnectClick,
  isDisconnectingWhatsApp = false,
}: IntegrationsTabProps) {
  const platforms = [
    {
      id: "gmail",
      name: "Gmail",
      desc: "Connect to your inbox, fetch messages, search emails, and compose replies via MCP.",
      icon: "/brand/gmail.png",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      desc: "Sync conversations, fetch message logs, and send automated client messages.",
      icon: "/brand/whatsapp.png",
    },
    {
      id: "slack",
      name: "Slack",
      desc: "Post updates to channels, sync workspace history, and notify team members.",
      icon: "/brand/slack.png",
    },
    {
      id: "outlook",
      name: "Outlook Calendar",
      desc: "Analyze calendar appointments, list inbox, and manage event schedules.",
      icon: "/brand/outlook.png",
    },
    {
      id: "discord",
      name: "Discord",
      desc: "Monitor channel chats, post announcements, and index community servers.",
      icon: "/brand/discord.png",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      desc: "Extract feed updates, post news shares, and manage member profiles.",
      icon: "/brand/linkedin.png",
    },
    {
      id: "telegram",
      name: "Telegram",
      desc: "Index channel events, query group chat messages, and send alert notices.",
      icon: "/brand/telegram.png",
    },
    {
      id: "other",
      name: "Other Platforms",
      desc: "Connect to standard webhooks, custom endpoints, and other local MCP gateways.",
      icon: "/brand/other.png",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in text-left">
      {/* Main Heading */}
      <div className="space-y-1 pb-4">
        <h2 className="text-2xl font-black text-white">Cognitive Workspace Integrations</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Bridge your communication channels to AuraSync's background processing model using local and secure MCP configurations.
        </p>
      </div>

      {/* Grid of Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {platforms.map((plat) => {
          const isSyncing = integrations[plat.id as keyof typeof integrations];
          return (
            <div
              key={plat.id}
              className="relative bg-[#0d121f] border border-[#1e293b]/40 rounded-2xl p-6 pt-10 shadow-lg flex flex-col justify-between overflow-hidden"
            >
              {/* Status Badge absolute in top-right */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#090d16]/85 border border-[#1e293b]/35 rounded-full px-2.5 py-1 text-[9px] font-black uppercase text-slate-400">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSyncing
                      ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                      : "bg-slate-500"
                  }`}
                />
                <span>{isSyncing ? "Connected" : "Disconnected"}</span>
              </div>

              <div className="flex flex-col items-center text-center space-y-3.5 mt-2">
                {/* Large Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-[#090d16]/80 border border-[#1e293b]/35 flex items-center justify-center shadow-inner shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img src={plat.icon} alt={plat.name} className="w-7 h-7 object-contain" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-white">{plat.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-[220px] mx-auto min-h-[48px]">
                    {plat.desc}
                  </p>
                </div>
              </div>

              {/* Connection Action Row */}
              <div className="mt-6 flex gap-2">
                {isSyncing ? (
                  <>
                    <button
                      onClick={() => setActiveSettingsPlatform(plat.id)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-black bg-slate-900 border border-[#1e293b]/45 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                      </svg>
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => handleConnectClick(plat.id)}
                      disabled={plat.id === "whatsapp" && isDisconnectingWhatsApp}
                      className="flex-1 py-2.5 rounded-xl text-xs font-black bg-rose-950/20 text-rose-400 border border-rose-900/30 hover:bg-rose-950/40 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {plat.id === "whatsapp" && isDisconnectingWhatsApp ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-rose-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Disconnecting...</span>
                        </>
                      ) : (
                        "Disconnect"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnectClick(plat.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-black bg-[#8b5cf6] text-white hover:bg-violet-500 transition-all cursor-pointer text-center"
                  >
                    Connect Integration
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

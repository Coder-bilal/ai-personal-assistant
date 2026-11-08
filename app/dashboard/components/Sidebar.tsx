"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { insforge } from "../../lib/insforge";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  profileName: string;
  user: any;
  logout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
  activeAlertsCount?: number;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  profileName,
  user,
  logout,
  isDarkMode,
  setIsDarkMode,
  activeAlertsCount,
}: SidebarProps) {
  const [dbAlertsCount, setDbAlertsCount] = useState(0);
  const alertsCount = activeAlertsCount !== undefined ? activeAlertsCount : dbAlertsCount;

  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch active alerts count from DB
    const fetchCount = async () => {
      try {
        const { count, error } = await insforge.database
          .from("alerts")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .neq("status", "resolved");
          
        if (!error && count !== null) {
          setDbAlertsCount(count);
        }
      } catch (err) {
        console.error("Failed to fetch alerts count in Sidebar:", err);
      }
    };
    
    fetchCount();
    
    // Subscribe to realtime alerts channel for count updates
    const handleAlertChange = () => {
      fetchCount();
    };

    insforge.realtime.connect()
      .then(() => insforge.realtime.subscribe(`alerts:${user.id}`))
      .catch(err => console.error("Realtime connection error in Sidebar:", err));
      
    insforge.realtime.on("alert_created", handleAlertChange);
    insforge.realtime.on("alert_updated", handleAlertChange);
    
    return () => {
      insforge.realtime.off("alert_created", handleAlertChange);
      insforge.realtime.off("alert_updated", handleAlertChange);
      insforge.realtime.unsubscribe(`alerts:${user.id}`);
    };
  }, [user?.id]);
  // Navigation Options configuration
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      activeColor: "bg-blue-600 text-white shadow-md shadow-blue-900/20",
      inactiveColor:
        "bg-blue-950/35 text-blue-400 border border-blue-900/25 hover:bg-blue-950/55 hover:text-blue-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: "ai-agent",
      label: "AI Agent",
      activeColor: "bg-violet-600 text-white shadow-md shadow-violet-900/20",
      inactiveColor:
        "bg-violet-950/35 text-violet-400 border border-violet-900/25 hover:bg-violet-950/55 hover:text-violet-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c-1.2 0-2.4.4-3.4 1.2A5.5 5.5 0 005.5 9c0 1.2.4 2.4 1.2 3.4C6 13.4 5.5 14.7 5.5 16c0 2.5 2 4.5 4.5 4.5h4c2.5 0 4.5-2 4.5-4.5 0-1.3-.5-2.6-1.2-3.6.8-1 1.2-2.2 1.2-3.4a5.5 5.5 0 00-3.1-4.8C14.4 3.4 13.2 3 12 3z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.5M8 10h8M7.5 15.5h9" />
        </svg>
      ),
    },
    {
      id: "briefing",
      label: "Briefing",
      activeColor: "bg-amber-600 text-white shadow-md shadow-amber-900/20",
      inactiveColor:
        "bg-amber-950/35 text-amber-400 border border-amber-900/25 hover:bg-amber-950/55 hover:text-amber-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "integrations",
      label: "Integrations",
      activeColor: "bg-teal-600 text-white shadow-md shadow-teal-900/20",
      inactiveColor:
        "bg-teal-950/35 text-teal-400 border border-teal-900/25 hover:bg-teal-950/55 hover:text-teal-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 3v2m6-2v2M9 11v4a3 3 0 006 0v-4m-6 0h6M12 15v5a2 2 0 002 2h0"
          />
        </svg>
      ),
    },
    {
      id: "alerts",
      label: "Alerts",
      activeColor: "bg-rose-600 text-white shadow-md shadow-rose-900/20",
      inactiveColor:
        "bg-rose-950/35 text-rose-400 border border-rose-900/25 hover:bg-rose-950/55 hover:text-rose-300",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      activeColor: "bg-slate-600 text-white shadow-md shadow-slate-900/20",
      inactiveColor:
        "bg-slate-900/55 text-slate-400 border border-slate-800/40 hover:bg-slate-900 hover:text-slate-200",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* SIDEBAR FOR DESKTOP */}
      <aside
        className={`hidden md:flex flex-col bg-[#0d121f] border-r border-[#1e293b]/40 h-screen sticky top-0 left-0 z-30 transition-all duration-300 ease-in-out dashboard-sidebar ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* LOGO AND BRAND */}
        <div className="p-5 flex items-center gap-3 border-b border-[#1e293b]/30 shrink-0 overflow-hidden h-[73px]">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-500 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold tracking-tight text-white transition-opacity duration-200">
                Aura<span className="text-violet-400 font-medium">Sync.ai</span>
              </span>
            )}
          </Link>
        </div>

        {/* MAIN NAVIGATION OPTIONS */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-none shrink-0">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? "bg-[#1e1b4b]/30 text-white border-l-4 border-[#8b5cf6]"
                    : "text-slate-400 hover:text-white hover:bg-[#1e293b]/20"
                }`}
              >
                {/* ICON CONTAINER */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 relative ${
                    isActive ? item.activeColor : item.inactiveColor
                  }`}
                >
                  {item.icon}
                  {item.id === "alerts" && isCollapsed && alertsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                  )}
                </div>
                {/* LABEL */}
                {!isCollapsed && (
                  <span className="transition-opacity duration-300 truncate">{item.label}</span>
                )}
                {item.id === "alerts" && !isCollapsed && alertsCount > 0 && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                )}
                {/* TOOLTIP WHEN COLLAPSED */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg bg-gray-900 text-xs text-white border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="mt-auto border-t border-[#1e293b]/30 shrink-0 space-y-3 p-3">
          {/* PRICING SETTINGS CARD */}
          <button
            onClick={() => {
              setActiveTab("pricing");
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-sm font-bold transition-all duration-200 group relative bg-[#090d16]/60 border border-[#1e293b]/25 shadow-inner ${
              activeTab === "pricing"
                ? "text-white border-violet-500/35 ring-1 ring-violet-500/10 bg-violet-950/10"
                : "text-slate-300 hover:text-white hover:bg-[#090d16]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 ${
                activeTab === "pricing"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/20"
                  : "bg-violet-950/25 text-violet-400 border border-violet-900/25 hover:bg-violet-950/50 hover:text-violet-300"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            {!isCollapsed && <span className="truncate">Pricing Settings</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg bg-gray-900 text-xs text-white border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                Pricing Settings
              </div>
            )}
          </button>


          {/* USER PROFILE SECTION AT THE BOTTOM */}
          <div
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer border border-transparent hover:bg-[#1e293b]/15 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title="Account Settings"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-950 to-slate-800 border border-white/5 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm relative overflow-hidden group">
              <span className="font-bold text-slate-200 tracking-wider">
                {profileName ? profileName.charAt(0).toUpperCase() : "B"}
              </span>
              <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1 leading-none">
                <span className="text-xs font-black text-white truncate">{profileName}</span>
                <span className="text-[10px] text-slate-500 truncate mt-1">
                  {user?.email || "bilal317699@gmail.com"}
                </span>
              </div>
            )}

            {!isCollapsed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all shrink-0 ml-auto cursor-pointer"
                title="Sign Out"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg bg-gray-900 text-xs text-white border border-white/10 opacity-0 hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                {profileName} ({user?.email || "bilal317699@gmail.com"})
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE DRAWER PANEL */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 w-72 bg-[#0d121f] border-r border-[#1e293b]/40 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-[#1e293b]/40 flex items-center justify-between shrink-0">
          <span className="text-xl font-bold text-white">
            Aura<span className="text-violet-400 font-medium">Sync.ai</span>
          </span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive ? "bg-[#1e1b4b]/50 text-white border-l-4 border-[#8b5cf6]" : "text-slate-400 hover:text-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? item.activeColor : item.inactiveColor
                  }`}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1e293b]/40 space-y-4">
          <button
            onClick={() => {
              setActiveTab("pricing");
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "pricing" ? "bg-[#1e1b4b]/50 text-white border-l-4 border-[#8b5cf6]" : "text-slate-400 hover:text-white"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                activeTab === "pricing"
                  ? "bg-[#8b5cf6] text-white shadow-amber-500/30"
                  : "bg-[#1e293b]/50 text-slate-400 border border-[#334155]/40"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <span>Pricing Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}

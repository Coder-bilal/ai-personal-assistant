"use client";

import React from "react";

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
  logout: () => void;
}

export default function Header({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  isDarkMode,
  setIsDarkMode,
  logout,
}: HeaderProps) {
  return (
    <>
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-[#0d121f] border-b border-[#1e293b]/40 px-4 py-3 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl bg-[#1e293b]/50 border border-[#334155]/40 text-gray-300"
            aria-label="Toggle navigation drawer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-500">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">
              Aura<span className="text-violet-400 font-medium">Sync.ai</span>
            </span>
          </div>
        </div>

        {/* Custom Theme Toggle Switch (Mobile) */}
        {activeTab === "dashboard" && (
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 transition-all duration-300 ease-in-out outline-none items-center ${
              isDarkMode
                ? "bg-[#090a15] border-[#2e265c] hover:border-[#3e347c]"
                : "bg-[#fffdf0] border-[#fde047] hover:border-[#facc15]"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center shadow-md ${
                isDarkMode
                  ? "translate-x-8 bg-[#5865f2] text-white"
                  : "translate-x-0 bg-[#fab800] text-[#1e293b]"
              }`}
            >
              {isDarkMode ? (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
            </span>
          </button>
        )}
      </header>

      {/* DESKTOP HEADER */}
      <header className="hidden md:flex bg-[#0d121f]/50 border-b border-[#1e293b]/30 px-6 py-4 items-center justify-between shrink-0 dashboard-header">
        <div className="flex items-center gap-4">
          {/* Collapse toggle for desktop sidebar */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center p-2 rounded-xl bg-[#1e293b]/50 border border-[#334155]/40 hover:bg-[#1e293b]/80 text-gray-300 hover:text-white transition-all cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white capitalize">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "ai-agent" && "AI Agent"}
            {activeTab === "briefing" && "Briefing"}
            {activeTab === "integrations" && "Integrations"}
            {activeTab === "alerts" && "Alerts"}
            {activeTab === "settings" && "Settings"}
            {activeTab === "pricing" && "Pricing Settings"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Custom Theme Toggle Switch (Desktop) */}
          {activeTab === "dashboard" && (
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 transition-all duration-300 ease-in-out outline-none items-center ${
                isDarkMode
                  ? "bg-[#090a15] border-[#2e265c] hover:border-[#3e347c]"
                  : "bg-[#fffdf0] border-[#fde047] hover:border-[#facc15]"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center shadow-md ${
                  isDarkMode
                    ? "translate-x-8 bg-[#5865f2] text-white"
                    : "translate-x-0 bg-[#fab800] text-[#1e293b]"
                }`}
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                )}
              </span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Sync Live</span>
          </div>

          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-xl border border-[#334155]/55 hover:bg-white/5 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>
    </>
  );
}

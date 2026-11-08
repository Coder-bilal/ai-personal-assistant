"use client";

import React from "react";

interface ConnectModalProps {
  activeConnectPlatform: string | null;
  setActiveConnectPlatform: (platform: string | null) => void;
  isConnecting: boolean;
  connectionLogs: string[];
  connectEmailInput: string;
  setConnectEmailInput: (val: string) => void;
  handleGmailOAuthConnect: () => void;
  startConnectFlow: (email: string) => void;
}

export default function ConnectModal({
  activeConnectPlatform,
  setActiveConnectPlatform,
  isConnecting,
  connectionLogs,
  connectEmailInput,
  setConnectEmailInput,
  handleGmailOAuthConnect,
  startConnectFlow,
}: ConnectModalProps) {
  if (!activeConnectPlatform) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 overflow-hidden glass-panel text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-950/20 border border-violet-900/30 flex items-center justify-center text-violet-400 shrink-0">
              <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Connect {activeConnectPlatform.toUpperCase()} via MCP</h3>
              <p className="text-[10px] text-slate-400">Establish a secure, local Model Context Protocol connection.</p>
            </div>
          </div>
          {!isConnecting && (
            <button
              onClick={() => setActiveConnectPlatform(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Modal Body */}
        {!isConnecting && connectionLogs.length === 0 ? (
          activeConnectPlatform === "gmail" ? (
            <div className="space-y-4">
              <div className="bg-slate-950/45 border border-[#1e293b]/25 rounded-2xl p-4 space-y-2 text-slate-300">
                <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Secure Cloud Authorization</h4>
                <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                  Connect your actual Gmail inbox to Aura Sync.ai. This will redirect you to Google to securely authenticate via OAuth 2.0.
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  No credentials or email data are stored on our servers. Your access token is encrypted and saved directly in your private database.
                </p>
              </div>

              <div className="bg-slate-950/45 border border-[#1e293b]/25 rounded-2xl p-4 space-y-2.5 text-left">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-semibold">Permissions Requested:</h4>
                <ul className="space-y-1.5 text-[11px] text-slate-300 font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Read, search, and manage your emails.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Compose, edit, and create draft replies.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Send emails on your behalf.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleGmailOAuthConnect}
                className="w-full py-3 bg-[#8b5cf6] hover:bg-violet-500 text-white rounded-xl text-xs font-black text-center shadow-md shadow-violet-900/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.65 4.5 1.8l2.4-2.4C17.3 1.7 14.9 1 12.24 1c-5.52 0-10 4.48-10 10s4.48 10 10 10c5.73 0 10-4.03 10-10 0-.6-.06-1.18-.17-1.715H12.24z" />
                </svg>
                <span>Connect with Google</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {activeConnectPlatform === "whatsapp" ? "Phone Number" : "Platform Identifier / API Key"}
                </label>
                <input
                  type="text"
                  value={connectEmailInput}
                  onChange={(e) => setConnectEmailInput(e.target.value)}
                  placeholder={activeConnectPlatform === "whatsapp" ? "+923001234567" : "Enter credentials..."}
                  className="w-full h-11 rounded-xl bg-[#090d16]/80 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/30 text-white px-4 outline-none transition-all text-xs font-semibold"
                />
              </div>
              <div className="bg-slate-950/45 border border-white/5 rounded-xl p-4 space-y-2.5 text-left">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-semibold">Requested MCP Permissions:</h4>
                <ul className="space-y-1.5 text-[11px] text-slate-300 font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Read inbox, history, and search logs.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Create and edit draft replies inside your workspace.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <span>Execute platform-specific automation tools locally.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => startConnectFlow(connectEmailInput)}
                className="w-full py-3 bg-[#8b5cf6] hover:bg-violet-500 text-white rounded-xl text-xs font-black text-center shadow-md shadow-violet-900/20 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Start MCP Connection
              </button>
            </div>
          )
        ) : (
          /* Terminal Logs screen */
          <div className="space-y-4 text-left">
            <div className="bg-black/90 rounded-2xl p-4 border border-[#1e293b]/60 font-mono text-[10px] text-emerald-400 min-h-[180px] max-h-[220px] overflow-y-auto space-y-1.5 scrollbar-thin select-text">
              {connectionLogs.map((log, idx) => (
                <p key={idx} className="leading-relaxed whitespace-pre-wrap animate-fade-in">
                  {log}
                </p>
              ))}
              {isConnecting && (
                <div className="flex items-center gap-1.5 text-slate-500 pl-1 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Syncing process stdout...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
              <span>Status: {isConnecting ? "Establishing..." : "Connected successfully"}</span>
              {isConnecting && (
                <svg className="animate-spin h-4.5 w-4.5 text-violet-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

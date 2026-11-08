"use client";

import React from "react";

export interface MCPTool {
  name: string;
  desc: string;
  params: string;
}

export const PLATFORM_MCP_TOOLS: Record<string, MCPTool[]> = {
  gmail: [
    { name: "gmail_list_messages", desc: "List messages in the user's mailbox", params: "q?: string, maxResults?: number" },
    { name: "gmail_get_message", desc: "Retrieve a specific message by ID", params: "id: string" },
    { name: "gmail_search_messages", desc: "Search inbox with query string", params: "q: string" },
    { name: "gmail_create_draft", desc: "Create a new draft message", params: "to: string, subject: string, body: string, threadId?: string" },
    { name: "gmail_send_message", desc: "Send an email message", params: "to: string, subject: string, body: string" },
    { name: "gmail_get_thread", desc: "Retrieve a conversation thread by ID", params: "id: string" }
  ],
  whatsapp: [
    { name: "whatsapp_get_recent_messages", desc: "Fetch recent messages across all active chat conversations", params: "" },
    { name: "whatsapp_get_chat_history", desc: "Read chat history for a specific contact or chat JID", params: "chatId: string, limit?: number" },
    { name: "whatsapp_send_message", desc: "Send a text message to a contact JID or phone number", params: "to: string, body: string" },
    { name: "whatsapp_search_chats", desc: "Search chats matching a text query", params: "query: string" },
    { name: "whatsapp_summarize_conversations", desc: "Summarize conversations or a specific chat", params: "chatId?: string" },
    { name: "whatsapp_get_contact_details", desc: "Get contact details for a specific JID or phone number", params: "jidOrPhone: string" },
    { name: "whatsapp_list_groups", desc: "List all active WhatsApp groups the user is in", params: "" },
    { name: "whatsapp_get_group_messages", desc: "Fetch messages from a specific group JID", params: "groupId: string, limit?: number" },
    { name: "whatsapp_send_group_message", desc: "Send a text message to a specific group JID", params: "groupId: string, body: string" }
  ],
  slack: [
    { name: "slack_list_channels", desc: "Retrieve list of channels in the workspace", params: "types?: string[]" },
    { name: "slack_get_history", desc: "Fetch message history from a channel", params: "channelId: string, limit?: number" },
    { name: "slack_post_message", desc: "Post a message to a channel or DM", params: "channelId: string, text: string" }
  ],
  outlook: [
    { name: "outlook_list_messages", desc: "List email messages in the user's inbox", params: "maxResults?: number" },
    { name: "outlook_list_events", desc: "List upcoming calendar events", params: "timeMin?: string, timeMax?: string" },
    { name: "outlook_create_event", desc: "Create a new calendar event", params: "summary: string, start: string, end: string" }
  ],
  discord: [
    { name: "discord_get_guilds", desc: "List all Discord servers joined", params: "" },
    { name: "discord_get_channels", desc: "List channels in a specific server", params: "guildId: string" },
    { name: "discord_post_message", desc: "Post a message to a Discord channel", params: "channelId: string, content: string" }
  ],
  linkedin: [
    { name: "linkedin_get_profile", desc: "Retrieve current member profile info", params: "" },
    { name: "linkedin_post_share", desc: "Create a new share/post on LinkedIn feed", params: "text: string, visibility?: 'public'|'connections'" }
  ],
  telegram: [
    { name: "telegram_get_updates", desc: "Retrieve latest updates and messages", params: "limit?: number" },
    { name: "telegram_send_message", desc: "Send a message to a chat or group", params: "chatId: string, text: string" }
  ],
  other: [
    { name: "webhook_trigger", desc: "Trigger a webhook endpoint with custom payload", params: "url: string, payload: object" },
    { name: "get_mcp_capabilities", desc: "Get details on all active local MCP gateways", params: "" }
  ]
};

interface SettingsModalProps {
  activeSettingsPlatform: string | null;
  setActiveSettingsPlatform: (platform: string | null) => void;
  gmailAddress: string;
  handleConnectClick: (platform: string) => void;
  
  // Optional props preserved to prevent TypeScript errors in dashboard container
  expandedTool?: string | null;
  setExpandedTool?: (tool: string | null) => void;
  toolInputs?: Record<string, Record<string, any>>;
  setToolInputs?: React.Dispatch<React.SetStateAction<Record<string, Record<string, any>>>>;
  toolOutputs?: Record<string, any>;
  setToolOutputs?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  runSimulatedTool?: (platformId: string, toolName: string, inputs: Record<string, any>) => void;
}

export default function SettingsModal({
  activeSettingsPlatform,
  setActiveSettingsPlatform,
  gmailAddress,
  handleConnectClick,
}: SettingsModalProps) {
  if (!activeSettingsPlatform) return null;

  const tools = PLATFORM_MCP_TOOLS[activeSettingsPlatform] || [];
  
  const displayName = activeSettingsPlatform === "gmail" 
    ? "Gmail" 
    : activeSettingsPlatform === "whatsapp"
    ? "WhatsApp"
    : activeSettingsPlatform.charAt(0).toUpperCase() + activeSettingsPlatform.slice(1);

  const getLogoPath = (platform: string) => {
    const knownPlatforms = ["gmail", "whatsapp", "slack", "outlook", "discord", "linkedin", "telegram"];
    if (knownPlatforms.includes(platform)) {
      return `/brand/${platform}.png`;
    }
    return ""; // Empty string triggers Globe fallback
  };

  const logoPath = getLogoPath(activeSettingsPlatform);

  // High-fidelity syntax highlighter for MCP parameters
  const renderParams = (params: string) => {
    if (!params) return null;
    const parts = params.split(",");
    return (
      <>
        <span className="text-slate-400 dark:text-slate-500">&#123; </span>
        {parts.map((part, index) => {
          const trimmed = part.trim();
          let name = "";
          let divider = "";
          let type = "";

          if (trimmed.includes("?:")) {
            const splitIdx = trimmed.indexOf("?:");
            name = trimmed.substring(0, splitIdx).trim();
            divider = "?:";
            type = trimmed.substring(splitIdx + 2).trim();
          } else if (trimmed.includes(":")) {
            const splitIdx = trimmed.indexOf(":");
            name = trimmed.substring(0, splitIdx).trim();
            divider = ":";
            type = trimmed.substring(splitIdx + 1).trim();
          } else {
            return <span key={index} className="text-slate-300 dark:text-slate-750">{trimmed}</span>;
          }

          return (
            <React.Fragment key={index}>
              <span className="text-sky-400 light:text-sky-600">{name}</span>
              <span className="text-pink-400 light:text-pink-600 font-bold">{divider}</span>
              <span className="text-orange-400 light:text-orange-600">{type}</span>
              {index < parts.length - 1 && <span className="text-slate-400 dark:text-slate-500">, </span>}
            </React.Fragment>
          );
        })}
        <span className="text-slate-400 dark:text-slate-500"> &#125;</span>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#090d1a] light:bg-white border border-white/10 light:border-slate-200 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl relative text-left">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white/[0.01] light:bg-slate-50 border-b border-white/5 light:border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 light:border-slate-200 flex items-center justify-center p-2 flex-shrink-0 shadow-sm">
              {logoPath ? (
                <img
                  src={logoPath}
                  alt={displayName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <svg className="w-5 h-5 text-slate-400 light:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white light:text-slate-900 tracking-wide">
                  {displayName} Settings
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Active Sync</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 light:text-slate-600">
                Connected via Model Context Protocol (MCP) integrations.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setActiveSettingsPlatform(null)}
            className="p-1.5 rounded-xl hover:bg-white/5 light:hover:bg-slate-100 border border-transparent text-slate-400 hover:text-white light:hover:text-slate-950 transition cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Content - Scrollable Tools List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#030712] light:bg-slate-50 scrollbar-thin">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white light:text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7h-9" />
                <path d="M14 17H5" />
                <circle cx="17" cy="17" r="3" />
                <circle cx="7" cy="7" r="3" />
              </svg>
              <span>Available MCP Tools</span>
            </h4>
            <p className="text-[11px] text-slate-500 light:text-slate-600 leading-relaxed">
              The following Model Context Protocol (MCP) tools are exposed by this platform to your OmniSync cognitive personal assistant.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="space-y-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="p-4 bg-white/[0.01] light:bg-white border border-white/5 light:border-slate-200 rounded-2xl space-y-2.5 hover:border-purple-500/20 light:hover:border-purple-500/30 transition shadow-sm"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-purple-400 light:text-purple-600">{tool.name}</span>
                  <span className="text-[8px] font-mono font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 light:text-purple-600 max-w-max">
                    mcp_tool_schema
                  </span>
                </div>
                <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed">{tool.desc}</p>
                {tool.params !== undefined && (
                  <div className="bg-[#030712] light:bg-slate-100 p-2.5 rounded-xl border border-white/5 light:border-slate-200 text-[10px] font-mono text-slate-400 light:text-slate-600">
                    <span className="text-purple-400 light:text-purple-600 font-bold mr-1">arguments:</span>
                    {tool.params ? renderParams(tool.params) : <span className="text-slate-500 dark:text-slate-400">&#123; &#125;</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

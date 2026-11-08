"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  Send,
  Trash2,
  Globe,
  Mail,
  MessageSquare,
  FileText,
  Star,
  AtSign,
  CheckCircle,
  ArrowRight,
  Calendar,
  Check
} from "lucide-react";

// Message interface matching target specifications
interface Message {
  id: string;
  sender: "user" | "aura";
  text: string;
  time: string;
  isStreaming?: boolean;
  suggestions?: string[];
}

export default function ChatTab() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 1. Chat History Recovery (LocalStorage Sync with 1-Day TTL)
  useEffect(() => {
    const stored = localStorage.getItem("aurasync_chat_history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const oneDayMs = 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.updatedAt < oneDayMs) {
          setMessages(parsed.messages);
        } else {
          localStorage.removeItem("aurasync_chat_history");
          loadDefaultGreeting();
        }
      } catch (e) {
        console.error("Failed to restore history", e);
        loadDefaultGreeting();
      }
    } else {
      loadDefaultGreeting();
    }
  }, []);

  const loadDefaultGreeting = () => {
    setMessages([
      {
        id: "1",
        sender: "aura",
        text: "Hello! I am your Aura cognitive personal assistant. I monitor your connected Gmail, WhatsApp, and Telegram in real-time. Ask me to draft email replies, fetch summaries, or list your action items.",
        time: "10:00 AM"
      }
    ]);
  };

  // Save to local storage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "aurasync_chat_history",
        JSON.stringify({
          updatedAt: Date.now(),
          messages
        })
      );
    }
  }, [messages]);

  // 2. Typing Effect / Streaming Emulator
  const streamMessage = (fullText: string, suggestions: string[] = []) => {
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "aura",
        text: "",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStreaming: true,
        suggestions
      }
    ]);

    let currentText = "";
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText.slice(index, index + 4);
        index += 4;
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.sender === "aura") {
            last.text = currentText;
          }
          return next;
        });
      } else {
        clearInterval(interval);
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.sender === "aura") {
            last.isStreaming = false;
          }
          return next;
        });
      }
    }, 15);
  };

  // 3. Send Message Core logic
  const executeSend = async (userText: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          prompt: userText,
          history: messages.slice(-10) // Conversational context
        })
      });

      if (res.ok) {
        const data = await res.json();
        streamMessage(data.response, data.suggestions || []);
      } else {
        const errorText = await res.text();
        console.error("Chat error:", errorText);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "aura",
            text: "Sorry, I encountered an issue querying the Gemini engine. Please try again.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      }
    } catch (err) {
      console.error("Error calling chat:", err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "aura",
          text: "Connection error. Make sure the backend server is running.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const userText = chatInput;
    setChatInput("");
    executeSend(userText);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    if (isTyping) return;
    executeSend(suggestionText);
  };

  const startNewConversation = () => {
    if (window.confirm("Are you sure you want to start a new conversation? This will clear the current chat history.")) {
      loadDefaultGreeting();
      localStorage.removeItem("aurasync_chat_history");
    }
  };

  const quickSuggestions = [
    { text: "Summarize my emails from today", icon: Mail, bg: "bg-blue-550/10 text-blue-400" },
    { text: "Check pending WhatsApp messages", icon: MessageSquare, bg: "bg-emerald-550/10 text-emerald-400" },
    { text: "Draft a reply to Sarah's email", icon: FileText, bg: "bg-purple-550/10 text-purple-400" },
    { text: "What are my priority action items?", icon: Star, bg: "bg-amber-550/10 text-amber-400" }
  ];

  const appLogos: Record<string, string> = {
    gmail: "/brand/gmail.png",
    whatsapp: "/brand/whatsapp.png",
    slack: "/brand/slack.png",
    outlook: "/brand/outlook.png",
    telegram: "/brand/telegram.png",
    discord: "/brand/discord.png",
    linkedin: "/brand/linkedin.png"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      <h2 className="text-xl font-bold text-white mb-2">AI Agent</h2>

      {/* Main Chat Box Container */}
      <div className="h-[75vh] flex flex-col bg-[#0d121f] border border-[#1e293b]/40 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-slate-950/20 border-b border-[#1e293b]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Aura Intelligent Agent</h3>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Connected to Gmail & WhatsApp</span>
              </div>
            </div>
          </div>

          <button
            onClick={startNewConversation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-rose-900/30 rounded-xl transition-all"
            title="Start fresh conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          
          {/* Quick Suggestions Cards (Shown only in empty chat) */}
          {messages.length <= 1 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Prompts:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickSuggestions.map((sug, i) => {
                  const SugIcon = sug.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestionClick(sug.text)}
                      className="bg-[#090d16]/60 border border-[#1e293b]/20 hover:border-[#8b5cf6]/40 text-left p-4 rounded-xl flex items-center gap-3.5 transition-all group cursor-pointer"
                    >
                      <span className={`w-9 h-9 rounded-lg bg-gray-950 flex items-center justify-center border border-white/5 shrink-0 group-hover:bg-violet-950/20 ${sug.bg}`}>
                        <SugIcon className="w-4.5 h-4.5" />
                      </span>
                      <span className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">
                        {sug.text}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="h-px bg-[#1e293b]/30 my-6" />
            </div>
          )}

          {/* Messages Loop */}
          {messages.map((m, idx) => {
            const getReferencedApps = (text: string) => {
              const lower = text.toLowerCase();
              return Object.keys(appLogos).filter((app) => lower.includes(app));
            };
            const referencedApps = getReferencedApps(m.text);

            return (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%] w-full">
                  {m.sender === "user" ? (
                    <div className="flex justify-end">
                      <div className="p-4 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-lg border border-violet-500/10 text-sm max-w-xl rounded-tr-none text-left font-medium">
                        <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                        <span className="block text-[9px] text-violet-200/60 mt-2 text-right">{m.time}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#090d16]/60 border border-[#1e293b]/35 space-y-4 text-left shadow-md">
                      
                      {/* Rich Markdown Parser Output */}
                      <SafeMarkdown content={m.text} />

                      {/* Referenced Platform Badges */}
                      {referencedApps.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-[#1e293b]/20">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Ref:</span>
                          <div className="flex flex-wrap gap-2">
                            {referencedApps.map((app) => (
                              <span key={app} className="inline-flex items-center gap-1 bg-[#1e293b]/60 text-slate-300 border border-[#1e293b] px-2 py-0.5 rounded text-[9px] font-black capitalize">
                                <img src={appLogos[app]} alt={app} className="w-3 h-3 object-contain" />
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Embedded suggestions inside bubble */}
                      {m.suggestions && m.suggestions.length > 0 && !m.isStreaming && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {m.suggestions.map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-full border border-violet-500/25 hover:border-violet-500/55 bg-violet-500/5 hover:bg-violet-500/10 text-violet-400 transition"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-end text-[9px] text-slate-500 font-semibold uppercase tracking-wider pt-1">
                        <span>{m.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing/Loader Bubble */}
          {isTyping && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-violet-950/45 border border-violet-800/30 flex items-center justify-center text-violet-400 shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#090d16]/40 border border-[#1e293b]/30 rounded-2xl rounded-tl-none p-4 max-w-[70%] space-y-3">
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Syncing platforms data...</p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950/20 border-t border-[#1e293b]/30 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isTyping}
            placeholder="Ask AI Agent to check alerts, draft emails, or search chat logs..."
            className="flex-1 bg-gray-950/55 border border-[#1e293b]/40 focus:border-[#8b5cf6]/50 text-xs sm:text-sm text-white placeholder-gray-500 rounded-xl px-4 py-3 outline-none transition-all font-semibold"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isTyping}
            className="p-3 bg-[#8b5cf6] hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
          >
            <Send className="w-4.5 h-4.5 text-white" />
          </button>
        </form>
      </div>

      <CustomMarkdownComponents />
    </div>
  );
}

// Inline formatting helper
function renderInlineMarkdown(text: string) {
  const parseInlineLogos = (str: string, keyPrefix: string): React.ReactNode[] => {
    const regex = /(gmail|whatsapp|slack|outlook|telegram|discord|linkedin)/gi;
    const tokens = str.split(regex);
    if (tokens.length <= 1) return [str];

    const logoMap: Record<string, string> = {
      gmail: "/brand/gmail.png",
      whatsapp: "/brand/whatsapp.png",
      slack: "/brand/slack.png",
      outlook: "/brand/outlook.png",
      telegram: "/brand/telegram.png",
      discord: "/brand/discord.png",
      linkedin: "/brand/linkedin.png"
    };

    return tokens.map((tok, index) => {
      const lower = tok.toLowerCase();
      if (logoMap[lower]) {
        return (
          <span key={`${keyPrefix}-${index}`} className="inline-flex items-center gap-1 bg-[#1e293b] border border-slate-800 px-2 py-0.5 rounded text-[11px] font-bold text-slate-200 mx-0.5 shadow">
            <img src={logoMap[lower]} alt={tok} className="w-3 h-3 object-contain shrink-0" />
            {tok}
          </span>
        );
      }
      return tok;
    });
  };

  let elements: React.ReactNode[] = [text];

  // Bold **text**
  elements = elements.flatMap((el, elIdx) => {
    if (typeof el !== "string") return el;
    const boldParts = el.split(/\*\*([^*]+)\*\*/g);
    return boldParts.map((part, partIdx) => {
      if (partIdx % 2 === 1) {
        return <strong key={`bold-${elIdx}-${partIdx}`} className="font-extrabold text-white">{part}</strong>;
      }
      return part;
    });
  });

  // Italic *text*
  elements = elements.flatMap((el, elIdx) => {
    if (typeof el !== "string") return el;
    const parts = el.split(/\*([^*]+)\*/g);
    return parts.map((part, partIdx) => {
      if (partIdx % 2 === 1) {
        return <em key={`italic-${elIdx}-${partIdx}`} className="italic text-slate-200">{part}</em>;
      }
      return part;
    });
  });

  // Links [text](url)
  elements = elements.flatMap((el, elIdx) => {
    if (typeof el !== "string") return el;
    const parts = el.split(/\[([^\]]+)\]\(([^)]+)\)/g);
    if (parts.length <= 1) return el;

    const nodes: React.ReactNode[] = [];
    for (let i = 0; i < parts.length; i += 3) {
      nodes.push(parts[i]);
      if (i + 1 < parts.length) {
        const linkText = parts[i + 1];
        const url = parts[i + 2];
        nodes.push(
          <a
            key={`link-${elIdx}-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300 font-bold underline inline-flex items-center gap-0.5"
          >
            {linkText}
          </a>
        );
      }
    }
    return nodes;
  });

  // Inline platform logo render
  elements = elements.flatMap((el, elIdx) => {
    if (typeof el !== "string") return el;
    return parseInlineLogos(el, `logo-${elIdx}`);
  });

  return <>{elements}</>;
}

// Safe Markdown component parser for lists, codeblocks, tables, and typography
function SafeMarkdown({ content }: { content: string }) {
  if (!content) return null;

  const parts: React.ReactNode[] = [];
  const lines = content.split("\n");

  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  let inList = false;
  let isOrderedList = false;
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    const ListTag = isOrderedList ? "ol" : "ul";
    parts.push(
      <ListTag key={key} className={isOrderedList ? "list-decimal pl-6 my-2.5 space-y-1.5 text-slate-300" : "list-disc pl-6 my-2.5 space-y-1.5 text-slate-300"}>
        {listItems.map((item, i) => (
          <li key={i} className="text-xs sm:text-sm">
            {renderInlineMarkdown(item)}
          </li>
        ))}
      </ListTag>
    );
    listItems = [];
    inList = false;
  };

  const flushTable = (key: string) => {
    if (tableHeader.length === 0 && tableRows.length === 0) return;
    parts.push(
      <div key={key} className="overflow-x-auto my-4 border border-[#1e293b]/40 rounded-xl bg-gray-950/20 shadow-sm">
        <table className="min-w-full divide-y divide-[#1e293b]/40 text-xs sm:text-sm">
          {tableHeader.length > 0 && (
            <thead className="bg-[#090d16]/70 text-slate-200">
              <tr>
                {tableHeader.map((th, i) => (
                  <th key={i} className="px-4 py-2 text-left font-bold border-b border-[#1e293b]/40">
                    {renderInlineMarkdown(th)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-[#1e293b]/30 text-slate-300">
            {tableRows.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2">
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableHeader = [];
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        const codeText = codeLines.join("\n");
        const key = `code-${i}`;
        parts.push(
          <div key={key} className="relative group my-4 rounded-xl overflow-hidden bg-slate-950 border border-white/5 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/5 text-[10px] uppercase font-bold tracking-wider text-slate-450 select-none">
              <span>{codeLang || "code"}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(codeText)}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-extrabold text-slate-500"
                title="Copy code"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed text-violet-300 select-text">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.replace("```", "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim().startsWith("|")) {
      const cleanLine = line.trim();
      if (cleanLine.includes("-") && cleanLine.replace(/[|:\-\s]/g, "") === "") {
        continue;
      }
      const cells = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (!inTable) {
        flushList(`list-before-table-${i}`);
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(`table-${i}`);
    }

    const unorderedMatch = line.match(/^[\s]*[\-*]\s+(.*)/);
    const orderedMatch = line.match(/^[\s]*\d+\.\s+(.*)/);

    if (unorderedMatch || orderedMatch) {
      const matchText = unorderedMatch ? unorderedMatch[1] : orderedMatch![1];
      const isCurrentOrdered = !!orderedMatch;

      if (!inList || isOrderedList !== isCurrentOrdered) {
        flushList(`list-${i}`);
        inList = true;
        isOrderedList = isCurrentOrdered;
      }
      listItems.push(matchText);
      continue;
    } else if (inList) {
      flushList(`list-${i}`);
    }

    if (line.startsWith("### ")) {
      parts.push(
        <h4 key={i} className="text-sm sm:text-base font-bold text-white mt-4 mb-2">
          {renderInlineMarkdown(line.slice(4))}
        </h4>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      parts.push(
        <h3 key={i} className="text-base sm:text-lg font-extrabold text-white mt-5 mb-2.5">
          {renderInlineMarkdown(line.slice(3))}
        </h3>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      parts.push(
        <h2 key={i} className="text-lg sm:text-xl font-black text-white mt-6 mb-3">
          {renderInlineMarkdown(line.slice(2))}
        </h2>
      );
      continue;
    }

    if (line.trim()) {
      parts.push(
        <p key={i} className="text-xs sm:text-sm text-slate-300 my-2 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    }
  }

  flushList("list-end");
  flushTable("table-end");

  return <div className="space-y-1">{parts}</div>;
}

function CustomMarkdownComponents() {
  return null;
}

"use client";

export default function BentoFeatures() {
  return (
    <section id="features" className="relative py-20 md:py-28 bg-gray-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-violet-400">
            CORE CAPABILITIES
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            A unified cognitive layer for your communication tools
          </h3>
          <p className="text-gray-400 text-sm">
            Say goodbye to jumping between messaging apps, emails, and calendar schedules. Aura handles it all automatically.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Central Integration Orbit */}
          <div className="md:col-span-2 rounded-2xl bg-gray-900/40 border border-white/5 p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-violet-500/10 text-violet-400 rounded-md border border-violet-500/20 mb-4">
                ORCHESTRATOR
              </span>
              <h4 className="text-2xl font-bold text-white mb-2">Central Integration Orbit</h4>
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                Connect your workspace in minutes. Our AI sync engine establishes a secure bridge with Telegram, WhatsApp, Gmail, and Outlook, routing notifications through a private local intelligence processor.
              </p>
            </div>
            
            <div className="mt-8 flex items-center justify-center h-48 relative">
              {/* Graphic Mockup */}
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent border-dashed" style={{ borderTopWidth: "2px", borderStyle: "dashed", borderColor: "rgba(255,255,255,0.1)" }} />
              <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-gray-700 to-transparent border-dashed" style={{ borderLeftWidth: "2px", borderStyle: "dashed", borderColor: "rgba(255,255,255,0.1)", transform: "rotate(45deg)" }} />
              <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-gray-700 to-transparent border-dashed" style={{ borderLeftWidth: "2px", borderStyle: "dashed", borderColor: "rgba(255,255,255,0.1)", transform: "rotate(-45deg)" }} />
              
              <div className="relative w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)] z-10">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>

              {/* Satellites */}
              <div className="absolute top-8 left-12 w-10 h-10 bg-gray-900 rounded-full border border-red-500/20 flex items-center justify-center text-red-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <div className="absolute bottom-8 left-20 w-10 h-10 bg-gray-900 rounded-full border border-green-500/20 flex items-center justify-center text-green-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
              <div className="absolute top-6 right-16 w-10 h-10 bg-gray-900 rounded-full border border-blue-500/20 flex items-center justify-center text-blue-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></div>
              <div className="absolute bottom-6 right-12 w-10 h-10 bg-gray-900 rounded-full border border-blue-400/20 flex items-center justify-center text-blue-300"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
            </div>
          </div>

          {/* Card 2: Smart Digests */}
          <div className="rounded-2xl bg-gray-900/40 border border-white/5 p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-yellow-500/10 text-yellow-500 rounded-md border border-yellow-500/20 mb-4">
                COGNITIVE
              </span>
              <h4 className="text-xl font-bold text-white mb-2">Smart Digests</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Condense hundreds of WhatsApp chat logs or long Outlook threads into three actionable points. You get high-level bullet summaries that highlight exact requests, action items, and schedules.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-gray-950 text-xs text-gray-400 font-mono space-y-4">
              <div>
                <div className="text-[9px] uppercase tracking-wider font-bold mb-2 text-gray-500">Telegram Digest</div>
                <div className="line-through opacity-50 mb-1">11:15 AM - Client: Let's adjust the deadline to...</div>
                <div className="line-through opacity-50">11:18 AM - Designer: Sounds good. Let's send it...</div>
              </div>
              <div className="pt-3 border-t border-white/5">
                <div className="text-[9px] uppercase tracking-wider font-bold mb-2 text-violet-400">AI Summary</div>
                <div className="flex gap-2 text-white font-sans font-semibold mb-1"><span className="text-red-400">!</span> Client deadline moved to Friday</div>
                <div className="flex gap-2 text-white font-sans font-semibold"><span className="text-red-400">!</span> Need to submit design assets by 5 PM</div>
              </div>
            </div>
          </div>

          {/* Card 3: Zero-Click Reminders */}
          <div className="rounded-2xl bg-gray-900/40 border border-white/5 p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-teal-500/10 text-teal-400 rounded-md border border-teal-500/20 mb-4">
                AUTOMATION
              </span>
              <h4 className="text-xl font-bold text-white mb-2">Zero-Click Reminders</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Never drop a promise again. Aura automatically detects casual commitments like "I'll call you at 4 PM" or "Sending document tonight", sending push reminders to keep you on schedule.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-gray-950 text-xs flex justify-between items-center mt-auto">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">Extracted Commitment</div>
                <div className="font-bold text-white mb-0.5">Call Sarah (Q2 Deliverables)</div>
                <div className="text-violet-400 text-[10px]">Tomorrow, 3:00 PM</div>
              </div>
              <span className="px-3 py-1 rounded bg-violet-600 border border-violet-500 font-bold text-white text-[10px]">Scheduled</span>
            </div>
          </div>

          {/* Card 4: Local-First Privacy Guard */}
          <div className="md:col-span-2 rounded-2xl bg-gray-900/40 border border-white/5 p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 mb-4">
                SECURITY
              </span>
              <h4 className="text-2xl font-bold text-white mb-2">Local-First Privacy Guard</h4>
              <p className="text-sm text-gray-400 leading-relaxed max-w-lg mb-6">
                Your messages belong to you. Aura runs on a local-first architecture. It processes texts directly in secure enclaves using AES-256 encryption. We never store, read, or sell your private conversation data.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-white/5 bg-gray-950 mt-auto">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3">
                <span className="text-sm font-bold text-white">Privacy Preferences</span>
                <span className="text-[10px] text-gray-500">Secure Storage: ACTIVE</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-emerald-400">🛡</span> End-to-End Chat Encryption
                  </div>
                  <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-purple-400">🔒</span> Local LLM Sync (Offline Mode)
                  </div>
                  <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-red-400">🚫</span> Anonymize email bodies
                  </div>
                  <div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Context-Aware Replies */}
          <div className="rounded-2xl bg-gray-900/40 border border-white/5 p-8 flex flex-col justify-between">
            <div>
              <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 mb-4">
                INTERACTIONS
              </span>
              <h4 className="text-xl font-bold text-white mb-2">Context-Aware Replies</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Reply to client emails or contractor WhatsApps using custom-tailored drafts. Our AI reads past context and models your unique tone of voice, letting you dispatch replies with a single click.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-gray-950 mt-auto flex flex-col gap-3">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-gray-500">
                <span>Suggested Draft</span>
                <span className="text-emerald-400">96% Match</span>
              </div>
              <p className="text-xs text-gray-300 font-mono italic">
                "Got it. I'll review the contract and get back to you by Monday."
              </p>
              <div className="flex justify-end">
                <span className="px-3 py-1.5 rounded bg-violet-600 border border-violet-500 font-bold text-white text-[10px]">Insert Reply</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

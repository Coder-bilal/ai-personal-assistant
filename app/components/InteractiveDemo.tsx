"use client";

export default function InteractiveDemo() {
  return (
    <section id="demo" className="relative py-20 md:py-28 bg-gray-950 border-b border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-violet-400">
            LIVE SIMULATION
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Test the AI Sync Engine in Real-Time
          </h3>
          <p className="text-gray-400 text-sm">
            Select an incoming channel, see the raw notification text, and run the simulator to watch how the cognitive layer extracts summaries, draft replies, or calendar events.
          </p>
        </div>

        {/* Demo Playground Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* Left: Channels List */}
          <div className="flex flex-col gap-3 w-full lg:w-48">
            <div className="p-3 rounded-xl border border-violet-500/30 bg-gray-900/40 flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded bg-red-500/20 text-red-500 flex items-center justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
              <div>
                <div className="text-sm font-bold text-white">Gmail</div>
                <div className="text-[10px] text-gray-500 italic">Demo Sync</div>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-gray-900/20 hover:bg-gray-900/40 flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded bg-green-500/20 text-green-500 flex items-center justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div>
              <div>
                <div className="text-sm font-bold text-white">WhatsApp</div>
                <div className="text-[10px] text-gray-500 italic">Demo Sync</div>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-gray-900/20 hover:bg-gray-900/40 flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-500 flex items-center justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></div>
              <div>
                <div className="text-sm font-bold text-white">Telegram</div>
                <div className="text-[10px] text-gray-500 italic">Demo Sync</div>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-gray-900/20 hover:bg-gray-900/40 flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded bg-blue-400/20 text-blue-400 flex items-center justify-center"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
              <div>
                <div className="text-sm font-bold text-white">Outlook</div>
                <div className="text-[10px] text-gray-500 italic">Demo Sync</div>
              </div>
            </div>
          </div>

          {/* Middle & Right: Interface */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-gray-900/30 flex flex-col md:flex-row overflow-hidden shadow-2xl">
            
            {/* Input Panel */}
            <div className="flex-1 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Incoming Notification: Gmail
                  </div>
                  <div className="text-[10px] text-gray-500">10:42 AM</div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-gray-950/80 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[10px] font-bold border border-red-500/30">SF</div>
                    <div>
                      <div className="text-xs font-bold text-white">sarah.finance@corp.com</div>
                      <div className="text-[9px] text-gray-500">via API Gateway</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 font-mono italic">
                    "Hi Rahul, please review the final Q2 budget draft before our meeting tomorrow. Let me know if we need to adjust the Marketing allocation by 10%. Thanks!"
                  </p>
                </div>
              </div>

              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Analyze with Aura AI
              </button>
              <div className="text-[9px] text-gray-500 text-center mt-2">Processes locally using secure cognitive pathways.</div>
            </div>

            {/* Output Panel (Standby State) */}
            <div className="w-full md:w-64 lg:w-80 p-6 flex flex-col bg-gray-900/10">
              <div className="text-xs font-bold text-gray-300 mb-6 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Core Output
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <div className="text-xs font-bold text-white mb-1">AI Engine Standby</div>
                <div className="text-[10px] text-gray-400 px-4">Click "Analyze with Aura AI" to trigger the parser.</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

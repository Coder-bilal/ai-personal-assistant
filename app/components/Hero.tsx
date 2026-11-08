"use client";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden bg-gray-950 flex flex-col items-center justify-center text-center">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gray-950 -z-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[120px] animate-pulse-slow -z-10" />
      
      {/* Mesh and dot patterns */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 -z-20" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center w-full">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel border border-white/10 text-xs sm:text-sm font-medium text-gray-300 mb-8">
          <span className="text-violet-300 font-semibold">Introducing Aura 1.0</span>
          <span className="w-px h-4 bg-white/20" />
          <span className="text-gray-400">Integrate Gmail, WhatsApp, Telegram, Outlook</span>
        </div>

        {/* Headlines */}
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white">
            Your AI Chief of Staff.
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 pb-2">
            Connected to your<br className="hidden sm:block"/> conversations.
          </h1>
        </div>

        {/* Subtext */}
        <p className="max-w-2xl text-lg text-gray-400 leading-relaxed mt-6 mb-10">
          Unify your WhatsApp, Telegram, Gmail, and Outlook into a secure cognitive intelligence workspace. Get automated digests, context-aware drafts, calendar conflict resolutions, and smart reminders instantly.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
          <button className="bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all">
            Start Free Trial
          </button>
          <button className="flex items-center gap-2 glass-panel border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/5 transition-all">
            <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Interactive Demo
          </button>
        </div>
      </div>


      {/* Stats Section (Full Width Borders) */}
      <div className="w-full border-t border-b border-white/10 py-10 mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-white mb-2">100k+</div>
            <div className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Digests Processed</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-white mb-2">98.4%</div>
            <div className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Accuracy Rating</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-white mb-2">&lt; 1.2s</div>
            <div className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Latency Speed</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-extrabold text-white mb-2">AES-256</div>
            <div className="text-xs text-gray-500 font-semibold tracking-widest uppercase">E2E Encryption</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center w-full">
        {/* Dashboard Mockup */}
        <div className="w-full max-w-5xl rounded-2xl glass-panel border border-white/10 shadow-2xl overflow-hidden relative text-left">
          {/* Dashboard Header Bar */}
          <div className="flex items-center px-4 py-3 bg-gray-900/80 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-32 py-1 rounded bg-white/5 text-[10px] text-gray-500 border border-white/5 font-mono">
                aura.ai/dashboard/overview
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex flex-col md:flex-row bg-gray-950/50">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r border-white/5 p-4 flex flex-col gap-6">
              <div>
                <div className="text-[10px] font-bold text-gray-500 tracking-widest mb-3 uppercase">Connected Accounts</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-3 py-2 rounded-lg border border-white/5 bg-white/5">
                    <span className="flex items-center gap-2 text-sm text-gray-300 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Gmail</span>
                    <span className="text-[10px] text-gray-500">Syncing</span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-2 rounded-lg border border-white/5 bg-white/5">
                    <span className="flex items-center gap-2 text-sm text-gray-300 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> WhatsApp</span>
                    <span className="text-[10px] text-gray-500">Syncing</span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-2 rounded-lg border border-white/5 bg-white/5">
                    <span className="flex items-center gap-2 text-sm text-gray-300 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Telegram</span>
                    <span className="text-[10px] text-gray-500">Syncing</span>
                  </div>
                  <div className="flex justify-between items-center px-3 py-2 rounded-lg border border-white/5 bg-white/5">
                    <span className="flex items-center gap-2 text-sm text-gray-300 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Outlook</span>
                    <span className="text-[10px] text-gray-500">Paused</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-500 tracking-widest mb-3 uppercase">Active Agent Tasks</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Summarizing Slack logs
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Drafting client updates
                  </div>
                </div>
              </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Daily Intelligence Briefing</h2>
                  <p className="text-xs text-gray-400">Aggregated from all active communication streams</p>
                </div>
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded bg-violet-900/30 text-[10px] text-violet-300 border border-violet-500/20">5 Critical Notifications</span>
                  <span className="px-3 py-1 rounded bg-emerald-900/30 text-[10px] text-emerald-400 border border-emerald-500/20">Agent Active</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 flex-1">
                {/* Card 1 */}
                <div className="p-4 rounded-xl border border-white/10 bg-gray-900/40 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3 text-xs">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> WhatsApp Smart Reminder</span>
                      <span className="text-gray-500">2m ago</span>
                    </div>
                    <p className="text-sm text-gray-300 italic mb-4">"Hey, send me the slides before our 5 PM call" - John</p>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-950/60 border border-white/5">
                    <div>
                      <div className="text-sm text-white font-medium">Send Pitch Slides to John</div>
                      <div className="text-[10px] text-gray-500">Today, 4:45 PM (Reminder Set)</div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Synced</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-4 rounded-xl border border-white/10 bg-gray-900/40 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3 text-xs">
                      <span className="flex items-center gap-1.5 text-rose-400 font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Gmail Urgent Action</span>
                      <span className="text-gray-500">14m ago</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">"We need to review and sign the NDA before onboarding the contractors..."</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold shadow-md">Draft NDA Response</button>
                    <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/10">Forward NDA</button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span> AI analyzed 14 conversations and extracted 3 tasks in the last 15 minutes.</span>
                <span className="text-violet-400 cursor-pointer hover:text-violet-300 transition-colors">Test in simulator &rarr;</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

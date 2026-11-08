"use client";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 md:py-28 bg-gray-950 border-b border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-violet-400">
            SUBSCRIPTION
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Pricing Plans for Every Workflow
          </h3>
          <p className="text-gray-400 text-sm">
            Start free and scale up as your communication volumes increase. Cancel or switch plans at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-center">
          
          {/* Starter */}
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-8 flex flex-col h-full hover:border-white/10 transition-colors">
            <h4 className="text-lg font-bold text-white mb-1">Starter</h4>
            <p className="text-xs text-gray-500 mb-6">For testing and light usage</p>
            
            <div className="flex items-baseline gap-1 border-b border-white/5 pb-6 mb-6">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-xs text-gray-500">/ month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Connect 2 Accounts
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> 50 AI Summaries / month
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Basic Reminder Syncing
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-600">
                <span>✕</span> Context-Aware Reply Suggestions
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-600">
                <span>✕</span> Local Offline LLM Execution
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-gray-800 text-white font-bold text-xs hover:bg-gray-700 transition-colors">
              Get Started
            </button>
          </div>

          {/* Professional */}
          <div className="rounded-2xl border border-violet-500/30 bg-gray-900/60 p-8 flex flex-col h-[105%] shadow-[0_0_40px_rgba(139,92,246,0.1)] relative">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full tracking-widest shadow-lg shadow-violet-500/50">
              Most Popular
            </div>

            <h4 className="text-lg font-bold text-white mb-1">Professional</h4>
            <p className="text-xs text-gray-500 mb-6">For active power users</p>
            
            <div className="flex items-baseline gap-1 border-b border-white/5 pb-6 mb-6">
              <span className="text-4xl font-extrabold text-white">$19</span>
              <span className="text-xs text-gray-500">/ month</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Connect Unlimited Accounts
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Unlimited AI Digests & Summaries
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Real-time Calendar conflict sync
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> AI Tone-Matched Suggested Replies
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Secure Local processing enclave
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all">
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-8 flex flex-col h-full hover:border-white/10 transition-colors">
            <h4 className="text-lg font-bold text-white mb-1">Enterprise</h4>
            <p className="text-xs text-gray-500 mb-6">For corporate teams & compliance</p>
            
            <div className="flex items-baseline gap-1 border-b border-white/5 pb-6 mb-6 mt-1">
              <span className="text-3xl font-extrabold text-white h-[36px] flex items-center">Custom</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Custom SSO & Identity sync
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Private LLM deployments (VPC/On-prem)
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Custom SLA & 24/7 Phone Support
              </li>
              <li className="flex items-center gap-3 text-xs text-gray-300">
                <span className="text-emerald-400">✓</span> Granular permission auditer tools
              </li>
            </ul>

            <button className="w-full py-3 rounded-xl bg-gray-800 text-white font-bold text-xs hover:bg-gray-700 transition-colors">
              Contact Sales
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

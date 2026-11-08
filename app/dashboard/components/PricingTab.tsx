"use client";

import React from "react";

export default function PricingTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-left">
      {/* Breadcrumb Label */}
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pricing</div>

      {/* Title Section */}
      <div className="border-b border-[#1e293b]/20 pb-4">
        <h2 className="text-3xl font-black text-white tracking-tight">Pricing Settings & Subscriptions</h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Configure your subscription level and check your token usage status.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Starter Plan */}
        <div className="bg-[#0d121f] border border-[#1e293b]/45 rounded-2xl p-8 shadow-lg flex flex-col justify-between min-h-[440px] relative group hover:border-[#1e293b]/75 transition-all">
          <div>
            <div>
              <h4 className="text-xl font-black text-white">Starter</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Ideal for individual testing</p>
            </div>

            <div className="flex items-baseline gap-1 mt-6 border-b border-[#1e293b]/20 pb-6">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>

            <div className="space-y-3.5 mt-6">
              {["1 connected account", "Basic AI summaries", "Daily email briefing"].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                  <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-8 w-full py-3 bg-slate-950 border border-[#1e293b]/40 rounded-xl text-xs font-black text-slate-400 cursor-not-allowed shadow-inner">
            Current Subscription
          </button>
        </div>

        {/* Premium Pro Plan */}
        <div className="bg-[#0d121f] border border-violet-500/35 rounded-2xl p-8 shadow-lg flex flex-col justify-between min-h-[440px] relative ring-1 ring-violet-500/20 group hover:border-violet-500/50 transition-all">
          {/* Popular Badge */}
          <span className="absolute top-8 right-8 bg-violet-600 text-[9px] font-black text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
            Popular
          </span>

          <div>
            <div>
              <h4 className="text-xl font-black text-white">Premium Pro</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Unlimited cognitive assistant power</p>
            </div>

            <div className="flex items-baseline gap-1 mt-6 border-b border-[#1e293b]/20 pb-6">
              <span className="text-4xl font-black text-white">$29</span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>

            <div className="space-y-3.5 mt-6">
              {[
                "All accounts connected",
                "Real-time sync & notifications",
                "Conflict calendar reschedule",
                "Custom replies auto-draft",
                "Priority support",
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                  <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert("Subscribed to Premium Pro plan successfully!")}
            className="mt-8 w-full py-3 bg-[#8b5cf6] hover:bg-violet-500 text-white rounded-xl text-xs font-black text-center shadow-md shadow-violet-900/20 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}

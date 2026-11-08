"use client";

export default function CTA() {
  return (
    <section className="relative py-20 md:py-28 bg-gray-950 overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-gray-950 border border-white/5 p-10 md:p-20 text-center shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-violet-900/10 via-transparent to-transparent -z-10" />
        <div className="absolute -left-32 -bottom-32 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] -z-10" />

        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Ready to reclaim your focus?
        </h2>
        
        <p className="text-gray-400 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
          Join 1,400+ professionals using Aura AI to unify their messaging, emails, and reminders. Start your 14-day free trial today.
        </p>

        <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto mb-8" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your business email"
            required
            className="flex-1 bg-gray-950 border border-white/10 rounded-xl py-4 px-6 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-bold text-sm py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all whitespace-nowrap"
          >
            Join the Waitlist
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-center gap-6 text-[10px] sm:text-xs text-gray-500 font-mono">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-violet-400">✓</span> No credit card required
          </div>
          <div className="flex items-center gap-2 justify-center">
            <span className="text-violet-400">✓</span> Cancel anytime
          </div>
        </div>

      </div>
    </section>
  );
}

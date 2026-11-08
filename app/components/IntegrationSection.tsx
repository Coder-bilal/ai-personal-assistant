"use client";

export default function IntegrationSection() {
  return (
    <section id="integrations" className="relative py-20 md:py-28 bg-gray-950 border-y border-white/5 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-violet-400">
            ONBOARDING
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Setup your Assistant in 3 Steps
          </h3>
          <p className="text-gray-400 text-sm">
            No complex developer API configurations. We leverage secure direct integrations to connect your accounts seamlessly.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal Line */}
          <div className="absolute top-8 left-16 right-16 h-[1px] bg-gray-800"></div>
          <div className="absolute top-8 left-16 right-1/2 h-[1px] bg-gradient-to-r from-violet-600 to-indigo-500"></div>

          <div className="grid grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-950 border border-white/10 flex items-center justify-center text-xl font-extrabold text-white mb-6 shadow-xl shadow-gray-950">
                01
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Securely Connect</h4>
              <p className="text-xs text-gray-400 leading-relaxed px-4">
                Authenticate your Gmail, Outlook, Telegram, and WhatsApp accounts via our secure sandboxed OAuth gateways.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-950 border border-white/10 flex items-center justify-center text-xl font-extrabold text-white mb-6 shadow-xl shadow-gray-950">
                02
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Define Rules</h4>
              <p className="text-xs text-gray-400 leading-relaxed px-4">
                Set priority alerts, select channels for digests, and customize your agent's tone of voice for reply suggestions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-950 border border-white/10 flex items-center justify-center text-xl font-extrabold text-white mb-6 shadow-xl shadow-gray-950">
                03
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Reclaim Your Focus</h4>
              <p className="text-xs text-gray-400 leading-relaxed px-4">
                Receive smart summaries via push notification or calendar briefs. Watch reminders sync and drafts compile automatically.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

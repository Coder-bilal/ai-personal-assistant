"use client";

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 border-t border-white/5 pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 pb-16 border-b border-white/5">
          
          {/* Column 1: Brand & Desc (2 cols) */}
          <div className="col-span-2 flex flex-col space-y-6">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Aura.ai
              </span>
            </a>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Aura AI brings clarity to your communication channels, orchestrating summaries, draft response suggests, and reminder calendar syncs.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-900 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-900 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-900 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011 13.985 13.985 0 0 0 10.128 0 .075.075 0 0 1 .078.012c.12.097.246.194.373.287a.075.075 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: PRODUCT */}
          <div className="flex flex-col space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Product</h5>
            <ul className="space-y-3 text-[11px]">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Live Simulator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Release Notes</a></li>
            </ul>
          </div>

          {/* Column 3: INTEGRATIONS */}
          <div className="flex flex-col space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Integrations</h5>
            <ul className="space-y-3 text-[11px]">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span><a href="#" className="text-gray-400 hover:text-white transition-colors">Gmail</a></li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span><a href="#" className="text-gray-400 hover:text-white transition-colors">WhatsApp</a></li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span><a href="#" className="text-gray-400 hover:text-white transition-colors">Telegram</a></li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span><a href="#" className="text-gray-400 hover:text-white transition-colors">Outlook</a></li>
              <li className="flex items-center gap-2 text-gray-600">Slack (Soon)</li>
            </ul>
          </div>

          {/* Column 4: RESOURCES */}
          <div className="flex flex-col space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h5>
            <ul className="space-y-3 text-[11px]">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Status</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 5: COMPANY */}
          <div className="flex flex-col space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Company</h5>
            <ul className="space-y-3 text-[11px]">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li className="flex items-center gap-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a>
                <span className="px-1.5 py-0.5 rounded bg-violet-600 text-white text-[8px] font-bold uppercase tracking-wider">Hiring</span>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press Kit</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500">
          <div>
            © 2026 Aura AI Inc. All rights reserved.
          </div>
          <div className="flex gap-4 md:gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Shield</a>
            <a href="#" className="hover:text-white transition-colors">CCPA Data Privacy</a>
            <a href="#" className="hover:text-white transition-colors">GDPR Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log("[Auth Callback] Secure session established. Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        console.log("[Auth Callback] No user session found. Checking for redirect errors...");
        const params = new URLSearchParams(window.location.search);
        const insforgeError = params.get("insforge_error") || params.get("error_description") || params.get("error");
        
        if (insforgeError) {
          setError(insforgeError);
        } else {
          setError("Could not retrieve your user session. Please try signing in again.");
        }
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-center items-center relative overflow-hidden font-sans px-4">
      {/* Background glowing mesh circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />
      
      {/* Background grid lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 text-center">
        {/* Glassmorphism Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-white/5 relative overflow-hidden">
          {/* Subtle top border glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          {error ? (
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto animate-bounce">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Authentication Failed</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => router.push("/sign-in")}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-violet-500/20 transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <div className="py-6 space-y-6">
              <div className="relative w-20 h-20 flex items-center justify-center mx-auto">
                {/* Outer dashed circle */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/50 border-t-violet-400 animate-[spin_4s_linear_infinite]" />
                {/* Inner circle */}
                <div className="absolute w-12 h-12 rounded-full bg-violet-950/30 border border-violet-500/10 flex items-center justify-center">
                  {/* Glowing center dot */}
                  <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.8)] animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Completing Sign In</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Establishing secure cognitive sync session...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

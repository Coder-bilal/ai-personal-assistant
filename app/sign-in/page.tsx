"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "../lib/insforge";
import { useAuth } from "../context/AuthContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { user, fetchUser } = useAuth();
  const router = useRouter();

  // Check if user has just verified their email
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "true") {
        setVerified(true);
      }
    }
  }, []);

  // If user is already logged in, redirect them to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Sign-in successful!");
      // Fetch user to trigger DB sync and update global state
      await fetchUser();
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const { data, error: oauthError } = await insforge.auth.signInWithOAuth("google", {
        redirectTo: window.location.origin + "/auth/callback",
      });

      if (oauthError) {
        setError(oauthError.message || "Google Sign-In failed.");
        setGoogleLoading(false);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-center items-center relative overflow-hidden font-sans px-4">
      {/* Background glowing mesh circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-8">
          <a href="/" className="flex items-center gap-2.5 group mb-4">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0.5 rounded-[10px] bg-gray-950 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-violet-400 group-hover:text-cyan-400 transition-colors duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Aura<span className="text-cyan-400 font-medium">.ai</span>
            </span>
          </a>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-2">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm mt-1.5">
            Access your unified AI chat dashboard
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-white/5 relative overflow-hidden">
          {/* Subtle top border glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          {/* Premium Loader Overlay */}
          {(loading || googleLoading) && (
            <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-2xl p-6 text-center animate-fade-in">
              <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                {/* Outer dashed circle */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/50 border-t-violet-400 animate-[spin_4s_linear_infinite]" />
                {/* Inner circle */}
                <div className="absolute w-12 h-12 rounded-full bg-violet-950/30 border border-violet-500/10 flex items-center justify-center">
                  {/* Glowing center dot */}
                  <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.8)] animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Completing Sign In
              </h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Establishing secure cognitive sync session...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-sm flex items-start gap-3 animate-shake">
              <svg
                className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {verified && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3 animate-fade-in">
              <svg
                className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Email verified successfully! You can now sign in below.</span>
            </div>
          )}

          {/* Social Sign In (Google) */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.52 0-6.386-2.866-6.386-6.386 0-3.52 2.866-6.386 6.386-6.386 1.63 0 3.102.617 4.237 1.62l3.052-3.052C19.316 2.454 16.012 1.25 12.24 1.25 5.922 1.25.75 6.422.75 12.74s5.172 11.49 11.49 11.49c6.485 0 11.666-5.172 11.666-11.49 0-.785-.09-1.57-.262-2.337l-11.404-.118z"
                />
              </svg>
            )}
            <span className="group-hover:text-white transition-colors">
              Sign In with Gmail (Google)
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-gray-500 text-xs px-4 uppercase tracking-wider">
              Or with Email
            </span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 rounded-xl bg-gray-900/50 border border-white/5 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 text-white placeholder-gray-500 px-4 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-400"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 rounded-xl bg-gray-900/50 border border-white/5 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 text-white placeholder-gray-500 px-4 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <a
            href="/sign-up"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Sign up for free
          </a>
        </p>
      </div>
    </div>
  );
}

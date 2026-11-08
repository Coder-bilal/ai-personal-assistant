"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "../lib/insforge";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Verification code flow states
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const { user, fetchUser } = useAuth();
  const router = useRouter();

  // If user is already logged in, redirect them to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const redirectToUrl = `${window.location.origin}/sign-in?verified=true`;
      
      const { data, error: signUpError } = await insforge.auth.signUp({
        email,
        password,
        name,
        redirectTo: redirectToUrl,
      });

      if (signUpError) {
        setError(signUpError.message || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Sign-up successful! Verification email sent.");
      setSuccess(true);
      setLoading(false);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setVerificationError("Please enter the verification code.");
      return;
    }

    setVerificationError(null);
    setVerificationLoading(true);

    try {
      const { data, error: verifyError } = await insforge.auth.verifyEmail({
        email,
        otp: verificationCode,
      });

      if (verifyError) {
        setVerificationError(verifyError.message || "Invalid verification code. Please try again.");
        setVerificationLoading(false);
        return;
      }

      console.log("Email verified successfully!");
      // Fetch user to trigger DB sync and update global state
      await fetchUser();
      router.push("/dashboard");
    } catch (e: any) {
      setVerificationError(e.message || "An unexpected error occurred.");
      setVerificationLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendMessage(null);
    setVerificationError(null);
    try {
      const { data, error: resendError } = await insforge.auth.resendVerificationEmail({
        email,
      });
      if (resendError) {
        setVerificationError(resendError.message || "Failed to resend verification code.");
        return;
      }
      setResendMessage("Verification code resent! Please check your inbox.");
    } catch (e: any) {
      setVerificationError(e.message || "An unexpected error occurred.");
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const { data, error: oauthError } = await insforge.auth.signInWithOAuth("google", {
        redirectTo: window.location.origin + "/auth/callback",
      });

      if (oauthError) {
        setError(oauthError.message || "Google Sign-Up failed.");
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
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

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
            Create an Account
          </h2>
          <p className="text-gray-400 text-sm mt-1.5">
            Get started with Aura.ai for free
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
                Creating Account
              </h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Configuring your personal AI workspace...
              </p>
            </div>
          )}

          {success ? (
            <div className="py-2 space-y-5 relative">
              {/* Verification Loader Overlay */}
              {verificationLoading && (
                <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-2xl p-6 text-center animate-fade-in">
                  <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-violet-500/50 border-t-violet-400 animate-[spin_4s_linear_infinite]" />
                    <div className="absolute w-12 h-12 rounded-full bg-violet-950/30 border border-violet-500/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.8)] animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                    Verifying Email
                  </h3>
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                    Synchronizing secure credentials...
                  </p>
                </div>
              )}

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/5">
                  <svg
                    className="w-7 h-7 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Enter Verification Code</h3>
                <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                  We sent a 6-digit code to <strong className="text-cyan-400">{email}</strong>.
                  Enter the code below to verify your email.
                </p>
              </div>

              {verificationError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-sm flex items-start gap-3 animate-shake">
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
                  <span>{verificationError}</span>
                </div>
              )}

              {resendMessage && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3 animate-fade-in">
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
                  <span>{resendMessage}</span>
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div>
                  <label
                    htmlFor="code"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 text-center"
                  >
                    6-Digit Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full h-14 rounded-xl bg-gray-900/50 border border-white/5 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 text-white placeholder-gray-600 px-4 outline-none transition-all text-center tracking-[0.75em] text-2xl font-bold font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verificationLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Verify Email</span>
                </button>
              </form>

              <div className="flex flex-col items-center gap-3 pt-2 text-xs">
                <button
                  onClick={handleResendCode}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  Didn't receive the code? Resend Code
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setVerificationCode("");
                    setVerificationError(null);
                    setResendMessage(null);
                  }}
                  className="text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Back to registration
                </button>
              </div>
            </div>
          ) : (
            <>
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

              {/* Social Sign Up (Google) */}
              <button
                onClick={handleGoogleSignUp}
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
                  Sign Up with Gmail (Google)
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
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-12 rounded-xl bg-gray-900/50 border border-white/5 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/15 text-white placeholder-gray-500 px-4 outline-none transition-all"
                  />
                </div>

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
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
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
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Bottom Link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

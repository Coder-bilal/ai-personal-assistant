"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-950/80 backdrop-blur-md border-b border-white/5 py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
              {/* Central glowing core */}
              <div className="absolute inset-0.5 rounded-[10px] bg-gray-950 flex items-center justify-center">
                <svg
                  className="w-4.5 h-4.5 text-violet-400 group-hover:text-cyan-400 transition-colors duration-300"
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
              {/* Outer halo */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-violet-200 transition-colors">
              Aura<span className="text-cyan-400 font-medium">.ai</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#demo"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Simulator
            </a>
            <a
              href="#integrations"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              FAQ
            </a>
          </nav>

           {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-5">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md overflow-hidden">
                    {user.profile?.avatar_url || user.metadata?.avatar_url || user.metadata?.picture ? (
                      <img
                        src={user.profile?.avatar_url || user.metadata?.avatar_url || user.metadata?.picture}
                        alt="avatar"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      (user.profile?.name || user.metadata?.name || user.email)[0].toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-200">
                    {user.profile?.name || user.profile?.nickname || user.metadata?.name || user.email.split("@")[0]}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-lg hover:shadow-violet-500/25 hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/sign-up" className="bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-violet-500/25 transition-all">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden fixed inset-0 top-[57px] bg-gray-950/95 backdrop-blur-lg z-40 transition-transform duration-300 ease-in-out border-t border-white/5 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 py-8 space-y-6 flex flex-col h-full">
          <a
            href="#features"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5"
          >
            Features
          </a>
          <a
            href="#demo"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5"
          >
            Simulator
          </a>
          <a
            href="#integrations"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-300 hover:text-white transition-colors py-2 border-b border-white/5"
          >
            FAQ
          </a>

          <div className="pt-6 flex flex-col gap-4">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-md overflow-hidden">
                    {user.profile?.avatar_url || user.metadata?.avatar_url || user.metadata?.picture ? (
                      <img
                        src={user.profile?.avatar_url || user.metadata?.avatar_url || user.metadata?.picture}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      (user.profile?.name || user.metadata?.name || user.email)[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {user.profile?.name || user.profile?.nickname || user.metadata?.name || user.email.split("@")[0]}
                    </span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:opacity-90 flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full h-12 rounded-xl border border-white/10 text-gray-300 hover:text-white font-semibold transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full h-12 rounded-xl border border-white/10 text-gray-300 hover:text-white font-semibold flex items-center justify-center transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:opacity-90 flex items-center justify-center transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

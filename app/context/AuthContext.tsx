"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { insforge } from "../lib/insforge";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  providers: string[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  profile?: Record<string, any>;
  integrations?: Record<string, any>;
  dashboard_brief?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (): Promise<User | null> => {
    try {
      let data: any = null;
      let error: any = null;

      // Try standard getCurrentUser first
      const res = await insforge.auth.getCurrentUser();
      data = res.data;
      error = res.error;

      // If it fails on localhost due to cookie blocks, fallback to HTTP session endpoint using the token header
      if (error || !data?.user) {
        const storedToken = typeof window !== "undefined" ? localStorage.getItem("insforge_access_token") : null;
        if (storedToken) {
          try {
            console.log("[Auth] getCurrentUser failed or was blocked. Restoring session via HTTP header fallback...");
            insforge.setAccessToken(storedToken);
            const httpClient = insforge.getHttpClient();
            const response = await httpClient.get<{ user: any }>("/api/auth/sessions/current");
            if (response?.user) {
              data = { user: response.user };
              error = null;
            }
          } catch (err) {
            console.warn("[Auth] Fallback HTTP session fetch failed:", err);
          }
        }
      }

      if (error) {
        // Silently handle expected unauthenticated state without logging console errors
        const isNoTokenError = 
          error.message?.includes("No refresh token") || 
          error.error === "NO_REFRESH_TOKEN" ||
          error.message === "No refresh token provided";
          
        if (!isNoTokenError) {
          console.error("Error fetching current user:", error);
        }
        setUser(null);
        return null;
      }
      if (data?.user) {
        const u = data.user as User;
        
        // Sync access token to localStorage for local persistence (bypasses browser third-party cookie blocks)
        if (typeof window !== "undefined") {
          try {
            const headers = insforge.getHttpClient().getHeaders();
            const authHeader = headers["Authorization"] || headers["authorization"];
            const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
            if (token && token !== "ik_241e4c9e1d0cf6621adeb00a48eb9f1e") {
              localStorage.setItem("insforge_access_token", token);
            }
          } catch (tokenErr) {
            console.error("Error saving auth token to localStorage:", tokenErr);
          }
        }

        // Sync user to database
        await syncUserToDatabase(u);

        // Fetch database record to get integrations and custom profile details
        let enriched = { ...u };
        try {
          const { data: dbUser, error: dbError } = await insforge.database
            .from("users")
            .select("integrations, name, nickname, avatar_url, dashboard_brief")
            .eq("id", u.id)
            .maybeSingle();

          if (dbError) {
            console.error("Error fetching db user record:", dbError);
          } else if (dbUser) {
            enriched = {
              ...u,
              profile: {
                ...u.profile,
                name: dbUser.name || u.profile?.name || u.metadata?.name || u.email.split("@")[0],
                nickname: dbUser.nickname || dbUser.name || u.profile?.nickname || u.email.split("@")[0],
                avatar_url: dbUser.avatar_url || u.profile?.avatar_url || u.metadata?.avatar_url || "",
              },
              integrations: dbUser.integrations || {},
              dashboard_brief: dbUser.dashboard_brief || null,
            };
          }
        } catch (dbErr) {
          console.error("Exception loading user database record:", dbErr);
        }

        setUser(enriched);
        return enriched;
      } else {
        setUser(null);
        return null;
      }
    } catch (e: any) {
      const isNoTokenError = 
        e?.message?.includes("No refresh token") || 
        e?.error === "NO_REFRESH_TOKEN" ||
        e?.message === "No refresh token provided";

      if (!isNoTokenError) {
        console.error("Exception fetching user:", e);
      }
      setUser(null);
      return null;
    }
  };

  const syncUserToDatabase = async (u: User) => {
    try {
      // Check if user profile already exists in public.users table
      const { data, error } = await insforge.database
        .from("users")
        .select("id")
        .eq("id", u.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking user existence in DB:", error);
        return;
      }

      // If profile does not exist, insert it (first-time sign-in)
      if (!data) {
        console.log("First-time sign-in detected. Synchronizing user profile to database...");
        
        const name = u.metadata?.name || u.profile?.nickname || u.email.split("@")[0];
        const avatarUrl = u.metadata?.avatar_url || u.metadata?.picture || "";

        const { error: insertError } = await insforge.database
          .from("users")
          .insert([
            {
              id: u.id,
              email: u.email,
              name: name,
              nickname: name,
              avatar_url: avatarUrl,
              bio: "Aura.ai User",
              birthday: "",
            },
          ]);

        if (insertError) {
          console.error("Failed to insert user profile into DB:", insertError);
        } else {
          console.log("User profile successfully synchronized to database.");
        }
      } else {
        console.log("User profile already exists in database. Skipping synchronization.");
      }
    } catch (e) {
      console.error("Exception in database sync:", e);
    }
  };

  const logout = async () => {
    try {
      const { error } = await insforge.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("insforge_access_token");
      }
      insforge.setAccessToken(null);
      setUser(null);
    } catch (e) {
      console.error("Exception signing out:", e);
      if (typeof window !== "undefined") {
        localStorage.removeItem("insforge_access_token");
      }
      insforge.setAccessToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Restore access token from localStorage if present (fixes sign-out on refresh on localhost)
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("insforge_access_token");
        if (storedToken) {
          console.log("[Auth] Stored access token found. Attempting session restoration...");
          insforge.setAccessToken(storedToken);
          try {
            const httpClient = insforge.getHttpClient();
            const response = await httpClient.get<{ user: any }>("/api/auth/sessions/current");
            if (response?.user) {
              console.log("[Auth] Session successfully restored from stored token.");
              const u = response.user as User;
              setUser(u);
              setLoading(false);
              // Run database sync in background
              syncUserToDatabase(u);
              return;
            }
          } catch (err) {
            console.warn("[Auth] Stored token was invalid or expired. Clearing token.", err);
            localStorage.removeItem("insforge_access_token");
            insforge.setAccessToken(null);
          }
        }
      }

      // 2. Fallback to standard cookie or PKCE-based exchange
      const hasOAuthCode =
        typeof window !== "undefined" &&
        window.location.search.includes("insforge_code");

      if (hasOAuthCode) {
        console.log("OAuth callback code detected. Waiting for SDK to complete exchange...");
        // Wait a brief moment to allow the SDK's auto-exchange to complete
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      await fetchUser();
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

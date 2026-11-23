"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authClient, API_URL } from "@/lib/auth-client";
import {
  apiFetch,
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/lib/api/fetcher";
import type { UserProfile } from "@/types";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<UserProfile | null>;
  syncJwt: (email?: string) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const syncJwt = useCallback(async (email?: string) => {
    try {
      const res = await fetch(`${API_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(email ? { email } : {}),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.token && data?.user) {
        setStoredToken(data.token);
        setUser(data.user);
        return data.user as UserProfile;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const token = getStoredToken();
      if (token) {
        const data = await apiFetch<{ success: boolean; user: UserProfile }>(
          "/api/users/me"
        );
        if (data?.user) {
          setUser(data.user);
          return data.user;
        }
      }

      // Check Next.js same-origin BetterAuth session
      const sessionRes = await authClient.getSession();
      if (sessionRes?.data?.user?.email) {
        return await syncJwt(sessionRes.data.user.email);
      }

      setUser(null);
      return null;
    } catch {
      try {
        const sessionRes = await authClient.getSession();
        if (sessionRes?.data?.user?.email) {
          return await syncJwt(sessionRes.data.user.email);
        }
      } catch {
        // Ignore
      }
      clearStoredToken();
      setUser(null);
      return null;
    }
  }, [syncJwt]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await refreshUser();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch {
      // Ignore
    }
    try {
      await fetch(`${API_URL}/api/jwt/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore
    }
    clearStoredToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, refreshUser, syncJwt, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}

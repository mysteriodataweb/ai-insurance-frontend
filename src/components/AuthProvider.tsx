"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as api from "@/lib/api";
import { clearSession, getSessionUser, saveSession, subscribeSession } from "@/lib/session";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; full_name: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const noopSubscribe = () => () => {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // The session lives in localStorage, which only exists in the browser: the server render
  // and hydration see "no user, not ready", then the client snapshot takes over.
  const user = useSyncExternalStore(subscribeSession, getSessionUser, () => null);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    saveSession(res.access_token, res.user);
  }, []);

  const register = useCallback(async (data: { email: string; full_name: string; password: string; role: string }) => {
    const res = await api.register(data);
    saveSession(res.access_token, res.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    router.push("/login");
  }, [router]);

  return <AuthContext.Provider value={{ user, ready, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/** Renders children only for signed-in users; redirects others to the login page. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}

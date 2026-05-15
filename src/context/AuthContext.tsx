"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User { name: string; email: string }
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const SESSION_KEY = "cvdesignerai_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setHydrated(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const stored = localStorage.getItem(`cvdesignerai_account_${email}`);
    if (!stored) return { ok: false, error: "No account found with this email" };
    const account = JSON.parse(stored);
    if (account.password !== password) return { ok: false, error: "Incorrect password" };
    const u: User = { name: account.name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const existing = localStorage.getItem(`cvdesignerai_account_${email}`);
    if (existing) return { ok: false, error: "An account with this email already exists" };
    localStorage.setItem(`cvdesignerai_account_${email}`, JSON.stringify({ name, password }));
    const u: User = { name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  if (!hydrated) return null;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

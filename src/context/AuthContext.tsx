"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  credits: number;
  is_admin: boolean;
  is_banned: boolean;
  headline: string;
  location: string;
};

type AuthContextType = {
  user: AuthUser | null | undefined;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<Pick<AuthUser, "name" | "headline" | "location">>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchProfile(userId: string): Promise<AuthUser | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (!data) return null;
  return {
    id: data.id,
    name: data.name ?? "",
    email: data.email ?? "",
    credits: data.credits ?? 0,
    is_admin: data.is_admin ?? false,
    is_banned: data.is_banned ?? false,
    headline: data.headline ?? "",
    location: data.location ?? "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const router = useRouter();

  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const profile = await fetchProfile(authUser.id);
      setUser(profile);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(await fetchProfile(session.user.id));
      } else {
        setUser(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(await fetchProfile(session.user.id));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.")), 30000)
      );
      const { error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        timeout,
      ]);
      if (error) return error.message;
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Giriş başarısız. Lütfen tekrar deneyin.";
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin.")), 15000)
      );
      const { error } = await Promise.race([
        supabase.auth.signUp({ email, password, options: { data: { name } } }),
        timeout,
      ]);
      if (error) return error.message;
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Kayıt başarısız. Lütfen tekrar deneyin.";
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/auth/login");
  };

  const updateProfile = async (data: Partial<Pick<AuthUser, "name" | "headline" | "location">>) => {
    if (!user) return;
    await supabase.from("profiles").update(data).eq("id", user.id);
    setUser((prev) => prev ? { ...prev, ...data } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

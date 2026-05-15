"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type CreditsContextType = {
  credits: number;
  deductCredit: () => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  openPurchase: () => void;
  closePurchase: () => void;
  isPurchaseOpen: boolean;
};

const CreditsContext = createContext<CreditsContextType | null>(null);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  const credits = user?.credits ?? 0;

  const deductCredit = async (): Promise<boolean> => {
    if (!user || user.credits <= 0) return false;
    const { error } = await supabase
      .from("profiles")
      .update({ credits: user.credits - 1 })
      .eq("id", user.id);
    if (!error) await refreshUser();
    return !error;
  };

  const addCredits = async (amount: number) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ credits: user.credits + amount })
      .eq("id", user.id);
    if (!error) await refreshUser();
  };

  return (
    <CreditsContext.Provider value={{
      credits,
      deductCredit,
      addCredits,
      openPurchase: () => setIsPurchaseOpen(true),
      closePurchase: () => setIsPurchaseOpen(false),
      isPurchaseOpen,
    }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error("useCredits must be used within CreditsProvider");
  return ctx;
}

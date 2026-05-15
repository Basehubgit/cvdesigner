"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cvdesignerai_credits";
const FREE_CREDITS = 3;

interface CreditsContextType {
  credits: number;
  deductCredit: () => boolean;
  addCredits: (amount: number) => void;
  purchaseOpen: boolean;
  openPurchase: () => void;
  closePurchase: () => void;
}

const CreditsContext = createContext<CreditsContextType | null>(null);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(FREE_CREDITS);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      localStorage.setItem(STORAGE_KEY, String(FREE_CREDITS));
      setCredits(FREE_CREDITS);
    } else {
      setCredits(Number(stored));
    }
    setHydrated(true);
  }, []);

  const deductCredit = useCallback((): boolean => {
    const current = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    if (current <= 0) {
      setPurchaseOpen(true);
      return false;
    }
    const next = current - 1;
    localStorage.setItem(STORAGE_KEY, String(next));
    setCredits(next);
    return true;
  }, []);

  const addCredits = useCallback((amount: number) => {
    const current = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    const next = current + amount;
    localStorage.setItem(STORAGE_KEY, String(next));
    setCredits(next);
  }, []);

  if (!hydrated) return null;

  return (
    <CreditsContext.Provider value={{ credits, deductCredit, addCredits, purchaseOpen, openPurchase: () => setPurchaseOpen(true), closePurchase: () => setPurchaseOpen(false) }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error("useCredits must be used inside CreditsProvider");
  return ctx;
}

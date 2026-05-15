"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface ResumeData {
  id: string;
  title: string;
  template: string;
  updatedAt: string;
  atsScore: number;
  status: "complete" | "draft";
  color: string;
  formData: Record<string, unknown>;
}

interface ResumesContextType {
  resumes: ResumeData[];
  getResume: (id: string) => ResumeData | null;
  saveResume: (id: string, data: Partial<ResumeData>) => void;
  createResume: (template?: string) => string;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;
}

const ResumesContext = createContext<ResumesContextType | null>(null);
const IDS_KEY = "cvdesignerai_resume_ids";
const COLORS = [
  "from-purple-600 to-purple-800",
  "from-blue-600 to-blue-800",
  "from-emerald-600 to-emerald-800",
  "from-pink-600 to-pink-800",
  "from-amber-600 to-amber-800",
];

function resumeKey(id: string) { return `cvdesignerai_resume_${id}`; }

export function ResumesProvider({ children }: { children: React.ReactNode }) {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const ids: string[] = JSON.parse(localStorage.getItem(IDS_KEY) ?? "[]");
    const loaded = ids
      .map((id) => {
        const raw = localStorage.getItem(resumeKey(id));
        return raw ? (JSON.parse(raw) as ResumeData) : null;
      })
      .filter(Boolean) as ResumeData[];
    setResumes(loaded);
    setHydrated(true);
  }, []);

  const persist = useCallback((list: ResumeData[]) => {
    const ids = list.map((r) => r.id);
    localStorage.setItem(IDS_KEY, JSON.stringify(ids));
    list.forEach((r) => localStorage.setItem(resumeKey(r.id), JSON.stringify(r)));
    setResumes(list);
  }, []);

  const getResume = useCallback((id: string): ResumeData | null => {
    const raw = localStorage.getItem(resumeKey(id));
    return raw ? JSON.parse(raw) : null;
  }, []);

  const saveResume = useCallback((id: string, data: Partial<ResumeData>) => {
    setResumes((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (!existing) return prev;
      const updated = { ...existing, ...data, updatedAt: "Just now" };
      const next = prev.map((r) => (r.id === id ? updated : r));
      localStorage.setItem(resumeKey(id), JSON.stringify(updated));
      localStorage.setItem(IDS_KEY, JSON.stringify(next.map((r) => r.id)));
      return next;
    });
  }, []);

  const createResume = useCallback((template = "modern"): string => {
    const id = `resume_${Date.now()}`;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newResume: ResumeData = {
      id,
      title: "Untitled Resume",
      template,
      updatedAt: "Just now",
      atsScore: 0,
      status: "draft",
      color,
      formData: {},
    };
    setResumes((prev) => {
      const next = [newResume, ...prev];
      localStorage.setItem(IDS_KEY, JSON.stringify(next.map((r) => r.id)));
      localStorage.setItem(resumeKey(id), JSON.stringify(newResume));
      return next;
    });
    return id;
  }, []);

  const deleteResume = useCallback((id: string) => {
    setResumes((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem(IDS_KEY, JSON.stringify(next.map((r) => r.id)));
      localStorage.removeItem(resumeKey(id));
      return next;
    });
  }, []);

  const duplicateResume = useCallback((id: string) => {
    const original = localStorage.getItem(resumeKey(id));
    if (!original) return;
    const src = JSON.parse(original) as ResumeData;
    const newId = `resume_${Date.now()}`;
    const copy: ResumeData = { ...src, id: newId, title: src.title + " (Copy)", updatedAt: "Just now", status: "draft" };
    setResumes((prev) => {
      const next = [copy, ...prev];
      localStorage.setItem(IDS_KEY, JSON.stringify(next.map((r) => r.id)));
      localStorage.setItem(resumeKey(newId), JSON.stringify(copy));
      return next;
    });
  }, []);

  if (!hydrated) return null;

  return (
    <ResumesContext.Provider value={{ resumes, getResume, saveResume, createResume, deleteResume, duplicateResume }}>
      {children}
    </ResumesContext.Provider>
  );
}

export function useResumes() {
  const ctx = useContext(ResumesContext);
  if (!ctx) throw new Error("useResumes must be used inside ResumesProvider");
  return ctx;
}

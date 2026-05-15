"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { calcAtsScore } from "@/lib/ats";

export type Resume = {
  id: string;
  title: string;
  template: string;
  status: "draft" | "complete";
  atsScore: number;
  color: string;
  updatedAt: string;
  formData: Record<string, unknown>;
};

type ResumesContextType = {
  resumes: Resume[];
  loading: boolean;
  createResume: (template: string) => Promise<string>;
  saveResume: (id: string, data: Partial<Resume & { formData: Record<string, unknown> }>) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  duplicateResume: (id: string) => Promise<void>;
  getResume: (id: string) => Resume | null;
  fetchResume: (id: string) => Promise<Resume | null>;
};

const ResumesContext = createContext<ResumesContextType | null>(null);

const COLORS = [
  "from-purple-500 to-purple-700",
  "from-blue-500 to-blue-700",
  "from-emerald-500 to-emerald-700",
  "from-pink-500 to-pink-700",
  "from-amber-500 to-amber-700",
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years  = Math.floor(days / 365);
  if (mins < 1)    return "Just now";
  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days < 30)   return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}yr ago`;
}

function rowToResume(r: Record<string, unknown>): Resume {
  return {
    id: r.id as string,
    title: r.title as string,
    template: r.template as string,
    status: r.status as "draft" | "complete",
    atsScore: r.ats_score as number,
    color: r.color as string,
    updatedAt: timeAgo(r.updated_at as string),
    formData: (r.form_data as Record<string, unknown>) ?? {},
  };
}

export function ResumesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!user) { setResumes([]); setLoading(false); return; }
    const { data } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setResumes((data ?? []).map(rowToResume));
    setLoading(false);
  };

  useEffect(() => {
    if (user !== undefined) fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createResume = async (template: string): Promise<string> => {
    const id = `resume_${Date.now()}`;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    await supabase.from("resumes").insert({
      id,
      user_id: user!.id,
      title: "Untitled Resume",
      template,
      status: "draft",
      ats_score: 0,
      color,
      form_data: {},
    });
    await fetchAll();
    return id;
  };

  const saveResume = async (id: string, data: Partial<Resume & { formData: Record<string, unknown> }>) => {
    const atsScore = data.formData ? calcAtsScore(data.formData) : undefined;
    const status = atsScore !== undefined ? (atsScore >= 60 ? "complete" : "draft") : undefined;
    const now = new Date().toISOString();

    await supabase.from("resumes").update({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.template !== undefined && { template: data.template }),
      ...(data.formData !== undefined && { form_data: data.formData }),
      ...(atsScore !== undefined && { ats_score: atsScore }),
      ...(status !== undefined && { status }),
      updated_at: now,
    }).eq("id", id);

    setResumes((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              ...(data.title !== undefined && { title: data.title! }),
              ...(data.template !== undefined && { template: data.template! }),
              ...(data.formData !== undefined && { formData: data.formData! }),
              ...(atsScore !== undefined && { atsScore }),
              ...(status !== undefined && { status: status as "draft" | "complete" }),
              updatedAt: "Just now",
            }
          : r
      )
    );
  };

  const deleteResume = async (id: string) => {
    await supabase.from("resumes").delete().eq("id", id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const duplicateResume = async (id: string) => {
    const original = resumes.find((r) => r.id === id);
    if (!original) return;
    const newId = `resume_${Date.now()}`;
    await supabase.from("resumes").insert({
      id: newId,
      user_id: user!.id,
      title: `${original.title} (Copy)`,
      template: original.template,
      status: original.status,
      ats_score: original.atsScore,
      color: original.color,
      form_data: original.formData,
    });
    await fetchAll();
  };

  const getResume = (id: string): Resume | null =>
    resumes.find((r) => r.id === id) ?? null;

  const fetchResume = async (id: string): Promise<Resume | null> => {
    const { data } = await supabase.from("resumes").select("*").eq("id", id).single();
    return data ? rowToResume(data) : null;
  };

  return (
    <ResumesContext.Provider value={{ resumes, loading, createResume, saveResume, deleteResume, duplicateResume, getResume, fetchResume }}>
      {children}
    </ResumesContext.Provider>
  );
}

export function useResumes() {
  const ctx = useContext(ResumesContext);
  if (!ctx) throw new Error("useResumes must be used within ResumesProvider");
  return ctx;
}

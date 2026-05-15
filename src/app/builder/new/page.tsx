"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, FileText, Link2, Upload, ArrowRight, ChevronLeft, Wand2, AlertCircle } from "lucide-react";
import { useResumes } from "@/context/ResumesContext";

const startOptions = [
  { id: "ai",       icon: Sparkles,  title: "Start with AI",             description: "Answer a few questions and let AI build your resume instantly.", tag: "Fastest",      tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30", color: "border-purple-500/30 hover:border-purple-500/60", iconBg: "bg-purple-600" },
  { id: "blank",    icon: FileText,  title: "Start from scratch",         description: "Build your resume section by section with AI assistance available.", tag: "Full Control", tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30", color: "border-blue-500/30 hover:border-blue-500/60", iconBg: "bg-blue-600" },
  { id: "linkedin", icon: Link2,     title: "Import from LinkedIn",       description: "Automatically import your profile data and we'll format it for you.", tag: "Quickest",     tagColor: "bg-sky-500/20 text-sky-300 border-sky-500/30", color: "border-sky-500/30 hover:border-sky-500/60", iconBg: "bg-sky-600" },
  { id: "upload",   icon: Upload,    title: "Upload existing resume",     description: "Upload your current resume and AI will improve and reformat it.", tag: "Improve",      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", color: "border-emerald-500/30 hover:border-emerald-500/60", iconBg: "bg-emerald-600" },
];

const COMING_SOON = ["linkedin", "upload"];

export default function NewResumePage() {
  const router = useRouter();
  const { createResume } = useResumes();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "ai-questions">("select");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;

    if (COMING_SOON.includes(selected)) return;

    if (selected === "ai" && step === "select") {
      setStep("ai-questions");
      return;
    }

    setLoading(true);
    const id = await createResume("modern");
    router.push(`/builder/${id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === "select" ? "Create a new resume" : "Tell AI about yourself"}
          </h1>
          <p className="text-[#94A3B8] text-sm">
            {step === "select" ? "How would you like to get started?" : "Answer a few quick questions and AI will craft your resume"}
          </p>
        </motion.div>

        {step === "select" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-4 mb-6">
            {startOptions.map((option, i) => {
              const Icon = option.icon;
              const active = selected === option.id;
              const comingSoon = COMING_SOON.includes(option.id);
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={() => !comingSoon && setSelected(option.id)}
                  className={`text-left p-5 rounded-2xl border transition-all relative ${
                    comingSoon
                      ? "border-white/5 glass-card opacity-60 cursor-not-allowed"
                      : active
                      ? `${option.color} bg-white/5 shadow-lg`
                      : "border-white/8 glass-card hover:bg-white/5"
                  }`}
                >
                  {comingSoon && (
                    <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#64748B]">
                      Coming Soon
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 ${option.iconBg} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    {!comingSoon && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${option.tagColor}`}>{option.tag}</span>
                    )}
                  </div>
                  <h3 className={`text-sm font-semibold mb-1.5 ${active ? "text-white" : "text-[#94A3B8]"}`}>{option.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{option.description}</p>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {step === "select" && selected && COMING_SOON.includes(selected) && (
          <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Bu özellik yakında gelecek. Şimdilik &quot;Start from scratch&quot; veya &quot;Start with AI&quot; seçebilirsin.
          </div>
        )}

        {step === "ai-questions" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">What role are you applying for?</label>
              <input className="w-full input-dark rounded-xl px-4 py-3 text-sm" placeholder="e.g. Senior Software Engineer, Product Manager..." value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Years of experience</label>
              <div className="grid grid-cols-4 gap-2">
                {["0-1", "2-4", "5-9", "10+"].map((y) => (
                  <button key={y} onClick={() => setExperience(y)} className={`py-2.5 rounded-xl text-sm font-medium transition-all ${experience === y ? "btn-primary text-white" : "border border-white/10 text-[#64748B] hover:text-white hover:bg-white/5"}`}>{y}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Key skills (comma separated)</label>
              <input className="w-full input-dark rounded-xl px-4 py-3 text-sm" placeholder="e.g. React, TypeScript, Node.js..." />
            </div>
          </motion.div>
        )}

        <div className="flex gap-3">
          {step === "ai-questions" && (
            <button onClick={() => setStep("select")} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-sm text-[#64748B] hover:text-white hover:bg-white/5 transition-all">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button
            onClick={handleContinue}
            disabled={!selected || loading || (!!selected && COMING_SOON.includes(selected))}
            className="flex-1 btn-primary flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</>
            ) : step === "ai-questions" ? (
              <><Sparkles className="w-4 h-4" /> Generate My Resume</>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

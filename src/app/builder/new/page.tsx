"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, FileText, Upload, ArrowRight, ChevronLeft,
  Wand2, AlertCircle, Zap, ClipboardPaste,
} from "lucide-react";
import { useResumes } from "@/context/ResumesContext";

const startOptions = [
  { id: "ai",      icon: Sparkles,       title: "Start with AI",         description: "Answer a few questions and let AI build your resume instantly.",              tag: "Fastest",     tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",   color: "border-purple-500/30 hover:border-purple-500/60",   iconBg: "bg-purple-600" },
  { id: "blank",   icon: FileText,       title: "Start from scratch",    description: "Build your resume section by section with full control.",                     tag: "Full Control",tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",     color: "border-blue-500/30 hover:border-blue-500/60",     iconBg: "bg-blue-600" },
  { id: "upload",  icon: Upload,         title: "Upload resume",         description: "Upload your PDF or .txt — AI will parse it into the resume builder.",        tag: "Import",      tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", color: "border-emerald-500/30 hover:border-emerald-500/60", iconBg: "bg-emerald-600" },
  { id: "improve", icon: Zap,            title: "AI Resume Boost",       description: "Upload your CV and AI rewrites it with stronger language, metrics & impact.", tag: "AI Powered",  tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",     color: "border-amber-500/30 hover:border-amber-500/60",     iconBg: "bg-amber-500" },
  { id: "paste",   icon: ClipboardPaste, title: "Paste resume text",     description: "Copy and paste your resume text — AI will parse and format it instantly.",  tag: "Quick",       tagColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",       color: "border-pink-500/30 hover:border-pink-500/60",       iconBg: "bg-pink-600" },
];

type Step = "select" | "ai-questions" | "upload-paste" | "improve-upload" | "paste-text";

export default function NewResumePage() {
  const router = useRouter();
  const { createResume, saveResume } = useResumes();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Creating...");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const improveFileRef = useRef<HTMLInputElement>(null);

  const goToBuilder = async (formData?: Record<string, unknown>) => {
    const id = await createResume("modern");
    if (formData) {
      await saveResume(id, { formData, title: (formData.name as string) || "My Resume" });
    }
    router.push(`/builder/${id}`);
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/ai/extract-pdf", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Could not read PDF");
    const { text } = await res.json();
    return text;
  };

  const handleContinue = async () => {
    if (!selected) return;
    setError(null);

    if (selected === "blank") {
      setLoading(true);
      setLoadingMsg("Creating...");
      await goToBuilder();
      return;
    }

    if (selected === "ai" && step === "select") { setStep("ai-questions"); return; }
    if (selected === "ai" && step === "ai-questions") {
      setLoading(true);
      setLoadingMsg("Creating...");
      await goToBuilder();
      return;
    }

    if (selected === "upload" && step === "select") { setStep("upload-paste"); return; }
    if (selected === "improve" && step === "select") { setStep("improve-upload"); return; }
    if (selected === "paste" && step === "select") { setStep("paste-text"); return; }

    // Parse / Improve / Paste flow
    if (!pasteText.trim()) {
      setError("Please enter some text or upload a file.");
      return;
    }

    setLoading(true);
    const endpoint = selected === "improve" ? "/api/ai/improve" : "/api/ai/parse";
    setLoadingMsg(selected === "improve" ? "AI is boosting your resume..." : "AI Parsing...");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pasteText }),
      });
      if (!res.ok) throw new Error("Failed");
      const formData = await res.json();
      await goToBuilder(formData);
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.type === "application/pdf") {
      setLoading(true);
      setLoadingMsg("Reading PDF...");
      try {
        const text = await extractPdfText(file);
        setPasteText(text);
      } catch {
        setError("Could not read PDF. Try copying the text manually.");
      } finally {
        setLoading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => setPasteText(ev.target?.result as string ?? "");
      reader.readAsText(file);
    }
  };

  const uploadUI = (isImprove = false) => (
    <motion.div
      key={isImprove ? "improve" : "upload"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card rounded-2xl p-6 mb-6 space-y-4"
    >
      {isImprove && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">
            AI will read your resume and rewrite it with <strong>stronger language</strong>, <strong>action verbs</strong>, and <strong>measurable impact</strong> — ready to impress recruiters.
          </p>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-[#94A3B8] mb-2">Upload your resume (.pdf or .txt)</label>
        <input
          ref={isImprove ? improveFileRef : fileRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => (isImprove ? improveFileRef : fileRef).current?.click()}
          className={`w-full py-8 rounded-xl border border-dashed text-sm transition-all flex flex-col items-center justify-center gap-2 ${
            isImprove
              ? "border-amber-500/30 hover:border-amber-500/60 text-[#64748B] hover:text-amber-300"
              : "border-white/20 hover:border-emerald-500/40 text-[#64748B] hover:text-white"
          }`}
        >
          <Upload className="w-6 h-6" />
          <span>Choose PDF or .txt file</span>
          {pasteText && <span className="text-xs text-green-400 mt-1">✓ File loaded — ready to {isImprove ? "boost" : "parse"}</span>}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <button
            onClick={() => step === "select" ? router.push("/dashboard") : setStep("select")}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {step === "select" ? "Back to Dashboard" : "Back"}
          </button>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === "select"        ? "Create a new resume" :
             step === "ai-questions"  ? "Tell AI about yourself" :
             step === "improve-upload" ? "AI Resume Boost" :
             step === "paste-text"    ? "Paste your resume" :
             "Upload your resume"}
          </h1>
          <p className="text-[#94A3B8] text-sm">
            {step === "select"        ? "How would you like to get started?" :
             step === "ai-questions"  ? "Answer a few quick questions and AI will craft your resume" :
             step === "improve-upload"? "Upload your existing CV — AI will rewrite it to be more impactful" :
             step === "paste-text" ? "Copy your resume text and paste it below — AI will format it" :
             "Upload your PDF or .txt file and AI will parse it into the builder"}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {startOptions.map((option, i) => {
                const Icon = option.icon;
                const active = selected === option.id;
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    onClick={() => setSelected(option.id)}
                    className={`text-left p-5 rounded-2xl border transition-all ${active ? `${option.color} bg-white/5 shadow-lg` : "border-white/8 glass-card hover:bg-white/5"}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 ${option.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${option.tagColor}`}>{option.tag}</span>
                    </div>
                    <h3 className={`text-sm font-semibold mb-1.5 ${active ? "text-white" : "text-[#94A3B8]"}`}>{option.title}</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">{option.description}</p>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {step === "ai-questions" && (
            <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card rounded-2xl p-6 mb-6 space-y-5">
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

          {step === "upload-paste"  && uploadUI(false)}
          {step === "improve-upload" && uploadUI(true)}

          {step === "paste-text" && (
            <motion.div key="paste" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card rounded-2xl p-6 mb-6">
              <label className="block text-sm font-medium text-[#94A3B8] mb-3">Paste your resume text</label>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full input-dark rounded-xl px-4 py-3 text-sm resize-none min-h-64"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleContinue}
            disabled={(!selected && step === "select") || loading}
            className="flex-1 btn-primary flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{loadingMsg}</>
            ) : step === "ai-questions" ? (
              <><Sparkles className="w-4 h-4" /> Generate My Resume</>
            ) : step === "improve-upload" ? (
              <><Zap className="w-4 h-4" /> Boost with AI</>
            ) : step === "upload-paste" || step === "paste-text" ? (
              <><Sparkles className="w-4 h-4" /> Parse with AI</>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Plus, FileText, Sparkles, TrendingUp, Eye, Download,
  MoreHorizontal, Clock, Star, Zap, ArrowRight, Target,
  X, Copy, Trash2, Edit3, Check,
} from "lucide-react";
import { useResumes, type ResumeData } from "@/context/ResumesContext";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "@/context/CreditsContext";

const aiSuggestions = [
  { icon: Target,    title: "Optimize for Google",    description: "Paste the job description to match keywords",    action: "Optimize", color: "text-blue-400",   bg: "bg-blue-500/10",   href: "/dashboard/ai" },
  { icon: TrendingUp,title: "Improve bullet points",  description: "3 weak bullet points detected in your resume",   action: "Improve",  color: "text-purple-400", bg: "bg-purple-500/10", href: "/dashboard/ai" },
  { icon: Star,      title: "Add missing sections",   description: "Add a Summary section to boost your ATS score",  action: "Add",      color: "text-amber-400",  bg: "bg-amber-500/10",  href: "/dashboard/ai" },
];

type Toast = { id: number; message: string; type?: "success" | "info" };

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { credits } = useCredits();
  const { resumes, deleteResume, duplicateResume } = useResumes();
  const [previewResume, setPreviewResume] = useState<ResumeData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toasts, setToasts]         = useState<Toast[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const avgAts = resumes.length > 0 ? Math.round(resumes.reduce((s, r) => s + (r.atsScore || 0), 0) / resumes.length) : 0;
  const stats = [
    { label: "Resumes Created", value: String(resumes.length),        icon: FileText,   color: "text-purple-400" },
    { label: "AI Credits Left", value: String(credits),               icon: Sparkles,   color: "text-emerald-400" },
    { label: "Avg ATS Score",   value: resumes.length ? `${avgAts}%` : "—", icon: TrendingUp, color: "text-amber-400" },
    { label: "Templates",       value: "8",                           icon: Zap,        color: "text-blue-400" },
  ];

  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDownload = (resume: ResumeData) => {
    router.push(`/builder/${resume.id}`);
    addToast(`Opening "${resume.title}" — use Export PDF in builder`, "info");
  };

  const handleDuplicate = (resume: ResumeData) => {
    duplicateResume(resume.id);
    setOpenMenuId(null);
    addToast(`"${resume.title}" duplicated`);
  };

  const handleDelete = (id: string) => {
    const title = resumes.find((r) => r.id === id)?.title;
    deleteResume(id);
    setOpenMenuId(null);
    addToast(`"${title}" deleted`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 md:ml-64 min-h-screen bg-[#07070F]">
        <div className="p-6 md:p-8 max-w-6xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Good morning, {user?.name?.split(" ")[0] ?? "there"} 👋</h1>
              <p className="text-[#64748B] text-sm">Ready to land your dream job? Let&apos;s build something great.</p>
            </div>
            <Link href="/builder/new" className="btn-primary flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
              <Plus className="w-4 h-4" />
              New Resume
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#64748B]">{stat.label}</span>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              );
            })}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Resumes */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">My Resumes</h2>
                <Link href="/dashboard/resumes" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {resumes.length === 0 && (
                  <div className="glass-card rounded-2xl p-10 text-center">
                    <FileText className="w-10 h-10 text-[#475569] mx-auto mb-3" />
                    <p className="text-[#94A3B8] text-sm font-medium mb-1">No resumes yet</p>
                    <p className="text-[#64748B] text-xs mb-4">Create your first resume to get started</p>
                    <Link href="/builder/new" className="btn-primary inline-flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-xl">
                      <Plus className="w-3.5 h-3.5" /> New Resume
                    </Link>
                  </div>
                )}
                <AnimatePresence>
                  {resumes.map((resume, i) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="glass-card rounded-2xl p-5 flex items-center gap-4 group"
                    >
                      <div className={`w-10 h-12 rounded-lg bg-gradient-to-br ${resume.color} flex items-center justify-center shrink-0`}>
                        <FileText className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-white truncate">{resume.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                            resume.status === "complete"
                              ? "bg-green-500/15 text-green-400 border border-green-500/20"
                              : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                          }`}>
                            {resume.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{resume.updatedAt}</span>
                          <span>{resume.template}</span>
                          <span className="flex items-center gap-1 text-green-400"><TrendingUp className="w-3 h-3" />{resume.atsScore}% ATS</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative" ref={menuRef}>
                        <Link href={`/builder/${resume.id}`} className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setPreviewResume(resume)}
                          className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownload(resume)}
                          className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === resume.id ? null : resume.id)}
                            className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                          <AnimatePresence>
                            {openMenuId === resume.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                className="absolute right-0 top-full mt-1 w-36 glass-card rounded-xl p-1 z-20 shadow-xl border border-white/10"
                              >
                                <button
                                  onClick={() => handleDuplicate(resume)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                  <Copy className="w-3.5 h-3.5" /> Duplicate
                                </button>
                                <button
                                  onClick={() => router.push(`/builder/${resume.id}`)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Rename
                                </button>
                                <div className="border-t border-white/5 my-1" />
                                <button
                                  onClick={() => handleDelete(resume.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <Link
                    href="/builder/new"
                    className="flex items-center gap-4 p-5 rounded-2xl border border-dashed border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
                  >
                    <div className="w-10 h-12 rounded-lg border border-dashed border-white/10 group-hover:border-purple-500/40 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4 text-[#64748B] group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#64748B] group-hover:text-white transition-colors">Create new resume</p>
                      <p className="text-xs text-[#475569]">Start from scratch or use AI</p>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-semibold text-white">AI Suggestions</h2>
              </div>

              <div className="space-y-3">
                {aiSuggestions.map((suggestion, i) => {
                  const Icon = suggestion.icon;
                  return (
                    <motion.div
                      key={suggestion.title}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="glass-card rounded-xl p-4 hover:border-purple-500/20 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${suggestion.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${suggestion.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white mb-0.5">{suggestion.title}</p>
                          <p className="text-xs text-[#64748B] leading-relaxed">{suggestion.description}</p>
                        </div>
                      </div>
                      <Link
                        href={suggestion.href}
                        className={`mt-3 text-xs font-medium ${suggestion.color} flex items-center gap-1 hover:gap-1.5 transition-all`}
                      >
                        {suggestion.action}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="pricing-popular rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-300" />
                    <span className="text-sm font-semibold text-white">Need more credits?</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mb-3">Buy CV credits — no subscription, credits never expire.</p>
                  <Link href="/dashboard/billing" className="btn-primary text-xs font-semibold text-white px-4 py-2 rounded-lg flex items-center gap-1.5 w-full justify-center">
                    <Zap className="w-3 h-3" />
                    Buy Credits
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewResume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setPreviewResume(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0D0D1A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div>
                  <p className="text-sm font-semibold text-white">{previewResume.title}</p>
                  <p className="text-xs text-[#64748B]">{previewResume.template} template · ATS {previewResume.atsScore}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { handleDownload(previewResume); setPreviewResume(null); }}
                    className="flex items-center gap-1.5 btn-primary text-white text-xs font-medium px-3 py-2 rounded-lg"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <button onClick={() => setPreviewResume(null)} className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Resume preview */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden text-xs" style={{ fontFamily: "Georgia, serif" }}>
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 text-white">
                    <h2 className="text-base font-bold">Alexandra Chen</h2>
                    <p className="text-purple-300 text-xs mt-0.5">{previewResume.title}</p>
                    <div className="flex flex-wrap gap-x-3 mt-2 text-[10px] text-slate-400">
                      <span>alex.chen@email.com</span>
                      <span>•</span><span>+1 (555) 000-0000</span>
                      <span>•</span><span>San Francisco, CA</span>
                    </div>
                  </div>
                  <div className="px-6 py-4 space-y-4">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-purple-700 mb-1.5">Summary</h3>
                      <p className="text-[11px] text-slate-600 leading-relaxed">Innovative product designer with 6+ years crafting user-centered experiences for Fortune 500 companies. Proven track record of increasing user engagement by 40% and reducing support tickets by 28%.</p>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-purple-700 mb-2">Experience</h3>
                      <div className="space-y-2.5">
                        <div>
                          <div className="flex justify-between">
                            <div><p className="text-[11px] font-bold text-slate-800">Senior Product Designer</p><p className="text-[10px] text-purple-700">Stripe</p></div>
                            <span className="text-[10px] text-slate-400">2022 — Present</span>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-0.5">Led end-to-end design for payment dashboard serving 4M+ merchants, resulting in 28% reduction in support tickets.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-purple-700 mb-1.5">Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {["Figma", "Design Systems", "User Research", "Prototyping", "React"].map((s) => (
                          <span key={s} className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-white/5 flex gap-2">
                <Link href={`/builder/${previewResume.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/10 text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Resume
                </Link>
                <button
                  onClick={() => { handleDownload(previewResume); setPreviewResume(null); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl btn-primary text-white text-sm font-medium"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-xl text-sm text-white"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${toast.type === "info" ? "bg-blue-500/20" : "bg-green-500/20"}`}>
                {toast.type === "info"
                  ? <Download className="w-3 h-3 text-blue-400" />
                  : <Check className="w-3 h-3 text-green-400" />}
              </div>
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

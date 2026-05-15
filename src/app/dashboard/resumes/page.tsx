"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Plus, FileText, Eye, Download, MoreHorizontal,
  Clock, TrendingUp, Search, Grid, List,
  Trash2, Copy, Edit3,
} from "lucide-react";
import { useResumes } from "@/context/ResumesContext";

type FilterType = "all" | "complete" | "draft";

export default function ResumesPage() {
  const router = useRouter();
  const { resumes, deleteResume, duplicateResume } = useResumes();
  const [filter, setFilter]   = useState<FilterType>("all");
  const [search, setSearch]   = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = resumes.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDuplicate = (id: string) => {
    duplicateResume(id);
    setOpenMenu(null);
  };

  const handleDelete = (id: string) => {
    deleteResume(id);
    setOpenMenu(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 min-h-screen bg-[#07070F]">
        <div className="p-8 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">My Resumes</h1>
              <p className="text-[#64748B] text-sm">{resumes.length} {resumes.length === 1 ? "resume" : "resumes"} total</p>
            </div>
            <Link href="/builder/new" className="btn-primary flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
              <Plus className="w-4 h-4" /> New Resume
            </Link>
          </motion.div>

          {/* Toolbar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resumes..." className="w-full input-dark rounded-xl pl-9 pr-4 py-2.5 text-sm" />
            </div>
            <div className="flex gap-1 p-1 glass-card rounded-xl">
              {(["all", "complete", "draft"] as FilterType[]).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-purple-600 text-white" : "text-[#64748B] hover:text-white"}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1 p-1 glass-card rounded-xl">
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-[#64748B] hover:text-white"}`}><List className="w-3.5 h-3.5" /></button>
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-[#64748B] hover:text-white"}`}><Grid className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>

          {/* Empty state */}
          {resumes.length === 0 && (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-[#475569] mx-auto mb-4" />
              <p className="text-white text-sm font-medium mb-1">No resumes yet</p>
              <p className="text-[#64748B] text-xs mb-5">Create your first resume to get started</p>
              <Link href="/builder/new" className="btn-primary inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
                <Plus className="w-4 h-4" /> New Resume
              </Link>
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map((resume, i) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="glass-card rounded-2xl p-5 flex items-center gap-4 group relative"
                >
                  <div className={`w-10 h-12 rounded-lg bg-gradient-to-br ${resume.color} flex items-center justify-center shrink-0`}>
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white truncate">{resume.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${resume.status === "complete" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`}>
                        {resume.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{resume.updatedAt}</span>
                      <span className="capitalize">{resume.template}</span>
                      {resume.atsScore > 0 && (
                        <span className="flex items-center gap-1 text-green-400">
                          <TrendingUp className="w-3 h-3" />{resume.atsScore}% ATS
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/builder/${resume.id}`} className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={() => router.push(`/builder/${resume.id}`)} className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all" title="Preview">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => router.push(`/builder/${resume.id}`)} className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all" title="Download PDF">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === resume.id ? null : resume.id)} className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-all">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                      {openMenu === resume.id && (
                        <div className="absolute right-0 top-full mt-1 w-36 glass-card rounded-xl p-1 z-10 shadow-xl">
                          <button onClick={() => handleDuplicate(resume.id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <Copy className="w-3.5 h-3.5" /> Duplicate
                          </button>
                          <button onClick={() => handleDelete(resume.id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Grid view */}
          {viewMode === "grid" && filtered.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((resume, i) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="glass-card rounded-2xl p-5 group"
                >
                  <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${resume.color} flex items-center justify-center mb-4`}>
                    <FileText className="w-10 h-10 text-white/70" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1 truncate">{resume.title}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${resume.status === "complete" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`}>
                      {resume.status}
                    </span>
                    {resume.atsScore > 0 && <span className="text-xs text-green-400">{resume.atsScore}% ATS</span>}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/builder/${resume.id}`} className="flex-1 text-center py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#94A3B8] hover:text-white transition-all">Edit</Link>
                    <button onClick={() => handleDuplicate(resume.id)} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#94A3B8] hover:text-white transition-all">Duplicate</button>
                    <button onClick={() => handleDelete(resume.id)} className="py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filtered.length === 0 && resumes.length > 0 && (
            <div className="text-center py-20">
              <Search className="w-10 h-10 text-[#475569] mx-auto mb-3" />
              <p className="text-[#64748B] text-sm">No resumes match your search</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

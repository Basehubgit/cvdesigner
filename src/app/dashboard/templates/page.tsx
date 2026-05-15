"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import { Eye, Star, Zap, Check, X } from "lucide-react";
import { useResumes } from "@/context/ResumesContext";

const categories = ["All", "Professional", "Creative", "Minimal", "Executive"];

const templates = [
  { id: "modern", name: "Modern", category: "Professional", color: "#7C3AED", accent: "from-purple-600 to-purple-800", popular: true, free: true, desc: "Clean lines, bold header, perfect for tech roles." },
  { id: "minimal", name: "Minimal", category: "Minimal", color: "#3B82F6", accent: "from-blue-600 to-blue-800", popular: false, free: true, desc: "Simple and elegant. Lets your content shine." },
  { id: "executive", name: "Executive", category: "Executive", color: "#D97706", accent: "from-amber-600 to-amber-800", popular: false, free: false, desc: "Traditional layout for senior-level positions." },
  { id: "creative", name: "Creative", category: "Creative", color: "#EC4899", accent: "from-pink-600 to-pink-800", popular: false, free: false, desc: "Stand out with a unique two-column design." },
  { id: "tech", name: "Tech", category: "Professional", color: "#10B981", accent: "from-emerald-600 to-emerald-800", popular: true, free: true, desc: "Developer-friendly with skills section emphasis." },
  { id: "classic", name: "Classic", category: "Professional", color: "#64748B", accent: "from-slate-600 to-slate-800", popular: false, free: true, desc: "Timeless design that works for any industry." },
  { id: "bold", name: "Bold", category: "Creative", color: "#EF4444", accent: "from-red-600 to-red-800", popular: false, free: false, desc: "High-contrast design for creative professionals." },
  { id: "clean", name: "Clean", category: "Minimal", color: "#06B6D4", accent: "from-cyan-600 to-cyan-800", popular: false, free: true, desc: "Ultra-clean layout with generous whitespace." },
];

export default function TemplatesPage() {
  const router = useRouter();
  const { createResume } = useResumes();
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);

  const handleUseTemplate = async (templateId: string) => {
    const id = await createResume(templateId);
    router.push(`/builder/${id}`);
  };

  const filtered = templates.filter((t) => activeCategory === "All" || t.category === activeCategory);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 min-h-screen bg-[#07070F]">
        <div className="p-8 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Templates</h1>
            <p className="text-[#64748B] text-sm">Choose a template to start building your resume</p>
          </motion.div>

          {/* Category filter */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat ? "btn-primary text-white" : "glass-card text-[#64748B] hover:text-white"}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Templates grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onMouseEnter={() => setHoveredId(template.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="template-card glass-card rounded-2xl overflow-hidden group cursor-pointer"
              >
                {/* Preview thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  {/* Simulated resume preview */}
                  <div className="absolute inset-0 bg-white p-2.5">
                    <div className={`w-full h-10 rounded-md bg-gradient-to-r ${template.accent} mb-2`} />
                    <div className="space-y-1.5">
                      <div className="h-1.5 rounded bg-slate-200 w-3/4" />
                      <div className="h-1.5 rounded bg-slate-100 w-1/2" />
                    </div>
                    <div className="mt-3 space-y-1">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-1 rounded bg-slate-100" style={{ width: `${85 - j * 8}%` }} />
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="h-1.5 rounded bg-slate-200 w-1/3 mb-1.5" />
                      <div className="flex gap-1 flex-wrap">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="h-4 w-12 rounded" style={{ background: template.color + "33" }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {template.popular && (
                      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-600/90 text-white font-medium">
                        <Star className="w-2.5 h-2.5" /> Popular
                      </span>
                    )}
                    {!template.free && (
                      <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/90 text-white font-medium">
                        <Zap className="w-2.5 h-2.5" /> Pro
                      </span>
                    )}
                  </div>

                  {/* Hover overlay */}
                  {hoveredId === template.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs font-medium transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 btn-primary rounded-lg text-white text-xs font-medium"
                      >
                        <Check className="w-3.5 h-3.5" /> Use
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">{template.name}</p>
                    <span className="text-[10px] text-[#64748B] bg-white/5 px-2 py-0.5 rounded-full">{template.category}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{template.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0D0D1A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div>
                  <p className="text-sm font-semibold text-white">{previewTemplate.name}</p>
                  <p className="text-xs text-[#64748B]">{previewTemplate.category} · {previewTemplate.free ? "Free" : "Pro"}</p>
                </div>
                <button onClick={() => setPreviewTemplate(null)} className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg text-xs" style={{ fontFamily: "Georgia, serif" }}>
                  <div className={`w-full px-6 py-5 bg-gradient-to-r ${previewTemplate.accent} text-white`}>
                    <p className="text-sm font-bold">Your Name</p>
                    <p className="text-xs mt-0.5 opacity-80">Professional Title</p>
                    <p className="text-[10px] mt-1.5 opacity-60">email@example.com • +1 555 000 0000 • City, Country</p>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    <div><p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: previewTemplate.color }}>Summary</p><div className="space-y-1">{[...Array(2)].map((_,i) => <div key={i} className="h-1.5 rounded bg-slate-100" style={{ width: `${90 - i*15}%` }} />)}</div></div>
                    <div><p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: previewTemplate.color }}>Experience</p><div className="space-y-1">{[...Array(4)].map((_,i) => <div key={i} className="h-1.5 rounded bg-slate-100" style={{ width: `${85 - i*10}%` }} />)}</div></div>
                    <div><p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: previewTemplate.color }}>Skills</p><div className="flex gap-1 flex-wrap">{[...Array(5)].map((_,i) => <div key={i} className="h-4 w-12 rounded" style={{ background: previewTemplate.color + "33" }} />)}</div></div>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-5">
                <button
                  onClick={() => { handleUseTemplate(previewTemplate.id); setPreviewTemplate(null); }}
                  className="w-full btn-primary text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" /> Use This Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Eye, LayoutTemplate } from "lucide-react";

const templates = [
  {
    id: "modern",
    name: "Modern",
    tag: "Most Popular",
    tagColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    accent: "#7C3AED",
    lightHeader: false,
    preview: { header: "bg-gradient-to-r from-slate-900 to-slate-800", accentLine: "bg-purple-500" },
  },
  {
    id: "minimal",
    name: "Minimal",
    tag: "Clean",
    tagColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    accent: "#3B82F6",
    lightHeader: true,
    preview: { header: "bg-slate-100 border-b-4 border-blue-500", accentLine: "bg-blue-500" },
  },
  {
    id: "executive",
    name: "Executive",
    tag: "Premium",
    tagColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    accent: "#D97706",
    lightHeader: false,
    preview: { header: "bg-gradient-to-r from-amber-900 to-amber-800", accentLine: "bg-amber-400" },
  },
  {
    id: "creative",
    name: "Creative",
    tag: "Bold",
    tagColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    accent: "#EC4899",
    lightHeader: false,
    preview: { header: "bg-gradient-to-br from-pink-700 to-fuchsia-900", accentLine: "bg-pink-400" },
  },
  {
    id: "tech",
    name: "Tech",
    tag: "Developer",
    tagColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    accent: "#10B981",
    lightHeader: false,
    preview: { header: "bg-slate-950 border-l-4 border-emerald-500", accentLine: "bg-emerald-500" },
  },
];

function MiniResumePreview({ template }: { template: typeof templates[0] }) {
  const light = template.lightHeader;
  const nameBg   = light ? "bg-slate-700"    : "bg-white/90";
  const titleBg  = light ? "bg-slate-400"    : "bg-white/50";
  const avatarBg = light ? "bg-slate-400"    : "bg-white/30";

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full aspect-[3/4]">
      {/* Header */}
      <div className={`${template.preview.header} p-3`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-full ${avatarBg} shrink-0`} />
          <div>
            <div className={`h-2 ${nameBg} rounded w-20 mb-1`} />
            <div className={`h-1.5 ${titleBg} rounded w-14`} />
          </div>
        </div>
        <div className={`h-0.5 ${template.preview.accentLine} rounded-full w-full mt-1`} />
      </div>
      {/* Body */}
      <div className="p-3 space-y-2.5">
        {/* Summary */}
        <div>
          <div className="h-1.5 rounded w-12 mb-1.5" style={{ background: template.accent + "99" }} />
          <div className="space-y-1">
            <div className="h-1 bg-slate-200 rounded w-full" />
            <div className="h-1 bg-slate-100 rounded w-5/6" />
          </div>
        </div>
        {/* Experience */}
        <div>
          <div className="h-1.5 rounded w-16 mb-1.5" style={{ background: template.accent + "99" }} />
          <div className="flex justify-between mb-0.5">
            <div className="h-1.5 bg-slate-300 rounded w-16" />
            <div className="h-1 bg-slate-200 rounded w-8" />
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-slate-100 rounded w-full" />
            <div className="h-1 bg-slate-100 rounded w-4/5" />
          </div>
          <div className="flex justify-between mt-1.5 mb-0.5">
            <div className="h-1.5 bg-slate-300 rounded w-14" />
            <div className="h-1 bg-slate-200 rounded w-8" />
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-slate-100 rounded w-full" />
            <div className="h-1 bg-slate-100 rounded w-3/4" />
          </div>
        </div>
        {/* Skills */}
        <div>
          <div className="h-1.5 rounded w-8 mb-1.5" style={{ background: template.accent + "99" }} />
          <div className="flex flex-wrap gap-1">
            {[10, 12, 8, 14, 9].map((w, i) => (
              <div key={i} className="h-1.5 rounded" style={{ width: `${w * 3.5}px`, background: template.accent + "50" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesShowcase() {
  const [activeTemplate, setActiveTemplate] = useState(0);

  return (
    <section id="templates" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge-purple px-4 py-2 rounded-full text-sm mb-6">
            <LayoutTemplate className="w-3.5 h-3.5 text-purple-400" />
            20+ Premium Templates
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="text-white">Choose your</span>
            <br />
            <span className="gradient-text">perfect style</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Every template is designed by professional recruiters and optimized for maximum impact.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Template selector tabs */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {templates.map((template, i) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setActiveTemplate(i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    activeTemplate === i
                      ? "bg-white/8 border-purple-500/40 shadow-lg"
                      : "glass-card hover:bg-white/5 border-white/8"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ background: template.accent, boxShadow: `0 0 8px ${template.accent}` }}
                      />
                      <span className={`font-semibold text-sm ${activeTemplate === i ? "text-white" : "text-[#94A3B8]"}`}>
                        {template.name}
                      </span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${template.tagColor}`}>
                      {template.tag}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <motion.a
              href="/auth/signup"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 btn-primary flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl text-sm group"
            >
              Use This Template
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>
          </div>

          {/* Preview area */}
          <div className="lg:col-span-3 relative">
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <Eye className="w-3.5 h-3.5" />
                  Live Preview
                </div>
              </div>
              <div className="max-w-xs mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTemplate}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MiniResumePreview template={templates[activeTemplate]} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Floating info */}
            <div className="absolute -bottom-4 right-4 glass-card rounded-xl px-4 py-2.5 border border-white/10 shadow-xl">
              <p className="text-xs text-[#94A3B8]">
                Template:{" "}
                <span className="text-white font-semibold">{templates[activeTemplate].name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

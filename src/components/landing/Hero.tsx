"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Play, CheckCircle } from "lucide-react";

const highlights = [
  "ATS-Optimized",
  "AI-Powered Writing",
  "PDF Export",
  "20+ Templates",
];

const resumePreview = {
  name: "Alexandra Chen",
  title: "Senior Product Designer",
  email: "alex.chen@email.com",
  location: "San Francisco, CA",
  summary: "Innovative product designer with 6+ years crafting user-centered experiences for Fortune 500 companies. Proven track record of increasing user engagement by 40%.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "Stripe",
      period: "2022 — Present",
      desc: "Led end-to-end design for payment dashboard serving 4M+ merchants, resulting in 28% reduction in support tickets.",
    },
    {
      role: "Product Designer",
      company: "Figma",
      period: "2020 — 2022",
      desc: "Designed core collaboration features adopted by 500K+ teams worldwide. Conducted 80+ user interviews.",
    },
  ],
  skills: ["Figma", "Design Systems", "User Research", "Prototyping", "React"],
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl orb-1 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl orb-2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 badge-purple px-4 py-2 rounded-full text-sm mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI-Powered Resume Builder</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            >
              Build{" "}
              <span className="gradient-text">Professional</span>
              <br />
              AI-Powered
              <br />
              <span className="text-white">Resumes</span>{" "}
              <span className="text-[#64748B]">in</span>
              <br />
              <span className="text-white">Minutes</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-[#94A3B8] leading-relaxed mb-8 max-w-lg"
            >
              Let AI analyze your experience and craft compelling, ATS-optimized resumes that get you interviews. Stand out from thousands of applicants.
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
                  <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                href="/auth/signup"
                className="btn-primary inline-flex items-center justify-center gap-2.5 text-white font-semibold px-8 py-4 rounded-xl text-base group"
              >
                <Sparkles className="w-4 h-4" />
                Create Resume — Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2.5 text-[#94A3B8] hover:text-white font-medium px-8 py-4 rounded-xl text-base border border-white/10 hover:border-white/20 transition-all hover:bg-white/5"
              >
                <Play className="w-4 h-4" />
                See Features
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {["A", "B", "C", "D", "E"].map((l, i) => (
                  <div
                    key={l}
                    className="w-8 h-8 rounded-full border-2 border-[#07070F] flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: `hsl(${270 + i * 15}, 70%, ${40 + i * 5}%)`,
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-sm text-[#94A3B8]">
                <span className="text-white font-semibold">12,000+</span> professionals
                <br />
                landed their dream jobs
              </div>
            </motion.div>
          </div>

          {/* Right — Resume Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Outer glow container */}
            <div className="relative">
              {/* Background blur blob */}
              <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-3xl transform scale-95" />

              {/* Resume card */}
              <div className="relative bg-white rounded-2xl resume-shadow overflow-hidden" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
                {/* Header — matches Modern template */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-7 text-white">
                  <h2 className="text-2xl font-bold tracking-tight">{resumePreview.name}</h2>
                  <p className="text-purple-400 text-sm mt-1 font-medium tracking-wide">{resumePreview.title}</p>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                    <span>{resumePreview.email}</span>
                    <span className="opacity-40">•</span>
                    <span>{resumePreview.location}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-8 py-6 bg-white space-y-5">
                  {/* Summary */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest pb-1.5 mb-2 border-b border-slate-100" style={{ color: "#7C3AED" }}>
                      Professional Summary
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{resumePreview.summary}</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest pb-1.5 mb-3 border-b border-slate-100" style={{ color: "#7C3AED" }}>
                      Experience
                    </h3>
                    <div className="space-y-3.5">
                      {resumePreview.experience.map((exp, i) => (
                        <div key={i} className="pl-3" style={{ borderLeft: "2px solid #7C3AED44" }}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[12px] font-bold text-slate-800">{exp.role}</p>
                              <p className="text-[11px] font-semibold" style={{ color: "#7C3AED" }}>{exp.company}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 ml-2">{exp.period}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{exp.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest pb-1.5 mb-2 border-b border-slate-100" style={{ color: "#7C3AED" }}>
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {resumePreview.skills.map((skill) => (
                        <span key={skill} className="text-[11px] px-2.5 py-0.5 rounded-md font-medium" style={{ background: "#7C3AED22", color: "#6D28D9" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07070F] to-transparent pointer-events-none" />
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Sparkles, Target, FileDown, Mail, LayoutTemplate, TrendingUp, Globe, Link2, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Writing Engine",
    description: "Claude AI analyzes your experience and automatically generates compelling, professional bullet points that highlight your impact.",
    color: "from-purple-600 to-purple-800",
    glow: "rgba(124, 58, 237, 0.3)",
    tag: "Core",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description: "Every resume is optimized for Applicant Tracking Systems. We analyze job descriptions and tailor keywords automatically.",
    color: "from-blue-600 to-blue-800",
    glow: "rgba(37, 99, 235, 0.3)",
    tag: "Smart",
  },
  {
    icon: FileDown,
    title: "One-Click PDF Export",
    description: "Download pixel-perfect, professionally formatted PDFs instantly. Your resume looks stunning in every viewer.",
    color: "from-emerald-600 to-emerald-800",
    glow: "rgba(5, 150, 105, 0.3)",
    tag: "Export",
  },
  {
    icon: Mail,
    title: "Cover Letter AI",
    description: "Generate personalized cover letters for any job posting. AI writes compelling narratives tailored to each company.",
    color: "from-pink-600 to-pink-800",
    glow: "rgba(219, 39, 119, 0.3)",
    tag: "New",
  },
  {
    icon: LayoutTemplate,
    title: "Premium Templates",
    description: "20+ modern, recruiter-approved templates. From minimalist to creative — find your perfect professional look.",
    color: "from-orange-600 to-orange-800",
    glow: "rgba(234, 88, 12, 0.3)",
    tag: "Design",
  },
  {
    icon: TrendingUp,
    title: "Resume Improvement AI",
    description: "Paste your existing resume and our AI provides specific, actionable improvements to maximize your interview chances.",
    color: "from-cyan-600 to-cyan-800",
    glow: "rgba(8, 145, 178, 0.3)",
    tag: "AI",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Create resumes in 15+ languages. Perfect for international job applications and global career opportunities.",
    color: "from-violet-600 to-violet-800",
    glow: "rgba(109, 40, 217, 0.3)",
    tag: "Global",
  },
  {
    icon: Link2,
    title: "LinkedIn Import",
    description: "One-click import from your LinkedIn profile. We automatically extract and format your professional history.",
    color: "from-sky-600 to-sky-800",
    glow: "rgba(2, 132, 199, 0.3)",
    tag: "Import",
  },
  {
    icon: Zap,
    title: "Job-Specific Optimization",
    description: "Paste any job description and AI instantly tailors your resume to match exactly what employers are looking for.",
    color: "from-yellow-600 to-yellow-800",
    glow: "rgba(202, 138, 4, 0.3)",
    tag: "Smart",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge-purple px-4 py-2 rounded-full text-sm mb-6">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="gradient-text-white">Powerful features</span>
            <br />
            <span className="text-[#64748B]">built for job seekers</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            From AI-powered writing to ATS optimization, every tool you need to land your dream job is right here.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="feature-card glass-card rounded-2xl p-6 group cursor-default"
                style={{
                  ["--feature-glow" as string]: feature.glow,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shrink-0`}
                    style={{ boxShadow: `0 0 20px ${feature.glow}` }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="badge-purple text-xs px-2.5 py-1 rounded-full font-medium">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

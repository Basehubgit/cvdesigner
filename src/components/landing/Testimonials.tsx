"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Kim",
    role: "Software Engineer @ Google",
    avatar: "SK",
    avatarBg: "from-purple-600 to-purple-800",
    content: "CVDesignerAI helped me land interviews at FAANG companies. The AI rewrote my bullet points to highlight impact instead of tasks. Got 3 offers in 6 weeks.",
    stars: 5,
    highlight: "3 offers in 6 weeks",
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager @ Stripe",
    avatar: "MJ",
    avatarBg: "from-blue-600 to-blue-800",
    content: "The ATS optimization feature is incredible. My resume finally started getting through automated screening. The AI cover letter generator saved me hours.",
    stars: 5,
    highlight: "Finally passed ATS screening",
  },
  {
    name: "Priya Patel",
    role: "Data Scientist @ Netflix",
    avatar: "PP",
    avatarBg: "from-pink-600 to-pink-800",
    content: "I was skeptical about AI-generated content, but the quality is genuinely impressive. It understood my research background and translated it into business value.",
    stars: 5,
    highlight: "Research to business value",
  },
  {
    name: "James Chen",
    role: "UX Designer @ Apple",
    avatar: "JC",
    avatarBg: "from-emerald-600 to-emerald-800",
    content: "The templates are stunning. I used the Modern template and everyone I interviewed with complimented my resume design. Landed my dream job at Apple!",
    stars: 5,
    highlight: "Dream job at Apple",
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Director @ Shopify",
    avatar: "ER",
    avatarBg: "from-orange-600 to-orange-800",
    content: "Job-specific optimization is a game changer. I tweaked my resume for each application in seconds. My response rate went from 5% to over 40%.",
    stars: 5,
    highlight: "5% → 40% response rate",
  },
  {
    name: "Alex Thompson",
    role: "DevOps Engineer @ AWS",
    avatar: "AT",
    avatarBg: "from-cyan-600 to-cyan-800",
    content: "The LinkedIn import saved me so much time. Had a complete, polished resume ready in under 10 minutes. The AI improvements were spot-on for technical roles.",
    stars: 5,
    highlight: "Ready in 10 minutes",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)"
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge-purple px-4 py-2 rounded-full text-sm mb-6">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            Loved by professionals
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="text-white">Real stories from</span>
            <br />
            <span className="gradient-text">real job seekers</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            Over 12,000 professionals have used CVDesignerAI to land roles at top companies.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6 mb-16"
        >
          {[
            { value: "12,000+", label: "Resumes created" },
            { value: "4.9/5", label: "Average rating" },
            { value: "78%", label: "Interview success rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center glass-card rounded-2xl py-6">
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-[#64748B]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-6 feature-card"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-5">
                <Quote className="w-6 h-6 text-purple-600/30 absolute -top-1 -left-1" />
                <p className="text-sm text-[#94A3B8] leading-relaxed pl-4">
                  {t.content}
                </p>
              </div>

              {/* Highlight badge */}
              <div className="badge-purple text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1 mb-4">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                {t.highlight}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[#64748B]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

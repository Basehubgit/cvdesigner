"use client";

import { motion } from "framer-motion";
import { Check, Zap, ArrowRight, Sparkles, Star } from "lucide-react";
import Link from "next/link";

const packages = [
  {
    id: "1cv",
    name: "Starter",
    price: "$1.49",
    credits: 1,
    icon: Zap,
    iconBg: "bg-blue-600",
    desc: "Try it out",
    popular: false,
    features: [
      "1 AI-powered CV",
      "All templates included",
      "PDF export",
      "ATS optimization",
    ],
  },
  {
    id: "5cv",
    name: "Value",
    price: "$5.99",
    credits: 5,
    icon: Sparkles,
    iconBg: "bg-purple-600",
    desc: "Best for job seekers",
    popular: true,
    features: [
      "5 AI-powered CVs",
      "All templates included",
      "PDF export",
      "ATS optimization",
      "Priority generation",
    ],
  },
  {
    id: "15cv",
    name: "Pro",
    price: "$14.99",
    credits: 15,
    icon: Star,
    iconBg: "bg-emerald-600",
    desc: "For power users",
    popular: false,
    features: [
      "15 AI-powered CVs",
      "All templates included",
      "PDF export",
      "ATS optimization",
      "Priority generation",
      "Best value per CV",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 badge-purple px-4 py-2 rounded-full text-sm mb-6">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Pay as you go
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="text-white">Simple,</span>{" "}
            <span className="gradient-text">credit-based</span>
            <br />
            <span className="text-white">pricing</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
            No subscriptions. Buy credits, use them whenever you want. Credits never expire.
          </p>
        </motion.div>

        {/* Packages */}
        <div className="grid md:grid-cols-3 gap-6 items-start max-w-4xl mx-auto">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 ${pkg.popular ? "pricing-popular glow-purple" : "glass-card"}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 ${pkg.iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{pkg.name}</h3>
                    <p className="text-xs text-[#64748B]">{pkg.desc}</p>
                  </div>
                </div>

                <div className="mb-7">
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-bold text-white">{pkg.price}</span>
                  </div>
                  <p className="text-sm text-purple-400 font-medium mt-1">
                    {pkg.credits} CV {pkg.credits === 1 ? "credit" : "credits"}
                    <span className="text-[#64748B] font-normal ml-1">
                      (${(parseFloat(pkg.price.slice(1)) / pkg.credits).toFixed(2)}/CV)
                    </span>
                  </p>
                </div>

                <Link
                  href="/auth/signup"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all mb-7 ${pkg.popular ? "btn-primary text-white" : "border border-white/20 hover:bg-white/5 text-white"}`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-3">
                  {pkg.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-[#94A3B8]">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#64748B] mt-10"
        >
          Credits never expire · Secure payment via İyzico · Instant activation
        </motion.p>
      </div>
    </section>
  );
}

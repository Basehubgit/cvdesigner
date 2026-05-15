"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import { Zap, Sparkles, Star, CreditCard, ShieldCheck, Clock } from "lucide-react";
import { useCredits } from "@/context/CreditsContext";

const packages = [
  {
    id: "1cv",
    name: "Starter",
    price: "$1.49",
    priceNum: 1.49,
    credits: 1,
    icon: Zap,
    iconBg: "bg-blue-600",
    desc: "Try it out",
    popular: false,
    perCV: "$1.49",
  },
  {
    id: "5cv",
    name: "Value",
    price: "$5.99",
    priceNum: 5.99,
    credits: 5,
    icon: Sparkles,
    iconBg: "bg-purple-600",
    desc: "Best value",
    popular: true,
    perCV: "$1.20",
  },
  {
    id: "15cv",
    name: "Pro",
    price: "$14.99",
    priceNum: 14.99,
    credits: 15,
    icon: Star,
    iconBg: "bg-emerald-600",
    desc: "Power users",
    popular: false,
    perCV: "$1.00",
  },
];

export default function BillingPage() {
  const { credits, openPurchase } = useCredits();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 min-h-screen bg-[#07070F]">
        <div className="p-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Billing & Credits</h1>
            <p className="text-[#64748B] text-sm">Buy CV credits — no subscription, no expiry</p>
          </motion.div>

          {/* Credit balance */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-[#64748B] mb-0.5">Current balance</p>
                <p className="text-3xl font-bold text-white">
                  {credits}
                  <span className="text-base font-normal text-[#64748B] ml-2">
                    {credits === 1 ? "credit" : "credits"} remaining
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={openPurchase}
              className="btn-primary flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
            >
              <Zap className="w-4 h-4" />
              Buy Credits
            </button>
          </motion.div>

          {/* How it works */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <h2 className="text-base font-semibold text-white mb-4">How credits work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Zap,         title: "1 credit = 1 CV",       desc: "Each AI generation or improvement costs 1 credit." },
                { icon: Clock,       title: "Never expire",           desc: "Credits you buy stay in your account forever." },
                { icon: ShieldCheck, title: "Secure payment",        desc: "Payments processed securely via İyzico." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="glass-card rounded-xl p-4 flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-0.5">{item.title}</p>
                      <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Packages */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-base font-semibold text-white mb-4">Credit packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {packages.map((pkg, i) => {
                const Icon = pkg.icon;
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className={`rounded-2xl p-6 border relative ${pkg.popular ? "pricing-popular border-purple-500/50" : "glass-card border-white/10"}`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-purple-600 text-white font-semibold">
                        Best Value
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 ${pkg.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{pkg.name}</p>
                        <p className="text-xs text-[#64748B]">{pkg.desc}</p>
                      </div>
                    </div>

                    <div className="mb-1">
                      <span className="text-3xl font-bold text-white">{pkg.price}</span>
                    </div>
                    <p className="text-sm text-purple-400 font-medium mb-1">
                      {pkg.credits} {pkg.credits === 1 ? "credit" : "credits"}
                    </p>
                    <p className="text-xs text-[#64748B] mb-5">{pkg.perCV} per CV</p>

                    <button
                      onClick={openPurchase}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${pkg.popular ? "btn-primary text-white" : "border border-white/10 text-[#94A3B8] hover:bg-white/5 hover:text-white"}`}
                    >
                      Buy {pkg.credits} {pkg.credits === 1 ? "Credit" : "Credits"}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Payment note */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 glass-card rounded-2xl p-5 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#64748B] shrink-0" />
            <p className="text-sm text-[#64748B]">
              Payments are processed securely via <span className="text-white font-medium">İyzico</span>. We do not store your card details.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

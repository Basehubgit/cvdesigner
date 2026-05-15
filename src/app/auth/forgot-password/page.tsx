"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FileText, ArrowRight, ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const account = localStorage.getItem(`cvdesignerai_account_${email}`);
    setLoading(false);

    if (!account) {
      setError("No account found with this email address.");
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center glow-purple-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              CVDesigner<span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-[#94A3B8] text-sm">Enter your email and we&apos;ll verify your account</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8 border border-white/8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-white font-semibold mb-2">Account verified!</p>
              <p className="text-sm text-[#64748B] mb-2">
                We found an account for <span className="text-[#94A3B8]">{email}</span>.
              </p>
              <p className="text-xs text-[#475569] mb-6">
                Since this is a demo app, please use the login page and try your existing password, or create a new account.
              </p>
              <Link href="/auth/login" className="text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1.5 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full input-dark rounded-xl pl-10 pr-4 py-3 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</>
                  : <>Verify Account <ArrowRight className="w-4 h-4" /></>
                }
              </button>

              <Link href="/auth/login" className="flex items-center justify-center gap-1.5 text-sm text-[#64748B] hover:text-white transition-colors mt-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

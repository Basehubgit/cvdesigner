"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Eye, EyeOff, Sparkles, ArrowRight, Code2, Globe, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const benefits = [
  "Free forever plan available",
  "No credit card required",
  "Create your first resume in 5 minutes",
];

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialToast, setSocialToast] = useState<string | null>(null);

  const handleSocialLogin = (provider: string) => {
    setSocialToast(`${provider} login coming soon!`);
    setTimeout(() => setSocialToast(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

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
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-[#94A3B8] text-sm">Start building your perfect resume today</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <Check className="w-3 h-3 text-green-500 shrink-0" /> {b}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8 border border-white/8">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => handleSocialLogin("Google")} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm text-[#94A3B8] hover:text-white">
              <Globe className="w-4 h-4" /> Google
            </button>
            <button onClick={() => handleSocialLogin("GitHub")} className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm text-[#94A3B8] hover:text-white">
              <Code2 className="w-4 h-4" /> GitHub
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-[#64748B] bg-transparent">or sign up with email</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className="w-full input-dark rounded-xl px-4 py-3 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full input-dark rounded-xl px-4 py-3 text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className="w-full input-dark rounded-xl px-4 py-3 text-sm pr-11" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Create Free Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#64748B] mt-4">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-purple-400 hover:underline">Terms</Link>{" "}and{" "}
            <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>
          </p>

          <p className="text-center text-sm text-[#64748B] mt-4 pt-4 border-t border-white/5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {socialToast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-xl text-sm text-white z-50">
            <Check className="w-4 h-4 text-purple-400" /> {socialToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

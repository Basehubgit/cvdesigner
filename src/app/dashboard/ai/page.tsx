"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Sparkles, Send, User, RotateCcw, Lightbulb, AlertCircle } from "lucide-react";
import { useCredits } from "@/context/CreditsContext";

type Message = { role: "user" | "ai"; text: string; streaming?: boolean };

const suggestions = [
  "Improve my professional summary",
  "Make my bullet points more impactful with metrics",
  "Optimize my resume for ATS",
  "Suggest skills for a Frontend Developer role",
  "Write a cover letter opening paragraph",
];

export default function AIAssistantPage() {
  const { deductCredit, openPurchase } = useCredits();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! I'm your AI resume assistant. I can help you write stronger bullet points, improve your summary, optimize for ATS, suggest skills, and more. What would you like to work on?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const ok = await deductCredit();
    if (!ok) {
      openPurchase();
      return;
    }
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    // Add a streaming AI message placeholder
    setMessages((prev) => [...prev, { role: "ai", text: "", streaming: true }]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, type: "chat" }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `API error ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "ai", text: current, streaming: true };
          return updated;
        });
      }

      // Mark as done (remove streaming flag)
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "ai", text: accumulated };
        return updated;
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const msg = (err as Error).message;
      setError(msg);
      // Remove the empty streaming placeholder
      setMessages((prev) => prev.filter((m) => !m.streaming));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([{ role: "ai", text: "Hi! I'm your AI resume assistant. I can help you write stronger bullet points, improve your summary, optimize for ATS, and more. What would you like to work on?" }]);
    setInput("");
    setError(null);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 h-screen bg-[#07070F] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Assistant</h1>
              <p className="text-xs text-[#64748B]">Llama 3 70B via Replicate</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#64748B] hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> New chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "ai" ? "bg-purple-600" : "bg-white/10"}`}>
                  {msg.role === "ai"
                    ? <Sparkles className="w-3.5 h-3.5 text-white" />
                    : <User className="w-3.5 h-3.5 text-[#94A3B8]" />}
                </div>
                <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "ai" ? "glass-card text-[#E2E8F0]" : "bg-purple-600/30 border border-purple-500/30 text-white"}`}>
                  {msg.text || (msg.streaming && (
                    <span className="flex gap-1">
                      {[0, 1, 2].map((j) => (
                        <span key={j} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce inline-block" style={{ animationDelay: `${j * 0.15}s` }} />
                      ))}
                    </span>
                  ))}
                  {msg.streaming && msg.text && (
                    <span className="inline-block w-0.5 h-3.5 bg-purple-400 animate-pulse ml-0.5 align-middle" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 text-sm text-red-400 glass-card rounded-xl px-4 py-3 border border-red-500/20">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Bağlantı hatası</p>
                <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
                {error.includes("REPLICATE_API_TOKEN") && (
                  <p className="text-xs text-[#64748B] mt-1">
                    <code className="text-amber-400">.env.local</code> dosyasına <code className="text-amber-400">REPLICATE_API_TOKEN</code> ekleyin.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-[#64748B]">Suggested prompts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 glass-card rounded-full text-[#94A3B8] hover:text-white hover:border-purple-500/40 transition-all disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 pb-6 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to improve your resume..."
              className="flex-1 input-dark rounded-xl px-4 py-3 text-sm"
              disabled={loading}
            />
            {loading ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="px-4 py-3 rounded-xl border border-white/10 text-[#64748B] hover:text-red-400 hover:border-red-500/30 transition-all text-xs"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="btn-primary px-4 py-3 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Zap, Check, Sparkles, ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import { useCredits } from "@/context/CreditsContext";

const packages = [
  {
    id: "1cv",
    credits: 1,
    price: 1.49,
    pricePerCredit: "1.49",
    label: "Başlangıç",
    badge: null,
    savings: null,
    color: "border-white/10",
    highlight: false,
  },
  {
    id: "5cv",
    credits: 5,
    price: 5.99,
    pricePerCredit: "1.20",
    label: "Popüler",
    badge: "En Çok Tercih",
    savings: "%20 indirim",
    color: "border-purple-500/50",
    highlight: true,
  },
  {
    id: "15cv",
    credits: 15,
    price: 14.99,
    pricePerCredit: "1.00",
    label: "En Avantajlı",
    badge: "%33 Tasarruf",
    savings: "%33 indirim",
    color: "border-emerald-500/30",
    highlight: false,
  },
];

export default function PurchaseModal() {
  const { isPurchaseOpen: purchaseOpen, closePurchase } = useCredits();
  const [selected, setSelected] = useState("5cv");
  const [loading, setLoading] = useState(false);
  const [iyzipayForm, setIyzipayForm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPkg = packages.find((p) => p.id === selected)!;

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selected,
          credits: selectedPkg.credits,
          price: selectedPkg.price,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        throw new Error(data.errorMessage ?? "Ödeme başlatılamadı");
      }
      setIyzipayForm(data.checkoutFormContent);
      // Inject script so iyzipay form works
      setTimeout(() => {
        const container = document.getElementById("iyzipay-form-container");
        if (container && data.checkoutFormContent) {
          container.innerHTML = data.checkoutFormContent;
          const scripts = container.querySelectorAll("script");
          scripts.forEach((s) => {
            const newScript = document.createElement("script");
            if (s.src) newScript.src = s.src;
            else newScript.textContent = s.textContent;
            document.body.appendChild(newScript);
          });
        }
      }, 100);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIyzipayForm(null);
    setError(null);
    closePurchase();
  };

  return (
    <AnimatePresence>
      {purchaseOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0D0D1A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-purple-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Buy CV Credits</p>
                  <p className="text-xs text-[#64748B]">Each AI action uses 1 credit</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {iyzipayForm ? (
              /* İyzico form embed */
              <div className="p-6">
                <p className="text-sm text-[#94A3B8] mb-4 text-center">Redirecting to secure payment page...</p>
                <div id="iyzipay-form-container" className="min-h-[400px]" />
              </div>
            ) : (
              <div className="p-6">
                {/* Packages */}
                <div className="space-y-3 mb-6">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelected(pkg.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all relative ${
                        selected === pkg.id
                          ? pkg.highlight
                            ? "border-purple-500/60 bg-purple-500/10"
                            : "border-white/30 bg-white/5"
                          : `${pkg.color} hover:bg-white/5`
                      }`}
                    >
                      {pkg.badge && (
                        <span className={`absolute -top-2.5 left-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pkg.highlight ? "bg-purple-600 text-white" : "bg-emerald-600 text-white"
                        }`}>
                          {pkg.badge}
                        </span>
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selected === pkg.id ? "border-purple-500 bg-purple-500" : "border-white/20"
                        }`}>
                          {selected === pkg.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white">
                              {pkg.credits} CV Credits
                            </p>
                            {pkg.savings && (
                              <span className="text-[10px] text-emerald-400 font-medium">{pkg.savings}</span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B]">${pkg.pricePerCredit} / credit</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-white">${pkg.price}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full btn-primary text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Redirecting...</>
                  ) : (
                    <><CreditCard className="w-4 h-4" />Pay ${selectedPkg.price} — Get {selectedPkg.credits} credits</>
                  )}
                </button>

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-4 text-xs text-[#475569]">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />SSL Secure</span>
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-400" />Powered by Iyzico</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-blue-400" />Instant activation</span>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

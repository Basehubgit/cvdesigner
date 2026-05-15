"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useCredits } from "@/context/CreditsContext";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { addCredits } = useCredits();
  const result  = params.get("result");
  const credits = Number(params.get("credits") ?? 0);
  const [status, setStatus] = useState<"loading" | "success" | "failure">("loading");

  useEffect(() => {
    if (result === "success" && credits > 0) {
      addCredits(credits).then(() => {
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 2500);
      });
    } else if (result === "failure") {
      setStatus("failure");
      setTimeout(() => router.push("/dashboard"), 3000);
    }
  }, [result, credits, router, addCredits]);

  return (
    <div className="min-h-screen bg-[#07070F] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-10 text-center max-w-sm w-full mx-4"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold mb-1">Ödeme doğrulanıyor...</p>
            <p className="text-sm text-[#64748B]">Lütfen bekleyin</p>
          </>
        )}
        {status === "success" && (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
            </motion.div>
            <p className="text-xl font-bold text-white mb-2">Ödeme Başarılı!</p>
            <p className="text-[#94A3B8] text-sm mb-4">
              <span className="text-white font-semibold">{credits} CV kredisi</span> hesabına eklendi.
            </p>
            <p className="text-xs text-[#475569]">Dashboard&apos;a yönlendiriliyorsunuz...</p>
          </>
        )}
        {status === "failure" && (
          <>
            <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <p className="text-xl font-bold text-white mb-2">Ödeme Başarısız</p>
            <p className="text-[#94A3B8] text-sm mb-4">
              Ödeme tamamlanamadı. Kredi kartı bilgilerini kontrol edip tekrar deneyin.
            </p>
            <p className="text-xs text-[#475569]">Dashboard&apos;a yönlendiriliyorsunuz...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07070F] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

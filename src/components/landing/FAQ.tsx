"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How does the AI resume writing work?",
    a: "Our AI analyzes your work experience, skills, and achievements, then crafts compelling professional bullet points that highlight your impact using industry-standard language. It transforms vague descriptions like 'worked on projects' into powerful statements like 'Led cross-functional team of 8 engineers to deliver payment system 2 weeks ahead of schedule, reducing transaction errors by 34%.'",
  },
  {
    q: "What is ATS optimization and why does it matter?",
    a: "ATS (Applicant Tracking System) software is used by 99% of Fortune 500 companies to automatically screen resumes before a human ever sees them. Many qualified candidates get rejected because their resume uses the wrong keywords or format. Our AI analyzes job descriptions and optimizes your resume with the right keywords, formatting, and structure to pass ATS screening.",
  },
  {
    q: "Can I use my own content or only AI-generated text?",
    a: "Absolutely! You have full control. You can write your own content, use AI to generate it, or combine both. Use the AI to create a first draft, then edit every detail to match your voice. You can also use the 'Improve My Resume' feature to enhance content you've already written.",
  },
  {
    q: "How does the job-specific optimization work?",
    a: "Simply paste any job description into our optimizer. The AI analyzes the required skills, keywords, and responsibilities, then compares them against your resume. It highlights gaps and suggests specific additions or modifications to maximize your match score for that particular role.",
  },
  {
    q: "What export formats are available?",
    a: "PDF export is included with every credit. Our PDFs are pixel-perfect and look identical in every PDF viewer. We also ensure the PDF is machine-readable for ATS systems (not just a visual PDF).",
  },
  {
    q: "Is my data secure and private?",
    a: "Yes. We take privacy seriously. Your resume data is encrypted at rest and in transit. We never share or sell your personal data. You can delete your account and all associated data at any time.",
  },
  {
    q: "How does the credit system work?",
    a: "Each AI generation or resume improvement costs 1 credit. You buy credits in packs — 1, 5, or 15 at a time. Credits never expire, so you can use them at your own pace. New accounts get 3 free credits to try the platform.",
  },
  {
    q: "Do credits expire?",
    a: "No. Credits you purchase never expire. There are no subscriptions or recurring charges — you only pay when you want more credits.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge-purple px-4 py-2 rounded-full text-sm mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            Frequently asked
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
            <span className="text-white">Got questions?</span>
            <br />
            <span className="gradient-text">We have answers</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-2xl overflow-hidden transition-all duration-200 ${
                openIndex === i ? "border-purple-500/30" : ""
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className={`text-sm font-medium pr-4 ${openIndex === i ? "text-white" : "text-[#94A3B8]"}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180 text-purple-400" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <p className="text-sm text-[#64748B] leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

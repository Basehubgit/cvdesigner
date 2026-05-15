"use client";

import Link from "next/link";
import { FileText, Share2, Code2, Link2, ArrowRight } from "lucide-react";

const links = {
  Product: [
    { label: "Features",   href: "/#features" },
    { label: "Templates",  href: "/#templates" },
    { label: "Pricing",    href: "/#pricing" },
    { label: "Get Started",href: "/auth/signup" },
  ],
  Resources: [
    { label: "Resume Guide",       href: "/blog/resume-guide" },
    { label: "ATS Tips",           href: "/blog/ats-tips" },
    { label: "Cover Letter Guide", href: "/blog/cover-letter" },
    { label: "FAQ",                href: "/#faq" },
  ],
  Company: [
    { label: "About",           href: "/about" },
    { label: "Privacy Policy",  href: "/privacy" },
    { label: "Terms of Service",href: "/terms" },
    { label: "Contact",         href: "mailto:hello@cvdesignerai.com" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <div className="glass-card rounded-2xl p-8 mb-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-purple-800/10 to-purple-900/20" />
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to land your dream job?
            </h3>
            <p className="text-[#94A3B8] mb-6 max-w-xl mx-auto">
              Join 12,000+ professionals who accelerated their job search with AI.
            </p>
            <Link
              href="/auth/signup"
              className="btn-primary inline-flex items-center gap-2 text-white font-semibold px-8 py-3.5 rounded-xl text-sm group"
            >
              Create Your Resume Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white text-lg tracking-tight">
                CVDesigner<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-[#64748B] leading-relaxed mb-4 max-w-xs">
              AI-powered resume builder that helps you create professional, ATS-optimized resumes in minutes.
            </p>
            <div className="flex gap-3">
              {[Share2, Code2, Link2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 glass-card rounded-lg flex items-center justify-center text-[#64748B] hover:text-purple-400 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#64748B] hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#64748B]">
            © 2025 CVDesignerAI. All rights reserved.
          </p>
          <p className="text-xs text-[#64748B]">
            Built with AI for job seekers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}

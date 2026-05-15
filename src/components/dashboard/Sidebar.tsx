"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FileText, Plus, LayoutTemplate, Sparkles, Settings,
  CreditCard, LogOut, ChevronRight, BarChart3,
  Menu, X, Zap,
} from "lucide-react";
import { useCredits } from "@/context/CreditsContext";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: BarChart3,     label: "Dashboard",    href: "/dashboard" },
  { icon: FileText,      label: "My Resumes",   href: "/dashboard/resumes" },
  { icon: LayoutTemplate,label: "Templates",    href: "/dashboard/templates" },
  { icon: CreditCard,    label: "Billing",      href: "/dashboard/billing" },
  { icon: Settings,      label: "Settings",     href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { credits, openPurchase } = useCredits();
  const { user, logout } = useAuth();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-xl glass-card text-[#94A3B8] hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-[#0A0A15] border-r border-white/5 flex flex-col z-50
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">
              CVDesigner<span className="gradient-text">AI</span>
            </span>
          </Link>
          {/* Close on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-[#64748B] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Resume button */}
        <div className="p-4">
          <Link
            href="/builder/new"
            className="btn-primary w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm"
          >
            <Plus className="w-4 h-4" />
            New Resume
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    active
                      ? "nav-item-active text-purple-300 font-medium"
                      : "text-[#64748B] hover:text-[#94A3B8] hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-400" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Credits */}
        <div className="p-4 border-t border-white/5">
          <div className="glass-card rounded-xl p-3.5 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-medium text-[#94A3B8]">AI Credits</span>
              </div>
              <span className="text-xs text-[#64748B]">{credits} kalan</span>
            </div>
            <button
              onClick={openPurchase}
              className="mt-1 w-full text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 transition-colors flex items-center justify-center gap-1.5 py-1.5 rounded-lg"
            >
              <Zap className="w-3 h-3" />
              Kredi Satın Al
            </button>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name ?? "Guest"}</p>
              <p className="text-xs text-[#64748B] truncate">{user?.email ?? ""}</p>
            </div>
            <button onClick={logout} className="text-[#64748B] hover:text-red-400 transition-colors" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

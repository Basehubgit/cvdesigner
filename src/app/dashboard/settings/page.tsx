"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { User, Lock, Bell, Palette, Trash2, Save, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const tabs = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "password",      label: "Password",      icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance",    label: "Appearance",    icon: Palette },
];

type Tab = "profile" | "password" | "notifications" | "appearance";

export default function SettingsPage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved]         = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwError, setPwError]     = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [name, setName]           = useState(user?.name ?? "");
  const [headline, setHeadline]   = useState(user?.headline ?? "");
  const [location, setLocation]   = useState(user?.location ?? "");
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  type NotifState = { resumeTips: boolean; weeklyDigest: boolean; productUpdates: boolean; marketingEmails: boolean };
  const [notifications, setNotifications] = useState<NotifState>(() => {
    if (typeof window !== "undefined" && user?.id) {
      const stored = localStorage.getItem(`notifications_${user.id}`);
      if (stored) return JSON.parse(stored) as NotifState;
    }
    return { resumeTips: true, weeklyDigest: false, productUpdates: true, marketingEmails: false };
  });

  const handleSaveProfile = async () => {
    await updateProfile({ name, headline, location });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async () => {
    setPwError(null);
    if (passwords.newPw.length < 8) { setPwError("New password must be at least 8 characters"); return; }
    if (passwords.newPw !== passwords.confirm) { setPwError("Passwords do not match"); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.newPw });
    setPwLoading(false);
    if (error) { setPwError(error.message); return; }
    setPasswords({ current: "", newPw: "", confirm: "" });
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm("Are you sure? This will permanently delete your account and all resumes. This cannot be undone.")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
    } catch { /* ignore */ }
    await logout();
  };

  const initials = (user?.name ?? "").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 min-h-screen bg-[#07070F]">
        <div className="p-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
            <p className="text-[#64748B] text-sm">Manage your account preferences</p>
          </motion.div>

          <div className="flex gap-6">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="w-44 shrink-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "nav-item-active text-purple-300 font-medium" : "text-[#64748B] hover:text-white hover:bg-white/5"}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex-1">
              {activeTab === "profile" && (
                <div className="space-y-5">
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-white mb-4">Profile Photo</h2>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-xl font-bold text-white shrink-0">
                        {initials || "?"}
                      </div>
                      <p className="text-xs text-[#64748B]">Avatar generated from your initials</p>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white mb-2">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1.5">Full Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1.5">Email</label>
                        <input value={user?.email ?? ""} disabled className="w-full input-dark rounded-xl px-4 py-2.5 text-sm opacity-50 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1.5">Professional Headline</label>
                        <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Senior Frontend Developer" className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1.5">Location</label>
                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Istanbul, Turkey" className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" />
                      </div>
                    </div>
                    <button onClick={handleSaveProfile} className="flex items-center gap-2 btn-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm mt-2">
                      {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "password" && (
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-semibold text-white mb-2">Change Password</h2>
                  {pwError && (
                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {pwError}
                    </div>
                  )}
                  {pwSuccess && (
                    <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                      <Check className="w-4 h-4 shrink-0" /> Password updated successfully
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">New Password</label>
                    <div className="relative">
                      <input type={showNewPw ? "text" : "password"} value={passwords.newPw} onChange={(e) => setPasswords((p) => ({ ...p, newPw: e.target.value }))} placeholder="Min. 8 characters" className="w-full input-dark rounded-xl px-4 py-2.5 text-sm pr-10" />
                      <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]">
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#64748B] mb-1.5">Confirm New Password</label>
                    <input type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="w-full input-dark rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                  <button onClick={handleChangePassword} disabled={pwLoading} className="flex items-center gap-2 btn-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-60">
                    {pwLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</> : <><Lock className="w-4 h-4" /> Update Password</>}
                  </button>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="glass-card rounded-2xl p-6 space-y-5">
                  <h2 className="text-sm font-semibold text-white mb-2">Notification Preferences</h2>
                  {[
                    { key: "resumeTips"      as const, label: "Resume Tips",      desc: "Weekly tips to improve your resume" },
                    { key: "weeklyDigest"    as const, label: "Weekly Digest",    desc: "Summary of your activity and stats" },
                    { key: "productUpdates" as const, label: "Product Updates",  desc: "New features and improvements" },
                    { key: "marketingEmails" as const, label: "Marketing Emails", desc: "Promotions and special offers" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-medium">{item.label}</p>
                        <p className="text-xs text-[#64748B]">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications((p) => ({ ...p, [item.key]: !p[item.key] }))}
                        style={{ width: "42px", height: "22px" }}
                        className={`rounded-full transition-all relative shrink-0 ${notifications[item.key] ? "bg-purple-600" : "bg-white/10"}`}
                      >
                        <div style={{ width: "18px", height: "18px", left: notifications[item.key] ? "22px" : "2px" }} className="absolute top-0.5 bg-white rounded-full shadow transition-all" />
                      </button>
                    </div>
                  ))}
                  <button onClick={handleSaveNotifications} className="flex items-center gap-2 btn-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm mt-4">
                    {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Preferences</>}
                  </button>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-5">
                  <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-white mb-4">Theme</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "dark",   label: "Dark",   desc: "Always dark mode" },
                        { id: "system", label: "System", desc: "Match system preference" },
                      ].map((t) => (
                        <div key={t.id} className="p-4 rounded-xl border border-purple-500/50 bg-purple-500/10 text-left">
                          <p className="text-sm font-medium text-purple-300 mb-0.5">{t.label}</p>
                          <p className="text-xs text-[#64748B]">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
                    <h2 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h2>
                    <p className="text-xs text-[#64748B] mb-4">Once you delete your account, there is no going back.</p>
                    <button onClick={handleDeleteAccount} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

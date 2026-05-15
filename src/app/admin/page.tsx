"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, FileText, TrendingUp, ShieldAlert, CreditCard,
  RefreshCw, Ban, CheckCircle, Plus, Minus, LogOut, BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Stats = {
  totalUsers: number;
  bannedUsers: number;
  newUsersToday: number;
  totalResumes: number;
  newResumesToday: number;
  avgAtsScore: number;
  completeResumes: number;
  totalCreditsRemaining: number;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  credits: number;
  is_banned: boolean;
  is_admin: boolean;
  created_at: string;
};

type Tab = "stats" | "users";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creditInputs, setCreditInputs] = useState<Record<string, number>>({});

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  const refresh = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patchUser = async (id: string, body: Partial<UserRow>) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await fetchUsers();
  };

  const toggleBan = (u: UserRow) => patchUser(u.id, { is_banned: !u.is_banned });

  const addCredits = async (u: UserRow) => {
    const amount = creditInputs[u.id] ?? 0;
    if (amount === 0) return;
    await patchUser(u.id, { credits: u.credits + amount });
    setCreditInputs((p) => ({ ...p, [u.id]: 0 }));
  };

  const removeCredits = async (u: UserRow) => {
    const amount = creditInputs[u.id] ?? 0;
    if (amount === 0) return;
    await patchUser(u.id, { credits: Math.max(0, u.credits - amount) });
    setCreditInputs((p) => ({ ...p, [u.id]: 0 }));
  };

  const statCards = stats
    ? [
        { label: "Total Users",        value: stats.totalUsers,             icon: Users,      color: "text-blue-400",   bg: "bg-blue-500/10" },
        { label: "New Today",           value: stats.newUsersToday,          icon: TrendingUp, color: "text-green-400",  bg: "bg-green-500/10" },
        { label: "Banned Users",        value: stats.bannedUsers,            icon: ShieldAlert, color: "text-red-400",   bg: "bg-red-500/10" },
        { label: "Total Resumes",       value: stats.totalResumes,           icon: FileText,   color: "text-purple-400", bg: "bg-purple-500/10" },
        { label: "Resumes Today",       value: stats.newResumesToday,        icon: FileText,   color: "text-amber-400",  bg: "bg-amber-500/10" },
        { label: "Avg ATS Score",       value: `${stats.avgAtsScore}%`,      icon: BarChart3,  color: "text-cyan-400",   bg: "bg-cyan-500/10" },
        { label: "Complete Resumes",    value: stats.completeResumes,        icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Credits in System",   value: stats.totalCreditsRemaining,  icon: CreditCard, color: "text-pink-400",   bg: "bg-pink-500/10" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#07070F]">
      {/* Top bar */}
      <div className="border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-[#64748B]">Logged in as {user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-card rounded-xl w-fit mb-8">
          {(["stats", "users"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? "bg-purple-600 text-white" : "text-[#64748B] hover:text-white"}`}
            >
              {t === "stats" ? "Dashboard" : "Users"}
            </button>
          ))}
        </div>

        {/* Stats tab */}
        {tab === "stats" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-2xl p-5"
                  >
                    <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-white mb-0.5">{card.value}</p>
                    <p className="text-xs text-[#64748B]">{card.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === "users" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#64748B]">{users.length} users total</p>
            </div>
            {users.map((u, i) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass-card rounded-2xl p-5 flex flex-wrap items-center gap-4 ${u.is_banned ? "border border-red-500/20" : ""}`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {u.name?.charAt(0)?.toUpperCase() || "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-white truncate">{u.name || "—"}</p>
                    {u.is_admin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Admin</span>}
                    {u.is_banned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">Banned</span>}
                  </div>
                  <p className="text-xs text-[#64748B]">{u.email}</p>
                  <p className="text-xs text-[#475569] mt-0.5">
                    Joined {new Date(u.created_at).toLocaleDateString("tr-TR")}
                  </p>
                </div>

                {/* Credits badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                  {u.credits} credits
                </div>

                {/* Credit controls */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    value={creditInputs[u.id] ?? 0}
                    onChange={(e) => setCreditInputs((p) => ({ ...p, [u.id]: Number(e.target.value) }))}
                    className="w-16 input-dark rounded-lg px-2 py-1.5 text-xs text-center"
                  />
                  <button
                    onClick={() => addCredits(u)}
                    className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all"
                    title="Add credits"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeCredits(u)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                    title="Remove credits"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Ban button */}
                <button
                  onClick={() => toggleBan(u)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    u.is_banned
                      ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  }`}
                >
                  {u.is_banned ? <><CheckCircle className="w-3.5 h-3.5" />Unban</> : <><Ban className="w-3.5 h-3.5" />Ban</>}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

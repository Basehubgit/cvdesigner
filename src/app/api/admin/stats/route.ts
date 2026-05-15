import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function GET() {
  const [usersRes, resumesRes] = await Promise.all([
    admin.from("profiles").select("id, credits, created_at, is_banned"),
    admin.from("resumes").select("id, ats_score, status, created_at"),
  ]);

  const users = usersRes.data ?? [];
  const resumes = resumesRes.data ?? [];
  const today = new Date().toISOString().split("T")[0];

  return NextResponse.json({
    totalUsers: users.length,
    bannedUsers: users.filter((u) => u.is_banned).length,
    newUsersToday: users.filter((u) => u.created_at?.startsWith(today)).length,
    totalResumes: resumes.length,
    newResumesToday: resumes.filter((r) => r.created_at?.startsWith(today)).length,
    avgAtsScore: resumes.length
      ? Math.round(resumes.reduce((s, r) => s + (r.ats_score ?? 0), 0) / resumes.length)
      : 0,
    completeResumes: resumes.filter((r) => r.status === "complete").length,
    totalCreditsRemaining: users.reduce((s, u) => s + (u.credits ?? 0), 0),
  });
}

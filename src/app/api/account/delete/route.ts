import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const adminSupabase = createClient(
  "https://vivvzwfzjxtnelhkymzz.supabase.co",
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error } = await adminSupabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  await adminSupabase.from("resumes").delete().eq("user_id", user.id);
  await adminSupabase.from("profiles").delete().eq("id", user.id);
  await adminSupabase.auth.admin.deleteUser(user.id);

  return NextResponse.json({ success: true });
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) router.replace("/auth/login");
    if (user && !user.is_admin) router.replace("/dashboard");
  }, [user, router]);

  if (!user || !user.is_admin) return null;
  return <>{children}</>;
}

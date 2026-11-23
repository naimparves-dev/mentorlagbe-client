"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

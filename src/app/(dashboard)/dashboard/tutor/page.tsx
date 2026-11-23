"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Users, Crown, PlusCircle } from "lucide-react";
import { getTutorStats } from "@/lib/api/dashboard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function TutorOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPosted: 0,
    activeApproved: 0,
    pendingApproval: 0,
    totalApplicants: 0,
    plan: user?.plan || "free",
    postLimit: user?.plan === "pro" ? null : 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutorStats()
      .then((res) => setStats(res.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Tutor Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your tuition batches, approval status, and student enrollments.
          </p>
        </div>
        <Link href="/dashboard/tutor/post-tuition">
          <Button>
            <PlusCircle className="h-4 w-4" />
            Post a Tuition
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tuitions Posted"
            value={stats.totalPosted}
            subtitle={
              stats.postLimit
                ? `Free Limit: ${stats.totalPosted}/${stats.postLimit} posts`
                : "Unlimited posts enabled"
            }
            icon={<BookOpen className="h-5 w-5" />}
            accent="brand"
          />
          <StatsCard
            title="Active & Approved"
            value={stats.activeApproved}
            subtitle={`${stats.pendingApproval} pending admin review`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
          />
          <StatsCard
            title="Total Applicants"
            value={stats.totalApplicants}
            icon={<Users className="h-5 w-5" />}
            accent="amber"
          />
          <StatsCard
            title="Current Plan"
            value={stats.plan.toUpperCase()}
            icon={<Crown className="h-5 w-5" />}
            accent="indigo"
          />
        </div>
      )}
    </div>
  );
}

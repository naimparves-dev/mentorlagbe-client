"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Crown,
  Bookmark,
  ArrowRight,
} from "lucide-react";
import { getStudentStats } from "@/lib/api/dashboard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplied: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
    bookmarksCount: 0,
    plan: user?.plan || "free",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentStats()
      .then((res) => setStats(res.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Student Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track your tuition applications, saved mentors, and subscription status.
          </p>
        </div>
        <Link href="/tuitions">
          <Button>
            Browse Tuitions
            <ArrowRight className="h-4 w-4" />
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
            title="Total Applied"
            value={stats.totalApplied}
            icon={<ClipboardList className="h-5 w-5" />}
            accent="brand"
          />
          <StatsCard
            title="Accepted Applications"
            value={stats.accepted}
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
          />
          <StatsCard
            title="Pending Applications"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            accent="amber"
          />
          <StatsCard
            title="Current Plan"
            value={stats.plan.toUpperCase()}
            subtitle={
              stats.plan === "pro"
                ? "Unlimited bookmarks active"
                : `${stats.bookmarksCount}/5 free bookmarks used`
            }
            icon={<Crown className="h-5 w-5" />}
            accent="indigo"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/student/my-applications">
          <Card className="transition hover:border-primary">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <h2 className="font-bold">My Applications</h2>
                <p className="text-xs text-muted-foreground">
                  View status updates or cancel pending requests
                </p>
              </div>
              <ClipboardList className="h-6 w-6 text-primary" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/saved">
          <Card className="transition hover:border-primary">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <h2 className="font-bold">Saved Tuitions</h2>
                <p className="text-xs text-muted-foreground">
                  Quickly revisit your bookmarked mentorship batches
                </p>
              </div>
              <Bookmark className="h-6 w-6 text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

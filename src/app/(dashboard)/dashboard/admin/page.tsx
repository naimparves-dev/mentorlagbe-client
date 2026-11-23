"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, GraduationCap, BookOpen, DollarSign } from "lucide-react";
import { getAdminStats } from "@/lib/api/dashboard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalStudents: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    rejectedTuitions: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide user counts, tuition moderation queue, and Stripe revenue.
        </p>
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
            title="Total Users"
            value={stats.totalUsers}
            subtitle={`${stats.totalStudents} Students • ${stats.totalTutors} Tutors`}
            icon={<Users className="h-5 w-5" />}
            accent="brand"
          />
          <StatsCard
            title="Total Tutors"
            value={stats.totalTutors}
            icon={<GraduationCap className="h-5 w-5" />}
            accent="indigo"
          />
          <StatsCard
            title="Pending vs Approved"
            value={`${stats.pendingTuitions} / ${stats.approvedTuitions}`}
            subtitle={`${stats.rejectedTuitions} rejected listings`}
            icon={<BookOpen className="h-5 w-5" />}
            accent="amber"
          />
          <StatsCard
            title="Total Stripe Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            subtitle="Paid Pro subscriptions"
            icon={<DollarSign className="h-5 w-5" />}
            accent="emerald"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/admin/tuitions">
          <Card className="transition hover:border-primary">
            <CardContent className="p-5">
              <h2 className="font-bold">Tuition Moderation Queue</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Approve or reject pending tutor listings
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/admin/users">
          <Card className="transition hover:border-primary">
            <CardContent className="p-5">
              <h2 className="font-bold">User Role Management</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Assign student, tutor, or admin roles
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/admin/transactions">
          <Card className="transition hover:border-primary">
            <CardContent className="p-5">
              <h2 className="font-bold">Stripe Transactions</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Audit Pro Tutor & Pro Student payments
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

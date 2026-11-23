"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getStudentApplications } from "@/lib/api/dashboard";
import { cancelApplicationAction } from "@/lib/action/applications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Application } from "@/types";

const STATUS_VARIANT = {
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
} as const;

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentApplications()
      .then((res) => setApplications(res.applications || []))
      .catch((err: unknown) =>
        toast.error(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this pending application?")) return;
    try {
      const res = await cancelApplicationAction(id);
      toast.success(res.message);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Cancel failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">My Applications</h1>
        <p className="text-sm text-muted-foreground">
          Track tutor responses and cancel pending applications.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            You haven&apos;t applied to any tuitions yet.
          </p>
          <Link href="/tuitions" className="mt-4 inline-block">
            <Button>Explore Tuitions</Button>
          </Link>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tuition</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Monthly Fee</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>
                    <Link
                      href={`/tuitions/${app.tuitionId}`}
                      className="inline-flex items-center gap-1 font-bold hover:text-primary"
                    >
                      {app.tuitionTitle}
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                    <p className="text-xs text-muted-foreground">{app.subject}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{app.tutorName}</p>
                    <p className="text-xs text-muted-foreground">{app.tutorEmail}</p>
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    ৳{app.monthlyFee.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[app.status]} className="capitalize">
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {app.status === "pending" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(app._id)}
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { getTutorApplicants } from "@/lib/api/dashboard";
import { updateApplicantStatusAction } from "@/lib/action/applications";
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

export default function TutorApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutorApplicants()
      .then((res) => setApplications(res.applications || []))
      .catch((err: unknown) =>
        toast.error(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      const res = await updateApplicantStatusAction(id, status);
      toast.success(res.message);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Manage Applicants</h1>
        <p className="text-sm text-muted-foreground">
          Review student inquiries and accept or reject tuition enrollments.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No student applications received yet.
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Tuition</TableHead>
                <TableHead>Schedule & Note</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>
                    <p className="font-bold">{app.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.studentEmail}
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {app.studentPhone}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{app.tuitionTitle}</p>
                    <p className="text-xs text-muted-foreground">{app.subject}</p>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-xs font-semibold">{app.preferredSchedule}</p>
                    {app.studentNote && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {app.studentNote}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[app.status]}
                      className="capitalize"
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        disabled={app.status === "accepted"}
                        onClick={() => handleStatus(app._id, "accepted")}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={app.status === "rejected"}
                        onClick={() => handleStatus(app._id, "rejected")}
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
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

"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { getAdminTuitions } from "@/lib/api/dashboard";
import { moderateTuitionAction } from "@/lib/action/admin";
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
import type { Tuition } from "@/types";

const STATUS_VARIANT = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
} as const;

export default function AdminTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  // The list is "loading" until the data for the *current* filter arrives, so
  // no `setLoading(true)` is needed inside the effect.
  const [loadedStatus, setLoadedStatus] = useState<string | null>(null);
  const loading = loadedStatus !== filterStatus;

  useEffect(() => {
    let active = true;
    getAdminTuitions(filterStatus)
      .then((res) => {
        if (!active) return;
        setTuitions(res.tuitions || []);
        setLoadedStatus(filterStatus);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setLoadedStatus(filterStatus);
        toast.error(err instanceof Error ? err.message : "Failed to load");
      });
    return () => {
      active = false;
    };
  }, [filterStatus]);

  const handleModerate = async (
    id: string,
    approvalStatus: "approved" | "rejected"
  ) => {
    try {
      const res = await moderateTuitionAction(id, approvalStatus);
      toast.success(res.message);
      setTuitions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, approvalStatus } : t))
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Moderation failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Tuition Approval Flow</h1>
          <p className="text-sm text-muted-foreground">
            Approve or reject tutor submissions before they appear publicly.
          </p>
        </div>

        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={filterStatus === st ? "default" : "outline"}
              onClick={() => setFilterStatus(st)}
              className="capitalize"
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : tuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No tuitions found in this category.
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tuition Title</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Fee / Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tuitions.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>
                    <p className="font-bold">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.subject} • {t.classLevel}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{t.tutorName}</p>
                    <p className="text-xs text-muted-foreground">{t.tutorEmail}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-primary">
                      ৳{t.monthlyFee.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.mode}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[t.approvalStatus]}
                      className="capitalize"
                    >
                      {t.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        disabled={t.approvalStatus === "approved"}
                        onClick={() => handleModerate(t._id, "approved")}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={t.approvalStatus === "rejected"}
                        onClick={() => handleModerate(t._id, "rejected")}
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

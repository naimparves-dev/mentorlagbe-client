"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Power, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { getTutorTuitions } from "@/lib/api/dashboard";
import {
  deleteTuitionAction,
  updateTuitionAction,
} from "@/lib/action/tuitions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

const APPROVAL_VARIANT = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
} as const;

export default function TutorMyTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tuition | null>(null);

  useEffect(() => {
    getTutorTuitions()
      .then((res) => setTuitions(res.tuitions || []))
      .catch((err: unknown) =>
        toast.error(err instanceof Error ? err.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleToggleActive = async (t: Tuition) => {
    try {
      const res = await updateTuitionAction(t._id, { isActive: !t.isActive });
      toast.success(
        `Tuition marked as ${res.tuition.isActive ? "Active" : "Closed"}`
      );
      setTuitions((prev) =>
        prev.map((item) => (item._id === t._id ? res.tuition : item))
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tuition post permanently?")) return;
    try {
      const res = await deleteTuitionAction(id);
      toast.success(res.message);
      setTuitions((prev) => prev.filter((item) => item._id !== id));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      const res = await updateTuitionAction(editing._id, {
        title: editing.title,
        monthlyFee: Number(editing.monthlyFee),
        daysPerWeek: Number(editing.daysPerWeek),
        location: editing.location,
        description: editing.description,
      });
      toast.success(res.message);
      setTuitions((prev) =>
        prev.map((item) => (item._id === editing._id ? res.tuition : item))
      );
      setEditing(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not update");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">My Created Tuitions</h1>
          <p className="text-sm text-muted-foreground">
            Edit details, toggle active availability, or remove tuition listings.
          </p>
        </div>
        <Link href="/dashboard/tutor/post-tuition">
          <Button>
            <PlusCircle className="h-4 w-4" />
            New Tuition
          </Button>
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : tuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          You haven&apos;t posted any tuitions yet.
        </div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tuition</TableHead>
                <TableHead>Fee / Mode</TableHead>
                <TableHead>Admin Approval</TableHead>
                <TableHead>Availability</TableHead>
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
                    <p className="font-bold text-primary">
                      ৳{t.monthlyFee.toLocaleString()}/mo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.mode} • {t.daysPerWeek} days/wk
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={APPROVAL_VARIANT[t.approvalStatus]}
                      className="capitalize"
                    >
                      {t.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.isActive ? "default" : "secondary"}>
                      {t.isActive ? "Active" : "Closed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleActive(t)}
                        title="Toggle Active / Closed"
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditing(t)}
                        title="Edit Tuition"
                      >
                        <Pencil className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(t._id)}
                        title="Delete Tuition"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-lg p-6">
            <h2 className="text-lg font-extrabold">Edit Tuition Listing</h2>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  type="text"
                  required
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Monthly Fee (BDT)</Label>
                  <Input
                    type="number"
                    required
                    value={editing.monthlyFee}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        monthlyFee: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Days / Week</Label>
                  <Input
                    type="number"
                    min={1}
                    max={7}
                    required
                    value={editing.daysPerWeek}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        daysPerWeek: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input
                  type="text"
                  required
                  value={editing.location}
                  onChange={(e) =>
                    setEditing({ ...editing, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

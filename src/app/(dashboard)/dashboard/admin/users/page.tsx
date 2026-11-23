"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { toast } from "sonner";
import { getAdminUsers } from "@/lib/api/dashboard";
import { updateUserRoleAction } from "@/lib/action/admin";
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
import type { UserProfile, UserRole } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers()
      .then((res) => setUsers(res.users || []))
      .catch((err: unknown) =>
        toast.error(err instanceof Error ? err.message : "Failed to load users")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await updateUserRoleAction(userId, newRole);
      toast.success(res.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Role update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage user roles across Student, Tutor, and Admin.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          u.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            u.name
                          )}&background=0d9488&color=fff`
                        }
                        alt={u.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <span className="font-bold">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={u.plan === "pro" ? "warning" : "secondary"}
                      className="gap-1 uppercase"
                    >
                      {u.plan === "pro" && <Crown className="h-3 w-3" />}
                      {u.plan || "free"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <select
                      value={u.role || "student"}
                      onChange={(e) =>
                        handleRoleChange(u._id, e.target.value as UserRole)
                      }
                      className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-bold capitalize"
                    >
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
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

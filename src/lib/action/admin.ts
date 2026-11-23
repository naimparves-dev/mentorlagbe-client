import { apiFetch } from "@/lib/api/fetcher";
import type { UserRole } from "@/types";

export async function updateUserRoleAction(userId: string, role: UserRole) {
  return apiFetch<{ success: boolean; message: string }>(
    `/api/admin/users/${userId}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }
  );
}

export async function moderateTuitionAction(
  tuitionId: string,
  approvalStatus: "approved" | "rejected" | "pending"
) {
  return apiFetch<{ success: boolean; message: string }>(
    `/api/admin/tuitions/${tuitionId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ approvalStatus }),
    }
  );
}

import { apiFetch } from "@/lib/api/fetcher";
import type { Application } from "@/types";

export async function applyForTuitionAction(payload: {
  tuitionId: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
}) {
  return apiFetch<{
    success: boolean;
    message: string;
    application: Application;
  }>("/api/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelApplicationAction(id: string) {
  return apiFetch<{ success: boolean; message: string }>(
    `/api/applications/student/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function updateApplicantStatusAction(
  id: string,
  status: "accepted" | "rejected"
) {
  return apiFetch<{ success: boolean; message: string }>(
    `/api/applications/tutor/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

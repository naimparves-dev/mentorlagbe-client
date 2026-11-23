import { apiFetch } from "@/lib/api/fetcher";
import type { Tuition } from "@/types";

export async function createTuitionAction(payload: {
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
}) {
  return apiFetch<{ success: boolean; message: string; tuition: Tuition }>(
    "/api/tuitions",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function updateTuitionAction(
  id: string,
  payload: Partial<Tuition>
) {
  return apiFetch<{ success: boolean; message: string; tuition: Tuition }>(
    `/api/tuitions/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteTuitionAction(id: string) {
  return apiFetch<{ success: boolean; message: string }>(
    `/api/tuitions/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function submitReviewAction(
  tuitionId: string,
  payload: { rating: number; comment: string }
) {
  return apiFetch<{ success: boolean; message: string }>(
    `/api/tuitions/${tuitionId}/reviews`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

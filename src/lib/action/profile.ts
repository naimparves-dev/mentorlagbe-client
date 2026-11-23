import { apiFetch } from "@/lib/api/fetcher";
import type { UserProfile } from "@/types";

export async function updateProfileAction(payload: {
  name?: string;
  phone?: string;
  bio?: string;
  image?: string;
}) {
  return apiFetch<{ success: boolean; message: string; user: UserProfile }>(
    "/api/users/profile",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function toggleBookmarkAction(tuitionId: string) {
  return apiFetch<{
    success: boolean;
    bookmarked: boolean;
    bookmarks: string[];
    message: string;
  }>(`/api/users/bookmarks/${tuitionId}`, {
    method: "POST",
  });
}

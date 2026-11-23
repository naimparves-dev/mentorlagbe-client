import { apiFetch } from "@/lib/api/fetcher";
import type { PaginationMeta, Tuition, UserProfile } from "@/types";

export async function getFeaturedTuitions() {
  return apiFetch<{ success: boolean; tuitions: Tuition[] }>(
    "/api/tuitions/featured"
  );
}

export async function getBrowseTuitions(params: {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.subject && params.subject !== "all")
    query.set("subject", params.subject);
  if (params.classLevel && params.classLevel !== "all")
    query.set("classLevel", params.classLevel);
  if (params.mode && params.mode !== "all") query.set("mode", params.mode);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return apiFetch<{
    success: boolean;
    tuitions: Tuition[];
    pagination: PaginationMeta;
  }>(`/api/tuitions?${query.toString()}`);
}

export async function getTuitionDetails(id: string) {
  return apiFetch<{
    success: boolean;
    tuition: Tuition;
    tutor: Partial<UserProfile>;
  }>(`/api/tuitions/${id}`);
}

export async function getPlatformStats() {
  return apiFetch<{
    success: boolean;
    stats: {
      totalTutors: number;
      totalStudents: number;
      approvedTuitions: number;
      totalApplications: number;
    };
  }>("/api/stats");
}

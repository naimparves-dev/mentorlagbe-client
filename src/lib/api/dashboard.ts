import { apiFetch } from "@/lib/api/fetcher";
import type {
  Application,
  PaymentRecord,
  Tuition,
  UserProfile,
} from "@/types";

export async function getStudentStats() {
  return apiFetch<{
    success: boolean;
    stats: {
      totalApplied: number;
      accepted: number;
      pending: number;
      rejected: number;
      bookmarksCount: number;
      plan: string;
    };
  }>("/api/applications/student/stats");
}

export async function getStudentApplications() {
  return apiFetch<{ success: boolean; applications: Application[] }>(
    "/api/applications/student"
  );
}

export async function getStudentBookmarks() {
  return apiFetch<{
    success: boolean;
    bookmarks: Tuition[];
    limit: number | null;
  }>("/api/users/bookmarks");
}

export async function getTutorStats() {
  return apiFetch<{
    success: boolean;
    stats: {
      totalPosted: number;
      activeApproved: number;
      pendingApproval: number;
      totalApplicants: number;
      plan: string;
      postLimit: number | null;
    };
  }>("/api/tuitions/tutor/stats");
}

export async function getTutorTuitions() {
  return apiFetch<{ success: boolean; tuitions: Tuition[] }>(
    "/api/tuitions/tutor/my-tuitions"
  );
}

export async function getTutorApplicants() {
  return apiFetch<{ success: boolean; applications: Application[] }>(
    "/api/applications/tutor"
  );
}

export async function getAdminStats() {
  return apiFetch<{
    success: boolean;
    stats: {
      totalUsers: number;
      totalTutors: number;
      totalStudents: number;
      pendingTuitions: number;
      approvedTuitions: number;
      rejectedTuitions: number;
      totalRevenue: number;
    };
  }>("/api/admin/stats");
}

export async function getAdminUsers() {
  return apiFetch<{ success: boolean; users: UserProfile[] }>(
    "/api/admin/users"
  );
}

export async function getAdminTuitions(status?: string) {
  const qs = status && status !== "all" ? `?status=${status}` : "";
  return apiFetch<{ success: boolean; tuitions: Tuition[] }>(
    `/api/admin/tuitions${qs}`
  );
}

export async function getAdminTransactions() {
  return apiFetch<{ success: boolean; transactions: PaymentRecord[] }>(
    "/api/admin/transactions"
  );
}

"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { getBrowseTuitions } from "@/lib/api/tuitions";
import { TuitionCard } from "@/components/tuitions/TuitionCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaginationMeta, Tuition } from "@/types";

const SUBJECT_OPTIONS = [
  "all",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Programming",
  "IELTS",
  "English",
];

const CLASS_OPTIONS = [
  "all",
  "Class 6-8",
  "SSC (Class 9-10)",
  "HSC (Class 11-12)",
  "O/A Level",
  "Admission Prep",
  "University / Adult",
];

function BrowseTuitionsContent() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "all");
  const [classLevel, setClassLevel] = useState("all");
  const [mode, setMode] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBrowseTuitions({
        search,
        subject,
        classLevel,
        mode,
        sort,
        page,
        limit: 9,
      });
      setTuitions(res.tuitions || []);
      setPagination(res.pagination);
    } catch {
      setTuitions([]);
    } finally {
      setLoading(false);
    }
  }, [search, subject, classLevel, mode, sort, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchList();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchList]);

  const handleReset = () => {
    setSearch("");
    setSubject("all");
    setClassLevel("all");
    setMode("all");
    setSort("newest");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Verified Directory
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
          Browse Approved Tuitions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search by title or subject, and filter by class level, mode, or monthly fee.
        </p>
      </div>

      <Card className="mb-8 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, subject, or location..."
              className="pl-9"
            />
          </div>

          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SUBJECT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Subjects" : s}
              </option>
            ))}
          </select>

          <select
            value={classLevel}
            onChange={(e) => {
              setClassLevel(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Class Levels" : c}
              </option>
            ))}
          </select>

          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline (Home)</option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest">Newest First</option>
            <option value="fee_asc">Fee: Low to High</option>
            <option value="fee_desc">Fee: High to Low</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Showing {tuitions.length} of {pagination.total} approved tuitions
          </span>
          <Button variant="link" size="sm" onClick={handleReset} className="h-auto p-0">
            Reset Filters
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      ) : tuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-14 text-center">
          <h2 className="text-lg font-bold">No matching tuitions found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing your filters or searching for another subject.
          </p>
          <Button onClick={handleReset} className="mt-4">
            Show All Tuitions
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((t) => (
              <TuitionCard key={t._id} tuition={t} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function BrowseTuitionsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm">Loading...</div>}>
      <BrowseTuitionsContent />
    </Suspense>
  );
}

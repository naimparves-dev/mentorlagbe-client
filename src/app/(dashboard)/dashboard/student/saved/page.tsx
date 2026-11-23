"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStudentBookmarks } from "@/lib/api/dashboard";
import { TuitionCard } from "@/components/tuitions/TuitionCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tuition } from "@/types";

export default function StudentSavedTuitionsPage() {
  const [bookmarks, setBookmarks] = useState<Tuition[]>([]);
  const [limit, setLimit] = useState<number | null>(5);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const res = await getStudentBookmarks();
      setBookmarks(res.bookmarks || []);
      setLimit(res.limit);
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Saved Tuitions</h1>
          <p className="text-sm text-muted-foreground">
            {limit
              ? `Free Student Plan: ${bookmarks.length} / ${limit} bookmarks used.`
              : "Pro Student Plan: Unlimited saved tuitions."}
          </p>
        </div>
        {limit && (
          <Link href="/pricing">
            <Button size="sm" className="bg-amber-500 text-slate-950 hover:bg-amber-400">
              Unlock Unlimited Bookmarks ($10)
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            No saved tuitions yet. Click the bookmark icon on any tuition card!
          </p>
          <Link href="/tuitions" className="mt-4 inline-block">
            <Button>Browse Tuitions</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((t) => (
            <TuitionCard
              key={t._id}
              tuition={t}
              onBookmarkChange={loadBookmarks}
            />
          ))}
        </div>
      )}
    </div>
  );
}

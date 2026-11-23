"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedTuitions } from "@/lib/api/tuitions";
import { TuitionCard } from "@/components/tuitions/TuitionCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tuition } from "@/types";

export function FeaturedTuitions() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getFeaturedTuitions()
      .then((res) => {
        if (active) setTuitions(res.tuitions || []);
      })
      .catch(() => {
        if (active) setTuitions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Latest Approved Listings
            </p>
            <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight">
              Featured Tuition Batches
            </h2>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Browse All Tuitions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : tuitions.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              No approved tuition listings yet. Post a tuition from the Tutor
              Dashboard and approve it from the Admin Dashboard (or insert
              approved records directly in MongoDB).
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((t) => (
              <TuitionCard key={t._id} tuition={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

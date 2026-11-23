"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : "";
    router.push(`/tuitions${qs}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent/60 via-background to-amber-50/40 py-16 dark:to-amber-950/10 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-bold text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Verified Online & Home Tutors Across Bangladesh
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Find Your Ideal{" "}
            <span className="text-primary">Tutor or Mentorship</span> Batch Today
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Compare admin-verified tuition batches by subject, class level,
            online or home mode, and monthly budget. Apply in seconds and track
            your enrollment in real time.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Mathematics, IELTS, Physics, Next.js..."
                className="h-11 pl-10"
              />
            </div>
            <Button type="submit" size="lg">
              Find Tuitions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Admin-Moderated Listings
            </span>
            <Link
              href="/sign-up"
              className="text-primary underline-offset-4 hover:underline"
            >
              Want to teach? Join as a Tutor →
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border bg-card p-2 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
              alt="Students learning with a mentor on MentorLagbe"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 sm:absolute sm:-bottom-5 sm:left-6 sm:right-6 sm:mt-0">
            <div className="rounded-2xl border bg-card/95 p-3.5 text-center shadow-lg backdrop-blur-xs">
              <p className="text-lg font-extrabold text-primary">100%</p>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Verified Posts
              </p>
            </div>
            <div className="rounded-2xl border bg-card/95 p-3.5 text-center shadow-lg backdrop-blur-xs">
              <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                Online & Home
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Flexible Modes
              </p>
            </div>
            <div className="rounded-2xl border bg-card/95 p-3.5 text-center shadow-lg backdrop-blur-xs">
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                4.9 / 5
              </p>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Student Rating
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

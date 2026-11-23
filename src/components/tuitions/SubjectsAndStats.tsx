"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Atom,
  Code2,
  Languages,
  FlaskConical,
  Dna,
  Star,
} from "lucide-react";
import { getPlatformStats } from "@/lib/api/tuitions";
import { Card, CardContent } from "@/components/ui/card";

const SUBJECTS = [
  { name: "Mathematics", icon: Calculator, tag: "SSC, HSC & O/A Level" },
  { name: "Physics", icon: Atom, tag: "Mechanics & Admission" },
  { name: "Programming", icon: Code2, tag: "Python, C, Next.js & ICT" },
  { name: "IELTS", icon: Languages, tag: "Band 7.5+ Intensive" },
  { name: "Chemistry", icon: FlaskConical, tag: "Organic & Lab Theory" },
  { name: "Biology", icon: Dna, tag: "Medical & Board Prep" },
];

const TESTIMONIALS = [
  {
    name: "Tasnim Tabassum",
    role: "Pro Student • IELTS Band 7.5",
    quote:
      "I found a verified IELTS mentor within minutes, booked my preferred evening slots, and raised my Writing score from 6.0 to 7.5.",
  },
  {
    name: "Dr. Farhan Rahman",
    role: "Pro Tutor • BUET CSE",
    quote:
      "Managing student applications and batch schedules used to be scattered across chats. MentorLagbe keeps every applicant organized in one dashboard.",
  },
  {
    name: "Rafiqul Islam",
    role: "HSC Science Student • Dhaka",
    quote:
      "Filtering by mode and monthly fee helped my parents choose an affordable online Higher Math batch with weekly progress tracking.",
  },
];

export function SubjectsAndStats() {
  const [stats, setStats] = useState({
    totalTutors: 4,
    totalStudents: 2,
    approvedTuitions: 12,
    totalApplications: 2,
  });

  useEffect(() => {
    getPlatformStats()
      .then((res) => {
        if (res?.stats) setStats(res.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <div>
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Explore By Subject
            </p>
            <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight">
              Top Mentorship Categories
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS.map((subj) => {
              const Icon = subj.icon;
              return (
                <Link
                  key={subj.name}
                  href={`/tuitions?subject=${encodeURIComponent(subj.name)}`}
                >
                  <Card className="transition hover:border-primary hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="font-bold">{subj.name}</h3>
                        <p className="text-xs text-muted-foreground">{subj.tag}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-lg sm:p-10">
          <div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-3xl font-extrabold">{stats.approvedTuitions}+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-85">
                Approved Tuitions
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{stats.totalTutors}+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-85">
                Verified Tutors
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{stats.totalStudents}+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-85">
                Active Students
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{stats.totalApplications}+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider opacity-85">
                Enrollments Tracked
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Community Voices
            </p>
            <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight">
              Trusted by Students & Tutors
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <Card key={item.name} className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-3 flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-5 border-t pt-3">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { UserPlus, Search, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  {
    step: "01",
    title: "Create Your Role Account",
    desc: "Register as a Student seeking mentorship or as a qualified Tutor ready to launch subject batches.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Post or Discover Verified Batches",
    desc: "Tutors publish detailed tuition listings; Admins verify every post before students filter by subject, class, or mode.",
    icon: Search,
  },
  {
    step: "03",
    title: "Apply & Confirm Schedule",
    desc: "Students submit preferred schedules and learning goals directly. Tutors review and accept enrollments in one click.",
    icon: CheckCircle2,
  },
  {
    step: "04",
    title: "Scale with Pro Mentorship",
    desc: "Unlock unlimited tuition posts for Tutors ($15) or unlimited bookmarks for Students ($10) via Stripe.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Simple 4-Step Ecosystem
          </p>
          <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight">
            How MentorLagbe Works
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Built for transparency between students, parents, tutors, and
            platform moderators.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-2xl font-black text-muted-foreground/30">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { createTuitionAction } from "@/lib/action/tuitions";
import { ImageUploader } from "@/components/dashboard/ImageUploader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Programming",
  "IELTS",
  "English",
  "Accounting",
  "Economics",
];

const CLASS_LEVELS = [
  "Class 6-8",
  "SSC (Class 9-10)",
  "HSC (Class 11-12)",
  "O/A Level",
  "Admission Prep",
  "University / Adult",
];

export default function PostTuitionPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [classLevel, setClassLevel] = useState("HSC (Class 11-12)");
  const [mode, setMode] = useState<"Online" | "Offline">("Online");
  const [location, setLocation] = useState("Online (Zoom Live)");
  const [monthlyFee, setMonthlyFee] = useState("3500");
  const [daysPerWeek, setDaysPerWeek] = useState("4");
  const [bannerImage, setBannerImage] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createTuitionAction({
        title,
        subject,
        classLevel,
        mode,
        location,
        monthlyFee: Number(monthlyFee),
        daysPerWeek: Number(daysPerWeek),
        bannerImage,
        description,
      });
      toast.success(res.message);
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to post tuition");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Post a New Tuition</h1>
          <p className="text-sm text-muted-foreground">
            New posts are submitted as Pending until an Admin approves them.
          </p>
        </div>

        {user?.plan !== "pro" && (
          <Link href="/pricing">
            <Button size="sm" className="bg-amber-500 text-slate-950 hover:bg-amber-400">
              <Crown className="h-4 w-4" />
              Free Limit: 2 Posts — Go Pro ($15)
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <ImageUploader
              label="Tuition Banner Image (ImgBB Upload)"
              value={bannerImage}
              onChange={setBannerImage}
            />

            <div className="space-y-1.5">
              <Label>Tuition Title *</Label>
              <Input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., HSC Higher Math 1st & 2nd Paper Mastery Batch"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Subject *</Label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Class Level *</Label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  {CLASS_LEVELS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Mode *</Label>
                <select
                  value={mode}
                  onChange={(e) => {
                    const val = e.target.value as "Online" | "Offline";
                    setMode(val);
                    setLocation(
                      val === "Online"
                        ? "Online (Zoom / Google Meet)"
                        : "Dhanmondi, Dhaka"
                    );
                  }}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline (Home)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Location / Platform *</Label>
                <Input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Monthly Fee (BDT) *</Label>
                <Input
                  type="number"
                  min={500}
                  required
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Days / Week *</Label>
                <Input
                  type="number"
                  min={1}
                  max={7}
                  required
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Course Outline & Description *</Label>
              <Textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe syllabus coverage, exam prep strategy, and assessments..."
              />
            </div>

            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
              Publish Tuition for Approval
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

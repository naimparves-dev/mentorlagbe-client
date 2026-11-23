"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  MapPin,
  Monitor,
  Home,
  Crown,
  Bookmark,
  Star,
  Send,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getTuitionDetails } from "@/lib/api/tuitions";
import { applyForTuitionAction } from "@/lib/action/applications";
import { submitReviewAction } from "@/lib/action/tuitions";
import { toggleBookmarkAction } from "@/lib/action/profile";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tuition, UserProfile } from "@/types";

export default function TuitionDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [tutor, setTutor] = useState<Partial<UserProfile> | null>(null);
  const [loading, setLoading] = useState(true);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [applying, setApplying] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadDetails = async () => {
    if (!params?.id) return;
    setLoading(true);
    try {
      const res = await getTuitionDetails(params.id);
      setTuition(res.tuition);
      setTutor(res.tutor);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load tuition");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (user?.phone) setStudentPhone(user.phone);
  }, [user?.phone]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tuition) return;
    setApplying(true);
    try {
      const res = await applyForTuitionAction({
        tuitionId: tuition._id,
        studentPhone,
        preferredSchedule,
        studentNote,
      });
      toast.success(res.message);
      setShowApplyModal(false);
      setPreferredSchedule("");
      setStudentNote("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Application failed");
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = async () => {
    if (!tuition || !user) return;
    try {
      const res = await toggleBookmarkAction(tuition._id);
      setUser((prev) => (prev ? { ...prev, bookmarks: res.bookmarks } : prev));
      toast.success(res.message);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Bookmark failed");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tuition) return;
    setSubmittingReview(true);
    try {
      const res = await submitReviewAction(tuition._id, { rating, comment });
      toast.success(res.message);
      setComment("");
      await loadDetails();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <Skeleton className="h-96 rounded-3xl" />
      </main>
    );
  }

  if (!tuition) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">Tuition Not Found</h1>
        <Link href="/tuitions" className="mt-4 inline-block">
          <Button>
            <ArrowLeft className="h-4 w-4" />
            Back to Browse Tuitions
          </Button>
        </Link>
      </main>
    );
  }

  const isBookmarked = Boolean(user?.bookmarks?.includes(tuition._id));
  const reviews = tuition.reviews || [];
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/tuitions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse Tuitions
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
              <img
                src={tuition.bannerImage}
                alt={tuition.title}
                className="h-full w-full object-cover"
              />
            </div>

            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{tuition.subject}</Badge>
                <Badge variant="secondary" className="gap-1">
                  {tuition.mode === "Online" ? (
                    <Monitor className="h-3.5 w-3.5" />
                  ) : (
                    <Home className="h-3.5 w-3.5" />
                  )}
                  {tuition.mode}
                </Badge>
                <Badge variant="warning" className="gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {tuition.classLevel}
                </Badge>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                {tuition.title}
              </h1>

              <div className="mt-5 grid gap-3 rounded-2xl bg-muted/50 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Monthly Fee
                  </p>
                  <p className="text-lg font-extrabold text-primary">
                    ৳{tuition.monthlyFee.toLocaleString()}/mo
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Schedule
                  </p>
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    <Calendar className="h-4 w-4 text-primary" />
                    {tuition.daysPerWeek} days / week
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    <MapPin className="h-4 w-4 text-primary" />
                    {tuition.location}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-base font-bold">About This Tuition Batch</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {tuition.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold">
                  Student Reviews ({reviews.length})
                </h2>
                {avgRating && (
                  <Badge variant="warning" className="gap-1 px-3 py-1 text-sm">
                    <Star className="h-4 w-4 fill-current" />
                    {avgRating} / 5
                  </Badge>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No reviews yet. Accepted students can submit a 1–5 star review.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="rounded-xl border bg-muted/30 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold">{rev.studentName}</p>
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {user?.role === "student" && (
                <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3 border-t pt-5">
                  <h3 className="text-sm font-bold">
                    Leave a Review (Accepted Students)
                  </h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`p-1 ${
                          num <= rating ? "text-amber-500" : "text-muted-foreground/30"
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your learning experience with this tutor..."
                    required
                  />
                  <Button type="submit" size="sm" disabled={submittingReview}>
                    {submittingReview ? "Submitting..." : "Post Review"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tutor Card */}
        <aside>
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Mentor
              </p>
              <div className="mt-4 flex items-center gap-3.5">
                <img
                  src={
                    tutor?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      tuition.tutorName
                    )}&background=0d9488&color=fff`
                  }
                  alt={tuition.tutorName}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/30"
                />
                <div>
                  <p className="flex items-center gap-1.5 text-base font-extrabold">
                    {tuition.tutorName}
                    {tutor?.plan === "pro" && (
                      <Crown className="h-4 w-4 text-amber-500" />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tuition.tutorEmail}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {tutor?.bio ||
                  "Verified MentorLagbe tutor offering personalized academic support."}
              </p>

              <div className="mt-6 space-y-2.5 border-t pt-5">
                {!user ? (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() =>
                      router.push(`/sign-in?redirect=/tuitions/${tuition._id}`)
                    }
                  >
                    Sign In as Student to Apply
                  </Button>
                ) : user.role === "student" ? (
                  <>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setShowApplyModal(true)}
                    >
                      <Send className="h-4 w-4" />
                      Apply for Tuition
                    </Button>
                    <Button
                      variant={isBookmarked ? "secondary" : "outline"}
                      className="w-full"
                      onClick={handleBookmark}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                      />
                      {isBookmarked ? "Bookmarked" : "Save Tuition"}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Only <strong>Student</strong> accounts can apply. Signed in
                      as <strong className="capitalize">{user.role}</strong>.
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-extrabold">Apply for Tuition</h2>
            <p className="mt-1 text-xs text-muted-foreground">{tuition.title}</p>

            <form onSubmit={handleApplySubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Preferred Schedule *</Label>
                <Input
                  type="text"
                  required
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  placeholder="e.g., Sun, Tue, Thu at 7:00 PM"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Learning Goal / Note</Label>
                <Textarea
                  rows={3}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="Mention your class, exam target, or topics..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={applying}>
                  {applying && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </main>
  );
}

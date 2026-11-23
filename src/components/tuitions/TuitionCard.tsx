"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  BookOpen,
  User,
  Bookmark,
  Monitor,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import type { Tuition } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { toggleBookmarkAction } from "@/lib/action/profile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TuitionCardProps {
  tuition: Tuition;
  onBookmarkChange?: () => void;
}

export function TuitionCard({ tuition, onBookmarkChange }: TuitionCardProps) {
  const { user, setUser } = useAuth();
  const isBookmarked = Boolean(user?.bookmarks?.includes(tuition._id));

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in as a student to bookmark tuitions.");
      return;
    }
    if (user.role !== "student") {
      toast.info("Only students can bookmark tuition listings.");
      return;
    }
    try {
      const res = await toggleBookmarkAction(tuition._id);
      setUser((prev) => (prev ? { ...prev, bookmarks: res.bookmarks } : prev));
      toast.success(res.message);
      onBookmarkChange?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not update bookmark");
    }
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={
            tuition.bannerImage ||
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
          }
          alt={tuition.title}
          width={1200}
          height={750}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <Badge className="bg-slate-900/85 text-white hover:bg-slate-900">
            {tuition.subject}
          </Badge>
          <Badge
            variant={tuition.mode === "Online" ? "default" : "warning"}
            className="gap-1"
          >
            {tuition.mode === "Online" ? (
              <Monitor className="h-3 w-3" />
            ) : (
              <Home className="h-3 w-3" />
            )}
            {tuition.mode}
          </Badge>
        </div>

        {user?.role === "student" && (
          <button
            type="button"
            onClick={handleBookmark}
            aria-label="Bookmark tuition"
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-xs transition ${
              isBookmarked
                ? "bg-primary text-primary-foreground"
                : "bg-background/90 text-foreground hover:bg-background"
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            {tuition.classLevel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            {tuition.daysPerWeek} days/wk
          </span>
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-snug">
          {tuition.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5 truncate">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium text-foreground">
              {tuition.tutorName}
            </span>
          </p>
          <p className="flex items-center gap-1.5 truncate">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{tuition.location}</span>
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <div>
            <span className="text-lg font-extrabold text-primary">
              ৳{tuition.monthlyFee.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">/month</span>
          </div>
          <Link href={`/tuitions/${tuition._id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

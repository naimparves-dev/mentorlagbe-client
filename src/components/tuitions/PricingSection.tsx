"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createCheckoutSessionAction } from "@/lib/action/payments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PricingSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleStripeCheckout = async (targetRole: "student" | "tutor") => {
    if (!user) {
      toast.info("Please sign in first to upgrade to Pro.");
      router.push("/sign-in?redirect=/pricing");
      return;
    }
    if (user.plan === "pro") {
      toast.success("You are already on the Pro Plan!");
      return;
    }
    if (user.role === "admin") {
      toast.info("Admin accounts already have full platform access.");
      return;
    }
    if (user.role !== targetRole) {
      toast.error(
        `You are signed in as a ${user.role}. Please choose the Pro ${
          user.role === "tutor" ? "Tutor" : "Student"
        } plan.`
      );
      return;
    }

    setLoadingPlan(targetRole);
    try {
      const res = await createCheckoutSessionAction();
      if (res.url) window.location.href = res.url;
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Unable to start Stripe checkout"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="border-t bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Transparent Stripe Subscriptions
          </p>
          <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight">
            Choose Your MentorLagbe Plan
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Start free and upgrade anytime with secure Stripe Checkout.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Free */}
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Free Starter</CardTitle>
              <CardDescription>
                For students & tutors exploring MentorLagbe
              </CardDescription>
              <p className="pt-4 text-4xl font-extrabold">
                $0
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  / forever
                </span>
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Tutors: Post up to 2 tuition listings
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Students: Bookmark up to 5 tuitions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Real-time application status tracking
                </li>
              </ul>
              <Button
                variant="outline"
                size="lg"
                className="mt-8 w-full"
                onClick={() =>
                  router.push(user ? `/dashboard/${user.role}` : "/sign-up")
                }
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Student ($10) */}
          <Card className="flex h-full flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pro Student</CardTitle>
                <Badge>Students</Badge>
              </div>
              <CardDescription>
                Priority booking & unlimited saved tuitions
              </CardDescription>
              <p className="pt-4 text-4xl font-extrabold">
                $10
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  / one-time
                </span>
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Unlimited tuition bookmarks & saved list
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Priority Student Pro badge on profile
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Instant activation via Stripe Checkout
                </li>
              </ul>
              <Button
                size="lg"
                className="mt-8 w-full"
                disabled={loadingPlan === "student"}
                onClick={() => handleStripeCheckout("student")}
              >
                {loadingPlan === "student" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Crown className="h-4 w-4" />
                )}
                Subscribe with Stripe ($10)
              </Button>
            </CardContent>
          </Card>

          {/* Pro Tutor ($15) */}
          <Card className="relative flex h-full flex-col border-2 border-primary shadow-lg">
            <Badge
              variant="warning"
              className="absolute -top-3 right-6 bg-amber-500 text-slate-950"
            >
              Most Popular
            </Badge>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pro Tutor</CardTitle>
                <Badge variant="warning">Tutors</Badge>
              </div>
              <CardDescription>
                Unlimited tuition batches & verified badge
              </CardDescription>
              <p className="pt-4 text-4xl font-extrabold">
                $15
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  / one-time
                </span>
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Post unlimited tuition & mentorship batches
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Verified Pro Tutor crown badge on listings
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Full applicant CRM & instant Stripe sync
                </li>
              </ul>
              <Button
                size="lg"
                className="mt-8 w-full"
                disabled={loadingPlan === "tutor"}
                onClick={() => handleStripeCheckout("tutor")}
              >
                {loadingPlan === "tutor" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Crown className="h-4 w-4" />
                )}
                Subscribe with Stripe ($15)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

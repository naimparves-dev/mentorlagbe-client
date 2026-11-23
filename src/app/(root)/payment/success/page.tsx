"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";
import { verifyStripeSessionAction } from "@/lib/action/payments";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, refreshUser } = useAuth();

  const [verifying, setVerifying] = useState(true);
  const [receipt, setReceipt] = useState<{
    planName: string;
    amount: number;
    currency: string;
    transactionId: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setVerifying(false);
      setErrorMsg("Missing Stripe session ID.");
      return;
    }

    (async () => {
      try {
        const res = await verifyStripeSessionAction(sessionId);
        setReceipt(res.payment);
        await refreshUser();
        toast.success("Pro Plan activated!");
      } catch (err: unknown) {
        setErrorMsg(
          err instanceof Error ? err.message : "Could not verify payment."
        );
      } finally {
        setVerifying(false);
      }
    })();
  }, [sessionId, refreshUser]);

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-lg flex-col justify-center px-4 py-14 text-center">
      <Card className="p-8">
        {verifying ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">
              Verifying your Stripe payment and upgrading your account...
            </p>
          </div>
        ) : errorMsg ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-extrabold text-rose-600">
              Verification Issue
            </h1>
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
            <Link href="/pricing">
              <Button>Return to Pricing</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div>
              <Badge variant="warning" className="gap-1">
                <Crown className="h-3.5 w-3.5" />
                Pro Plan Active
              </Badge>
              <h1 className="mt-3 text-2xl font-extrabold">
                Payment Successful!
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account has been upgraded and your transaction recorded.
              </p>
            </div>

            {receipt && (
              <div className="space-y-2 rounded-xl bg-muted/50 p-4 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-bold">{receipt.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold">
                    ${receipt.amount} {receipt.currency}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="truncate font-mono font-semibold">
                    {receipt.transactionId}
                  </span>
                </div>
              </div>
            )}

            <Link href={user ? `/dashboard/${user.role}` : "/dashboard"}>
              <Button size="lg" className="w-full">
                Go to Your Dashboard
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

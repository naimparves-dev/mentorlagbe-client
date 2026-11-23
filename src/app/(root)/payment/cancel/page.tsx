import Link from "next/link";
import { XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-lg flex-col justify-center px-4 py-14 text-center">
      <Card className="p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <XCircle className="h-9 w-9" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold">Payment Cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your Stripe checkout was cancelled and you have not been charged.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link href="/pricing">
            <Button>View Plans</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}

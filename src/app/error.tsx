"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {error?.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => reset()}>
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button>
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}

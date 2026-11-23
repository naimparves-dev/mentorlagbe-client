import Link from "next/link";
import { BookX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <BookX className="h-8 w-8" />
      </div>
      <p className="mt-5 text-sm font-bold uppercase tracking-widest text-primary">
        404 Error
      </p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The tuition listing or page you are looking for doesn&apos;t exist or may
        have been moved.
      </p>
      <Link href="/" className="mt-6">
        <Button size="lg">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </main>
  );
}

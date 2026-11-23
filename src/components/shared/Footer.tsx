import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                Mentor<span className="text-primary">Lagbe</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Connecting ambitious students with verified subject mentors for
              online batches and home tuition across Bangladesh and beyond.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tuitions" className="hover:text-primary">
                  Browse Tuitions
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary">
                  Pro Plans & Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-primary">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@mentorlagbe.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+880 1711-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Dhanmondi 27, Dhaka 1209, Bangladesh</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">
              Follow Us
            </h3>
            <p className="mb-3 text-sm">
              Stay updated on new mentorship batches and scholarship prep.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-foreground transition hover:border-primary hover:text-primary"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-foreground transition hover:border-primary hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-foreground transition hover:border-primary hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs">
          © {new Date().getFullYear()} MentorLagbe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

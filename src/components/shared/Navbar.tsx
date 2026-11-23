"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  LayoutDashboard,
  UserCog,
  LogOut,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    toast.success("Signed out successfully");
    setMobileOpen(false);
    router.push("/");
  };

  const dashboardHref = user ? `/dashboard/${user.role}` : "/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Mentor<span className="text-primary">Lagbe</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle />

          {loading ? (
            <Skeleton className="h-9 w-28" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link href={dashboardHref}>
                <Button size="sm">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm">
                  <UserCog className="h-4 w-4" />
                  Update Profile
                </Button>
              </Link>

              <div className="flex items-center gap-2 rounded-full border bg-secondary/60 py-1 pl-1.5 pr-3">
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=0d9488&color=fff`
                  }
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <div className="flex flex-col leading-tight">
                  <span className="flex items-center gap-1 text-xs font-bold">
                    {user.name.split(" ")[0]}
                    {user.plan === "pro" && (
                      <Crown className="h-3 w-3 text-amber-500" />
                    )}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
                    {user.role}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/60 dark:text-rose-400"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t pt-3">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link href={dashboardHref} onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Update Profile
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

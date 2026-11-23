"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  ClipboardList,
  CreditCard,
  UserCog,
  Bookmark,
  Menu,
  X,
  LogOut,
  Home,
  Crown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_NAV: Record<string, NavItem[]> = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
    {
      label: "My Applications",
      href: "/dashboard/student/my-applications",
      icon: ClipboardList,
    },
    { label: "Saved Tuitions", href: "/dashboard/student/saved", icon: Bookmark },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
    {
      label: "Post a Tuition",
      href: "/dashboard/tutor/post-tuition",
      icon: PlusCircle,
    },
    { label: "My Tuitions", href: "/dashboard/tutor/my-tuitions", icon: BookOpen },
    {
      label: "Manage Applicants",
      href: "/dashboard/tutor/applicants",
      icon: Users,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Approve Tuitions",
      href: "/dashboard/admin/tuitions",
      icon: BookOpen,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: CreditCard,
    },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `/sign-in?redirect=${encodeURIComponent(pathname || "/dashboard")}`
      );
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Restoring your MentorLagbe session...
          </p>
        </div>
      </div>
    );
  }

  const navItems = ROLE_NAV[user.role] || ROLE_NAV.student;

  const handleSignOut = async () => {
    await logout();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-200 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : "w-64"}`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            {!collapsed && (
              <span className="truncate text-lg font-extrabold tracking-tight">
                Mentor<span className="text-primary">Lagbe</span>
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <img
              src={
                user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=0d9488&color=fff`
              }
              alt={user.name}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-primary/30"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{user.name}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="default" className="px-1.5 py-0 text-[10px] uppercase">
                    {user.role}
                  </Badge>
                  <Badge
                    variant={user.plan === "pro" ? "warning" : "secondary"}
                    className="gap-0.5 px-1.5 py-0 text-[10px] uppercase"
                  >
                    {user.plan === "pro" && <Crown className="h-2.5 w-2.5" />}
                    {user.plan}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={item.label}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

          {user.plan !== "pro" && user.role !== "admin" && (
            <Link
              href="/pricing"
              className="mt-4 flex items-center gap-3 rounded-xl bg-amber-100/80 px-3 py-2.5 text-sm font-bold text-amber-900 transition hover:bg-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300"
            >
              <Crown className="h-5 w-5 shrink-0 text-amber-500" />
              {!collapsed && <span className="truncate">Upgrade to Pro</span>}
            </Link>
          )}
        </nav>

        <div className="space-y-1 border-t p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Home className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Back to Home</span>}
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCollapsed((c) => !c)}
              className="hidden lg:inline-flex"
              aria-label="Toggle collapse"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
            <span className="text-sm font-bold capitalize text-muted-foreground">
              {user.role} Workspace
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/tuitions" className="hidden sm:inline-block">
              <Button variant="outline" size="sm">
                Browse Tuitions
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: "brand" | "amber" | "emerald" | "indigo";
}

const ACCENT_MAP = {
  brand: "bg-accent text-accent-foreground",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  emerald:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  indigo:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  accent = "brand",
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-extrabold">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${ACCENT_MAP[accent]}`}>{icon}</div>
      </CardContent>
    </Card>
  );
}

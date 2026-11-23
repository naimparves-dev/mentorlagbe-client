"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </AuthProvider>
    </ThemeProvider>
  );
}

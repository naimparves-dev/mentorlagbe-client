import { createAuthClient } from "better-auth/react";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authClient = createAuthClient({
  // Same-origin Next.js BetterAuth route: /api/auth/[...all]
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

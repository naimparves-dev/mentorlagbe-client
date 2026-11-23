<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MentorLagbe — Client (`mentorlagbe-client`)

Next.js 16 (App Router, Turbopack) frontend for the MentorLagbe tuition &
mentorship platform.

---

## 1. Dual-repo architecture

This project is **one half of a two-repo app**. The repos are siblings on disk:

```
Full Stack Project/
├── mentorlagbe-client/   → Next.js 16   → http://localhost:3000  (this repo)
└── mentorlagbe-server/   → Express 5    → http://localhost:5000
```

| | `mentorlagbe-client` | `mentorlagbe-server` |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Express 5 (`"type": "module"`) |
| Port | `3000` | `5000` (`PORT`, default 5000) |
| Role | UI, BetterAuth session, SSR | REST API, JWT issuance, Stripe |
| Database | MongoDB — shared with the server | MongoDB — shared with the client |
| Run | `npm run dev` | `npm run dev` (nodemon) |

**Both processes point at the same MongoDB database** (`DB_URI` + `DB_NAME`).
The Express server does not own the user table — BetterAuth writes it from
inside Next.js, and Express reads it.

### Cross-origin calling

The browser calls the Express API directly. `src/lib/auth-client.ts` exports the
base URL used everywhere:

```ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
```

* `src/lib/api/fetcher.ts` → `apiFetch()` prefixes every request with `API_URL`,
  injects `Authorization: Bearer <token>` from `localStorage`, and sets
  `credentials: "include"` (Express also sets an `ml_token` httpOnly cookie).
* Express allows CORS from `CLIENT_URL` / `http://localhost:3000` and accepts the
  `Authorization` header.

### Server API surface (for reference)

`/api/health`, `/api/stats`, `/api/jwt`, `/api/jwt/logout`, plus routers mounted
at `/api/users`, `/api/tuitions`, `/api/applications`, `/api/admin`,
`/api/payments`. Every Express response is shaped `{ success, ... }` and errors
go through `middleware/errorHandler.js`.

---

## 2. Auth flow (BetterAuth ⇄ Express JWT)

There are **two credential systems** bridged at runtime:

```
┌─ Next.js (port 3000) ────────────────────────────────────────┐
│  betterAuth()  +  mongodbAdapter(db)      src/lib/auth.ts    │
│        │                                                     │
│        ▼                                                     │
│  /api/auth/[...all]  (route handler)                         │
│        │  createAuthClient()  →  src/lib/auth-client.ts      │
│        ▼                                                     │
│  AuthProvider  →  src/hooks/useAuth.tsx                      │
└────────┼─────────────────────────────────────────────────────┘
         │  POST /api/jwt  { email }
         ▼
┌─ Express (port 5000) ────────────────────────────────────────┐
│  signAuthToken(user)  →  JWT signed with JWT_SECRET          │
│  sets `ml_token` cookie + returns { token, user }            │
└──────────────────────────────────────────────────────────────┘
```

**Key files (do not move them):**

* `src/lib/auth.ts` — server-only `betterAuth()` config: MongoDB adapter,
  `emailAndPassword`, and the extra user fields `role`, `phone`, `bio`, `plan`
  (model name `users`). Never import this from a client component.
* `src/lib/auth-client.ts` — client-only `createAuthClient()` + the exported
  `API_URL`. Uses `window.location.origin` so BetterAuth always hits the
  same-origin Next.js route.
* `src/app/api/auth/[...all]/route.ts` — the BetterAuth catch-all route
  (`toNextJsHandler(auth)`). Required for `GET` + `POST`.
* `src/hooks/useAuth.tsx` — `AuthProvider` that bridges the two systems:
  1. `refreshUser()` → try `GET /api/users/me` with the stored JWT;
  2. fall back to `authClient.getSession()`;
  3. if a BetterAuth session exists but no JWT, call `syncJwt(email)` →
     `POST /api/jwt`, persist the token, and store the returned `user`.
  Also exposes `logout()` (BetterAuth `signOut` + `POST /api/jwt/logout` +
  `clearStoredToken()`).

`AuthProvider` is mounted once in `src/components/shared/Providers.tsx`,
together with `next-themes` and the sonner `<Toaster />`.

**Rules:**

* Always read the current user through `useAuth()` — never re-implement token
  handling in a page.
* The JWT lives in `localStorage` under `mentorlagbe_jwt_token`
  (`TOKEN_STORAGE_KEY` in `src/lib/api/fetcher.ts`). Only `fetcher.ts` and
  `useAuth.tsx` may touch it.
* Never call `betterAuth()` (server) from `"use client"` code.

---

## 3. Folder conventions

```
src/
├── app/
│   ├── layout.tsx                 root layout: fonts, <Providers>, globals.css
│   ├── globals.css                Tailwind v4 + Shadcn tokens (single source of truth)
│   ├── api/auth/[...all]/route.ts BetterAuth handler (server-only)
│   ├── error.tsx | loading.tsx | not-found.tsx
│   ├── (root)/                    public marketing & browsing
│   │   ├── page.tsx               "/"  — hero, featured tuitions, pricing
│   │   ├── tuitions/  pricing/  payment/{success,cancel}/
│   ├── (auth)/                    sign-in, sign-up (centered card layout)
│   └── (dashboard)/               authenticated app (wrapped in DashboardShell)
│       ├── dashboard/             overview per role
│       ├── dashboard/student/  tutor/  admin/  profile/
├── components/
│   ├── ui/                        Shadcn UI primitives ONLY (button, card, …)
│   ├── shared/                    Navbar, Footer, Providers, ThemeToggle
│   ├── dashboard/                 DashboardShell, StatsCard, ImageUploader
│   ├── tuitions/  auth/           feature components
├── hooks/                         useAuth, useIsHydrated
├── lib/
│   ├── api/                       ✅ GET / read queries
│   ├── action/                    ✅ mutations + ImgBB uploads
│   ├── auth.ts  auth-client.ts  utils.ts (cn())
├── types/index.ts                 shared domain types
```

### The `lib/api` vs `lib/action` split (important)

| Directory | Purpose | HTTP | Naming |
|---|---|---|---|
| `src/lib/api/` | **Reads** — fetch lists, detail, stats | `GET` | `getX()` / `getXs()` |
| `src/lib/action/` | **Writes** — create/update/delete, ImgBB uploads | `POST/PATCH/PUT/DELETE` | `xAction()` / `doXAction()` |

Both layers are thin wrappers over `apiFetch()` from `src/lib/api/fetcher.ts`
and must declare their response type inline:

```ts
// src/lib/api/tuitions.ts   (read)
export async function getFeaturedTuitions() {
  return apiFetch<{ success: boolean; tuitions: Tuition[] }>("/api/tuitions/featured");
}

// src/lib/action/tuitions.ts   (write)
export async function createTuitionAction(payload: CreateTuitionPayload) {
  return apiFetch<{ success: boolean; message: string; tuition: Tuition }>(
    "/api/tuitions", { method: "POST", body: JSON.stringify(payload) }
  );
}
```

* `src/lib/action/imgbb.ts` → `uploadImageToImgBB(file)` posts the `File`
  directly to `https://api.imgbb.com/1/upload` and returns the URL. All image
  picking goes through `src/components/dashboard/ImageUploader.tsx`.

### `src/components/ui/`

Shadcn-generated primitives. Treat as **generated code**: prefer adding a new
component (`npx shadcn add <name>`) over editing one, and never import feature
components from here. Shared styling helper is `cn()` from `src/lib/utils.ts`
(missing file → every `ui/` import breaks).

### App Router route groups

| Group | URL prefix | Layout | Use for |
|---|---|---|---|
| `(root)` | `/…` | Navbar + Footer | Public marketing & browsing |
| `(auth)` | `/sign-in`, `/sign-up` | Navbar + centered main + Footer | Authentication screens |
| `(dashboard)` | `/dashboard/…` | `DashboardShell` (sidebar) | Role-gated app screens |

Route groups change **layouts only**, never the URL. There must be exactly **one**
`page.tsx` per route — a default `src/app/page.tsx` and `(root)/page.tsx` both
resolve to `/` and conflict. Keep the `(root)` one.

---

## 4. Coding rules

### Tailwind CSS v4 + Shadcn CSS variables

This repo uses **Tailwind CSS v4 (CSS-first)**. There is **no
`tailwind.config.*`** — the JS config format is not loaded by v4 and was
removed. Everything lives in `src/app/globals.css`:

```css
@import "tailwindcss";                          /* v4 entry — never @tailwind base/components/utilities */
@custom-variant dark (&:is(.dark *));           /* .dark class toggled by next-themes */
@theme inline {                                 /* Shadcn tokens → Tailwind utilities */
  --color-background: hsl(var(--background));
  --color-primary: hsl(var(--primary));
  --radius-lg: var(--radius);
  --font-sans: var(--font-jakarta), system-ui, sans-serif;
  /* …one --color-* per Shadcn token… */
}
:root { --background: 0 0% 100%; /* … */ }
.dark { --background: 222.2 84% 4.9%; /* … */ }
```

* **Never** add `@tailwind base;` / `@tailwind utilities;` or use `@apply` with
  Tailwind v4-only at-rules — they produce "unknown rule" warnings.
* When adding a Shadcn component that needs a new token (e.g. `--popover`),
  add the raw variable under `:root`/`.dark` **and** the matching
  `--color-*: hsl(var(--…))` entry inside `@theme inline`. Utilities only
  exist for tokens declared there.
* PostCSS wiring is `postcss.config.mjs` → `{ plugins: { "@tailwindcss/postcss":
  {} } }`. Next.js 16 picks it up for both `next dev` and `next build`.
* Dark mode is the `.dark` class (`<html>`), set by `next-themes` in
  `src/components/shared/Providers.tsx`.
* `next.config.ts` sets `images.unoptimized: true` plus permissive
  `remotePatterns`, so `next/image` accepts ImgBB / ui-avatars / Unsplash URLs
  as-is. **Use `next/image`, not `<img>`** — `<img>` is an ESLint error-level
  concern in review (`@next/next/no-img-element`).

### No hardcoded secrets

* **Never** write a literal secret, key, connection string, or JWT into source.
  Read it from `process.env` instead.
* Server-only values (`BETTER_AUTH_SECRET`, `DB_URI`, `JWT_SECRET`,
  `STRIPE_SECRET_KEY`, …) must never appear in a `"use client"` file or any
  `NEXT_PUBLIC_*` variable.
* `.env` holds placeholders; real values go in `.env.local`, which is
  git-ignored. **Do not modify `.env` / `.env.local`** as part of ordinary work.
* Fallbacks in code must be obviously non-production defaults (e.g.
  `http://localhost:5000`), never a real credential.

### Clean TypeScript types

* Shared domain types live in `src/types/index.ts` (`UserRole`, `UserPlan`,
  `UserProfile`, `Tuition`, `Application`, `PaymentRecord`, …). Reuse them — do
  not re-declare an interface in a page.
* Type the `apiFetch<T>()` response explicitly; `T` must mirror the Express
  payload exactly. If the API returns a union (`plan: "free" | "pro"`), type it
  as `UserPlan`, not `string`.
* `strict: true` and `noEmit: true` are on. No `any`, no `as unknown as`, no
  `@ts-ignore` / `eslint-disable` to silence a rule.
* Prefer **derived state** over `useState` + `useEffect` sync. The
  `react-hooks/set-state-in-effect` rule rejects synchronous `setState` in an
  effect body:
  * loading flags → `const loading = loadedId !== currentId;`
  * prop → form state → remount with `key` (see `dashboard/profile/page.tsx`)
  * hydration guards → `useIsHydrated()` (`useSyncExternalStore`), not
    `useEffect(() => setMounted(true))`
* Server responses are untrusted: guard with `res.x || []` before mapping.

---

## 5. Verification

Run these before considering any change done — all three must exit `0` with no
output:

```bash
npx tsc --noEmit      # TypeScript
npm run lint          # ESLint (0 errors, 0 warnings)
npm run build         # production build: type check + Turbopack + CSS
```

Do not modify `.env` or `.env.local` to make a build pass.

# MentorLagbe — Smart Tuition & Mentorship Platform

**MentorLagbe** is a full-stack, role-based EdTech tuition and mentorship platform built with **Next.js (App Router)**, **Shadcn UI**, **Express.js**, **MongoDB**, **BetterAuth**, **JWT**, **Stripe**, and **ImgBB**. It connects verified **Tutors** offering subject-wise batches or 1-on-1 mentorship with **Students** searching by subject, class level, mode (Online/Offline), and monthly budget, while **Admins** moderate listings, manage user roles, and track Stripe subscription revenue.

## Live Links & Repositories

* **Live Site (Client):** https://mentorlagbe-client-rose.vercel.app
* **Live API Server:** https://mentorlagbe-server-naim-b589.vercel.app
* **GitHub Repository (Client):** https://github.com/naimparves-dev/mentorlagbe-client
* **GitHub Repository (Server):** https://github.com/naimparves-dev/mentorlagbe-server

## Key Features

### Authentication & Role-Based Security

* **BetterAuth + MongoDB Adapter:** Role-based registration (`student` or `tutor`, defaulting to `plan: "free"`) and email/password sign-in with form validation and toast alerts (`sonner`).
* **JWT Protection & Express Middlewares (Challenge 2):** Issues signed JWTs (`/api/jwt`) on login and protects backend routes with `verifyToken`, `verifyStudent`, `verifyTutor`, and `verifyAdmin`.
* **Reload-Safe Private Routes:** Persistent session restoration across page reloads on all `/dashboard/...` routes without redirecting logged-in users back to `/sign-in`.

### Public Pages & Discovery

* **Landing Page (`/`):** Hero search banner, 6 latest approved & active featured tuition cards (uniform equal-height grid), How MentorLagbe Works (4-step workflow), Top Subjects & live platform statistics/testimonials, and Stripe Pro Plan pricing.
* **Browse Tuitions (`/tuitions`) — Challenge 1 & Pagination:** Dynamic server-side search (title/subject/location), filters (subject, class level, Online/Offline mode), fee sorting, and MongoDB `.skip()` / `.limit()` pagination.
* **Tuition Details (`/tuitions/[id]`):** Full tuition breakdown, tutor profile summary, role-restricted **Apply for Tuition** modal (Students only; prevents duplicate applications), **Bookmark/Save** button, and **1–5 Star Reviews** for accepted students.

### Role-Based Dashboards (`/dashboard/...`)

* **Student Dashboard:** Overview stats cards, **My Applications** (status tracking & pending application cancellation), and **Saved Tuitions** (Free: up to 5 bookmarks; Pro: unlimited).
* **Tutor Dashboard:** Overview stats cards, **Post a Tuition** with direct ImgBB banner upload (Challenge 3; Free: up to 2 posts, Pro: unlimited), **My Tuitions** full CRUD + Active/Closed toggle, and **Manage Applicants** (Accept/Reject).
* **Admin Dashboard:** Platform-wide statistics & revenue overview, **User Role Management** (`student` / `tutor` / `admin`), **Tuition Approval Flow** (Approve/Reject), and **Stripe Transactions** ledger.
* **Shared Profile (`/dashboard/profile`):** Update Name, Phone, Bio, and upload Profile Picture directly via **ImgBB API**.

### Stripe Subscriptions & UI Polish

* **Stripe Checkout & Webhook Sync:** Upgrade to **Pro Student ($10)** or **Pro Tutor ($15)** via Stripe Checkout; automatically records transactions in `payments` and updates `users.plan = "pro"` via webhook (`/api/payments/webhook`) and session verification (`/payment/success`).
* **Theme & UX:** Smooth **Dark / Light Mode** toggle (`next-themes`), custom `loading.tsx` skeletons, custom `not-found.tsx` (404) and `error.tsx` boundary pages, responsive collapsible dashboard sidebar, and updated **X** social icon in the footer.

## Database Architecture (4 MongoDB Collections)

1. **`users`**: `_id, name, email, image, role ('student' | 'tutor' | 'admin'), phone, bio, plan ('free' | 'pro'), bookmarks, createdAt`
2. **`tuitions`**: `_id, title, subject, classLevel, mode ('Online' | 'Offline'), location, monthlyFee, daysPerWeek, bannerImage, description, tutorName, tutorEmail, approvalStatus ('pending' | 'approved' | 'rejected'), isActive, reviews, createdAt`
3. **`applications`**: `_id, tuitionId, tuitionTitle, subject, monthlyFee, tutorName, tutorEmail, studentName, studentEmail, studentPhone, preferredSchedule, studentNote, status ('pending' | 'accepted' | 'rejected'), appliedAt`
4. **`payments`**: `_id, userEmail, userName, userRole, planName, amount, currency, transactionId, stripeSessionId, paymentStatus ('paid'), paidAt`

## NPM Packages Used

### Client (`mentorlagbe-client`)

* `next`, `react`, `react-dom`, `typescript`
* `better-auth`, `mongodb`
* `tailwindcss`, `@tailwindcss/postcss`, `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`
* `lucide-react`, `next-themes`, `sonner`

### Server (`mentorlagbe-server`)

* `express`, `mongodb`, `cors`, `cookie-parser`, `dotenv`
* `jsonwebtoken`, `stripe`
* `nodemon` *(devDependency)*




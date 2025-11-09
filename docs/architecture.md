# Frontend Architecture

## Goals

1. Deliver a frictionless experience for two roles (parent, student) with minimal navigation overhead.
2. Keep the stack simple enough for fast iteration while still flexible for Supabase auth + data needs.
3. Co-locate data fetching with UI via Next.js App Router server components, falling back to client hooks only when interactivity is required.

## High-Level Structure

```
src/
├── app/
│   ├── (public)/      Landing, marketing, shared curriculum
│   ├── (auth)/        Signup/login/reset flows
│   ├── parent/        Parent dashboard + student management
│   └── student/       Student workspace + assessment flow
├── components/
│   ├── ui/            Buttons, cards, table, progress
│   ├── feedback/      Checkpoint review widgets
│   └── assessments/   Question player, answer forms
├── lib/
│   ├── supabase/      Browser + server client helpers + provider
│   ├── env.ts         Runtime env guards
│   └── utils/         Cross-cutting helpers (e.g., app-info)
└── types/
    └── supabase.ts    Generated types from Supabase CLI (placeholder today)
```

## Data Flow

- **Server Components**: Prefetch parent/student-specific datasets (e.g., `student_book_progress`, `parent_student_link`) using the Supabase server client. This keeps sensitive data on the server and leverages RLS to auto-scope results.
- **Client Components**: Use TanStack Query hooks for mutations (`useSubmitAnswer`, `useUpdateStudentLevel`) and optimistic updates. Queries live under `lib/api/` to centralize projection strings and keep PostgREST usage consistent with `docs/api/user_endpoints.md`.
- **Edge/Route Handlers**: Parent-triggered student creation uses a Route Handler that invokes the Supabase Admin API with a service role key stored via server-only env var. Responses are returned to the client with limited metadata to avoid leaking service credentials.

## Authentication & Authorization

- `middleware.ts` (root) inspects Supabase auth cookies and routes users:
  - Parents to `/parent` namespace.
  - Students to `/student`.
  - Unauthenticated visitors stay on marketing/auth routes.
- Layouts read `session.user.app_metadata.role` to conditionally render navigation items and to prevent cross-role access.
- All data access leans on Supabase RLS; service-role calls are limited to backend-like operations (student provisioning, future admin utilities).

## State Management

- Prefer React/Next local state for UI only.
- TanStack Query caches Supabase responses per role and handles revalidation after mutations (e.g., when a student submits answers).
- React Hook Form + Zod handle validation for login/signup, parent student creation, answer forms.

## Styling & UI System

- Tailwind CSS for utility-first styling.
- Headless UI and Radix primitives for accessible components (dialogs, menus, combobox).
- `SupabaseProvider` hydrates the browser client, listens for `onAuthStateChange`, and pings `/api/auth/update-session` so server components/middleware retain the latest session.
- `components/ui/` exports typed wrappers so designers can swap internals without rewriting consumers.

## Testing Strategy

- **Unit**: Vitest + Testing Library for hooks and presentational components.
- **Integration**: Playwright smoke flows for parent dashboard and student assessment loops.
- **Contracts**: Type-safe Supabase responses using generated types (via `supabase gen types typescript --local`) committed under `types/supabase.ts`, ensuring API changes break builds early.

## Env & Configuration

- `.env.example` lists Supabase URL, anon key, service role key (prefixed with `NEXT_PUBLIC_` only when safe).
- Never commit `.env`; developers duplicate to `.env.local`.
- `next.config.js` toggles experimental features (server actions, appDir) as needed.

## Future Enhancements

1. Module-level caching of read-only curriculum queries via ISR.
2. Feature flag hooks to enable new assessment experiences for subsets of students.
3. Telemetry integration (PostHog or simple Supabase logging) for engagement tracking.

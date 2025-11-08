# Frontend Delivery Plan

## Phase 0 – Foundations

- Initialize Next.js (App Router) + TypeScript + Tailwind + pnpm workspace.
- Add lint/test tooling (ESLint, Prettier, Vitest, Playwright scaffolding).
- Create Supabase client helpers (server + browser) and middleware stub.
- Document environment requirements and developer scripts in README.
- **Status**: ✅ Repository scaffolded with Next.js 16, Tailwind v4, Prettier, Vitest, and Supabase helpers/middleware.

## Phase 1 – Auth & Shell

- Implement marketing landing page with CTA for parents.
- Build signup/login screens wired to Supabase Auth (`role = parent`).
- Add role-aware middleware + layout shell with responsive nav, session indicator, and sign-out.
- Smoke-test with Supabase local project to confirm parent flow.

## Phase 2 – Shared Curriculum Browser

- Create read-only pages for Levels, Categories, Books pulling data from Supabase tables (open to anon/auth).
- Add filtering/search for level/category.
- Cache via server components with revalidation.
- Expose the curriculum browser to both parent and student layouts for quick reference.

## Phase 3 – Parent Experience

- Parent dashboard listing linked students with progress summary (`student_book_progress`).
- Screens to invite/add additional parents (leveraging backend signup semantics).
- Student detail page: reset password workflow (via Supabase Admin API), mark completed books, view recent answers.
- Notifications/toasts for key actions (student invite, level change).

## Phase 4 – Student Experience

- Student dashboard showing current level, available books, next checkpoint.
- Book detail with available units; start/resume ability.
- Unit runner with question carousel, answer form, submission status.
- Checkpoint review UI surfacing last five units incorrect answers and re-try flow.

## Phase 5 – Polish & QA

- Accessibility sweep (keyboard nav, screen reader labels).
- Responsive tweaks down to 320px.
- Add Playwright scripts for parent + student happy paths.
- Performance budget (Core Web Vitals) monitoring hooks.
- **Status**: Playwright harness + basic smoke specs (landing/auth placeholders) committed; expand coverage as features land.

## Cross-Cutting Concerns

- **State/Cache**: TanStack Query for client mutations; server cache for read-only data.
- **Error Handling**: Shared error boundary components and toast notifications.
- **Analytics (Later)**: Hook architecture ready for optional telemetry.

## Milestones & Success Criteria

1. **M1** – Auth shell deployed, parents can log in/out.
2. **M2** – Curriculum browser usable by both roles with live Supabase data.
3. **M3** – Parent dashboard fully manages students and reviews progress.
4. **M4** – Student unit runner supports answering + feedback loop.
5. **M5** – Automated tests + accessibility baseline in place, ready for beta users.

## Dependencies

- Supabase backend endpoints as documented in `../backend/docs/api`.
- Service role key for admin-only operations (stored server-side).
- Finalized curriculum seed data (Backend TODO #2) for richer UI states.

# SRA Web App Frontend

Lightweight Supabase-backed web client that lets parents manage students working through the SRA Specific Skills series and gives students a focused practice workspace.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS (v4) with Headless UI primitives
- **Data Layer**: Supabase JS (Auth, PostgREST) + future TanStack Query hooks
- **Validation/Form**: Zod + React Hook Form
- **Tooling**: ESLint, Prettier, Vitest + Testing Library

## Getting Started

1. Install deps (Node 20 LTS recommended):
   ```bash
   pnpm install
   ```
2. Copy env template and fill in Supabase project keys (never commit secrets):

   ```bash
   cp .env.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` come from your Supabase project.
   - `SUPABASE_SERVICE_ROLE_KEY` should stay server-side only; never expose it to the browser.

3. Run checks:
   ```bash
   pnpm lint
   pnpm test
   pnpm format
   pnpm test:e2e        # Playwright smoke tests (spins up Next dev server)
   ```
4. Start the dev server:
   ```bash
   pnpm dev
   ```

## Testing

- **Unit/Integration**: `pnpm test` (Vitest) + `pnpm test:watch` for dev mode.
- **E2E Smoke**: `pnpm test:e2e` launches Playwright against a temporary dev server on port 3100. Add `--headed` or run `pnpm test:e2e:ui` to interact with the UI runner. Auth flow specs require a running Supabase instance plus `SUPABASE_SERVICE_ROLE_KEY` (loaded via `.env.local`) so the test can confirm/delete users via the Admin API.
- **Formatting/Linting**: `pnpm format`, `pnpm lint`, `pnpm typecheck`.

## Key Pages

- `/curriculum` – Read-only browser for levels, categories, and books.
- `/student/books` – Student-facing list of books + units, leading to the unit runner experience.
- `/student/books/[bookId]/unit/[unitNumber]` – Minimal unit runner where students enter answers (no instant feedback; checkpoint logic triggers every five units).

## Authentication

- Signup/Login forms call Supabase Auth (`role = parent`) via the shared browser client and sync sessions through `/api/auth/update-session` so middleware can route users based on metadata.
- Middleware (`middleware.ts`) enforces role access while server components use `getSupabaseServerClient` for data fetching behind RLS.
- When testing locally, ensure your Supabase project allows email/password signup for parents or run a Supabase CLI instance with matching credentials.

### Local Email Confirmations

When running Supabase locally, open Inbucket (`http://127.0.0.1:54324`) to grab the confirmation link for any signup emails. Alternatively, flip the `email_confirm` flag inside Supabase Studio (Auth → Users).

## Repository Layout

```
.
├── docs/                # Architecture, plans, project TODO
├── public/              # Static assets
├── src/
│   ├── app/             # App Router entries grouped by role
│   ├── components/      # Shared UI widgets
│   ├── lib/             # Supabase helpers, env utilities
│   └── types/           # Generated types (placeholder for Supabase)
├── README.md
└── TODO.md
```

## Documentation Index

- `docs/architecture.md` – high-level frontend architecture, auth flow, data fetch strategy.
- `docs/frontend_plan.md` – phased delivery plan, milestones, and acceptance criteria.
- `TODO.md` – running backlog of tasks, ordered by priority.

## Related Repos

- [`../backend`](../backend) contains the Supabase project (schema, migrations, edge functions). The frontend talks exclusively to those APIs.

## Contributing Notes

- Follow the commit workflow in `AGENTS.md`.
- Keep docs updated as architectural decisions evolve.
- When adding new routes or flows, document APIs used and any assumptions in `docs/frontend_plan.md`.

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
- **E2E Smoke**: `pnpm test:e2e` launches Playwright against a temporary dev server on port 3100. Add `--headed` or run `pnpm test:e2e:ui` to interact with the UI runner.
- **Formatting/Linting**: `pnpm format`, `pnpm lint`, `pnpm typecheck`.

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

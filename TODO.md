# Project TODO

Use this file to track high-level tasks. Each entry includes owner (if known), priority, and notes/next action.

## Legend

- **Priority**: H = High, M = Medium, L = Low
- **Status**: ☐ not started, ⟳ in progress, ☐ blocked, ☑ done

## Backlog

| Status | Priority | Task                                                    | Notes / Next Action                                              |
| ------ | -------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| ☐      | H        | Build parent auth flow (signup/login/reset)             | Wire to Supabase Auth, capture `role=parent` metadata            |
| ☐      | M        | Curriculum browser (levels/categories/books)            | Server components hitting read-only tables, add filtering        |
| ☐      | H        | Parent dashboard with linked students + progress        | Requires `parent_student_link` + `student_book_progress` queries |
| ☐      | H        | Student workspace + unit runner                         | Integrate answer submission, checkpoint review                   |
| ☐      | M        | Route handler for parent-triggered student provisioning | Wrap Supabase Admin API, ensure service key stays server-only    |
| ☐      | L        | Analytics/telemetry hook                                | Placeholder for future instrumentation                           |

## In Progress

| Status | Priority | Task             | Notes / Next Action                                                                 |
| ------ | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| ⟳      | H        | Parent auth flow | Next: wire Supabase Auth (signup/login), persist session, and gate routes via RLS. |

## Done

| Status | Priority | Task                                                          | Notes / Next Action                                            |
| ------ | -------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| ☑      | H        | Scaffold Next.js app with pnpm, Tailwind, lint/test tooling   | Next.js 16 + Tailwind v4 + Prettier/Vitest configured          |
| ☑      | H        | Implement Supabase client helpers + auth middleware           | Added browser/server clients, env guards, and route middleware |
| ☑      | M        | Testing suite (Vitest unit + Playwright smoke)                | Vitest unit test + Playwright E2E setup with scripts/reporting |
| ☑      | M        | Establish documentation baseline (README, architecture, plan) | Initial version committed on `frontend-docs-setup`             |

## Next Session Focus

1. Finish parent auth wiring (Supabase signup/login + session storage).
2. Start read-only curriculum browser pulling `level/category/book` tables.
3. Plan parent dashboard data hooks (identify queries + UI states).

# Project TODO

Use this file to track high-level tasks. Each entry includes owner (if known), priority, and notes/next action.

## Legend

- **Priority**: H = High, M = Medium, L = Low
- **Status**: ☐ not started, ⟳ in progress, ☐ blocked, ☑ done

## Backlog

| Status | Priority | Task                                                    | Notes / Next Action                                              |
| ------ | -------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| ☑      | H        | Build parent auth flow (signup/login/reset)             | Supabase Auth wired with role metadata + session sync            |
| ☐      | H        | Parent dashboard with linked students + progress        | Requires `parent_student_link` + `student_book_progress` queries |
| ⟳      | H        | Student workspace + unit runner                         | Extend checkpoint logic + richer progress feedback               |
| ☐      | M        | Route handler for parent-triggered student provisioning | Wrap Supabase Admin API, ensure service key stays server-only    |
| ☐      | L        | Analytics/telemetry hook                                | Placeholder for future instrumentation                           |

## In Progress

| Status | Priority | Task               | Notes / Next Action                                                 |
| ------ | -------- | ------------------ | ------------------------------------------------------------------- |
| ⟳      | H        | Student workspace  | Finish checkpoint review flow + polish unit runner interactions.    |

## Done

| Status | Priority | Task                                                          | Notes / Next Action                                            |
| ------ | -------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| ☑      | H        | Scaffold Next.js app with pnpm, Tailwind, lint/test tooling   | Next.js 16 + Tailwind v4 + Prettier/Vitest configured          |
| ☑      | H        | Implement Supabase client helpers + auth middleware           | Added browser/server clients, env guards, and route middleware |
| ☑      | M        | Testing suite (Vitest unit + Playwright smoke)                | Vitest unit test + Playwright E2E setup with scripts/reporting |
| ☑      | H        | Build parent auth flow (signup/login/reset)                   | Supabase Auth wired with role metadata + session sync          |
| ☑      | M        | Curriculum browser                                            | `/curriculum` page backed by Supabase tables                   |
| ☑      | M        | Establish documentation baseline (README, architecture, plan) | Initial version committed on `frontend-docs-setup`             |

## Next Session Focus

1. Wire up parent dashboard data hooks (student links + progress snapshots).
2. Layer checkpoint review logic into the student unit runner after every 5 units.
3. Implement parent-triggered student provisioning (service-role route + UI).

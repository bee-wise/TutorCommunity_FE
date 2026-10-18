---
description: BeeWise frontend architecture, API integration, and completion rules for coding agents.
---

# BeeWise Development Workflow

Read only the sections relevant to the task, as directed by [AGENTS.md](../../AGENTS.md). Its scope rules govern task tracking and unrelated cleanup.

# 1. Project Overview & Tech Stack

Turborepo; Next.js 16 App Router; React 19; strict TypeScript; Tailwind CSS v4; TanStack Query; Zustand for permitted global UI state; React Hook Form + Zod; Heroicons; `motion/react`; Centrifugo. Favor maintainability, type safety, clear layers, performance, and consistent caching.

# 2. Monorepo & Feature Architecture

## 2.1. `apps/[app-name]`

- Keep apps isolated; never import directly from another app. Move code reused across apps to `packages/core` or `packages/ui`.
- `app/` handles routing and page composition only: no business logic, complex state, or direct API calls.
- Put domains in `features/[name]/`: UI in `components/`, state/business behavior in `hooks/`, data access in `api/` or `services/`, Zod in `schemas/`, types in `types/`, helpers in `utils/`. Use a feature `store/` only for appropriate UI state.

## 2.2. `packages/core`

Shared API client/services, query keys/hooks, authentication/session logic, types, schemas, and utilities belong here. No JSX or presentation components.

## 2.3. `packages/ui`

Shared presentation components (controls, cards, dialogs, tables, feedback states) belong here. No domain logic or API fetching.

# 3. UI Standards & Anti-Slop Rules

For UI implementation, follow [AGENTS.md](../../AGENTS.md) and the [frontend design skill](../skills/design-taste-frontend/SKILL.md); consult its [benchmark](../skills/design-taste-frontend/references/beewise-ui-standards.html) when making layout or visual-design decisions. These cover Heroicons, `@workspace/ui` buttons, chips, active states, heading copy, and disclosure controls. In `apps/lms`, also follow the [LMS skill](../skills/design-taste-lms/SKILL.md) and active `packages/ui/globals.css` tokens. Planning-only work should list applicable UI guidance for the implementation agent rather than reading it solely to write a plan. Use `motion/react` only in Client Components and only for purposeful motion.

# 4. Separation of Concerns & Data Flow

`UI component → custom hook → API/service → apiClient → backend`.

- Components render UI and connect actions. Decompose at 150–200 lines; 300 is the maximum.
- Hooks own complex state, side effects, form wiring, validation flow, queries/mutations, and transformations.
- Services/API modules own typed HTTP calls. Never call `fetch` or `axios` directly inside components or hooks.

# 5. State Management Matrix

| State | Tool | Boundary |
| --- | --- | --- |
| Local UI | `useState` / `useReducer` | Keep dialogs, dropdowns, and transient filters local. |
| Forms | React Hook Form + Zod | Avoid manual state per field in complex forms. |
| Server data and mutations | TanStack Query | Centralize keys and invalidate affected caches; no server data in Zustand. |
| Global UI | Zustand | Auth session, notifications, theme/settings only. |

# 6. Strict TypeScript & Validation Standards

Type function boundaries, hooks, and API payloads. No `any` or `@ts-ignore`; prefer `unknown`, generics, or discriminated unions. Infer self-evident local types. Validate forms and external payloads with Zod in `schemas/`; derive types with `z.infer` where appropriate and use `z.guid()` for UUID fields.

# 7. Complete API Integration Standard & Workflow

Apply all ten steps to API integration:

1. **Contract:** Inspect method/path, path/query/body fields, response DTO, errors, and pagination/search/sort parameters in docs or OpenAPI.
2. **Types:** Define request, response, and pagination types in feature `types/` or shared `packages/core/types/`.
3. **Validation:** Add Zod schemas for forms, mutations, and external input where applicable.
4. **Service:** Use a feature API/service module wrapping `apiClient` from `@workspace/core/apiClient` with globally configured `withCredentials: true`. Never call Axios directly, duplicate base URLs, hardcode tokens, or set `Content-Type` manually for `FormData`.
5. **Query keys:** Define structured keys centrally for precise list/detail invalidation.
6. **Hooks:** Use `useQuery` for reads and `useMutation` for writes; invalidate affected keys after success.
7. **Transformation:** Normalize responses in services or hooks, not with deep payload traversal in JSX.
8. **UI states:** Handle loading, empty, error/retry, and success/pagination; show mutation success/failure feedback.
9. **Names:** Use domain names such as `getTutorList`, `createBooking`, `useTutorListQuery`, `useCreateTutorMutation`; avoid `fetchData`, `callApi`, `request`, and `submit`.
10. **Verify:** Confirm contract/DTOs, schemas, client, keys, hooks, invalidation, UI states, feedback, and strict TypeScript.

# 8. Next.js App Router & React Rules

Use Server Components by default. Add `'use client'` only to the innermost interactive leaf using hooks, events, animation, or browser APIs. Use Server Actions for simple submissions; use TanStack Query mutations for rich client interaction, optimistic updates, polling, or complex invalidation. Memoize only after profiling shows a benefit.

# 9. Real-Time & WebSockets (Centrifugo)

Use one shared Centrifugo client, expose subscriptions through hooks, and unsubscribe/remove listeners in effect cleanup.

# 10. Error Handling & Resilience

Parse backend errors at the service/hook boundary. Show actionable toasts and retry paths; do not fail silently or rely on `console.error`. Use error boundaries where an isolated widget could otherwise break a major feature.

# 11. Authentication & Security

Use HttpOnly/Secure cookie authentication with `withCredentials: true`. Configure each app's `proxy.ts` and `rewrites()` in `next.config.mjs` for role parsing, guards, and redirects. Never store access/refresh tokens or passwords in `localStorage` or `sessionStorage`.

# 12. Code Style, Imports & Naming Conventions

- Use descriptive files such as `TutorCard.tsx`, `useTutorListQuery.ts`, `auth.store.ts`, `tutor.api.ts`, `login.schema.ts`, and `formatCurrency.ts`. Avoid `helpers.ts`, `utils.ts`, `common.ts`, `temp.ts`, and `new.ts`.
- Order imports: React/framework; third-party; monorepo packages; feature/local; type-only; styles.

# 13. Logging, Performance & Accessibility

Leave no `console.log`, `console.error`, `debugger`, or temporary code. Dynamically import heavy interactive modals/charts and optimize images with `next/image`. Use semantic buttons, links, and headings, keyboard support, and appropriate ARIA labels.

# 14. Git Rules

Use `feature/[name]`, `fix/[description]`, `refactor/[module]`, or `hotfix/[description]` branch names where applicable. Format commits as `type(scope): description`.

# 15. Agent Development Workflow

1. Identify affected apps/packages, existing reusable code, API contracts, and state needs.
2. Place shared UI in `packages/ui`, shared logic in `packages/core`, domain work in `features/`, and route composition in `app/`.
3. Implement within component → hook → service boundaries.
4. Review changed code for dead code, unused imports, debug artifacts, and component size.
5. Run relevant TypeScript, ESLint, tests, and usage checks. Update `.agents/implement-task.md` only when the user requests tracking.

# 16. Terminal Requirement

Use PowerShell syntax and cmdlets for project commands. Do not use Git Bash or Bash syntax.

# 17. Definition of Done

For the requested scope, confirm:

- [ ] Functional requirements work, including relevant error paths.
- [ ] UI changes follow BeeWise design rules, accessibility, and mobile/tablet/desktop layouts.
- [ ] Component, hook, and service boundaries remain clear.
- [ ] Strict TypeScript passes without `any` or `@ts-ignore`; ESLint has no new errors or warnings.
- [ ] Query keys and mutation invalidation are correct where API data is involved.
- [ ] Data-driven UI covers loading, empty, error, and success.
- [ ] No temporary debugging artifacts remain.
- [ ] Task tracking is updated only if requested.

# 18. Core Development Philosophy

Choose the simplest maintainable solution consistent with existing architecture and the user's requested scope.

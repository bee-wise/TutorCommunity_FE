---
description: BeeWise frontend architecture, API integration and completion rules. Read only the sections AGENTS.md points to.
---

# BeeWise development workflow

## 1. Stack

Turborepo · Next.js 16 App Router · React 19 · strict TypeScript · Tailwind CSS v4 · TanStack Query · Zustand (limited) · React Hook Form + Zod · Heroicons · `motion/react` · Centrifugo. UI rules: [design-system.md](../design-system.md).

## 2. Monorepo layout

- `apps/*` are isolated; never import across apps. Shared code moves to `packages/core` (API client, services, query keys/hooks, auth, types, schemas, utils; no JSX) or `packages/ui` (presentation components; no domain logic or fetching).
- `app/` = routing and page composition only (no business logic, complex state or API calls).
- Domains live in `features/[name]/`: `components/`, `hooks/`, `api/` or `services/`, `schemas/`, `types/`, `utils/`, optional `store/` for UI state.

## 3. Next.js & React

Server Components by default; `'use client'` only on the innermost interactive leaf. Server Actions for simple submissions, TanStack mutations for rich interaction. Memoize only after profiling. Centrifugo: one shared client, subscriptions via hooks, cleanup in effects.

## 4. Data flow

`component → hook → service → apiClient → backend`.

- Components render and wire actions; split at 150-200 lines, max 300.
- Hooks own state, effects, form wiring, queries/mutations, transformations.
- Services own typed HTTP calls. Never `fetch`/`axios` in components or hooks.

## 5. State

| State | Tool | Rule |
| --- | --- | --- |
| Local UI | `useState` / `useReducer` | Dialogs, dropdowns, transient filters |
| Forms | React Hook Form + Zod | No per-field manual state |
| Server data | TanStack Query | Central keys, invalidate affected caches; never in Zustand |
| Global UI | Zustand | Auth session, notifications, theme/settings only |

## 6. TypeScript & validation

Type function boundaries, hooks and payloads. No `any` / `@ts-ignore` (use `unknown`, generics, unions). Zod in `schemas/` for forms and external input; `z.infer` types; `z.guid()` for UUID/GUID fields.

## 7. API integration checklist

1. Read the contract (method, path, params, body, response DTO, errors, pagination) from docs/OpenAPI.
2. Types in feature `types/` or `packages/core/types/`.
3. Zod schemas for forms, mutations, external input.
4. Service wraps `apiClient` from `@workspace/core/apiClient` (`withCredentials: true` is global). No direct Axios, duplicated base URLs, hardcoded tokens, or manual `Content-Type` for `FormData`.
5. Structured query keys, defined centrally.
6. `useQuery` for reads, `useMutation` for writes, invalidate on success.
7. Normalize responses in service/hook, not in JSX.
8. UI handles loading, empty, error/retry, success/pagination; toast on mutation result.
9. Domain names: `getTutorList`, `useTutorListQuery`, `useCreateBookingMutation`; not `fetchData`, `callApi`, `submit`.
10. Parse backend errors at the service/hook boundary; show actionable feedback, never fail silently.

## 8. Auth & security

HttpOnly/Secure cookies with `withCredentials: true`. Guards and redirects in each app's `proxy.ts` and `rewrites()` in `next.config.mjs`. Never store tokens or passwords in `localStorage`/`sessionStorage`.

## 9. Code style

- Descriptive file names (`TutorCard.tsx`, `useTutorListQuery.ts`, `tutor.api.ts`, `login.schema.ts`); no `helpers.ts`, `utils.ts`, `common.ts`, `temp.ts`.
- Import order: React/framework → third-party → `@workspace/*` → local → types → styles.
- No `console.*`, `debugger` or temporary code. Dynamic-import heavy modals/charts; `next/image` for images.
- Git: branches `feature/`, `fix/`, `refactor/`, `hotfix/`; commits `type(scope): description`.

## 10. Process

1. Identify affected apps/packages, reusable code, API contracts, state needs.
2. Place code per §2 and implement within §4 boundaries.
3. Review for dead code, unused imports, component size.
4. Run relevant `tsc`, ESLint, tests (PowerShell).

## 11. Definition of done

- [ ] Requirement works, including error paths.
- [ ] UI follows design-system.md, is accessible and works on mobile/tablet/desktop.
- [ ] Component/hook/service boundaries are clear.
- [ ] TypeScript strict passes; no new ESLint errors/warnings.
- [ ] Query keys and invalidation correct; data UI covers loading/empty/error/success.
- [ ] No debug artifacts. Simplest maintainable solution within the requested scope.

---
description: This document provides the comprehensive workflow, frontend architecture, API integration standards, and development guidelines for Agents working on the BeeWise TutorCommunity FE project.
---

# BeeWise Project Workflow & Development Guidelines

This document defines the mandatory workflow, architecture logic, API integration standards, coding conventions, and UI rules for every AI Agent contributing to the **BeeWise TutorCommunity Frontend** project.

---

# 1. Project Overview & Tech Stack

BeeWise is built using:

- **Monorepo**: Turborepo
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **Server State**: TanStack Query (React Query)
- **Global UI State**: Zustand
- **Form & Validation**: React Hook Form + Zod
- **Icons**: `@phosphor-icons/react`
- **Animation**: `motion/react`
- **Real-Time**: Centrifugo

Every implementation must prioritize:
- **Reusability** & **Maintainability**
- **Strict Type Safety** & **Zero `any`**
- **Separation of Concerns** (Dumb Components, Smart Hooks, Service Layer)
- **Consistent Server State & Caching**
- **Performance & Polish**

---

# 2. Monorepo & Feature Architecture

```
BeeWise/
├── apps/
│   ├── lms/
│   ├── sale/
│   └── staff/
├── packages/
│   ├── core/
│   └── ui/
└── .agents/
```

## 2.1. `apps/[app-name]` (Isolated Applications)

Each application in `apps/` is strictly isolated.

```
apps/[app-name]/
├── app/                  # Next.js App Router (Thin routing & page composition only)
├── features/             # Domain-driven feature modules
│   └── [feature-name]/
│       ├── api/          # Feature API fetching functions (or services/)
│       ├── components/   # UI components specific to this feature
│       ├── hooks/        # Custom hooks (business logic, queries/mutations)
│       ├── schemas/      # Zod validation schemas
│       ├── services/     # Feature business services / API calls
│       ├── store/        # Feature-specific Zustand store (if needed)
│       ├── types/        # Feature TypeScript interfaces & types
│       ├── utils/        # Feature-specific helpers
│       └── index.ts      # Public feature exports (optional)
├── components/           # App-level composite components (layout, nav, app-specific dumb UI)
├── hooks/                # App-level reusable hooks
├── types/                # App-level general types
└── utils/                # App-level utility functions
```

### Monorepo Rules
- **Thin Pages**: Never place heavy business logic or raw API calls inside `app/`. App router pages only compose UI and call feature components/hooks.
- **Domain Encapsulation**: Every business domain belongs inside `features/`.
- **No Cross-App Imports**: Never import code directly from one app to another.
- **Shared Code Extraction**: Any logic or UI reused across multiple apps must reside in `packages/core` or `packages/ui`.

## 2.2. `packages/core` (Shared Business Logic)

Contains all shared business and data access logic:
- API Client & Request/Response interceptors
- API endpoints & shared API functions
- Shared React Query hooks & centralized query keys
- Authentication logic & session handling
- Shared TypeScript interfaces & types
- Shared Zod validation schemas
- Global Zustand stores (Auth, global preferences)
- Shared utility helpers & formatters

> **Note**: Never place UI components or JSX inside `packages/core`.

## 2.3. `packages/ui` (Shared Presentation Components)

Contains dumb, reusable design system components:
- Buttons, Inputs, Selects, Checkboxes, Switches
- Dialogs, Modals, Drawers, Tooltips, Popovers
- Cards, Badges, Action Chips, Avatars, Dividers
- Data Tables, Pagination bars
- Loading skeletons, Spinners, Empty states

> **Note**: Presentation logic only. No business domain logic or direct API fetching in `packages/ui`.

---

# 3. UI Standards & Anti-Slop Rules

BeeWise adopts an **Edutech Soft-Modern & Glassmorphism** design language.

## 3.1. 🚫 Strict UI Anti-Patterns & Button Rules
- **CẤM HOÀN TOÀN** tạo các button/link hành động dạng text trần có gạch chân (`hover:underline`, `underline`) kèm icon mũi tên thô sơ (ví dụ: `← Đổi email`, `← Quay lại`).
- **Mọi nút bấm / action chips bắt buộc phải là:**
  - **Action Chips / Badges**: Đóng gói trong container (`rounded-xl border bg-muted/40 px-3.5 py-2.5`) kèm nút chip/badge tinh tế (`rounded-lg border bg-background px-2.5 py-1 text-xs font-bold hover:bg-muted active:scale-95`).
  - **Standard Button Variants**: Dùng Button chuẩn từ `@workspace/ui` (`variant="default" | "accent" | "secondary" | "outline" | "ghost" | "destructive"`).
  - **Interactive Text Links**: Dùng `transition-colors hover:text-primary/80` (KHÔNG dùng `hover:underline` trừ nội dung chính sách pháp lý).
- **Mandatory Micro-Interactions**: Mọi nút bấm và chip tương tác phải có `active:scale-[0.98]` hoặc `active:scale-95`, `transition-all`, và hiệu ứng bo góc mượt mà.
- **Reference Benchmark**: Đối chiếu chi tiết tại [.agents/skills/design-taste-frontend/references/beewise-ui-standards.html](file:///d:/FPTUNI/MECODE/MyProject/BeeWise/TutorCommunity_FE/.agents/skills/design-taste-frontend/references/beewise-ui-standards.html).

## 3.2. Color Palette & UI Tokens

- **Primary**: `#280F91` (Deep Royal Indigo)
- **Secondary**: `#447353` (Sage Forest Green)
- **Accent**: `#FFC500` (Bee Amber Yellow)
- **Background**: `#CFE1FA` / Clean Slate Neutrals
- **Surface**: Glassmorphism with subtle backdrop blur for Hero, KPI Cards, AI cards, Dialogs; Flat UI with clean borders for high-density tables and data entry.

## 3.3. Icons & Animation

- **Icons**: Exclusively use `@phosphor-icons/react` (or `@phosphor-icons/react/dist/ssr` for Server Components).
- **Animation**: Use `motion/react` in Client Components only. Keep transitions smooth and purposeful.

---

# 4. Separation of Concerns & Data Flow

Maintain clean boundaries: **Dumb Components, Smart Hooks, and Service Layer**.

```
User Action (Click/Submit)
   │
   ▼
[UI Component] ──────────► Calls custom hook
   │
   ▼
[Custom Hook]  ──────────► Handles state, TanStack Query, validation
   │
   ▼
[Service / API] ─────────► Calls apiClient with typed payload
   │
   ▼
[Backend API]
```

## 4.1. Rules for Components
- Components should focus purely on UI presentation and user interaction.
- **File Length Limit**: If a component exceeds **150–200 lines**, decompose it into smaller sub-components (Absolute maximum is **300 lines**).
- Prefer composition (`<Card><CardHeader /><CardBody /></Card>`) over monolithic multi-purpose components.

## 4.2. Rules for Custom Hooks
- Extract complex side effects, form wiring, data transformations, and state logic into dedicated custom hooks (e.g., `useBookSession.ts`, `useTutorFilters.ts`).

## 4.3. Rules for Services / API Layer
- Never invoke `fetch` or `axios` directly inside components or hooks.
- All API calls must go through feature services / api modules wrapping `apiClient`.

---

# 5. State Management Matrix

Use the right tool for each type of state. Do not store everything in global state.

| State Type | Primary Tool | Best Use Cases | What NOT to Do |
| :--- | :--- | :--- | :--- |
| **Local UI State** | `useState`, `useReducer` | Modal open/close, accordion toggles, dropdown active state, local filter inputs | Do not store server data or cross-screen data |
| **Form State** | **React Hook Form + Zod** | Multi-step forms, registration, profile settings, search forms | Do not use manual `useState` per field for complex forms |
| **Server State** | **TanStack Query (React Query)** | Data fetching, pagination, caching, server mutations, optimistic updates | Do not store fetched API data inside Zustand |
| **Global UI / App State** | **Zustand** | Auth session data, user role/permissions, theme, global notification queue, shopping cart | Do not use for server cache or transient component state |

---

# 6. Strict TypeScript & Validation Standards

## 6.1. TypeScript Rules
- **Strict Mode**: Explicitly type all variables, function arguments, hook returns, and API responses.
- **Zero `any` / Zero `@ts-ignore`**: Prefer `unknown`, generics, or discriminated unions over `any`.
- Use type inference only when the type is self-evident.

```ts
// Bad
const response: any = await getTutors();

// Good
interface TutorItem {
  id: string;
  fullName: string;
  hourlyRate: number;
}
const response = await tutorService.getTutors(); // returns Promise<ApiResponse<TutorItem[]>>
```

## 6.2. Zod Schema & Type Derivation
- Validate all user inputs and external payloads with Zod schemas.
- Place schemas in `schemas/` (e.g., `booking.schema.ts`, `login.schema.ts`).
- Derive TypeScript types directly from Zod schemas where appropriate:

```ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
```

---

# 7. Complete API Integration Standard & Workflow

Every API integration must adhere to this standardized end-to-end process.

## Step 1: Understand the API Contract
Before writing code, inspect documentation / OpenAPI specs to identify:
- HTTP Method & Endpoint path
- Path parameters, Query parameters, Request Body
- Response structure & DTOs
- Error codes & response payloads
- Pagination parameters (`page`, `pageSize`, `search`, `sortBy`)

## Step 2: Define TypeScript Types
Define explicit interfaces in `types/` (feature-level or `packages/core/types/`):

```ts
export interface TutorListParams {
  page: number;
  pageSize: number;
  subjectId?: string;
  search?: string;
}

export interface TutorSummary {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  hourlyRate: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

## Step 3: Define Validation Schema (If Applicable)
For mutating endpoints or forms, define schemas in `schemas/` using Zod.

## Step 4: Create API / Service Functions
All HTTP calls must use `apiClient` from `packages/core/apiClient`.

```ts
// features/tutors/api/tutor.api.ts
import { apiClient } from "@workspace/core/apiClient";
import type { PaginatedResult, TutorListParams, TutorSummary } from "../types/tutor.types";

export async function getTutorList(params: TutorListParams): Promise<PaginatedResult<TutorSummary>> {
  return apiClient.get<PaginatedResult<TutorSummary>>("/tutors", { params });
}

export async function createTutor(data: CreateTutorRequest): Promise<TutorSummary> {
  return apiClient.post<TutorSummary>("/tutors", data);
}
```

### 🚫 API Function Rules:
- Never call `axios` directly inside features or components.
- Never duplicate base URLs or hardcode tokens.
- Never manually set `Content-Type` for `FormData` file uploads (browser sets boundaries automatically).
- Always use `withCredentials: true` (configured globally in `apiClient`).

## Step 5: Centralize Query Keys
Define structured query keys to ensure reliable caching and targeted invalidation:

```ts
// packages/core/queryKeys.ts or feature queryKeys.ts
export const tutorQueryKeys = {
  all: ["tutors"] as const,
  lists: () => [...tutorQueryKeys.all, "list"] as const,
  list: (params: TutorListParams) => [...tutorQueryKeys.lists(), params] as const,
  details: () => [...tutorQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...tutorQueryKeys.details(), id] as const,
};
```

## Step 6: Create TanStack Query Hooks
Wrap API calls in standard React Query hooks in `hooks/`:

```ts
// features/tutors/hooks/useTutorListQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getTutorList } from "../api/tutor.api";
import { tutorQueryKeys } from "../queryKeys";
import type { TutorListParams } from "../types/tutor.types";

export function useTutorListQuery(params: TutorListParams) {
  return useQuery({
    queryKey: tutorQueryKeys.list(params),
    queryFn: () => getTutorList(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

```ts
// features/tutors/hooks/useCreateTutorMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTutor } from "../api/tutor.api";
import { tutorQueryKeys } from "../queryKeys";

export function useCreateTutorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTutor,
    onSuccess: () => {
      // Invalidate relevant query lists only
      queryClient.invalidateQueries({ queryKey: tutorQueryKeys.lists() });
    },
  });
}
```

## Step 7: Response Transformation
Transform data in the API or custom hook layer, keeping UI components pure and clean:

```ts
// Good
const { data: tutors = [] } = useTutorListQuery(params);

// Bad (Never traverse deep nested payloads directly in JSX)
<Table data={response?.data?.data?.items?.data} />
```

## Step 8: Handle UI States & Feedback
Every data-driven view must account for all lifecycle states:
1. **Loading**: Skeletons or spinners from `@workspace/ui`.
2. **Empty**: Meaningful empty state illustrations/messages with call-to-action.
3. **Error**: User-friendly alerts and retry options (never crash the page).
4. **Success**: Rendered data with pagination controls.

## Step 9: API Naming Conventions

| Purpose | Function / Hook Pattern | Examples |
| :--- | :--- | :--- |
| **API Fetch Functions** | `get[Resource]()`, `create[Resource]()`, `update[Resource]()`, `delete[Resource]()` | `getTutorList()`, `createBooking()`, `updateProfile()` |
| **Query Hooks** | `use[Resource]Query()`, `use[Resource]ListQuery()` | `useTutorListQuery()`, `useTutorDetailQuery(id)` |
| **Mutation Hooks** | `use[Action][Resource]Mutation()` | `useCreateTutorMutation()`, `useUpdateBookingMutation()` |
| **Forbidden Names** | Generic verbs without domain | `fetchData()`, `callApi()`, `request()`, `submit()` |

## Step 10: API Implementation Checklist

Before marking an API integration task as complete:
- [ ] API contract and DTO types reviewed
- [ ] Request & response interfaces created in `types/`
- [ ] Zod schema created in `schemas/` (if input mutation)
- [ ] API function implemented using shared `apiClient`
- [ ] Query keys added to query keys factory
- [ ] Custom TanStack Query / Mutation hook created
- [ ] Cache invalidation configured accurately
- [ ] UI handles Loading, Empty, Error, and Success states
- [ ] User feedback via toasts on mutation success/failure
- [ ] Strict TypeScript (zero `any`) verified

---

# 8. Next.js App Router & React Rules

- **Server Components by Default**: Write Server Components (`.tsx` without `'use client'`) by default for static UI, initial server data rendering, and metadata.
- **Leaf-Node `'use client'`**: Only add `'use client'` at the outermost interactive leaf nodes (components using hooks, event handlers, animations, or browser APIs).
- **Server Actions vs. TanStack Query**:
  - Use Server Actions for lightweight form submissions and straightforward page mutations.
  - Use TanStack Query mutations for rich client interactions, optimistic updates, and complex polling/invalidation flows.
- **Avoid Premature Memoization**: Use `useMemo`, `useCallback`, and `React.memo` only when profiling indicates tangible performance gains.

---

# 9. Real-Time & WebSockets (Centrifugo)

For real-time features (chat, live notifications, live booking updates):
- **Singleton Connection**: Initialize the Centrifugo client once globally (e.g., in a provider or `lib/centrifugo.ts`).
- **Hook Encapsulation**: Expose subscriptions via dedicated hooks (e.g., `useCentrifugoSubscription(channel, onMessage)`).
- **Cleanup Guarantee**: Always unsubscribe from channels and remove event listeners in the `useEffect` cleanup return to eliminate memory leaks.

---

# 10. Error Handling & Resilience

- **Boundary Try/Catch**: Catch and format errors in service functions or hook mutation callbacks.
- **Structured Backend Errors**: Parse server error payloads (e.g., extracting `error.response?.data?.message`).
- **User Feedback**: Present actionable notifications via toast components (`toast.error()`, `toast.success()`), never silent failures or plain `console.error`.
- **Error Boundaries**: Wrap major feature sections in React Error Boundaries to prevent isolated widget failures from taking down the entire application.

---

# 11. Authentication & Security

- **Cookie-Based Authentication**: Uses HttpOnly, Secure cookies with `withCredentials: true`.
- **App Isolation**: Every app must configure its `proxy.ts` and `rewrites()` in `next.config.mjs` for role parsing, authentication guards, and redirects.
- **Security Rule**: Never store access tokens, refresh tokens, or user passwords in `localStorage` or `sessionStorage`.

---

# 12. Code Style, Imports & Naming Conventions

## 12.1. File Naming

```
Components:      TutorCard.tsx, MessageContextMenu.tsx
Hooks:           useTutorListQuery.ts, useAuth.ts
Stores:          auth.store.ts, chat.store.ts
APIs/Services:   tutor.api.ts, booking.service.ts
Schemas:         login.schema.ts, tutor-profile.schema.ts
Types:           tutor.types.ts, auth.types.ts
Utils:           formatCurrency.ts, formatDate.ts
```

> **Prohibited Generic Names**: Never name files `helpers.ts`, `utils.ts`, `common.ts`, `temp.ts`, or `new.ts`.

## 12.2. Import Ordering

Organize imports cleanly in this order:
```ts
// 1. React & Framework
import React, { useState } from "react";
import Link from "next/link";

// 2. Third-Party Libraries
import { useQuery } from "@tanstack/react-query";
import { CheckCircle } from "@phosphor-icons/react";

// 3. Monorepo Packages
import { Button } from "@workspace/ui/button";
import { apiClient } from "@workspace/core/apiClient";

// 4. Feature & Local Absolute Imports
import { tutorService } from "@/features/tutors/services/tutor.service";

// 5. Types
import type { TutorSummary } from "@/features/tutors/types/tutor.types";

// 6. Styles (if any)
```

---

# 13. Logging, Performance & Accessibility

- **No Debugging Artifacts**: Never commit `console.log()`, `console.error()`, or `debugger` statements.
- **Performance**: Use dynamic imports (`next/dynamic`) for heavy interactive modals and charts. Optimize all images via `next/image`.
- **Accessibility**: All buttons must be `<button>` elements, all links must be `<a>` / `<Link>` elements. Ensure appropriate `aria-label`, keyboard navigation, and semantic HTML5 hierarchy (`<h1>` to `<h6>`).

---

# 14. Git Rules

### Branch Naming
- `feature/[feature-name]` (e.g., `feature/tutor-registration`)
- `fix/[bug-description]` (e.g., `fix/avatar-upload`)
- `refactor/[module-name]` (e.g., `refactor/auth-api`)
- `hotfix/[urgent-fix]` (e.g., `hotfix/session-expiry`)

### Commit Convention
```
feat(tutor): add paginated tutor list with filter bar
fix(auth): handle token refresh expiration on proxy
refactor(ui): update action chip button styling
```

---

# 15. Agent Development Workflow (Step-by-Step)

Every agent executing a task must follow these steps:

### Step 1: Understand & Plan
- Identify affected applications, shared packages, and reusable components/hooks.
- Verify API contract and state management needs before writing code.

### Step 2: Determine File Locations
- Shared UI → `packages/ui`
- Shared logic / API client → `packages/core`
- App-specific feature → `apps/[app]/features/[feature-name]`
- App routing / composition → `apps/[app]/app/`

### Step 3: Track Task Progress
- Update `.agents/implement-task.md` with status (`[ ] Todo`, `[/] In Progress`, `[x] Done`).

### Step 4: Implement Clean Code
- Follow the 3-layer architecture (Component → Hook → Service).
- Enforce strict TypeScript, Zod validation, and BeeWise UI standards.

### Step 5: Self-Review
- Eliminate dead code, unused imports, `console.log`, and commented-out code.
- Verify that component length is within limits (150-200 lines recommended, max 300 lines).

### Step 6: Final Validation
- Ensure project compiles without TypeScript or ESLint errors.

---

# 16. Terminal Requirement

> **Required Terminal:** Git Bash

All project commands and scripts must be compatible with **Git Bash (Bash shell)**.

- Always run commands with standard Bash syntax (`mkdir -p`, `rm -rf`, `cp -r`, `mv`).
- Do **not** use PowerShell cmdlets (`New-Item`, `Remove-Item`, `Copy-Item`).
- If running commands in VS Code, ensure the terminal profile is set to **Git Bash**.

---

# 17. Definition of Done

A task is considered complete only if:
- [ ] Feature works completely and matches all functional requirements.
- [ ] UI follows BeeWise Soft-Modern / Glassmorphism design and Anti-Slop button rules.
- [ ] Architecture separates Dumb UI, Custom Hooks, and API Services.
- [ ] Strict TypeScript passes without errors (zero `any`, zero `@ts-ignore`).
- [ ] ESLint passes without warnings or errors.
- [ ] TanStack Query keys and cache invalidation are properly structured.
- [ ] All UI states (Loading, Empty, Error, Success) are gracefully handled.
- [ ] No `console.log` or temporary debug code remains.
- [ ] Responsive across mobile, tablet, and desktop breakpoints.
- [ ] Task progress updated in `.agents/implement-task.md`.

---

# 18. Core Development Philosophy

Every contribution should make the BeeWise codebase:
- **Easier to understand**
- **Easier to extend**
- **Easier to maintain**
- **More type-safe & resilient**
- **More performant & consistent**

When multiple technical solutions exist, **choose the simplest, most maintainable, and most architecturally consistent solution**.

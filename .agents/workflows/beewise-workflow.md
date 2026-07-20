---
description: This document provides the workflow and mandatory standards for Agents working on the BeeWise TutorCommunity FE project.
---

# BeeWise Project Workflow & Development Guidelines

This document defines the mandatory workflow, coding standards, and development conventions for every AI Agent contributing to the **BeeWise TutorCommunity Frontend** project.

---

# 1. Project Overview

BeeWise is built using:

- Turborepo
- Next.js 16 (App Router)
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS v4
- TanStack Query
- Zustand
- React Hook Form
- Zod

The project follows a **Feature-Based Architecture** with a shared package system.

Every implementation should prioritize:

- Reusability
- Scalability
- Readability
- Maintainability
- Type Safety
- Performance

---

# 2. Monorepo Structure

```
apps/
    lms/
    sale/
    staff/

packages/
    core/
    ui/

.agents/
```

## apps/

Each application is completely isolated.

Each app contains:

```
app/
features/
components/
hooks/
types/
utils/
```

### Rules

- Never place business logic inside `app/`.
- Pages should only compose UI and call feature modules.
- Every business feature belongs inside `features/`.
- Do not import files across different apps.
- Shared code must be moved into packages.

---

## packages/core

Contains all reusable business logic.

Examples

- API Client
- API Hooks
- Authentication
- Types
- Constants
- Helpers
- Validation Schemas
- Zustand Stores
- Shared Business Logic

Never place UI components here.

---

## packages/ui

Contains reusable UI.

Examples

- Buttons
- Inputs
- Dialogs
- Cards
- Tables
- Layout Components
- Loading Components
- Empty States

Only presentation logic belongs here.

No business logic.

---

# 3. Feature Architecture

Every feature should follow this structure.

```
features/
    auth/
        api/
        components/
        hooks/
        schemas/
        services/
        types/
        utils/
        index.ts
```

If a folder is unnecessary, do not create it.

Avoid folders with only one file unless they improve clarity.

---

# 4. Development Workflow

Every task must follow these steps.

## Step 1

Understand the requirement.

Before coding:

- identify affected apps
- identify reusable logic
- identify reusable UI
- identify API changes

Never start coding immediately.

---

## Step 2

Find the correct location.

Decision tree:

Shared UI?

→ packages/ui

Shared API logic?

→ packages/core

App-specific feature?

→ apps/[app]/features

App page?

→ app/

---

## Step 3

Read task document.

```
.agents/implement-task.md
```

Update status.

```
[ ] Todo
[/] In Progress
[x] Done
```

---

## Step 4

Implement.

Follow all project conventions.

---

## Step 5

Self Review.

Before finishing:

- remove dead code
- remove console.log
- remove commented code
- simplify duplicated logic
- check naming
- verify types

---

## Step 6

Final Validation.

Must pass:

- Typescript
- ESLint
- Build
- Dev server

---

# 5. Code Style

## TypeScript

Always:

- strict typing
- explicit interfaces
- avoid `any`
- prefer `unknown`
- use type inference only when obvious

Bad

```ts
const data: any;
```

Good

```ts
interface User {}
```

---

## Naming

Components

```
TutorCard.tsx
```

Hooks

```
useLogin.ts
```

Store

```
auth.store.ts
```

API

```
auth.api.ts
```

Schema

```
login.schema.ts
```

Types

```
auth.types.ts
```

Utils

```
formatDate.ts
```

Never use:

```
helpers.ts
utils.ts
common.ts
temp.ts
new.ts
```

These names are too generic.

---

# 6. Import Rules

Import order:

```ts
// React

// Third-party libraries

// Packages

// Local absolute imports

// Relative imports

// Types

// CSS
```

Always remove unused imports.

Never use circular imports.

Use barrel exports only when appropriate.

---

# 7. Component Rules

Prefer:

Small components.

One responsibility.

Avoid components longer than **300 lines**.

If a component grows too much:

Split it.

---

Prefer composition over inheritance.

Example

Good

```
<Card>
    <CardHeader />
    <CardBody />
</Card>
```

Not

```
MegaCard
```

---

# 8. React Rules

Prefer

- Server Components

Use Client Components only when necessary.

Examples

- useState
- useEffect
- animation
- browser APIs

Never add `"use client"` unless required.

---

Avoid unnecessary re-renders.

Use

- memo
- useMemo
- useCallback

only when profiling shows benefit.

Do not prematurely optimize.

---

# 9. API Rules

All API requests must use

```
packages/core/apiClient
```

Never call axios directly inside features.

Always:

- typed request
- typed response
- centralized error handling

Authentication:

- Cookie-based
- HttpOnly
- withCredentials: true

Never store tokens in:

- LocalStorage
- SessionStorage

---

# 10. TanStack Query Rules

Server State only.

Do not use Zustand for server data.

Naming:

```
useTutorList()

useTutorDetail()

useLoginMutation()
```

Always define:

- queryKey
- staleTime
- enabled (when needed)

Mutations should invalidate related queries.

---

# 11. Zustand Rules

Only for

- UI State
- Authentication State
- Global Preferences

Never store fetched server data inside Zustand.

---

# 12. Form Rules

Use

React Hook Form

-

Zod

Validation belongs inside

```
schemas/
```

Never validate forms manually.

---

# 13. Styling Rules

Only use

Tailwind CSS v4

Avoid custom CSS.

Avoid inline styles.

Reuse utility classes.

If styles become repetitive:

Create reusable UI components.

---

# 14. Design System

Primary

```
#280F91
```

Secondary

```
#447353
```

Accent

```
#FFC500
```

Background

```
#CFE1FA
```

UI Principles

- Glassmorphism for Hero, AI, KPI Cards, Dialogs
- Flat UI for standard components
- Consistent spacing
- Consistent radius
- Consistent shadows

---

# 15. Icons

Only use

```
@phosphor-icons/react
```

Server Components

```
@phosphor-icons/react/dist/ssr
```

---

# 16. Animation

Only use

```
motion/react
```

Animation belongs only inside Client Components.

Avoid excessive animation.

---

# 17. Authentication

Cookie Authentication.

Every new app must include:

- rewrites()
- proxy.ts

Responsibilities:

- role parsing
- authentication
- authorization
- redirects

Never duplicate auth logic.

---

# 18. Error Handling

Every async function must handle errors.

Never swallow exceptions.

Always return meaningful errors.

User-facing errors should be friendly.

Developer errors should remain descriptive.

---

# 19. Logging

Development only.

Never commit:

```
console.log()

debugger
```

---

# 20. Performance

Avoid

- unnecessary Client Components
- unnecessary Context Providers
- duplicate API calls
- large bundles

Prefer

- lazy loading
- dynamic imports
- server rendering
- image optimization

---

# 21. Accessibility

Always include

- aria-label
- keyboard support
- semantic HTML

Buttons must be buttons.

Links must be links.

---

# 22. Git Rules

Branch naming

```
feature/login

feature/payment

fix/profile

hotfix/api

refactor/auth
```

Commit convention

```
feat:

fix:

refactor:

style:

docs:

test:

chore:
```

Example

```
feat(auth): implement login flow

fix(profile): resolve avatar upload issue
```

---

# 23. Documentation

Every reusable function should include concise JSDoc if its purpose is not immediately obvious.

Complex logic should explain **why**, not **what**.

Avoid unnecessary comments.

Bad

```ts
// increment i
i++;
```

Good

```ts
// Retry once because backend may still be generating tutor embeddings.
```

---

# 24. Agent Rules

Before generating code:

- Understand the entire feature.
- Search for existing implementations.
- Reuse before creating new code.
- Keep architecture consistent.
- Never duplicate business logic.
- Never introduce breaking changes.
- Keep changes minimal and isolated.

If uncertain:

Stop and analyze the existing project structure before implementing.

## Terminal Requirement

> **Required Terminal:** Git Bash

All commands, scripts, and examples in this project are written for **Git Bash (Bash shell)**. Every command executed by the agent must be compatible with Bash.

### Rules

- Always use **Git Bash** when running project commands.
- Do **not** generate or execute commands specific to **PowerShell** or **Command Prompt**.
- Use standard Bash syntax and utilities.

### Examples

Correct (Git Bash)

```bash
mkdir -p packages/core/src
rm -rf node_modules
cp -r source destination
mv old-name new-name
```

Incorrect (PowerShell)

```powershell
New-Item -ItemType Directory
Remove-Item -Recurse -Force
Copy-Item
Move-Item
```

### Notes

- If the current terminal is **PowerShell** or **Command Prompt**, switch to **Git Bash** before executing any commands.
- In VS Code:
  - **Terminal → New Terminal → Git Bash**
- If a command fails because it is being run in PowerShell (e.g. `mkdir -p`, `rm -rf`, `cp`, `mv`), reopen the terminal using **Git Bash** and run the command again.

---

# 25. Definition of Done

A task is considered complete only if:

- Feature works correctly.
- TypeScript passes.
- ESLint passes.
- Build succeeds.
- No console logs.
- No commented-out code.
- Responsive on desktop and mobile.
- Reusable logic extracted when appropriate.
- UI follows the design system.
- Task status updated in `.agents/implement-task.md`.
- No impact on the Turborepo configuration.
- No unnecessary dependencies introduced.
- Existing functionality remains unaffected.
- Code has been self-reviewed.

---

# 26. Core Development Philosophy

Every contribution should make the project:

- Easier to understand
- Easier to extend
- Easier to maintain
- More reusable
- More type-safe
- More performant
- More consistent

When multiple solutions exist:

Choose the one that is simplest, most maintainable, and most aligned with the existing architecture rather than the cleverest.

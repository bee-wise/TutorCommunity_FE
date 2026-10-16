<!-- BEGIN:user-request-scope -->

# SCOPE OF WORK ACCORDING TO USER REQUEST

- Strictly execute only what is explicitly requested by the user. Only modify the files and code directly necessary to complete that request; do not expand scope, refactor, or "clean up" other parts on your own.
- If bugs or issues outside the requested scope are detected, only notify the user of their location and impact; do not fix them without a separate explicit request from the user.
- Do not modify task tracking files, documentation, configuration, formatting, or existing changes made by others unless the current request directly involves them. Inspection steps should only read and report out-of-scope issues.
- If an out-of-scope change is genuinely necessary to fulfill the request, explain the dependency and ask the user for confirmation before proceeding.

<!-- END:user-request-scope -->

<!-- BEGIN:beewise-core-rules -->

# MANDATORY BEEWISE DEVELOPMENT STANDARDS & AGENT WORKFLOW

All AI Agents working in this repository **MUST** strictly adhere to the following principles across ALL prompts:

1. **SINGLE SOURCE OF TRUTH**:
   - All Monorepo architectural standards, state management, 10-step API integration flow, layer separation (Dumb Component ➔ Smart Hook ➔ Service), and Definition of Done are located at: [.agents/workflows/beewise-workflow.md](file:///d:/FPTUNI/MECODE/MyProject/BeeWise/TutorCommunity_FE/.agents/workflows/beewise-workflow.md).
   - Before creating new code or modifying existing code, the Agent must read and cross-reference with the workflow above.

2. **CLEAN ARCHITECTURE & SEPARATION OF CONCERNS**:
   - **App Router (`app/`)**: Used exclusively for routing and page composition. Strictly no business logic, complex state, or direct API calls inside `app/`.
   - **Feature Modules (`features/[name]/`)**: All domain logic belongs inside feature modules.
   - **Dumb UI vs Smart Logic**: Separate UI Components (`components/`), Business Hooks (`hooks/`), and API/Services (`api/` or `services/`). Components should not exceed 150-200 lines (maximum 300 lines).
   - **Zero `any`**: Strict TypeScript; use Zod schemas to validate forms and external inputs.
   - Mandatory use of `z.guid()` when validating UUID fields.

3. **STATE MANAGEMENT & API INTEGRATION**:
   - **Server State**: TanStack Query (`useQuery`, `useMutation`) is mandatory; centralize query keys, and automatically invalidate caches after mutations. Do not store server data in Zustand.
   - **Global UI State**: Use Zustand only for Auth session, global notification queue, and theme/settings.
   - **API Client**: Calls must go through `apiClient` from `@workspace/core/apiClient` with `withCredentials: true`. Direct calls to `axios` within components are forbidden.

4. **TERMINAL REQUIREMENT**:
   - Must use **PowerShell** when executing commands in the project.
   - Use PowerShell syntax and cmdlets (`New-Item`, `Remove-Item`, `Copy-Item`); do not use Git Bash or Bash syntax.

<!-- END:beewise-core-rules -->

<!-- BEGIN:nextjs-agent-rules -->

# NEXT.JS 16 & REACT 19 RULES

- Default to **Server Components** (`.tsx` without `'use client'`).
- Only add `'use client'` to innermost interactive leaf nodes (components using hooks, event listeners, animations).

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:beewise-ui-standards -->

# MANDATORY BEEWISE UI & ANTI-SLOP STANDARDS

When developing or modifying ANY user interface, button, form, chip, badge, card, or table across the ENTIRE BeeWise system (`apps/sale`, `apps/lms`, `apps/staff`, `apps/admin`):

1. **GOLDEN UI BENCHMARK & DESIGN SYSTEM**: Always follow the visual design standards at [.agents/skills/design-taste-frontend/references/beewise-ui-standards.html](file:///d:/FPTUNI/MECODE/MyProject/BeeWise/TutorCommunity_FE/.agents/skills/design-taste-frontend/references/beewise-ui-standards.html) and the comprehensive design guidelines at [.agents/skills/design-taste-frontend/SKILL.md](file:///d:/FPTUNI/MECODE/MyProject/BeeWise/TutorCommunity_FE/.agents/skills/design-taste-frontend/SKILL.md) (applies to Landing, Marketplace, LMS Workspaces, and Staff/Admin Dashboards). For `apps/lms`, additionally apply the specialized rules in item 7 below.

2. **ICON USAGE STANDARDS**:
   - **Prioritize Heroicons (`@heroicons/react`)** as the primary icon library for all UI components, buttons, navigation, badges, cards, tables, and status indicators.
   - Mandatory imports using exact subpaths matching size and style:
     - 24x24 Outline: `@heroicons/react/24/outline` (default for buttons, menus, cards, standard actions)
     - 24x24 Solid: `@heroicons/react/24/solid` (for active/filled state, ratings, high-emphasis)
     - 20x20 Mini Solid: `@heroicons/react/20/solid` (for input icons, dropdown select, compact buttons)
     - 16x16 Micro: `@heroicons/react/16/solid` (for badges, action chips, tags)
   - Ensure consistency in sizing and style across the screen (coherent stroke vs. solid usage).
3. **FORBIDDEN BUTTON / ACTION PATTERNS**:
   - **STRICTLY PROHIBITED** to create bare underlined text buttons/action links (`hover:underline`, `underline`) accompanied by crude arrow icons (e.g., `← Change email`, `← Back`).
   - All interactive buttons and action chips must be:
     - **Action Chips / Badges**: Encapsulated within a container (`rounded-xl border bg-muted/40 px-3.5 py-2.5`) with a refined chip/badge button (`rounded-lg border bg-background px-2.5 py-1 text-xs font-bold hover:bg-muted active:scale-95`).
     - **Standard Button Variants**: Use standard Button components from `@workspace/ui` (`variant="default" | "accent" | "secondary" | "outline" | "ghost" | "destructive"`).
     - **Interactive Text Links**: Use `transition-colors hover:text-primary/80` (DO NOT use `hover:underline` except for legal policy text).
4. **MANDATORY MICRO-INTERACTIONS**: Every interactive button must feature `active:scale-[0.98]` or `active:scale-95`, `transition-all`, and smooth rounded corner effects in line with BeeWise's Soft-Modern Edutech design philosophy.
5. **FORBIDDEN REDUNDANT SUBTITLE PARAGRAPHS**: STRICTLY PROHIBITED to automatically generate boilerplate, hollow description paragraphs that merely reiterate heading text (`<p className="text-sm text-muted-foreground">...</p>`) under `h1`, `h2`, and page headers. By default, keep headers clean and concise; ONLY add description copy when it provides essential operational guidance or genuinely helpful warnings.
6. **FORBIDDEN NATIVE TRIANGLE DISCLOSURE (<details><summary> / ▶)**: STRICTLY FORBIDDEN to use default browser `<details><summary>` tags that expose crude black triangle glyphs (`▶`). All content expand/collapse features must use `DisclosureCard`, `Collapsible` from `@workspace/ui/components/ui/collapsible`, or `Accordion` from `@workspace/ui/components/ui/accordion`.
7. **LMS-SPECIFIC DESIGN SKILL**: When creating or modifying interfaces in `apps/lms`, you must read [.agents/skills/design-taste-lms/SKILL.md](.agents/skills/design-taste-lms/SKILL.md); for dashboards, navigation shells, course cards, charts, calendars, or assignment areas, also reference [.agents/skills/design-taste-lms/references/lms-dashboard.html](.agents/skills/design-taste-lms/references/lms-dashboard.html). Colors, surfaces, and shadows must adhere to active tokens in `packages/ui/globals.css`; LMS typography, radius, layouts, and motion in that skill take priority over the general visual formulas in item 1. Architectural rules, accessibility, Heroicons, and anti-slop guidelines still apply. Use three-column layouts only for suitable screens; do not force every LMS page into the reference dashboard layout.

<!-- END:beewise-ui-standards -->

<!-- BEGIN:codegraph-rules -->

## CodeGraph – Codebase Intelligence Rules

Before implementing, refactoring, or modifying existing code:

1. Use CodeGraph MCP to locate relevant symbols, modules, and dependencies.
2. Identify the callers, callees, imports, and usages of affected components or functions.
3. Analyze the potential impact of modifications, especially on shared components, services, hooks, and API contracts.
4. Read the actual source code to verify findings before making changes.
5. Prefer existing architectural patterns and reusable components.
6. After implementation, verify impacted dependencies and run relevant tests.

### Rules

- Do not modify shared components without checking their usages.
- Do not assume a dependency exists solely because of naming conventions.
- Do not introduce duplicate logic when an equivalent implementation already exists.
- Do not change business logic or API contracts without explicit requirements.
- Treat CodeGraph as an analysis tool, not as the source of truth for business requirements.
- If CodeGraph is unavailable or its index is outdated, fall back to repository search and direct code inspection.

### Expected Behavior

Use CodeGraph for targeted code discovery and impact analysis. Avoid unnecessary graph queries for trivial or isolated changes.

<!-- END:codegraph-rules -->

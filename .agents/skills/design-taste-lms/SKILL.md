---
name: design-taste-lms
description: Component standard and layout language for BeeWise LMS screens in apps/lms (shell, nav, buttons, fields, badges, cards, tables, chart, mini calendar, data states, overlays). Use with .agents/design-system.md for LMS UI work; not for sale or staff.
---

# BeeWise LMS components

Tokens and global rules come from [`.agents/design-system.md`](../../design-system.md). This skill adds the LMS component standard. Read only the reference files your task needs; copy their TSX/Tailwind snippets.

## Rules

- Scope LMS styling to `apps/lms` (`.lms-workspace` in `features/lms-workspace/styles/lms-workspace.css`). Do not change `packages/ui` tokens for an LMS look.
- Canvas `bg-muted`; white `bg-card` cards, `rounded-[var(--radius-card)]`, `shadow-soft`, hover `shadow-soft-hover`. Large panels up to `--radius-panel`. Buttons and selected days 12px (`rounded-lg`); search is a pill.
- Font: Plus Jakarta Sans (set by `.lms-workspace`); headings 700-800, labels 500.
- Only build the requested screen. Forms, lessons, messages and mobile views reuse this language without being forced into the dashboard grid.

## What to read

| Task | Read |
| --- | --- |
| Colors, type scale, radius, shadow, motion, icons | [foundations](references/components/foundations.md) |
| Button, form field, select, search, checkbox/radio/switch | [actions-inputs](references/components/actions-inputs.md) |
| Status badge, card, stat, course/join card, session/list row, table, progress, avatar, bar chart, date selector | [display](references/components/display.md) |
| Sidebar nav, tabs, breadcrumb, pagination | [navigation](references/components/navigation.md) |
| Empty/loading/error states, alert, toast, dialog, sheet, menu, tooltip, accordion | [feedback-overlays](references/components/feedback-overlays.md) |
| Page/section header, dashboard shell and rails | [layout](references/components/layout.md) |

A typical screen needs 2-3 files, e.g. a list page = `display` + `feedback-overlays` + `layout`. [`references/lms-components.html`](references/lms-components.html) is a visual preview for people only; do not read it or copy its CSS.

When you change a component rule, edit its `.md` file; update the HTML preview only if the visual changed.

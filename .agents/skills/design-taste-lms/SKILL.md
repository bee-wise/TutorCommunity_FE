---
name: design-taste-lms
description: Design or revise BeeWise LMS screens in apps/lms using BeeWise platform color tokens, Plus Jakarta Sans, the LMS layout language, and its HTML reference. Use for LMS UI work; do not apply to sale, staff, or admin.
---

# BeeWise LMS design language

Use this skill for visual work in `apps/lms`. Read [the dashboard reference](references/lms-dashboard.html) when designing an LMS dashboard, navigation shell, course card, chart, calendar, or assignment area. The HTML is a visual and interaction reference, not production markup to paste into Next.js.

The user supplied a 1440 × 900 three-pane dashboard brief and screenshot. Use the screenshot for its airy hierarchy, compact navigation, stacked stats, course cards, and activity rail. The palette now follows `packages/ui/globals.css`; do not retain the brief's earlier blue, orange, pink, or purple hex values. Do not copy the screenshot's sample data or force dashboard widgets into unrelated LMS tasks.

## Scope and precedence

- For `apps/lms` visual decisions, use the live color tokens and soft shadows in `packages/ui/globals.css`. This skill's typography, radius, layout, and motion take precedence over conflicting visual recipes in `design-taste-frontend` and its showcase. Continue to follow the repository workflow, architecture, accessibility, Heroicons, button/action rules, and other universal AGENTS.md requirements.
- Keep LMS styles scoped to `apps/lms` or its components. Do not change global tokens in `packages/ui` solely to realize this look.
- Build only the requested screen or component. A form, lesson view, message screen, or mobile view should use the same visual language without being forced into a three-column dashboard.

## Tokens and hierarchy

| Role | Value |
| --- | --- |
| Font | Plus Jakarta Sans throughout; headings 700–800, labels 500 |
| Main canvas / cards / hairline | `--muted` `#f0f4ff` / `--card` `#ffffff` / `--border` `#dce8fb` |
| Primary / muted text | `--foreground` `#0c0c0b` / `--muted-foreground` `#5a6a9a` |
| Primary blue | `--primary` `#162cd4`; foreground `#ffffff` |
| Secondary green | `--secondary` `#32cd32`; foreground `#ffffff` |
| Accent yellow | `--accent` `#ffc500`; foreground `#0c0c0b` |
| Highlight / warning | `--highlight` `#fadc76` / `--warning` `#905b0f` |
| Chart categories | Primary blue, secondary green, and accent yellow; subdued bars use `--border` |
| Radius | Cards 24px, large panels up to 32px, buttons and selected days 12px, search full pill |
| Elevation | Cards: `--bw-shadow-soft`; hovered cards: `--bw-shadow-soft-hover`; active primary CTA: restrained primary-tinted shadow |

Read the current `:root` tokens before implementing a screen and use semantic Tailwind classes or CSS variables so later platform palette changes flow into LMS. The HTML reference freezes the current token values only for standalone viewing. Use color for meaning and focus, not as a stripe on one edge of a card. Navigation's active indicator is a small rounded vertical pill beside the selected item; it is the one intentional exception to the no one-sided accent-border rule. Keep white cards spacious and avoid stacking containers without a clear hierarchy. Do not add decorative subtitle paragraphs beneath headings.

## Dashboard composition

- At the 1440px reference width, use a 256px white left rail, a flexible gray main panel with 32px padding, and a 320px white right rail. Hairline dividers separate the rails. The 900px mockup scrolls within panels; production layouts must also work at other viewport heights and collapse to usable narrower layouts.
- Left rail: compact logo with two circular glyphs, accent-tinted organization selector, 12px-padded navigation, and a soft primary-to-muted promo surface near the bottom. Selected navigation has primary text, soft fill, and the vertical pill.
- Main panel: bold greeting and white pill search, a vertical stack of icon-left stats beside a larger learning-time chart, a three-column course grid, then a full-width assignment table. Keep headings and controls aligned. On smaller widths, reorder these into a readable single column rather than shrinking cards excessively.
- Right rail: profile, horizontally selectable dates, upcoming classes, and todos. The brief's 300px circular profile image can be used on a profile-focused view; in the dashboard rail, scale it to fit the 320px column and preserve space for schedule content. Avoid stretching a portrait or letting it displace actionable items.

## Named components

- **Learning-time chart:** CSS bars with 12px top corners, blue/green/yellow category colors from the platform tokens, and `ease-in-out` height transitions. A selected bar may show a white floating value card with an emoji only if this particular chart calls for that playful cue. Hover/focus reveals a `--foreground` tooltip with duration. Provide text labels and a table/list alternative for screen readers; never rely on bar color alone.
- **Course joining card:** 24px surface tinted from `--accent` with a low-opacity organic accent SVG decoration. The white join-code input wrapper holds an accent CTA with dark text at its right edge. Keep the decoration behind content and label the input.
- **Mini calendar:** horizontal day selector with muted default dates. The active day uses `--primary`, white text, 12px radius, a 4px upward offset, and soft primary shadow. Use real buttons with keyboard focus and `aria-pressed` or equivalent selection semantics.

## Interaction and implementation

- Hoverable cards may lift slightly with soft shadow. Buttons and action chips use the repository's standard `@workspace/ui` variants where possible, plus `transition-all duration-300` and `active:scale-[0.98]` or `active:scale-95`. Chart heights use `ease-in-out`; respect reduced-motion preferences.
- Prefer Heroicons with the prescribed subpaths in AGENTS.md. Decorative SVGs are allowed for the course card, but do not hand-draw replacement UI icons.
- Keep contrast, focus visibility, loading/empty/error states, and touch targets usable. Use actual data and existing app behavior rather than hardcoded showcase content when implementing a screen.
- Follow `.agents/workflows/beewise-workflow.md` for architecture and data flow. This skill governs appearance, not API or state management.

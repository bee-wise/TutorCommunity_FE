# BeeWise design system

Single source of truth for UI work in `apps/sale`, `apps/lms`, `apps/staff`. Token values live in `packages/ui/globals.css`; this file explains roles and rules. If the two disagree, `globals.css` wins: update this file, never hardcode a different value.

## 1. Color tokens (light theme only; there is no dark theme)

Use semantic Tailwind classes (`bg-primary`, `text-muted-foreground`, `border-border`) or `var(--token)`. Never hardcode hex in components.

| Token | Value | Role |
| --- | --- | --- |
| `primary` / `primary-foreground` | `#162cd4` / `#ffffff` | Main CTA, active/selected state, links, headings emphasis |
| `accent` / `accent-foreground` | `#ffc500` / `#0c0c0b` | Brand amber: ratings, promo, highlights. Always dark text on it |
| `secondary` / `secondary-foreground` | `#32cd32` / `#ffffff` | Verified / success only |
| `highlight` | `#fadc76` | Flat marker highlight behind dark text |
| `warning` | `#905b0f` | Warning text/icon |
| `error` | `#e1aba7` | Soft error fill/border |
| `destructive` / `destructive-foreground` | `#dc2626` / `#ffffff` | Error text on white, destructive actions |
| `background`, `card`, `popover` (+ `-foreground`) | `#ffffff` / `#0c0c0b` | Opaque surfaces and body text |
| `muted` / `muted-foreground` | `#f0f4ff` / `#5a6a9a` | Canvas/quiet fill / secondary text |
| `border`, `input` | `#dce8fb` | Dividers, card and field borders |
| `ring` | `#280f91` | Focus ring |
| `glass` | legacy | Do not use in new UI |
| `sidebar-*` | shadcn defaults | Only inside `@workspace/ui` sidebar |

Roles are fixed: primary = action, accent = reward/highlight, secondary = verified/success. No green CTA, no blue star. Do not add new colors; get depth from radius, elevation and solid color blocks. No translucent primary wash (`bg-primary/5..10`) as the fill of buttons, badges, cards or inputs.

**Legacy hex to replace when you touch a file** (do not mass-refactor unasked): `#447353` → `secondary`, `#0c0c0b` → `foreground`, `#280F91` → `ring`, `#ffc500` → `accent`, `#905b0f` → `warning`, `#fadc76` → `highlight`, `#dce8fb`/`#dce7f7`/`#e8edf5` → `border`, `#f0f4ff`/`#f8faff`/`#f7f9fd` → `muted`, `#5a6a9a`/`#667085`/`#716c83` → `muted-foreground`.

## 2. Shape, elevation, motion

| Token / class | Value | Use |
| --- | --- | --- |
| `--radius` (`rounded-lg`) | 12px | Existing components, LMS buttons. Do not change |
| `--radius-card` (`rounded-[var(--radius-card)]` or `rounded-3xl`) | 24px | Cards |
| `--radius-panel` (`rounded-[var(--radius-panel)]`) | 32px | Large panels, hero/CTA blocks |
| `rounded-2xl` | 16px | Inputs, selects, textareas |
| `rounded-full` | pill | Sale buttons, chips, badges, search |
| `shadow-soft` / `shadow-soft-hover` | 2-layer, primary-tinted | Cards / hovered cards |
| `shadow-pop` | 2-layer, neutral | Menus, popovers, floating chips, modals |
| `--ease-soft` | `cubic-bezier(0.16,1,0.3,1)` | Default easing |

- Surfaces are opaque: fill + visible `border-border` + soft shadow. No glass, no `backdrop-blur` on content, no glows, no gradient text, no shadow blur > 48px.
- Hover card: `-translate-y-1` + `shadow-soft-hover`. Press: `active:scale-[0.98]`. Respect `prefers-reduced-motion`. `motion/react` only in Client Components, only for purposeful motion.

## 3. Typography

- Sale / staff: headings Nunito 800 (`font-nunito`, applied to h1-h6 globally), body Google Sans (`font-sans`). Fonts come from `packages/core/configs/fonts.ts`.
- LMS: Plus Jakarta Sans via `.lms-workspace` in `apps/lms/features/lms-workspace/styles/lms-workspace.css` (overrides the font variables). Do not add other typefaces.
- h1 is always `primary` (base rule in `globals.css`). Use `text-primary` or no color class on h1; never `text-foreground` or hex. Only exception: h1 on a dark/primary surface uses `text-primary-foreground`. h2-h6 stay `foreground`.
- Vietnamese: headline `leading-[1.15]` minimum (diacritics clip otherwise). Prices in VND (`450.000đ`), numbers `tabular-nums`.

## 4. Component rules

- Icons: Heroicons only in new code: `@heroicons/react/24/outline` by default, `20/solid` for small/filled. 16-18px inside buttons, 32-36px icon tiles. No upward/diagonal-up arrows; use `ArrowRightIcon`, `ChevronDownIcon`. Never hand-draw icon SVGs. Too many actions → one overflow menu (labelled, 44px target).
- Buttons: use `Button` from `@workspace/ui/components/ui/button` (`default`, `outline`, `ghost`, `secondary`, `destructive`). No bare underlined text links with arrows for actions (`← Quay lại`); use a ghost/outline button or a chip (`rounded-lg border bg-background px-2.5 py-1 text-xs font-bold hover:bg-muted active:scale-95`). `hover:underline` only for legal links.
- Headings: no decorative subtitle paragraph under h1/h2. Add a description only if it carries instructions, a warning, or business context the heading cannot.
- Checkbox: never a raw native checkbox; hide input with `sr-only`, render `size-5 rounded-md border-2 border-border`, checked `bg-primary border-primary text-primary-foreground`.
- Disclosure: never `<details><summary>`. Use `Collapsible` / `Accordion` from `@workspace/ui/components/ui/*` with `ChevronDownIcon` rotating 180°.
- Cards: design from the one question/action the card serves. Primary object strongest, status reads as status, critical info prominent, metadata subordinate, at most one primary CTA. Same entity type keeps the same hierarchy. Do not invent extra stats, badges or actions.
- Cards: never add a decorative accent edge/stripe (for example `<span className="absolute inset-y-0 left-0 w-1.5 bg-accent" aria-hidden="true" />`, or a `border-l-4` colored side bar). Express emphasis with the badge, icon tile, typography or `border-border` + shadow instead.
- Every data view handles loading (skeleton matching shape), empty (`empty-state`), error/retry, success. Accessible: semantic elements, visible focus ring, keyboard support, labels, 44px touch targets, contrast 4.5:1.
- Emoji and fake sample data ("Jane Doe", lorem) are not allowed in shipped UI.

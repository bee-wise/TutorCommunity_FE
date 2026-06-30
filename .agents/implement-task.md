# BeeWise TutorCommunity FE — Implementation Task Log

> Track mọi task đã và đang làm. Cập nhật file này sau mỗi session.
> Status: `[ ]` todo · `[/]` in progress · `[x]` done

---

## Session 1 — 2026-06-30 (DONE)

### Landing Page (Guest Route `/`)

- [x] Install `motion` library
- [x] Create `.agents/implement-task.md` (this file)
- [x] Create `src/components/layout/Header.tsx` (reusable, sticky nav, 64px)
- [x] Create `src/components/layout/MobileNav.tsx` (client island, hamburger)
- [x] Create `src/components/layout/Footer.tsx` (reusable, #280F91 bg)
- [x] Create `src/features/landing/types/index.ts`
- [x] Create `src/features/landing/data/landing.data.ts`
- [x] Create `src/features/landing/components/HeroSection.tsx` (asymmetric split + glass AI search)
- [x] Create `src/features/landing/components/HeroMotion.tsx` (client island)
- [x] Create `src/features/landing/components/PainPointSection.tsx` (2x2 grid)
- [x] Create `src/features/landing/components/SolutionSection.tsx` (bento 4-cell)
- [x] Create `src/features/landing/components/SolutionMotion.tsx` (client island, scroll-reveal)
- [x] Create `src/features/landing/components/HowItWorksSection.tsx` (3-step track)
- [x] Create `src/features/landing/components/TutorSection.tsx` (split-screen, green palette)
- [x] Create `src/features/landing/components/FaqSection.tsx` (client island, accordion)
- [x] Update `app/(guest)/page.tsx` — SEO metadata + thin page composition
- [x] Update `app/layout.tsx` — `lang="vi"`
- [x] Update `app/globals.css` — background token to #CFE1FA
- [x] Build verified: `next build` SUCCESS (TypeScript clean, 0 errors)

### Layout Families Used (7 distinct families, anti-repetition verified)

1. Asymmetric split hero (Hero)
2. 2x2 grid (Pain Points)
3. Bento 4-cell varied bg (Solutions)
4. 3-column step track (How It Works)
5. Split-screen reversed (Tutor)
6. Accordion disclosure (FAQ)
7. Flat branded (Footer)

---

## Backlog (Future Sessions)

- [ ] Authentication flow (Login / Register pages)
- [ ] Tutor listing page (`/tutors`)
- [ ] AI Search feature (`src/features/ai-search/`)
- [ ] Tutor profile detail page
- [ ] Booking / Connect flow
- [ ] Chat room feature (`src/features/chat/`)
- [ ] Tutor registration flow (`/register/tutor`)
- [ ] Admin dashboard
- [ ] LMS module

---

## Architecture Notes

- BeeWise palette locked: Primary `#280F91` · Secondary `#447353` · Accent `#FFC500` · BG `#CFE1FA`
- Glassmorphism ONLY on: Hero AI search box, KPI cards, Modals. All others = flat UI.
- Font: Montserrat ExtraBold headlines (via next/font) · Google Sans body (self-hosted TTF)
- Icon library: `@phosphor-icons/react` — SSR import: `@phosphor-icons/react/dist/ssr`
- State: TanStack Query for server state · Zustand for global UI state
- Forms: React Hook Form + Zod resolver
- `motion` v11+ installed. Import: `motion/react`. Client islands only, never in Server Components.
- Phosphor in Server Components: must import from `/dist/ssr` path, not the main package.

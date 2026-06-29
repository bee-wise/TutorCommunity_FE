---
name: frontend-architecture-logic
description: TypeScript code logic, clean architecture, and state management rules for the frontend. Enforces feature-based structure, strict type safety, separation of concerns, and robust error handling.
---

# Frontend Architecture & TypeScript Logic

This skill defines the rules for writing clean, scalable, and maintainable TypeScript code. It focuses on how data flows, how state is managed, and how files are organized, strictly separating business logic from UI rendering.

---

## 1. FOLDER ARCHITECTURE (Feature-Based)

Do not dump all components into a single `components/` folder. Use a **Feature-based** organization to encapsulate domain logic.

- `src/features/<feature-name>/`: Contains everything specific to a domain (e.g., `chat`, `booking`, `tutor-registration`).
  - `/components`: UI components specific to this feature.
  - `/hooks`: Custom hooks encapsulating business logic.
  - `/services` or `/api`: API fetching logic (axios/fetch wrappers).
  - `/types`: TypeScript interfaces and Zod schemas.
  - `/store`: Zustand stores (if feature-specific global state is needed).
- `src/components/ui/`: Dumb, reusable UI components (Buttons, Inputs, Cards).
- `src/helpers/`: Global utility functions (e.g., formatters, payment helpers).
- `src/configs/`: Configuration files (e.g., environment constants, navigation config).
- `src/sys-libs/`: System-level libraries (e.g., Centrifugo client setup).
- `app/`: Next.js App Router pages (keep these thin, import from `features/`).

---

## 2. STRICT TYPE SAFETY & VALIDATION

- **No `any` or `@ts-ignore`**: Explicitly define types for all variables, props, and API responses.
- **Zod for Validation**: Use `zod` for validating external data (API responses, Form inputs).
  - Define the schema first: `export const BookingSchema = z.object({...})`
  - Derive the type: `export type Booking = z.infer<typeof BookingSchema>`
- **API Response Typing**: Always type API responses. Do not rely on implicit any.

---

## 3. SEPARATION OF CONCERNS (Dumb Components, Smart Hooks)

React components should focus on UI rendering. Business logic must be extracted.

- **Component Rule**: If a component file exceeds 150-200 lines, it's doing too much.
- **Custom Hooks**: Extract complex logic, data fetching, and state transformations into custom hooks (e.g., `useBookSession.ts`, `useChatRoom.ts`).
- **Service Layer**: Never call `fetch` or `axios` directly inside a component. Encapsulate API calls in a service file (e.g., `tutor.service.ts`).

Example Flow:
Component (`Button onClick`) -> Hook (`useSubmitBooking`) -> Service (`bookingService.create`) -> Backend API.

---

## 4. STATE MANAGEMENT

Choose the right tool for the job. Do not overuse global state.

- **Local State (`useState`, `useReducer`)**: For isolated component UI state (toggles, accordions, local filters).
- **Form State**: Use **React Hook Form** combined with **Zod** resolver. Never use controlled `useState` for complex forms (like Tutor Registration).
- **Server State / Data Fetching**: Use **TanStack Query (React Query)** for client-side fetching. It handles caching, loading states, and retries automatically.
- **Global UI/App State**: Use **Zustand** for cross-feature states that React Query doesn't cover (e.g., User Authentication state, active theme, global notification queue).

---

## 5. REAL-TIME & WEBSOCKETS (Centrifugo)

- **Centralized Connection**: Initialize the Centrifugo client once globally (e.g., in a Context Provider or a singleton in `lib/`).
- **Hook Encapsulation**: Expose real-time events via custom hooks like `useCentrifugoSubscription(channel)`.
- **Cleanup**: Always unsubscribe from channels and remove event listeners in the `useEffect` cleanup function to prevent memory leaks.

---

## 6. ERROR HANDLING & RESILIENCE

- **Try/Catch in Services/Hooks**: Catch errors at the boundary.
- **Structured Error Responses**: Standardize how the frontend interprets backend errors (e.g., `message`, `code`).
- **User Feedback**: Use toast notifications (e.g., `sonner` or `react-hot-toast`) to inform the user of failures, not just `console.error`.
- **Error Boundaries**: Wrap major feature sections in React Error Boundaries to prevent the entire app from crashing on a localized failure.

---

## 7. NEXT.JS SPECIFICS (App Router)

- **Server vs. Client Components**: Default to Server Components (`.tsx` files without `'use client'`). Only add `'use client'` at the leaf nodes where interactivity (hooks, state, onClick) is required.
- **Server Actions**: Use Server Actions for simple mutations where optimistic UI isn't heavily required. For complex UX, React Query mutations are preferred.

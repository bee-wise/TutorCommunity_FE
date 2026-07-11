"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { createTutorApprovedState } from "./tutor-approved.fixtures";
import type { AvailabilitySlot, TutorApprovedProfile, TutorApprovedScenario, TutorApprovedState } from "./tutor-approved.types";

type Action =
  | { type: "mark-read"; id: string }
  | { type: "mark-all-read" }
  | { type: "update-draft"; field: keyof TutorApprovedProfile; value: string }
  | { type: "reset-draft" }
  | { type: "submit-profile" }
  | { type: "add-slot"; slot: AvailabilitySlot }
  | { type: "delete-slot"; id: string }
  | { type: "open-renewal" }
  | { type: "close-renewal" }
  | { type: "confirm-renewal" };

function reducer(state: TutorApprovedState, action: Action): TutorApprovedState {
  switch (action.type) {
    case "mark-read":
      return { ...state, notifications: state.notifications.map((item) => item.id === action.id ? { ...item, read: true } : item) };
    case "mark-all-read":
      return { ...state, notifications: state.notifications.map((item) => ({ ...item, read: true })) };
    case "update-draft":
      return { ...state, draftProfile: { ...state.draftProfile, [action.field]: action.value } };
    case "reset-draft":
      return { ...state, draftProfile: { ...state.profile } };
    case "submit-profile":
      return { ...state, profileSubmitted: true };
    case "add-slot":
      return { ...state, availability: [...state.availability, action.slot] };
    case "delete-slot":
      return { ...state, availability: state.availability.filter((slot) => slot.id !== action.id) };
    case "open-renewal":
      return { ...state, renewalOpen: true };
    case "close-renewal":
      return { ...state, renewalOpen: false };
    case "confirm-renewal":
      return { ...state, renewalOpen: false, renewalConfirmed: true };
  }
}

type ContextValue = { state: TutorApprovedState; dispatch: React.Dispatch<Action> };
const Context = createContext<ContextValue | null>(null);

export function TutorApprovedProvider({ children, scenario }: { children: ReactNode; scenario: TutorApprovedScenario }) {
  const initialState = useMemo(() => createTutorApprovedState(scenario), [scenario]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useTutorApproved() {
  const value = useContext(Context);
  if (!value) throw new Error("useTutorApproved must be used inside TutorApprovedProvider");
  return value;
}

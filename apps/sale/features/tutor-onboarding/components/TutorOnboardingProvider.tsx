"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { MeType } from "@workspace/core/types/auth.type";
import { MockTutorOnboardingDataSource } from "../constants/tutor-onboarding.fixtures";
import { applyTutorOnboardingAction } from "../api/tutor-onboarding.api";
import { resolveTutorOnboardingView } from "../schemas/tutor-onboarding.resolver";
import type {
  TutorOnboardingActionId,
  TutorOnboardingDataSource,
  TutorOnboardingMockState,
  TutorOnboardingScenario,
  TutorOnboardingStepId,
} from "../types";

type TutorOnboardingContextValue = {
  state: TutorOnboardingMockState;
  view: ReturnType<typeof resolveTutorOnboardingView>;
  session: ReturnType<TutorOnboardingDataSource["getSession"]>;
  isPreview: boolean;
  dispatchAction: (
    action: TutorOnboardingActionId,
    payload?: { stepId?: TutorOnboardingStepId },
  ) => void;
  reset: () => void;
};

const TutorOnboardingContext =
  createContext<TutorOnboardingContextValue | null>(null);

type ReducerAction =
  | {
      type: "action";
      action: TutorOnboardingActionId;
      payload?: { stepId?: TutorOnboardingStepId };
    }
  | { type: "reset"; state: TutorOnboardingMockState };

function reducer(state: TutorOnboardingMockState, action: ReducerAction) {
  if (action.type === "reset") return action.state;
  return applyTutorOnboardingAction(state, action.action, action.payload);
}

export function TutorOnboardingProvider({
  children,
  scenario,
  dataSource = MockTutorOnboardingDataSource,
  mode = "preview",
  sessionUser,
}: {
  children: ReactNode;
  scenario: TutorOnboardingScenario | "unknown";
  dataSource?: TutorOnboardingDataSource;
  mode?: "preview" | "live";
  sessionUser?: MeType;
}) {
  const initialState = useMemo(
    () => dataSource.getInitialState(scenario),
    [dataSource, scenario],
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const view = useMemo(() => resolveTutorOnboardingView(state), [state]);
  const session = useMemo(() => {
    const base = dataSource.getSession();
    return sessionUser
      ? {
          ...base,
          user: sessionUser,
          tutorProfileId: sessionUser.tutorProfileId ?? "",
          tutorProfileStatus: sessionUser.tutorProfileStatus ?? "",
          canAccessTutorLms: sessionUser.canAccessTutorLms === true,
        }
      : base;
  }, [dataSource, sessionUser]);

  const value = useMemo<TutorOnboardingContextValue>(
    () => ({
      state,
      view,
      session,
      isPreview: mode === "preview",
      dispatchAction: (action, payload) => {
        if (mode === "live" && action !== "switch-journey-detail-step") return;
        dispatch({ type: "action", action, payload });
      },
      reset: () => dispatch({ type: "reset", state: initialState }),
    }),
    [initialState, mode, session, state, view],
  );

  return (
    <TutorOnboardingContext.Provider value={value}>
      {children}
    </TutorOnboardingContext.Provider>
  );
}

export function useTutorOnboardingViewModel() {
  const context = useContext(TutorOnboardingContext);
  if (!context) {
    throw new Error(
      "useTutorOnboardingViewModel must be used inside TutorOnboardingProvider",
    );
  }
  return context;
}

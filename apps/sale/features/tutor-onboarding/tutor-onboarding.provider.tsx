"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { MockTutorOnboardingDataSource } from "./tutor-onboarding.fixtures";
import { applyTutorOnboardingAction } from "./tutor-onboarding.actions";
import { resolveTutorOnboardingView } from "./tutor-onboarding.resolver";
import type {
  TutorOnboardingActionId,
  TutorOnboardingDataSource,
  TutorOnboardingMockState,
  TutorOnboardingScenario,
  TutorOnboardingStepId,
} from "./tutor-onboarding.types";

type TutorOnboardingContextValue = {
  state: TutorOnboardingMockState;
  view: ReturnType<typeof resolveTutorOnboardingView>;
  session: ReturnType<TutorOnboardingDataSource["getSession"]>;
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
}: {
  children: ReactNode;
  scenario: TutorOnboardingScenario | "unknown";
  dataSource?: TutorOnboardingDataSource;
}) {
  const initialState = useMemo(
    () => dataSource.getInitialState(scenario),
    [dataSource, scenario],
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const view = useMemo(() => resolveTutorOnboardingView(state), [state]);
  const session = useMemo(() => dataSource.getSession(), [dataSource]);

  const value = useMemo<TutorOnboardingContextValue>(
    () => ({
      state,
      view,
      session,
      dispatchAction: (action, payload) =>
        dispatch({ type: "action", action, payload }),
      reset: () => dispatch({ type: "reset", state: initialState }),
    }),
    [initialState, session, state, view],
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

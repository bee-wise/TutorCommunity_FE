import type { TrialSession } from "./connection-widgets.service";

export type TrialJoinAvailability =
  | { state: "NO_SCHEDULE" | "BEFORE_START" | "AFTER_END" | "AWAITING_CONFIRMATION" | "CLOSED"; nextTransitionAt?: number }
  | { state: "READY"; nextTransitionAt: number };

export function getTrialJoinAvailability(
  trial: Pick<TrialSession, "scheduledStartAt" | "scheduledEndAt" | "status" | "tutorConfirmedAt" | "learnerConfirmedAt">,
  now: number,
): TrialJoinAvailability {
  const start = trial.scheduledStartAt ? Date.parse(trial.scheduledStartAt) : NaN;
  const end = trial.scheduledEndAt ? Date.parse(trial.scheduledEndAt) : NaN;
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return { state: "NO_SCHEDULE" };
  }
  if (trial.status === "CANCELLED" || trial.status === "REJECTED" || trial.status === "COMPLETED") {
    return { state: "CLOSED" };
  }
  if (now < start) return { state: "BEFORE_START", nextTransitionAt: start };
  if (now >= end) return { state: "AFTER_END" };
  if (trial.status !== "CONFIRMED" || !trial.tutorConfirmedAt || !trial.learnerConfirmedAt) {
    return { state: "AWAITING_CONFIRMATION" };
  }
  return { state: "READY", nextTransitionAt: end };
}

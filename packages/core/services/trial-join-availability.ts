import type { TrialSession } from "./connection-widgets.service";

export type TrialJoinAvailability =
  | { state: "NO_SCHEDULE" | "BEFORE_START" | "AFTER_END" | "CLOSED"; nextTransitionAt?: number }
  | { state: "READY"; nextTransitionAt: number };

export function getTrialJoinAvailability(
  trial: Pick<TrialSession, "scheduledStartAt" | "scheduledEndAt" | "status">,
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
  // CONFIRMED is legacy data that already counts as a scheduled trial.
  if (trial.status !== "SCHEDULED" && trial.status !== "CONFIRMED") {
    return { state: "CLOSED" };
  }
  return { state: "READY", nextTransitionAt: end };
}

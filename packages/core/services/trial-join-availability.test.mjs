import assert from "node:assert/strict";
import test from "node:test";
import { getTrialJoinAvailability } from "./trial-join-availability.ts";

const start = "2026-10-09T02:00:00Z";
const end = "2026-10-09T03:00:00Z";
const trial = {
  scheduledStartAt: start,
  scheduledEndAt: end,
  status: "CONFIRMED",
  tutorConfirmedAt: "2026-10-08T10:00:00Z",
  learnerConfirmedAt: "2026-10-08T11:00:00Z",
};

test("opens only from the scheduled start until the end", () => {
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  assert.equal(getTrialJoinAvailability(trial, startMs - 1).state, "BEFORE_START");
  assert.equal(getTrialJoinAvailability(trial, startMs).state, "READY");
  assert.equal(getTrialJoinAvailability(trial, endMs - 1).state, "READY");
  assert.equal(getTrialJoinAvailability(trial, endMs).state, "AFTER_END");
});

test("does not open unconfirmed, cancelled, or malformed sessions", () => {
  const duringClass = Date.parse(start) + 1;
  assert.equal(getTrialJoinAvailability({ ...trial, learnerConfirmedAt: null }, duringClass).state, "AWAITING_CONFIRMATION");
  assert.equal(getTrialJoinAvailability({ ...trial, status: "CANCELLED" }, duringClass).state, "CLOSED");
  assert.equal(getTrialJoinAvailability({ ...trial, scheduledEndAt: start }, duringClass).state, "NO_SCHEDULE");
});

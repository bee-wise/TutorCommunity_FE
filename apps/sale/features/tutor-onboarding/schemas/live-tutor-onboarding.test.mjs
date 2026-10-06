import assert from "node:assert/strict";
import test from "node:test";
import { resolveLiveTutorOnboardingScenario } from "./live-tutor-onboarding.ts";
import {
  getTutorOnboardingActiveStep,
  resolveTutorOnboardingView,
} from "./tutor-onboarding.resolver.ts";

test("PENDING_REVIEW without isInterviewed stays on AI interview step", () => {
  const scenario = resolveLiveTutorOnboardingScenario({
    tutorProfileStatus: " pending_review ",
    isInterviewed: false,
  });
  assert.equal(scenario, "interview");
  assert.equal(getTutorOnboardingActiveStep(scenario), "interview");
  const view = resolveTutorOnboardingView({ scenario });
  assert.equal(view.currentScreen, "INTERVIEW");
  assert.equal(view.stepStatuses.profile, "COMPLETED");
  assert.equal(view.stepStatuses.interview, "CURRENT");
  assert.equal(view.stepStatuses.verification, "BLOCKED");
});

test("isInterviewed === true advances to verification screen", () => {
  const scenario = resolveLiveTutorOnboardingScenario({
    tutorProfileStatus: "PENDING_REVIEW",
    isInterviewed: true,
  });
  assert.equal(scenario, "pending-review");
  assert.equal(getTutorOnboardingActiveStep(scenario), "verification");
});

test("profile status is not overridden by a stale draft status", () => {
  assert.equal(
    resolveLiveTutorOnboardingScenario({
      tutorOnboardingStatus: "DRAFT",
      tutorProfileStatus: "PENDING_REVIEW",
    }),
    "interview",
  );
});

test("LMS access is controlled by BE permission", () => {
  assert.equal(
    resolveLiveTutorOnboardingScenario({
      tutorProfileStatus: "COMPLETED",
      canAccessTutorLms: false,
    }),
    "post-approval",
  );
  assert.equal(
    resolveLiveTutorOnboardingScenario({
      tutorProfileStatus: "DRAFT",
      canAccessTutorLms: true,
    }),
    "completed",
  );
});

test("missing and unrecognized statuses have safe views", () => {
  assert.equal(resolveLiveTutorOnboardingScenario({}), "journey");
  assert.equal(
    resolveLiveTutorOnboardingScenario({ tutorProfileStatus: "SOME_NEW_STATUS" }),
    "unknown",
  );
  assert.equal(getTutorOnboardingActiveStep("unknown"), "profile");
});

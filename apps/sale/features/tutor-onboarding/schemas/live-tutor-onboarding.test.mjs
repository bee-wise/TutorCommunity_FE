import assert from "node:assert/strict";
import test from "node:test";
import { applyTutorOnboardingAction } from "../api/tutor-onboarding.api.ts";
import { resolveLiveTutorOnboardingScenario } from "./live-tutor-onboarding.ts";
import {
  getTutorOnboardingActiveStep,
  resolveTutorOnboardingView,
} from "./tutor-onboarding.resolver.ts";

test("pending profile review blocks AI interview", () => {
  const scenario = resolveLiveTutorOnboardingScenario({
    tutorProfileStatus: " pending_review ",
    isInterviewed: false,
  });
  assert.equal(scenario, "pending-review");
  assert.equal(getTutorOnboardingActiveStep(scenario), "verification");
  const view = resolveTutorOnboardingView({ scenario });
  assert.equal(view.currentScreen, "PENDING_REVIEW");
  assert.equal(view.stepStatuses.profile, "COMPLETED");
  assert.equal(view.stepStatuses.verification, "CURRENT");
  assert.equal(view.stepStatuses.interview, "BLOCKED");
});

test("all submitted but unapproved statuses stay in profile review", () => {
  for (const tutorProfileStatus of [
    "PROFILE_SUBMITTED",
    "INTERVIEW_PENDING",
    "PENDING_REVIEW",
    "PENDING_VERIFICATION",
  ]) {
    assert.equal(
      resolveLiveTutorOnboardingScenario({ tutorProfileStatus }),
      "pending-review",
      tutorProfileStatus,
    );
  }
});

test("isInterviewed does not bypass profile approval", () => {
  const scenario = resolveLiveTutorOnboardingScenario({
    tutorProfileStatus: "PENDING_REVIEW",
    isInterviewed: true,
  });
  assert.equal(scenario, "pending-review");
  assert.equal(getTutorOnboardingActiveStep(scenario), "verification");
});

test("approved profile unlocks AI interview before additional details", () => {
  const scenario = resolveLiveTutorOnboardingScenario({
    tutorProfileStatus: "APPROVED",
    tutorOnboardingStatus: "PENDING_REVIEW",
    isInterviewed: false,
  });
  assert.equal(scenario, "interview");
  const view = resolveTutorOnboardingView({ scenario });
  assert.equal(view.stepStatuses.verification, "COMPLETED");
  assert.equal(view.stepStatuses.interview, "CURRENT");
  assert.equal(view.stepStatuses.postApproval, "BLOCKED");

  assert.equal(
    resolveLiveTutorOnboardingScenario({
      tutorProfileStatus: "APPROVED",
      isInterviewed: true,
    }),
    "post-approval",
  );
});

test("onboarding approval alone does not unlock an unapproved profile", () => {
  assert.equal(
    resolveLiveTutorOnboardingScenario({
      tutorProfileStatus: "PENDING_REVIEW",
      tutorOnboardingStatus: "APPROVED",
    }),
    "pending-review",
  );
});

test("profile status is not overridden by a stale draft status", () => {
  assert.equal(
    resolveLiveTutorOnboardingScenario({
      tutorOnboardingStatus: "DRAFT",
      tutorProfileStatus: "PENDING_REVIEW",
    }),
    "pending-review",
  );
});

test("preview sends profile to review before allowing interview", () => {
  const submitted = applyTutorOnboardingAction(
    { scenario: "profile-draft", selectedStepId: "profile" },
    "submit-profile",
  );
  assert.equal(submitted.scenario, "pending-review");
  assert.equal(resolveTutorOnboardingView(submitted).stepStatuses.interview, "BLOCKED");
  assert.equal(
    applyTutorOnboardingAction(submitted, "join-mock-interview"),
    submitted,
  );

  const approved = applyTutorOnboardingAction(submitted, "approve-mock-profile");
  assert.equal(approved.scenario, "approved");
  assert.equal(resolveTutorOnboardingView(approved).stepStatuses.interview, "CURRENT");
  assert.equal(
    applyTutorOnboardingAction(approved, "open-approved-interview").scenario,
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

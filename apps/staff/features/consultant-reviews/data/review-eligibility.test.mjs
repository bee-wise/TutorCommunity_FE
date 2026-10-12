import assert from "node:assert/strict";
import { test } from "node:test";
import { canRejectSubmittedField, canSubmitProfileReview } from "./review-eligibility.ts";

test("initial review allows every profile field, including null or empty values", () => {
  assert.equal(canRejectSubmittedField({ submitted: false, reviewCount: 0 }), true);
  assert.equal(canRejectSubmittedField({ submitted: true, reviewCount: 0 }), true);
  assert.equal(canSubmitProfileReview(true, 0, false), true);
});

test("resubmission allows only fields submitted in this review", () => {
  assert.equal(canRejectSubmittedField({ submitted: true, reviewCount: 1 }), true);
  assert.equal(canRejectSubmittedField({ submitted: false, reviewCount: 1 }), false);
  assert.equal(canSubmitProfileReview(true, 1, false), false);
  assert.equal(canSubmitProfileReview(true, 1, true), true);
});

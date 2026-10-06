import assert from "node:assert/strict";
import test from "node:test";
import { toChatBusinessMessage } from "./chat-business-message.ts";

test("recognizes Swagger widget resource names and parses JSON payloads", () => {
  for (const [resource, kind] of [
    ["TrialSessions", "TRIAL_SESSION"],
    ["ClassConfirmations", "CLASS_CONFIRMATION"],
    ["LearnerPayments", "PAYMENT_REQUEST"],
    ["ClassSessions", "CLASS_SESSIONS"],
  ]) {
    assert.deepEqual(
      toChatBusinessMessage(resource, "widget-id", '{"classId":"class-id"}'),
      {
        kind,
        referenceId: "widget-id",
        payload: { classId: "class-id" },
      },
    );
  }
});

test("ignores unrelated messages and malformed payloads", () => {
  assert.equal(toChatBusinessMessage("PLAIN_TEXT", null, {}), null);
  assert.deepEqual(
    toChatBusinessMessage("TRIAL_SESSION", null, "not json")?.payload,
    {},
  );
  assert.equal(
    toChatBusinessMessage("WIDGET", "id", { widgetType: "PaymentRequest" })
      ?.kind,
    "PAYMENT_REQUEST",
  );
});

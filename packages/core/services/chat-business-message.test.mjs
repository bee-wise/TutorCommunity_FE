import assert from "node:assert/strict";
import test from "node:test";
import { toChatBusinessMessage, toChatHistoryBusinessMessage } from "./chat-business-message.ts";

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

test("uses hydrated widget state instead of the event snapshot", () => {
  const message = {
    id: "event-1",
    chatRoomId: "room-1",
    senderId: "user-1",
    content: "trial_proposed",
    createdAt: "2026-10-06T03:00:00Z",
    messageType: "BUSINESS",
    businessType: "trial_proposed",
    businessReferenceId: "trial-1",
    businessPayload: { status: "PROPOSED" },
    type: "WIDGET",
    widget: {
      type: "TRIAL_SESSION",
      referenceId: "trial-1",
      trialSession: { id: "trial-1", chatRoomId: "room-1", status: "COMPLETED", version: 4 },
      classConfirmation: null,
      payment: null,
      schedule: null,
    },
  };
  const result = toChatHistoryBusinessMessage(message);
  assert.equal(result?.kind, "TRIAL_SESSION");
  assert.equal(result?.current?.data.status, "COMPLETED");
  assert.equal(result?.payload.status, "PROPOSED");
  assert.equal(result?.roomId, "room-1");
  assert.equal(toChatHistoryBusinessMessage({ ...message, id: "event-2" })?.referenceId, "trial-1");
});

test("falls back to content when hydrated resource is unavailable or unrelated", () => {
  const message = {
    id: "event-1",
    chatRoomId: "room-1",
    senderId: "user-1",
    content: "Trial lesson proposed.",
    createdAt: "2026-10-06T03:00:00Z",
    businessType: "trial_proposed",
    type: "WIDGET",
    widget: { type: "TRIAL_SESSION", referenceId: "trial-1", trialSession: null },
  };
  assert.equal(toChatHistoryBusinessMessage(message), null);
  assert.equal(toChatHistoryBusinessMessage({
    ...message,
    widget: { ...message.widget, trialSession: { id: "trial-1", chatRoomId: "other-room" } },
  }), null);
  assert.equal(toChatHistoryBusinessMessage({ ...message, type: "SYSTEM", widget: null }), null);
});

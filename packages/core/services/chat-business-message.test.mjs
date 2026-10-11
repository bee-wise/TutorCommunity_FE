import assert from "node:assert/strict";
import test from "node:test";
import {
  formatTeachingOfferingName,
  isDraftWidget,
  isDraftWidgetMessage,
  toChatBusinessMessage,
  toChatHistoryBusinessMessage,
} from "./chat-business-message.ts";

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

test("uses hydrated widget state without businessPayload dependency", () => {
  const message = {
    id: "event-1",
    chatRoomId: "room-1",
    senderId: "user-1",
    content: "trial_proposed",
    createdAt: "2026-10-06T03:00:00Z",
    messageType: "BUSINESS",
    businessType: "trial_proposed",
    businessReferenceId: "trial-1",
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
  assert.equal(result?.roomId, "room-1");
  assert.equal(toChatHistoryBusinessMessage({ ...message, id: "event-2" })?.referenceId, "trial-1");
});

test("formatTeachingOfferingName formats contextName and teachingItemName properly", () => {
  assert.equal(
    formatTeachingOfferingName({ contextName: "Lớp 10", teachingItemName: "Toán Đại Số" }),
    "Lớp 10 - Toán Đại Số",
  );
  assert.equal(
    formatTeachingOfferingName({ contextName: null, teachingItemName: "Toán Học" }),
    "Toán Học",
  );
  assert.equal(
    formatTeachingOfferingName({ contextName: "Lớp 12", teachingItemName: undefined }),
    "Lớp 12",
  );
  assert.equal(
    formatTeachingOfferingName({ subjectName: "Tiếng Anh Căn Bản" }),
    "Tiếng Anh Căn Bản",
  );
  assert.equal(
    formatTeachingOfferingName({
      offeringSnapshot: { contextName: "Cấp 3", teachingItemName: "Vật Lý" },
    }),
    "Cấp 3 - Vật Lý",
  );
  assert.equal(formatTeachingOfferingName(null), "—");
  assert.equal(formatTeachingOfferingName({}, "Chưa xác định"), "Chưa xác định");
});

test("isDraftWidget checks for DRAFT status case-insensitively", () => {
  assert.equal(isDraftWidget("DRAFT"), true);
  assert.equal(isDraftWidget("draft"), true);
  assert.equal(isDraftWidget("Draft"), true);
  assert.equal(isDraftWidget("PROPOSED"), false);
  assert.equal(isDraftWidget("CONFIRMED"), false);
  assert.equal(isDraftWidget(null), false);
  assert.equal(isDraftWidget(undefined), false);
});

test("isDraftWidgetMessage identifies draft status across all message forms", () => {
  assert.equal(isDraftWidgetMessage({ isDraft: true }), true);
  assert.equal(isDraftWidgetMessage({ isDraft: false }), false);
  assert.equal(isDraftWidgetMessage(null), false);
  assert.equal(isDraftWidgetMessage(undefined), false);

  // Raw API widget format
  assert.equal(
    isDraftWidgetMessage({
      widget: { classConfirmation: { status: "DRAFT" } },
    }),
    true,
  );
  assert.equal(
    isDraftWidgetMessage({
      widget: { classConfirmation: { status: "WAITING_CONFIRMATION" } },
    }),
    false,
  );
  assert.equal(
    isDraftWidgetMessage({
      widget: { trialSession: { status: "draft" } },
    }),
    true,
  );

  // Mapped ChatMessage widget format
  assert.equal(
    isDraftWidgetMessage({
      widget: { widgetType: "CLASS_CONFIRMATION", data: { status: "DRAFT" } },
    }),
    true,
  );

  // Business current data format
  assert.equal(
    isDraftWidgetMessage({
      business: {
        kind: "CLASS_CONFIRMATION",
        current: {
          kind: "CLASS_CONFIRMATION",
          data: { status: "DRAFT" },
        },
      },
    }),
    true,
  );

  // Business payload format
  assert.equal(
    isDraftWidgetMessage({
      businessPayload: { status: "DRAFT" },
    }),
    true,
  );
  assert.equal(
    isDraftWidgetMessage({
      business: {
        kind: "CLASS_CONFIRMATION",
        payload: { status: "DRAFT" },
      },
    }),
    true,
  );
});

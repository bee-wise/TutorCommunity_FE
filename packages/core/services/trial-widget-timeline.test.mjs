import assert from "node:assert/strict";
import test from "node:test";
import { selectChatWidgetTimelineMessages, selectTrialWidgetTimelineMessages } from "./trial-widget-timeline.ts";

const trialEvent = (id, senderRole, referenceId, version, status) => ({
  id,
  senderRole,
  business: {
    kind: "TRIAL_SESSION",
    roomId: "room-1",
    referenceId,
    payload: {},
    current: {
      kind: "TRIAL_SESSION",
      data: { id: referenceId, chatRoomId: "room-1", version, status },
    },
  },
});

const isConsultant = (message) => message.senderRole === "CONSULTANT";

test("shows the consultant trial card once with the newest loaded state", () => {
  const proposal = trialEvent("proposal", "CONSULTANT", "trial-1", 1, "PROPOSED");
  const tutor = trialEvent("tutor", "TUTOR", "trial-1", 2, "PROPOSED");
  const learner = trialEvent("learner", "LEARNER", "trial-1", 3, "CONFIRMED");
  const textMessage = { id: "text", senderRole: "LEARNER", business: null };
  const history = [proposal, tutor, textMessage, learner];

  const visible = selectTrialWidgetTimelineMessages(history, isConsultant);

  assert.deepEqual(visible.map((message) => message.id), ["proposal", "text"]);
  assert.equal(visible[0].business.current.data.status, "CONFIRMED");
  assert.equal(proposal.business.current.data.status, "PROPOSED");
  assert.equal(history.length, 4);
});

test("keeps a fallback card until the older consultant event is loaded", () => {
  const tutor = trialEvent("tutor", "TUTOR", "trial-1", 2, "PROPOSED");
  const learner = trialEvent("learner", "LEARNER", "trial-1", 3, "CONFIRMED");
  const proposal = trialEvent("proposal", "CONSULTANT", "trial-1", 1, "PROPOSED");
  const otherTrial = trialEvent("other", "CONSULTANT", "trial-2", 1, "PROPOSED");

  assert.deepEqual(
    selectTrialWidgetTimelineMessages([tutor, learner], isConsultant).map((message) => message.id),
    ["tutor"],
  );
  assert.deepEqual(
    selectTrialWidgetTimelineMessages([proposal, tutor, learner, otherTrial], isConsultant)
      .map((message) => message.id),
    ["proposal", "other"],
  );
});

const confirmationEvent = (id, senderRole, referenceId, version, status, roomId = "room-1") => ({
  id,
  senderRole,
  business: {
    kind: "CLASS_CONFIRMATION",
    roomId,
    referenceId,
    payload: {},
    current: {
      kind: "CLASS_CONFIRMATION",
      data: { id: referenceId, chatRoomId: roomId, version, status },
    },
  },
});

test("shows one class confirmation at the newest consultant message with the latest state", () => {
  const first = confirmationEvent("first", "CONSULTANT", "confirmation-1", 1, "WAITING_CONFIRMATION");
  const tutor = confirmationEvent("tutor", "TUTOR", "confirmation-1", 2, "WAITING_CONFIRMATION");
  const second = confirmationEvent("second", "CONSULTANT", "confirmation-1", 3, "CONFIRMED");
  const learner = confirmationEvent("learner", "LEARNER", "confirmation-1", 4, "CONFIRMED");
  const textMessage = { id: "text", senderRole: "LEARNER", business: null };

  const visible = selectChatWidgetTimelineMessages([first, tutor, textMessage, second, learner], isConsultant);

  assert.deepEqual(visible.map((message) => message.id), ["text", "second"]);
  assert.equal(visible[1].business.current.data.version, 4);
  assert.equal(second.business.current.data.version, 3);
});

test("keeps separate confirmations and falls back to the newest loaded event", () => {
  const first = confirmationEvent("first", "TUTOR", "confirmation-1", 1, "WAITING_CONFIRMATION");
  const second = confirmationEvent("second", "LEARNER", "confirmation-1", 2, "CONFIRMED");
  const other = confirmationEvent("other", "CONSULTANT", "confirmation-2", 1, "WAITING_CONFIRMATION");
  const differentRoom = confirmationEvent("different-room", "CONSULTANT", "confirmation-1", 1, "WAITING_CONFIRMATION", "room-2");

  assert.deepEqual(
    selectChatWidgetTimelineMessages([first, second, other, differentRoom], isConsultant)
      .map((message) => message.id),
    ["second", "other", "different-room"],
  );
});

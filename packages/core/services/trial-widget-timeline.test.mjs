import assert from "node:assert/strict";
import test from "node:test";
import { selectTrialWidgetTimelineMessages } from "./trial-widget-timeline.ts";

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

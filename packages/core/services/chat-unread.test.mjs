import assert from "node:assert/strict";
import test from "node:test";
import { countUnreadMessages } from "./chat-unread.ts";

const readAt = "2026-10-10T10:00:00.000Z";

test("counts incoming messages while excluding own and system events", () => {
  const messages = [
    { senderId: "learner", createdAt: "2026-10-10T09:59:59.999Z" },
    { senderId: "consultant", createdAt: "2026-10-10T10:00:00.100Z" },
    { senderId: "learner", createdAt: "2026-10-10T10:00:00.200Z" },
    { senderId: "tutor", createdAt: "2026-10-10T10:00:00.300Z" },
    { senderId: "system", createdAt: "2026-10-10T10:00:00.400Z", type: "SYSTEM" },
    { senderId: "00000000-0000-0000-0000-000000000000", createdAt: "2026-10-10T10:00:00.500Z" },
  ];

  assert.equal(countUnreadMessages(messages, readAt, "consultant"), 2);
});

test("counts an incoming message in the same second as the read marker", () => {
  assert.equal(countUnreadMessages(
    [{ senderId: "learner", createdAt: "2026-10-10T10:00:00.001Z" }],
    readAt,
    "consultant",
  ), 1);
});

test("does not count a message without a valid read marker or viewer", () => {
  const messages = [{ senderId: "learner", createdAt: "2026-10-10T10:00:01.000Z" }];
  assert.equal(countUnreadMessages(messages, "invalid", "consultant"), 0);
  assert.equal(countUnreadMessages(messages, readAt, ""), 0);
});

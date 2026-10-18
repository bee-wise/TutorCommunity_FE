/* eslint-disable @typescript-eslint/no-require-imports -- Native Node harness for class-chat sender avatar rendering and contract. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const originalTs = require.extensions[".ts"];
const originalTsx = require.extensions[".tsx"];
const originalLoad = Module._load;

const compile = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );

require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;

Module._load = function (name, parent, isMain) {
  if (name.startsWith("@/")) {
    return originalLoad.call(
      this,
      path.resolve(__dirname, "../../..", name.slice(2)),
      parent,
      isMain,
    );
  }
  if (name === "@workspace/ui/components/ui/avatar") {
    return {
      Avatar: ({ children, ...props }) =>
        React.createElement("span", props, children),
      AvatarImage: ({ src, alt, ...props }) =>
        src ? React.createElement("img", { src, alt, ...props }) : null,
      AvatarFallback: ({ children, ...props }) =>
        React.createElement("span", props, children),
    };
  }
  return originalLoad.call(this, name, parent, isMain);
};

const {
  ClassChatHistory,
} = require("../components/ClassChatHistory.tsx");
const { chatMessageSchema } = require("../../../../../packages/core/lms-classes/schemas.ts");

const render = (component, props) =>
  renderToStaticMarkup(React.createElement(component, props));

const tutorId = "11111111-1111-4111-8111-111111111111";
const learnerId = "22222222-2222-4222-8222-222222222222";
const otherLearnerId = "33333333-3333-4333-8333-333333333333";
const classId = "44444444-4444-4444-8444-444444444444";

test("ClassChatHistory renders sender avatars with safeExternalUrl for valid HTTPS images", () => {
  const messages = [
    {
      id: "msg-1",
      classId,
      senderId: tutorId,
      senderName: "Gia sư",
      senderRole: "TUTOR",
      content: "Chào cả lớp!",
      createdAt: "2026-10-17T08:00:00Z",
      avatarUrl: "https://example.com/tutor-avatar.jpg",
    },
    {
      id: "msg-2",
      classId,
      senderId: learnerId,
      senderName: "Nguyễn An",
      senderRole: "LEARNER",
      content: "Em chào thầy ạ.",
      createdAt: "2026-10-17T08:01:00Z",
      avatarUrl: "https://example.com/learner-avatar.png",
    },
  ];

  // Rendered from the perspective of learnerId (own = msg-2, other = msg-1)
  const html = render(ClassChatHistory, {
    messages,
    historyRef: { current: null },
    currentUserId: learnerId,
  });

  // Verify avatar images are rendered with HTTPS source
  assert.match(html, /src="https:\/\/example\.com\/tutor-avatar\.jpg"/);
  assert.match(html, /src="https:\/\/example\.com\/learner-avatar\.png"/);
  assert.match(html, /referrerPolicy="no-referrer"/);

  // Verify accessibility: Avatar container is aria-hidden to avoid duplicate screen reader reading
  assert.match(html, /aria-hidden="true"/);

  // Verify layout separation: own message uses flex-row-reverse, other message uses justify-start
  assert.match(html, /flex-row-reverse/);

  // Verify readable sender text
  assert.match(html, /Bạn/);
  assert.match(html, /Gia sư/);
});

test("ClassChatHistory falls back to initials for null, missing, and non-HTTPS avatarUrl without broken img", () => {
  const messages = [
    {
      id: "msg-null",
      classId,
      senderId: tutorId,
      senderName: "Gia sư",
      senderRole: "TUTOR",
      content: "Tin nhắn với avatar null",
      createdAt: "2026-10-17T08:00:00Z",
      avatarUrl: null,
    },
    {
      id: "msg-insecure",
      classId,
      senderId: otherLearnerId,
      senderName: "Trần Bình",
      senderRole: "LEARNER",
      content: "Tin nhắn với HTTP không an toàn",
      createdAt: "2026-10-17T08:02:00Z",
      avatarUrl: "http://insecure.example.com/avatar.jpg",
    },
    {
      id: "msg-xss",
      classId,
      senderId: otherLearnerId,
      senderName: "Lê Cường",
      senderRole: "LEARNER",
      content: "Tin nhắn với javascript protocol",
      createdAt: "2026-10-17T08:03:00Z",
      avatarUrl: "javascript:alert(1)",
    },
    {
      id: "msg-legacy",
      classId,
      senderId: learnerId,
      senderName: "Nguyễn An",
      senderRole: "LEARNER",
      content: "Tin nhắn cũ không có trường avatarUrl",
      createdAt: "2026-10-17T08:04:00Z",
    },
  ];

  const html = render(ClassChatHistory, {
    messages,
    historyRef: { current: null },
    currentUserId: tutorId,
  });

  // None of the untrusted or null URLs should produce an <img> tag
  assert.doesNotMatch(html, /insecure\.example\.com/);
  assert.doesNotMatch(html, /javascript:alert/);

  // Fallbacks with sender initials should be present
  assert.match(html, />B</);  // own message "Bạn" -> "B"
  assert.match(html, />TB</); // "Trần Bình" -> "TB"
  assert.match(html, />LC</); // "Lê Cường" -> "LC"
  assert.match(html, />NA</); // "Nguyễn An" -> "NA"

  // When viewed by a learner, tutor's message shows "Gia sư" -> "GS"
  const htmlLearner = render(ClassChatHistory, {
    messages,
    historyRef: { current: null },
    currentUserId: learnerId,
  });
  assert.match(htmlLearner, />GS</); // "Gia sư" -> "GS"
});

test("chatMessageSchema preserves avatarUrl through Zod parsing with null, string, and omitted values", () => {
  const valid = chatMessageSchema.parse({
    id: tutorId,
    classId,
    senderId: tutorId,
    content: "Nội dung",
    createdAt: "2026-10-17T08:00:00Z",
    avatarUrl: "https://example.com/pic.jpg",
  });
  assert.equal(valid.avatarUrl, "https://example.com/pic.jpg");

  const nullable = chatMessageSchema.parse({
    id: tutorId,
    classId,
    senderId: tutorId,
    content: "Nội dung",
    createdAt: "2026-10-17T08:00:00Z",
    avatarUrl: null,
  });
  assert.equal(nullable.avatarUrl, null);

  const omitted = chatMessageSchema.parse({
    id: tutorId,
    classId,
    senderId: tutorId,
    content: "Nội dung",
    createdAt: "2026-10-17T08:00:00Z",
  });
  assert.equal(omitted.avatarUrl, undefined);
});

after(() => {
  Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs;
  else delete require.extensions[".ts"];
  if (originalTsx) require.extensions[".tsx"] = originalTsx;
  else delete require.extensions[".tsx"];
});

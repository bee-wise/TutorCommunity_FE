/* eslint-disable @typescript-eslint/no-require-imports -- Native DTO and SSR contract test. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const originalLoad = Module._load;
const originalTs = require.extensions[".ts"];
const originalTsx = require.extensions[".tsx"];
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
  if (name === "next/link")
    return {
      __esModule: true,
      default: ({ children, ...props }) => React.createElement("a", props, children),
    };
  if (name === "@workspace/ui/components/ui/avatar")
    return {
      Avatar: ({ children, ...props }) => React.createElement("span", props, children),
      AvatarImage: ({ src, alt, ...props }) =>
        src ? React.createElement("img", { src, alt, ...props }) : null,
      AvatarFallback: ({ children, ...props }) =>
        React.createElement("span", props, children),
    };
  return originalLoad.call(this, name, parent, isMain);
};

const { lmsClassSchema } = require("../schemas/lms-class.schema.ts");
const { toTutorClassCard } = require("../utils/class-api.utils.ts");
const { TutorClassCard } = require("../components/TutorClassCard.tsx");
const {
  LearnerClassTutorIdentity,
} = require("../../learner-classes/components/LearnerClassTutorIdentity.tsx");

const classId = "11111111-1111-4111-8111-111111111111";
const tutorId = "22222222-2222-4222-8222-222222222222";
const learnerIds = [
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
  "55555555-5555-4555-8555-555555555555",
  "66666666-6666-4666-8666-666666666666",
];
const dto = (patch = {}) => ({
  id: classId,
  type: "GROUP",
  teachingOfferingId: null,
  programName: null,
  teachingItemName: "Toán",
  contextName: null,
  tutorId,
  tutorName: "Gia sư kiểm thử",
  tutorAvatarUrl: "https://example.com/tutor.png",
  learners: [],
  teachingMode: "ONLINE",
  status: "ACTIVE",
  capacity: 8,
  activeMembers: 0,
  pricePerHour: 100000,
  sessionDurationMinutes: 60,
  numberOfSessions: 8,
  createdAt: "2026-10-13T02:00:00Z",
  title: "Lớp kiểm thử",
  code: "TEST-G1",
  approvalStatus: "APPROVED",
  billingMode: "MONTHLY",
  openingAt: null,
  sessionCount: 1,
  learnerCount: 0,
  features: { attendance: true, feedback: false },
  ...patch,
});
const render = (Component, props) =>
  renderToStaticMarkup(React.createElement(Component, props));

test("1:1 list uses one Learner avatar and falls back when absent", () => {
  const withAvatar = lmsClassSchema.parse(
    dto({
      type: "INDIVIDUAL",
      learnerCount: 1,
      learners: [{ id: learnerIds[0], avatarUrl: "https://example.com/learner.png" }],
    }),
  );
  const card = toTutorClassCard(withAvatar);
  assert.equal(card.learnerPreviews.length, 1);
  assert.match(render(TutorClassCard, card), /learner\.png/);
  const missing = toTutorClassCard(
    lmsClassSchema.parse(dto({ type: "INDIVIDUAL", learnerCount: 1, learners: [{ id: learnerIds[0], avatarUrl: null }] })),
  );
  const html = render(TutorClassCard, missing);
  assert.match(html, /1 học viên trong lớp/);
  assert.doesNotMatch(html, /src="undefined"|learner\.png/);
  assert.match(html, /<svg/);
});

test("GROUP list keeps only three newest server previews and handles empty class", () => {
  const previews = learnerIds.map((id, index) => ({ id, avatarUrl: `https://example.com/${index}.png` }));
  const group = toTutorClassCard(lmsClassSchema.parse(dto({ learnerCount: 4, learners: previews })));
  const html = render(TutorClassCard, group);
  assert.equal((html.match(/<img /g) ?? []).length, 3);
  assert.doesNotMatch(html, /3\.png/);
  assert.match(html, /4 học viên trong lớp/);
  const empty = toTutorClassCard(lmsClassSchema.parse(dto({ learners: null })));
  assert.deepEqual(empty.learnerPreviews, []);
  assert.doesNotMatch(render(TutorClassCard, empty), /<img /);
});

test("Learner detail displays server Tutor identity with safe avatar fallback", () => {
  const person = lmsClassSchema.parse(dto());
  const html = render(LearnerClassTutorIdentity, { tutor: person });
  assert.match(html, /Gia sư kiểm thử/);
  assert.match(html, /tutor\.png/);
  const legacy = lmsClassSchema.parse(dto({ tutorName: null, tutorAvatarUrl: null }));
  const fallback = render(LearnerClassTutorIdentity, { tutor: legacy });
  assert.match(fallback, /Chưa có tên gia sư/);
  assert.doesNotMatch(fallback, /<img /);
  assert.match(fallback, /<svg/);
  assert.doesNotMatch(render(LearnerClassTutorIdentity, { tutor: { ...person, tutorAvatarUrl: "javascript:alert(1)" } }), /javascript:/);
});

test("new previews validate GUID, while old deployment may omit them", () => {
  assert.equal(lmsClassSchema.safeParse(dto({ learners: [{ id: "wrong", avatarUrl: null }] })).success, false);
  const oldDto = Object.fromEntries(
    Object.entries(dto()).filter(
      ([key]) => !["learners", "tutorName", "tutorAvatarUrl"].includes(key),
    ),
  );
  assert.equal(lmsClassSchema.safeParse(oldDto).success, true);
});

after(() => {
  Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs;
  else delete require.extensions[".ts"];
  if (originalTsx) require.extensions[".tsx"] = originalTsx;
  else delete require.extensions[".tsx"];
});

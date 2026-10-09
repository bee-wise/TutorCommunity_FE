/* eslint-disable @typescript-eslint/no-require-imports -- Native Node harness compiles the feature in memory; no browser or API writes. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const originalTs = require.extensions[".ts"];
const originalTsx = require.extensions[".tsx"];
const originalLoad = Module._load;

const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
Module._load = function (name, parent, isMain) {
  if (name.endsWith(".module.css")) return { card: "learner-library-card" };
  if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
  // Dialog markup only: keyboard/focus behavior is owned by the real Radix primitive and requires browser QA.
  if (name === "@workspace/ui/components/ui/dialog") return {
    Dialog: ({ children, open }) => open ? React.createElement(React.Fragment, null, children) : null,
    DialogContent: ({ children, ...props }) => React.createElement("section", { ...props, role: "dialog" }, children),
    DialogHeader: ({ children, ...props }) => React.createElement("header", props, children),
    DialogTitle: ({ children, ...props }) => React.createElement("h2", props, children),
    DialogDescription: ({ children, ...props }) => React.createElement("p", props, children),
  };
  return originalLoad.call(this, name, parent, isMain);
};

const { LEARNER_CLASSES, LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS } = require("../data/learner-materials.mock.ts");
const {
  buildClassSummaries, buildSessionSummaries, DEFAULT_CLASS_FILTERS, DEFAULT_SESSION_FILTERS, DEFAULT_MATERIAL_FILTERS,
  filterClassSummaries, filterSessionSummaries, filterSharedMaterials, formatLibraryDate,
} = require("../utils/learner-materials.utils.ts");
const { useSessionMaterials } = require("../hooks/useLearnerMaterials.ts");
const { ClassLibraryScreen } = require("../components/ClassLibraryScreen.tsx");
const { ClassLibraryFilters } = require("../components/ClassLibraryFilters.tsx");
const { ClassLibraryList } = require("../components/ClassLibraryList.tsx");
const { ClassSessionsScreen } = require("../components/ClassSessionsScreen.tsx");
const { SessionMaterialsScreen } = require("../components/SessionMaterialsScreen.tsx");
const { LearnerClassCard } = require("../components/LearnerClassCard.tsx");
const { LearnerSessionCard } = require("../components/LearnerSessionCard.tsx");
const { SharedMaterialList } = require("../components/SharedMaterialList.tsx");
const { MaterialDetailDialog } = require("../components/MaterialDetailDialog.tsx");
const { LearnerMaterialsSkeleton } = require("../components/LearnerMaterialsSkeleton.tsx");
const render = (component, props = {}) => renderToStaticMarkup(React.createElement(component, props));
const summaries = buildClassSummaries(LEARNER_CLASSES, LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS);

test("summaries scope documents to each class, retain counts/new flags and select latest dates by instant", () => {
  const before = structuredClone([LEARNER_CLASSES, LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS]);
  assert.equal(summaries[0].sessionCount, 3);
  assert.equal(summaries[0].completedSessionCount, 2);
  assert.equal(summaries[0].materialCount, 3);
  assert.equal(summaries[0].newMaterialCount, 1);
  const dates = [
    { ...LEARNER_SHARED_MATERIALS[0], sharedAt: "2026-08-20T11:00:00Z" },
    { ...LEARNER_SHARED_MATERIALS[1], sharedAt: "2026-08-20T15:00:00+07:00" },
    { ...LEARNER_SHARED_MATERIALS[0], sessionId: "foreign", sharedAt: "2027-01-01T00:00:00Z" },
  ];
  assert.equal(buildClassSummaries(LEARNER_CLASSES, LEARNER_CLASS_SESSIONS, dates)[0].latestMaterialAt, dates[0].sharedAt);
  assert.deepEqual([LEARNER_CLASSES, LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS], before);
});

test("class filters compose kinds, subjects, statuses, codes and accent-insensitive tutor search without mutation", () => {
  const before = structuredClone(summaries);
  assert.deepEqual(filterClassSummaries(summaries, DEFAULT_CLASS_FILTERS).map((item) => item.classInfo.id), ["class-physics-10", "class-math-10"]);
  assert.deepEqual(filterClassSummaries(summaries, { ...DEFAULT_CLASS_FILTERS, sort: "oldest" }).map((item) => item.classInfo.id), ["class-math-10", "class-physics-10"]);
  assert.equal(filterClassSummaries(summaries, { ...DEFAULT_CLASS_FILTERS, search: "nguyen thu ha", subject: "Toán" }).length, 1);
  assert.equal(filterClassSummaries(summaries, { ...DEFAULT_CLASS_FILTERS, search: "BW-PHY10-014" })[0].classInfo.id, "class-physics-10");
  assert.equal(filterClassSummaries(summaries, { ...DEFAULT_CLASS_FILTERS, kind: "group", search: "Speaking" })[0].classInfo.id, "class-ielts-65");
  assert.equal(filterClassSummaries(summaries, { ...DEFAULT_CLASS_FILTERS, status: "completed" }).length, 0);
  const statuses = ["completed", "active", "upcoming"].map((status, index) => ({ ...summaries[0], classInfo: { ...summaries[0].classInfo, id: String(index), status } }));
  assert.deepEqual(filterClassSummaries(statuses, { ...DEFAULT_CLASS_FILTERS, sort: "status" }).map((item) => item.classInfo.status), ["active", "upcoming", "completed"]);
  assert.deepEqual(summaries, before);
});

test("session summaries only include the selected class and combine status, topic and material availability", () => {
  const sessions = buildSessionSummaries("class-math-10", LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS);
  assert.deepEqual(sessions.map((item) => item.materialCount), [2, 1, 0]);
  assert.equal(filterSessionSummaries(sessions, { ...DEFAULT_SESSION_FILTERS, status: "COMPLETED", availability: "available", search: "bat phuong" }).length, 1);
  assert.equal(filterSessionSummaries(sessions, { ...DEFAULT_SESSION_FILTERS, availability: "empty" })[0].session.sequence, 14);
  assert.equal(filterSessionSummaries(sessions, { ...DEFAULT_SESSION_FILTERS, status: "CANCELED" }).length, 0);
});

test("material filters keep session boundaries, AI/upload, file type and accent-insensitive content search", () => {
  const before = structuredClone(LEARNER_SHARED_MATERIALS);
  assert.equal(filterSharedMaterials("math-session-01", LEARNER_SHARED_MATERIALS, DEFAULT_MATERIAL_FILTERS).length, 2);
  assert.equal(filterSharedMaterials("math-session-01", LEARNER_SHARED_MATERIALS, { ...DEFAULT_MATERIAL_FILTERS, source: "ai", fileType: "BEEWISE", search: "phuong phap the" })[0].id, "learner-material-01");
  assert.equal(filterSharedMaterials("math-session-01", LEARNER_SHARED_MATERIALS, { ...DEFAULT_MATERIAL_FILTERS, source: "upload", fileType: "PDF" }).length, 1);
  assert.equal(filterSharedMaterials("foreign", LEARNER_SHARED_MATERIALS, DEFAULT_MATERIAL_FILTERS).length, 0);
  assert.deepEqual(LEARNER_SHARED_MATERIALS, before);
});

test("date formatting stays in Vietnam timezone and safely renders missing/invalid times", () => {
  assert.ok(formatLibraryDate("2026-08-20T18:00:00Z").includes("21/08/2026"));
  assert.ok(formatLibraryDate("2026-08-20T18:00:00Z").includes("01:00"));
  assert.equal(formatLibraryDate("invalid"), "Chưa có thời gian");
});

test("class cards prioritize titles, codes, status and tutor identity with one keyboard navigation target", () => {
  for (const status of ["active", "upcoming", "completed"]) {
    const card = { ...summaries[0], classInfo: { ...summaries[0].classInfo, status, id: "class/encoded" } };
    const html = render(LearnerClassCard, card);
    const header = html.match(/<header[^>]*>([\s\S]*?)<\/header>/)?.[1] ?? "";
    assert.ok(header.indexOf("<h3") < header.indexOf(card.classInfo.code));
    assert.equal((html.match(/<a /g) ?? []).length, 1);
    assert.ok(html.includes("class%2Fencoded"));
    assert.ok(html.includes(card.classInfo.tutorName));
    assert.ok(html.includes("mt-auto"));
    assert.ok(html.includes("1 tài liệu mới được chia sẻ"));
    assert.doesNotMatch(html, /<button|underline|bg-primary\/10|border-[tlrb]-[24]/);
  }
});

test("class filter controls have pressed-kind semantics, explicit labels, custom selects and 44px targets", () => {
  const html = render(ClassLibraryFilters, { filters: DEFAULT_CLASS_FILTERS, subjects: ["Toán"], counts: { individual: 2, group: 1 }, onChange() {} });
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 1);
  for (const id of ["class-search", "class-subject", "class-status", "class-sort"]) {
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`for="${id}"`));
  }
  assert.equal((html.match(/<svg /g) ?? []).length, 4);
  assert.ok(html.includes("min-h-11"));
});

test("class listing renders compact cards, restores group kind and exposes one empty-state reset", () => {
  const html = render(ClassLibraryScreen);
  assert.ok(html.includes("Kho tài liệu"));
  assert.ok(html.includes("Dữ liệu minh họa"));
  assert.ok(html.includes("md:grid-cols-2 xl:grid-cols-3"));
  assert.equal((html.match(/<a /g) ?? []).length, 2);
  assert.doesNotMatch(html, /Tổng quan|Xuất bản|Tạo tài liệu AI|Upload|underline/);
  const group = render(ClassLibraryScreen, { initialKind: "group" });
  assert.equal((group.match(/<a /g) ?? []).length, 1);
  assert.ok(group.includes("class-ielts-65"));
  const empty = render(ClassLibraryList, { classes: [], onReset() {} });
  assert.ok(empty.includes("Không tìm thấy lớp học"));
  assert.equal((empty.match(/Đặt lại bộ lọc/g) ?? []).length, 1);
});

test("sessions without shared materials have no fake view link; group Back restores its originating tab", () => {
  const sessions = buildSessionSummaries("class-math-10", LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS);
  const unavailable = render(LearnerSessionCard, { classId: "class-math-10", ...sessions[2] });
  assert.ok(unavailable.includes("Chưa có tài liệu được chia sẻ"));
  assert.ok(unavailable.includes("disabled"));
  assert.doesNotMatch(unavailable, /<a /);
  const available = render(LearnerSessionCard, { classId: "class/maths", ...sessions[0] });
  assert.ok(available.includes("class%2Fmaths/sessions/math-session-01"));
  const group = render(ClassSessionsScreen, { classId: "class-ielts-65" });
  assert.ok(group.includes("/lms/learner/materials?kind=group"));
});

test("wrong-class session and unknown identifiers expose only a missing state, no documents", () => {
  function Probe({ classId, sessionId }) {
    const library = useSessionMaterials(classId, sessionId);
    return React.createElement("span", { "data-count": library.filteredMaterials.length });
  }
  assert.ok(render(Probe, { classId: "class-physics-10", sessionId: "math-session-01" }).includes('data-count="0"'));
  for (const props of [{ classId: "class-physics-10", sessionId: "math-session-01" }, { classId: "missing", sessionId: "math-session-01" }]) {
    const html = render(SessionMaterialsScreen, props);
    assert.ok(html.includes("Không tìm thấy buổi học"));
    assert.doesNotMatch(html, /Tóm tắt hệ phương trình|material-source|Xuất bản|Chỉnh sửa/);
  }
});

test("shared document rows expose one clearly labelled read-only view action on the right", () => {
  const html = render(SharedMaterialList, { materials: LEARNER_SHARED_MATERIALS.slice(0, 2), onView() {} });
  assert.equal((html.match(/<button/g) ?? []).length, 2);
  assert.ok(html.includes("md:grid-cols-[minmax(0,1fr)_auto]"));
  assert.ok(html.includes("Tạo bằng AI"));
  assert.ok(html.includes("Gia sư tải lên"));
  assert.doesNotMatch(html, /underline|Xuất bản|Chỉnh sửa|Ẩn tài liệu|download=/);
  const detail = render(MaterialDetailDialog, { material: LEARNER_SHARED_MATERIALS[0], onClose() {} });
  assert.ok(detail.includes("Bản xem tài liệu chỉ đọc"));
  assert.ok(detail.includes("khi kết nối dữ liệu thực tế"));
  assert.doesNotMatch(detail, /<input|<textarea|contenteditable/);
});

test("child screens preserve labelled filters, back navigation and the published-only session flow", () => {
  const html = render(SessionMaterialsScreen, { classId: "class-math-10", sessionId: "math-session-01" });
  assert.ok(html.includes("/lms/learner/materials/classes/class-math-10"));
  for (const id of ["material-search", "material-source", "material-file-type"]) assert.ok(html.includes(`id="${id}"`));
  assert.equal((html.match(/aria-label="Xem tài liệu:/g) ?? []).length, 2);
  assert.doesNotMatch(html, /IELTS Writing Task 1 templates|underline|Preview &amp; chỉnh sửa/);
});

test("each skeleton matches its screen and respects reduced motion", () => {
  for (const view of ["classes", "sessions", "materials"]) {
    const html = render(LearnerMaterialsSkeleton, { view });
    assert.ok(html.includes('role="status"'));
    assert.ok(html.includes('aria-hidden="true"'));
    assert.ok(html.includes("motion-safe:animate-pulse"));
    assert.equal((html.match(/min-h-\[300px\]/g) ?? []).length, view === "materials" ? 0 : 6);
  }
});

after(() => {
  require.extensions[".ts"] = originalTs;
  require.extensions[".tsx"] = originalTsx;
  Module._load = originalLoad;
});

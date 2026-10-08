/* eslint-disable @typescript-eslint/no-require-imports -- Native Node harness compiles the listing in memory without browser or API writes. */
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
let snapshot = { ready: true, storageError: null, materials: [] };

const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
Module._load = function (name, parent, isMain) {
  if (name.endsWith(".module.css")) return { card: "material-class-card" };
  if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
  if (parent?.filename.endsWith("useTutorClassLibrary.ts") && name === "./useClassMaterials") return { useClassMaterials: () => snapshot };
  return originalLoad.call(this, name, parent, isMain);
};

const { CLASS_LEARNERS, CLASS_SESSIONS, MATERIAL_CLASSES } = require("../data/classroom.mock.ts");
const { getMaterialLibraryCard } = require("../utils/material-library.utils.ts");
const { MaterialLibraryContent } = require("../components/MaterialLibraryContent.tsx");
const { MaterialLibraryFilters } = require("../components/MaterialLibraryFilters.tsx");
const { MaterialLibrarySkeleton } = require("../components/MaterialLibrarySkeleton.tsx");
const { TutorMaterialsScreen } = require("../components/TutorMaterialsScreen.tsx");
const { MaterialClassCard } = require("../components/MaterialClassCard.tsx");
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
const defaults = { kind: "individual", search: "", status: "all", sort: "newest" };
const counts = { individual: 7, group: 3 };
const card = getMaterialLibraryCard(MATERIAL_CLASSES[0], CLASS_LEARNERS, CLASS_SESSIONS, []);
const contentProps = { cards: [card], filters: defaults, counts, storageError: null, onFiltersChange() {}, onResetFilters() {} };

test("listing model scopes roster/materials and counts only completed sessions without published documents", () => {
  const classInfo = MATERIAL_CLASSES[0];
  const sessions = CLASS_SESSIONS.filter((session) => session.classId === classInfo.id && session.completed);
  const materials = [
    { id: "draft", classId: classInfo.id, sessionId: sessions[0].id, status: "draft" },
    { id: "hidden", classId: classInfo.id, sessionId: sessions[0].id, status: "hidden" },
    { id: "foreign", classId: "other-class", sessionId: sessions[0].id, status: "published" },
  ];
  const before = structuredClone(materials);
  const model = getMaterialLibraryCard(classInfo, CLASS_LEARNERS, CLASS_SESSIONS, materials);
  assert.equal(model.materialCount, 2);
  assert.equal(model.missingPublishedCount, sessions.length);
  assert.deepEqual(model.learners.map((learner) => learner.id), classInfo.learnerIds);
  const published = sessions.map((session, index) => ({ id: `published-${index}`, classId: classInfo.id, sessionId: session.id, status: "published" }));
  assert.equal(getMaterialLibraryCard(classInfo, CLASS_LEARNERS, CLASS_SESSIONS, [...materials, ...published]).missingPublishedCount, 0);
  assert.deepEqual(materials, before);
});

test("listing exposes a compact grid with one link per class, without workspace actions or overview cards", () => {
  const html = render(MaterialLibraryContent, contentProps);
  assert.ok(html.includes("Quản lý tài liệu"));
  assert.ok(html.includes("Dữ liệu lớp minh họa"));
  assert.ok(html.includes('aria-labelledby="material-library-results"'));
  assert.ok(html.includes("md:grid-cols-2 xl:grid-cols-3"));
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.ok(html.includes(card.classInfo.title));
  assert.ok(html.includes(card.classInfo.code));
  assert.ok(html.includes("Xem tài liệu"));
  assert.doesNotMatch(html, /underline|Preview|Tạo tài liệu AI|Kéo thả|Tổng quan|<table/);
});

test("filters retain labelled custom selects, two class choices and three useful icons", () => {
  const html = render(MaterialLibraryFilters, { filters: { ...defaults, kind: "group", search: "Gia Huy" }, counts, onChange() {} });
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 1);
  assert.ok(html.includes('aria-label="Lớp nhóm: 3 lớp"'));
  assert.ok(html.includes('type="search"'));
  assert.ok(html.includes('value="Gia Huy"'));
  for (const id of ["class-status", "class-sort"]) {
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`for="${id}"`));
  }
  assert.equal((html.match(/<svg /g) ?? []).length, 3);
  assert.ok(html.includes("min-h-11"));
});

test("empty state exposes one reset action and storage errors do not hide class content", () => {
  const empty = render(MaterialLibraryContent, { ...contentProps, cards: [], filters: { ...defaults, search: "missing" } });
  assert.ok(empty.includes("Không tìm thấy lớp học"));
  assert.equal((empty.match(/Đặt lại bộ lọc/g) ?? []).length, 1);
  assert.equal((empty.match(/<a /g) ?? []).length, 0);
  const failedStorage = render(MaterialLibraryContent, { ...contentProps, storageError: "Không đọc được bộ nhớ trình duyệt." });
  assert.ok(failedStorage.includes('role="alert"'));
  assert.ok(failedStorage.includes("Không đọc được bộ nhớ trình duyệt."));
  assert.ok(failedStorage.includes(card.classInfo.title));
});

test("main screen preserves initial learner search and uses a listing-only skeleton before hydration", () => {
  snapshot = { ready: false, storageError: null, materials: [] };
  const waiting = render(TutorMaterialsScreen, { initialSearch: "Gia Huy" });
  assert.ok(waiting.includes('aria-label="Đang tải danh sách lớp tài liệu"'));
  snapshot = { ready: true, storageError: null, materials: [] };
  const ready = render(TutorMaterialsScreen, { initialSearch: "Gia Huy" });
  assert.ok(ready.includes('value="Gia Huy"'));
  assert.equal((ready.match(/<a /g) ?? []).length, 2);
  assert.ok(ready.includes("Đặt lại bộ lọc"));
});

test("listing skeleton matches filter/grid shapes and respects reduced motion", () => {
  const html = render(MaterialLibrarySkeleton, {});
  assert.ok(html.includes('role="status"'));
  assert.ok(html.includes('aria-hidden="true"'));
  assert.ok(html.includes("motion-safe:animate-pulse"));
  assert.ok(html.includes("md:grid-cols-2 xl:grid-cols-3"));
  assert.equal((html.match(/min-h-\[280px\]/g) ?? []).length, 6);
});

test("class cards distinguish status from metadata, retain learner identity and pin one styled CTA", () => {
  for (const status of ["active", "upcoming", "completed"]) {
    const html = render(MaterialClassCard, { ...card, classInfo: { ...card.classInfo, status } });
    assert.equal((html.match(/<a /g) ?? []).length, 1);
    const header = html.match(/<header[^>]*>([\s\S]*?)<\/header>/)?.[1] ?? "";
    assert.ok(header.indexOf("<h2") >= 0);
    assert.ok(header.indexOf("<h2") < header.indexOf(card.classInfo.code));
    assert.ok(html.includes('aria-label="Môn học và cấp độ"'));
    assert.ok(html.includes(card.learners[0].fullName));
    assert.ok(html.includes("Buổi học"));
    assert.ok(html.includes("Tài liệu"));
    assert.ok(html.includes("mt-auto"));
    assert.ok(html.includes("rounded-xl"));
    if (status === "active") assert.match(html, /border-primary bg-primary text-primary-foreground/);
    if (status === "upcoming") assert.match(html, /border-accent bg-accent text-accent-foreground/);
    assert.doesNotMatch(html, /<button|underline|border-[tlrb]-[24]|bg-primary\/10/);
  }
});

after(() => {
  require.extensions[".ts"] = originalTs;
  require.extensions[".tsx"] = originalTsx;
  Module._load = originalLoad;
});

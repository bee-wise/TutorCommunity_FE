/* eslint-disable @typescript-eslint/no-require-imports -- Native Node test harness transpiles source and mocks Next.js boundaries in memory. */
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
let pathname = "/lms/tutor/materials/session-ma-01/preview";

const compile = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, filename);
};
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
Module._load = function (request, parent, isMain) {
  if (request.endsWith("/AI-icon.svg")) return "/test-assets/AI-icon.svg";
  if (request.endsWith(".module.css")) return { screen: "preview-screen", leaving: "preview-leaving", card: "material-class-card" };
  if (request === "next/navigation") return { usePathname: () => pathname };
  if (request === "next/link") return ({ children, ...props }) => React.createElement("a", props, children);
  if (request === "next/image") return ({ src, alt }) => React.createElement("img", { src, alt });
  if (request === "@phosphor-icons/react") {
    return new Proxy({}, {
      get: (_, prop) => ({ className, ...props }) => React.createElement("span", { className, "data-icon": String(prop), ...props }),
    });
  }
  if (request === "@workspace/ui/components/ui/dropdown-menu") {
    return {
      DropdownMenu: ({ children }) => React.createElement("div", { "data-slot": "dropdown-menu" }, children),
      DropdownMenuTrigger: ({ children, asChild, ...props }) => asChild ? React.cloneElement(React.Children.only(children), props) : React.createElement("button", props, children),
      DropdownMenuContent: ({ children, ...props }) => React.createElement("div", { "data-slot": "dropdown-menu-content", ...props }, children),
      DropdownMenuItem: ({ children, asChild, ...props }) => asChild ? React.cloneElement(React.Children.only(children), { "data-slot": "dropdown-menu-item", ...props }) : React.createElement("div", { "data-slot": "dropdown-menu-item", ...props }, children),
      DropdownMenuSeparator: () => React.createElement("hr", { "data-slot": "dropdown-menu-separator" }),
    };
  }
  if (request === "@workspace/ui/components/ui/sidebar") return { SidebarProvider: ({ children }) => children };
  if (parent?.filename.endsWith("ClassMaterialRow.tsx")) {
    if (request === "@workspace/ui/components/ui/bee-toast") return { toast: { success: () => {} } };
    if (request === "../store/class-materials.store") return { useClassMaterialsStore: (select) => select({ updateMaterial: () => {} }) };
    if (request === "../hooks/useLocalMaterialFile") return { useLocalMaterialFile: () => ({ url: null, error: null }) };
  }
  if (parent?.filename.endsWith("DashboardLayout.tsx")) {
    if (request === "./AppSidebar") return { AppSidebar: () => React.createElement("aside", null, "SIDEBAR") };
    if (request === "./Topbar") return { Topbar: () => React.createElement("header", null, "TOPBAR") };
  }
  return originalLoad.call(this, request, parent, isMain);
};

const { DashboardLayout } = require("../../../../../packages/ui/components/layout/DashboardLayout.tsx");
const { AIReadyState } = require("../components/AIReadyState.tsx");
const { MaterialPreviewShell } = require("../components/MaterialPreviewShell.tsx");
const { ClassMaterialRow } = require("../components/ClassMaterialRow.tsx");
const { MaterialClassCard } = require("../components/MaterialClassCard.tsx");
const { MATERIAL_CLASSES, CLASS_SESSIONS, CLASS_LEARNERS } = require("../data/classroom.mock.ts");
const { getMaterialLibraryCard } = require("../utils/material-library.utils.ts");
const { getPreviewReturnHref } = require("../utils/preview-navigation.utils.ts");
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));

test("material preview hides dashboard chrome without hiding the class workspace", () => {
  const preview = render(DashboardLayout, { children: "DOCUMENT" });
  assert.match(preview, /DOCUMENT/);
  assert.doesNotMatch(preview, /SIDEBAR|TOPBAR/);
  pathname = "/lms/tutor/materials/classes/class-ma-math";
  const workspace = render(DashboardLayout, { children: "CLASS" });
  assert.match(workspace, /SIDEBAR/);
  assert.match(workspace, /TOPBAR/);
  pathname = "/lms/learner/exercises/exercise-01";
  assert.doesNotMatch(render(DashboardLayout, { children: "EXERCISE" }), /SIDEBAR|TOPBAR/);
});

test("ready-state preview links navigate in the same tab", () => {
  const html = render(AIReadyState, {
    material: { id: "ai-01", sessionId: "session-ma-01", status: "draft", title: "Tài liệu" },
    readOnly: false, onPublish: () => {},
  });
  assert.match(html, /href="\/lms\/tutor\/materials\/session-ma-01\/preview\?materialId=ai-01&amp;from=ai-modal"/);
  assert.doesNotMatch(html, /target="_blank"/);
});

test("a class sidebar is injected without changing fullscreen preview or learner chrome", () => {
  const sidebar = React.createElement("aside", null, "CLASS_SIDEBAR");
  pathname = "/lms/tutor/classes/class-ma-math/messages";
  const room = render(DashboardLayout, { sidebar, children: "CLASS_CHAT" });
  assert.match(room, /CLASS_SIDEBAR/);
  assert.match(room, /CLASS_CHAT/);
  assert.match(room, /TOPBAR/);
  assert.doesNotMatch(room, />SIDEBAR</);
  pathname = "/lms/tutor/materials/session-ma-01/preview";
  assert.doesNotMatch(render(DashboardLayout, { sidebar, children: "PREVIEW" }), /CLASS_SIDEBAR|TOPBAR/);
  pathname = "/lms/learner/materials";
  assert.match(render(DashboardLayout, { children: "LEARNER_LIBRARY" }), />SIDEBAR</);
});

test("fullscreen shell exposes the logo and Back button and locks controls during exit", () => {
  const props = { children: "DOCUMENT", onBack: () => {}, onTransitionEnd: () => {}, phase: "entered", leaving: false };
  const html = render(MaterialPreviewShell, props);
  assert.match(html, /alt="BeeWise LMS"/);
  assert.match(html, /Quay lại/);
  assert.match(html, /DOCUMENT/);
  assert.match(html, /data-phase="entered"/);
  const waiting = render(MaterialPreviewShell, { ...props, phase: "waiting" });
  assert.match(waiting, /data-phase="waiting"/);
  assert.match(waiting, /inert=""/);
  const exiting = render(MaterialPreviewShell, { ...props, phase: "leaving", leaving: true });
  assert.match(exiting, /inert=""/);
  assert.match(exiting, /disabled=""/);
});

test("material cards separate responsive actions and emphasize publication without underlines", () => {
  const material = { id: "ai-01", sessionId: "session-ma-01", source: "ai", status: "draft", title: "Tài liệu", fileType: "BEEWISE", updatedAt: "2026-10-06T05:24:00Z", data: {} };
  const html = render(ClassMaterialRow, { material, readOnly: false });
  assert.match(html, /aria-label="Thao tác tài liệu"/);
  assert.match(html, /src="\/test-assets\/AI-icon.svg"/);
  assert.match(html, /alt="Tài liệu tạo bằng AI"/);
  assert.doesNotMatch(html, /BeeWise AI|from=ai-modal/);
  assert.match(html, /Xuất bản/);
  assert.doesNotMatch(html, /underline/);
  const readOnly = render(ClassMaterialRow, { material, readOnly: true });
  assert.match(readOnly, /Preview &amp; chỉnh sửa/);
  assert.doesNotMatch(readOnly, /Đổi tên|Xuất bản/);
});

test("Back from the list does not reopen AI; Back from the AI modal restores it", () => {
  assert.equal(getPreviewReturnHref("class-01", "ai-01", false), "/lms/tutor/materials/classes/class-01");
  assert.equal(getPreviewReturnHref("class-01", "ai-01", true), "/lms/tutor/materials/classes/class-01?ai=ai-01");
  assert.equal(getPreviewReturnHref(undefined, undefined, true), "/lms/tutor/materials");
});

test("class cards prioritize the title, retain status, and have a single keyboard navigation target", () => {
  for (const status of ["active", "upcoming", "completed"]) {
    const classInfo = { ...MATERIAL_CLASSES[0], status };
    const html = render(MaterialClassCard, getMaterialLibraryCard(classInfo, CLASS_LEARNERS, CLASS_SESSIONS, []));
    assert.equal((html.match(/<a /g) || []).length, 1);
    assert.match(html, /href="\/lms\/tutor\/materials\/classes\/class-ma-math"/);
    assert.match(html, /aria-label="Xem tài liệu lớp/);
    assert.match(html, /font-nunito text-lg font-extrabold/);
    assert.ok(html.indexOf("<h2") < html.indexOf("<span"));
    assert.match(html, /bg-primary[^>]+>Xem tài liệu/);
    assert.doesNotMatch(html, /<button|underline/);
    assert.match(html, new RegExp({ active: "Đang học", upcoming: "Sắp khai giảng", completed: "Đã kết thúc" }[status]));
  }
});

test("class card attention notice disappears only when every completed session has published material", () => {
  const classInfo = MATERIAL_CLASSES[0];
  const sessions = CLASS_SESSIONS.filter((session) => session.classId === classInfo.id && session.completed);
  assert.ok(sessions.length > 0);
  assert.match(render(MaterialClassCard, getMaterialLibraryCard(classInfo, CLASS_LEARNERS, CLASS_SESSIONS, [])), /bg-accent[\s\S]*chưa có tài liệu đã xuất bản/);
  const materials = sessions.map((session, index) => ({ id: `published-${index}`, sessionId: session.id, classId: classInfo.id, status: "published" }));
  assert.doesNotMatch(render(MaterialClassCard, getMaterialLibraryCard(classInfo, CLASS_LEARNERS, CLASS_SESSIONS, materials)), /chưa có tài liệu đã xuất bản/);
});

after(() => {
  Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs; else delete require.extensions[".ts"];
  if (originalTsx) require.extensions[".tsx"] = originalTsx; else delete require.extensions[".tsx"];
});

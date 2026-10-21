/* eslint-disable @typescript-eslint/no-require-imports -- Render the route shell in Node without browser providers. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const originalLoad = Module._load;
const originalTsx = require.extensions[".tsx"];

require.extensions[".tsx"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText, filename);
Module._load = function (name, parent, isMain) {
  if (parent?.filename.endsWith("LmsDashboardShell.tsx")) {
    if (name === "@workspace/ui/components/ui/sidebar") return { SidebarProvider: ({ children }) => React.createElement("div", null, children) };
    if (name === "./LmsAppSidebar") return { LmsAppSidebar: () => React.createElement("nav", { "aria-label": "LMS navigation" }) };
    if (name === "./LmsMobileNav") return { LmsMobileNav: () => React.createElement("nav", { "aria-label": "LMS mobile navigation" }) };
    if (name === "./LmsTopbar") return { LmsTopbar: ({ breadcrumb }) => React.createElement("header", null, breadcrumb || "TOPBAR") };
  }
  return originalLoad.call(this, name, parent, isMain);
};

const { LmsDashboardShell } = require("../components/LmsDashboardShell.tsx");
const render = (pathname, props = {}) => renderToStaticMarkup(React.createElement(LmsDashboardShell, { pathname, role: "TUTOR", children: "SCREEN", ...props }));

test("ordinary tutor and learner routes expose navigation, topbar, and a keyboard content target", () => {
  for (const pathname of ["/lms/tutor/dashboard", "/lms/learner", "/lms/learner/exercises/classes/c1"]) {
    const html = render(pathname);
    assert.match(html, /LMS navigation/);
    assert.match(html, /TOPBAR/);
    assert.match(html, /href="#lms-main-content"/);
    assert.match(html, /id="lms-main-content"[^>]*>SCREEN/);
  }
});

test("exercise, tutor connection chat, and material preview retain their focused layouts", () => {
  for (const pathname of ["/lms/learner/exercises/e1", "/lms/tutor/messages", "/lms/tutor/messages/room1", "/lms/tutor/materials/s1/preview/"]) {
    const html = render(pathname);
    assert.match(html, />SCREEN<\/main>/);
    assert.doesNotMatch(html, /LMS navigation|TOPBAR/);
  }
});

test("a class workspace keeps its own navigation and breadcrumb; class chat stays inside the shell", () => {
  const html = render("/lms/tutor/classes/c1/messages", {
    sidebar: React.createElement("nav", null, "CLASS NAV"),
    breadcrumb: React.createElement("span", null, "CLASS LOCATION"),
  });
  assert.match(html, /CLASS NAV/);
  assert.match(html, /CLASS LOCATION/);
  assert.match(html, />SCREEN<\/main>/);
  assert.doesNotMatch(html, /LMS navigation/);
});

after(() => {
  Module._load = originalLoad;
  if (originalTsx) require.extensions[".tsx"] = originalTsx;
  else delete require.extensions[".tsx"];
});

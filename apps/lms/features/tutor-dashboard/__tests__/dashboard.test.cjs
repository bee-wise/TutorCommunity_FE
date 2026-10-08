/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness transpiles feature files in memory. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const originalLoad = Module._load;
const originals = { ts: require.extensions[".ts"], tsx: require.extensions[".tsx"], css: require.extensions[".css"] };
const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
require.extensions[".css"] = (module) => { module.exports = {}; };
Module._load = function (name, parent, isMain) {
  if (name.startsWith("@/")) return originalLoad.call(this, path.resolve(__dirname, "../../..", name.slice(2)), parent, isMain);
  if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
  if (name === "next/image") return { __esModule: true, default: (props) => React.createElement("img", props) };
  return originalLoad.call(this, name, parent, isMain);
};
const { getUpcomingDashboardSessions, dashboardDateLabel, dashboardWeekday } = require("../utils/dashboard-schedule.utils.ts");
const { DASHBOARD_SESSIONS } = require("../data/dashboard.data.ts");
const { DashboardNextSession } = require("../components/DashboardNextSession.tsx");
const { DashboardSchedule } = require("../components/DashboardSchedule.tsx");
const { DashboardTools } = require("../components/DashboardTools.tsx");

test("upcoming sessions exclude cancelled/completed, sort deterministically and preserve input", () => {
  const first = DASHBOARD_SESSIONS[0];
  const input = [{ ...first, id: "b" }, { ...first, id: "done", status: "COMPLETED" }, { ...first, id: "cancel", status: "CANCELED" }, { ...first, id: "a" }];
  const before = structuredClone(input);
  assert.deepEqual(getUpcomingDashboardSessions(input).map((item) => item.id), ["a", "b"]);
  assert.deepEqual(input, before);
  assert.deepEqual(getUpcomingDashboardSessions([]), []);
  assert.equal(dashboardDateLabel("2026-07-08"), "08/07/2026");
  assert.ok(dashboardWeekday("2026-07-08").includes("4"));
});

test("next-session panel exposes identity, date, time and a mock label without launching a sample meeting", () => {
  const session = DASHBOARD_SESSIONS[0];
  const html = renderToStaticMarkup(React.createElement(DashboardNextSession, { session, onSelect: () => {} }));
  for (const value of [session.studentFullName, session.classId, session.startTime, session.endTime, "(mẫu)", "Xem buổi học"]) assert.ok(html.includes(value));
  assert.ok(!html.includes(session.classroomLink));
});

test("schedule exposes labelled day filters and all five demo sessions, with a useful empty state", () => {
  const html = renderToStaticMarkup(React.createElement(DashboardSchedule, { sessions: DASHBOARD_SESSIONS }));
  assert.ok(html.includes("không phải lịch thực tế"));
  for (const session of DASHBOARD_SESSIONS) assert.ok(html.includes(session.classId));
  assert.ok(html.includes('aria-pressed="true"'));
  const empty = renderToStaticMarkup(React.createElement(DashboardSchedule, { sessions: [] }));
  assert.ok(empty.includes("Chưa có buổi học trong danh sách"));
  assert.ok(!empty.includes("dashboard-next-session"));
});

test("tools preserve functional LMS routes and use styled links without underline/upward-arrow patterns", () => {
  const html = renderToStaticMarkup(React.createElement(DashboardTools));
  for (const route of ["materials", "classes", "earnings", "messages"]) assert.ok(html.includes(`/lms/tutor/${route}`));
  assert.ok(!html.includes("underline"));
  assert.ok(html.includes('data-slot="button"'));
});

after(() => {
  require.extensions[".ts"] = originals.ts;
  require.extensions[".tsx"] = originals.tsx;
  if (originals.css) require.extensions[".css"] = originals.css;
  else delete require.extensions[".css"];
  Module._load = originalLoad;
});

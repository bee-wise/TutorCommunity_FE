/* eslint-disable @typescript-eslint/no-require-imports -- Node harness transpiles local TS and mocks Next boundaries. */
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
const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;

const box = ({ children, className, "aria-label": label }) => React.createElement("div", { className, "aria-label": label }, children);
Module._load = function (name, parent, isMain) {
  if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
  if (name === "next/image") return { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) };
  if (name === "@workspace/ui/components/ui/sidebar") return {
    Sidebar: box, SidebarContent: box, SidebarFooter: box, SidebarGroup: box, SidebarGroupContent: box,
    SidebarGroupLabel: box, SidebarHeader: box, SidebarMenu: box, SidebarMenuItem: box, SidebarRail: () => null,
    SidebarTrigger: ({ className, "aria-label": label }) => React.createElement("button", { className, "aria-label": label }),
    SidebarMenuButton: ({ children, className, isActive }) => React.cloneElement(React.Children.only(children), { className, "data-active": isActive }),
    useSidebar: () => ({ setOpenMobile: () => {}, toggleSidebar: () => {} }),
  };
  return originalLoad.call(this, name, parent, isMain);
};

const { navigationConfig } = require(path.resolve(__dirname, "../../../../../packages/core/configs/navigation.ts"));
const { LEARNER_CLASSES } = require("../../learner-materials/data/learner-materials.mock.ts");
const { LEARNER_EXERCISE_CLASSES, LEARNER_EXERCISES } = require("../../learner-exercises/data/learner-exercises.mock.ts");
const { LEARNER_TUITION_CLASSES } = require("../../learner-tuition-fee/data/tuition-fee.mock.ts");
const { LEARNER_CONVERSATIONS } = require("../../learner-messages/data/learner-messages.mock.ts");
const { getLearnerClassSummaries, getLearnerWorkspaceSessions } = require("../services/learner-classes.mock.service.ts");
const { getLearnerWorkspaceRoute, getLearnerWorkspaceLinks } = require("../utils/learner-class-workspace.utils.ts");
const { LearnerClassSidebar } = require("../components/LearnerClassSidebar.tsx");
const { LearnerClassCard } = require("../components/LearnerClassCard.tsx");
const { LearnerClassFilters } = require("../components/LearnerClassFilters.tsx");
const { LearnerClassesScreen } = require("../components/LearnerClassesScreen.tsx");
const { LearnerWorkspaceSkeleton } = require("../components/LearnerWorkspaceSkeleton.tsx");
const { LearnerClassOverviewScreen } = require("../components/LearnerClassOverviewScreen.tsx");
const { LearnerClassSessionsScreen } = require("../components/LearnerClassSessionsScreen.tsx");
const { LearnerReportScreen } = require("../../learner-overview/components/LearnerReportScreen.tsx");
const { getLearnerLearningReport } = require("../../learner-overview/services/learner-overview.mock.service.ts");
const render = (component, props = {}) => renderToStaticMarkup(React.createElement(component, props));

test("learner navigation separates overview, class learning and class chat", () => {
  const groups = navigationConfig.LEARNER;
  assert.deepEqual(groups.find((group) => group.groupName === "Tổng Quan").items.map((item) => [item.title, item.url]), [["Báo cáo học tập", "/lms/learner"], ["Lịch học của tôi", "/lms/learner/schedule"]]);
  const learning = groups.find((group) => group.groupName === "Học Tập").items;
  assert.deepEqual(learning.map((item) => item.url), ["/lms/learner/classes", "/lms/learner/chat"]);
  assert.equal(learning[1].title, "Tin nhắn lớp học");
  assert.ok(!groups.some((group) => group.items.some((item) => ["/lms/learner/materials", "/lms/learner/exercises"].includes(item.url))));
});

test("class workspace keeps old deep links, maps tuition IDs and excludes chat/fullscreen exercises", () => {
  const classId = "class-math-10";
  for (const [url, section] of [
    [`/lms/learner/classes/${classId}`, "overview"],
    [`/lms/learner/classes/${classId}/sessions`, "sessions"],
    [`/lms/learner/materials/classes/${classId}`, "materials"],
    [`/lms/learner/materials/classes/${classId}/sessions/math-session-01`, "materials"],
    [`/lms/learner/exercises/classes/${classId}`, "exercises"],
    [`/lms/learner/exercises/classes/${classId}/sessions/math-session-01`, "exercises"],
    ["/lms/learner/tuition-fee/tuition-math-10", "tuition"],
  ]) assert.deepEqual(getLearnerWorkspaceRoute(url), { classId, section });
  for (const url of ["/lms/learner/classes", "/lms/learner/chat/conversation-math-10", "/lms/learner/exercises/exercise-math-system", "/lms/learner/classes/a%2Fb", "/lms/learner/classes/%ZZ", "/lms/learner/tuition-fee/unknown"]) assert.equal(getLearnerWorkspaceRoute(url), null);
  assert.equal(getLearnerWorkspaceLinks(classId).tuition, "/lms/learner/tuition-fee/tuition-math-10");
});

test("materials, exercises, tuition and conversations identify the same learner classes", () => {
  const classes = new Map(LEARNER_CLASSES.map((item) => [item.id, item]));
  assert.equal(classes.size, 4);
  for (const item of LEARNER_EXERCISE_CLASSES) {
    assert.equal(item.name, classes.get(item.id)?.title);
    assert.equal(item.classCode, classes.get(item.id)?.code);
  }
  for (const item of LEARNER_TUITION_CLASSES) assert.equal(item.className, classes.get(item.learnerClassId)?.title);
  for (const item of LEARNER_CONVERSATIONS.filter((conversation) => classes.has(conversation.classId))) assert.equal(item.className, classes.get(item.classId)?.title);
  for (const exercise of LEARNER_EXERCISES) assert.equal(exercise.className, classes.get(exercise.classId)?.title);
  assert.equal(getLearnerClassSummaries().find((item) => item.classInfo.id === "class-literature-10")?.classInfo.status, "completed");
});

test("learner class sidebar has scoped links and no in-class chat action", () => {
  const html = render(LearnerClassSidebar, { workspace: { classId: "class-math-10", section: "materials" } });
  const links = getLearnerWorkspaceLinks("class-math-10");
  for (const href of Object.values(links)) assert.ok(html.includes(`href="${href}"`));
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
  assert.match(html, /BeeWiseLMS-Logo-500x150\.svg/);
  assert.match(html, /BeeWiseLMS-Logo-500x500\.svg/);
  assert.ok(html.indexOf('aria-label="Về danh sách lớp"') < html.indexOf("<img "));
  assert.doesNotMatch(html, /Tin nhắn lớp|\/lms\/learner\/chat/);
  assert.equal(html.split("Toán 10 - Nền tảng").length - 1, 1);
});

test("class directory, overview and session screen connect materials, exercises and tuition", () => {
  const directory = render(LearnerClassesScreen);
  assert.match(directory, /Lớp học|Dữ liệu minh họa/);
  assert.match(directory, /\/lms\/learner\/classes\/class-math-10/);
  const overview = render(LearnerClassOverviewScreen, { classId: "class-math-10" });
  assert.match(overview, /Thông tin lớp|Gia sư phụ trách/);
  assert.match(overview, /\/lms\/learner\/materials\/classes\/class-math-10/);
  assert.match(overview, /\/lms\/learner\/exercises\/classes\/class-math-10/);
  assert.doesNotMatch(overview, /<h1[^>]*>Toán 10 - Nền tảng/);
  const sessions = getLearnerWorkspaceSessions("class-math-10");
  assert.deepEqual(sessions.map((item) => item.session.sequence), [12, 13, 14]);
  const sessionScreen = render(LearnerClassSessionsScreen, { classId: "class-math-10" });
  assert.match(sessionScreen, /learner-class-session-search|learner-class-session-status/);
  assert.match(sessionScreen, /\/materials\/classes\/class-math-10\/sessions\/math-session-01/);
  assert.match(sessionScreen, /\/exercises\/classes\/class-math-10\/sessions\/math-session-01/);
});

test("learner class cards keep one target, clear status, tutor and actionable exercise notice", () => {
  const summaries = getLearnerClassSummaries();
  const active = render(LearnerClassCard, summaries.find((item) => item.classInfo.id === "class-math-10"));
  assert.equal((active.match(/<a /g) ?? []).length, 1);
  for (const detail of ["BW-MATH-1042", "Toán 10 - Nền tảng", "Cô Nguyễn Thu Hà", "Đang học", "bài tập cần làm", "Vào lớp"]) assert.ok(active.includes(detail));
  assert.match(active, /rounded-3xl border border-border bg-card/);
  assert.doesNotMatch(active, /rounded-2xl border border-border bg-background p-3/);
  const completed = render(LearnerClassCard, summaries.find((item) => item.classInfo.id === "class-literature-10"));
  assert.match(completed, /Đã kết thúc/);
  assert.match(completed, /Xem lại lớp/);
  assert.match(completed, /bài tập cần làm/);
});

test("class filters and loading state match the compact responsive directory", () => {
  const filters = { kind: "individual", search: "", subject: "all", status: "all", sort: "newest" };
  const html = render(LearnerClassFilters, { filters, subjects: ["Toán", "Vật lý"], counts: { individual: 3, group: 1 }, resultCount: 2, hasFilters: false, onChange() {}, onReset() {} });
  assert.match(html, /Bộ lọc lớp học|Loại lớp học|Tìm lớp hoặc gia sư/);
  assert.match(html, /learner-class-search|learner-class-subject|learner-class-status|learner-class-sort/);
  assert.match(html, /2 lớp phù hợp|aria-pressed="true"/);
  assert.match(html, /role="combobox"/);
  assert.match(html, /<select aria-hidden="true"/);
  assert.doesNotMatch(html, /Xóa lọc/);
  const emptyFilters = render(LearnerClassFilters, { filters, subjects: [], counts: { individual: 3, group: 1 }, resultCount: 0, hasFilters: true, onChange() {}, onReset() {} });
  assert.doesNotMatch(emptyFilters, /Xóa lọc/);
  const skeleton = render(LearnerWorkspaceSkeleton, { view: "classes" });
  assert.match(skeleton, /Đang tải danh sách lớp học|motion-safe:animate-pulse/);
  assert.match(skeleton, /md:grid-cols-2 xl:grid-cols-3/);
});

test("learning report is the sole overview and shows honest sample aggregates with class links", () => {
  const report = getLearnerLearningReport();
  assert.equal(report.length, LEARNER_CLASSES.length);
  assert.equal(report.find((item) => item.classInfo.id === "class-math-10")?.exerciseCount, 2);
  const reportHtml = render(LearnerReportScreen);
  assert.match(reportHtml, /Báo cáo học tập|Tiến độ từ dữ liệu mẫu|chưa phải báo cáo chính thức/);
  assert.match(reportHtml, /\/lms\/learner\/classes\/class-literature-10/);
  const rootPage = fs.readFileSync(path.resolve(__dirname, "../../../app/lms/learner/page.tsx"), "utf8");
  const legacyReportPage = fs.readFileSync(path.resolve(__dirname, "../../../app/lms/learner/report/page.tsx"), "utf8");
  assert.match(rootPage, /<LearnerReportScreen \/>/);
  assert.match(legacyReportPage, /redirect\("\/lms\/learner"\)/);
});

after(() => {
  require.extensions[".ts"] = originalTs;
  require.extensions[".tsx"] = originalTsx;
  Module._load = originalLoad;
});

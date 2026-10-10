/* eslint-disable @typescript-eslint/no-require-imports -- Native Node harness transpiles feature modules and mocks Next boundaries. */
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
let chatFixture;
const box = ({ children, className, "aria-label": label }) => React.createElement("div", { className, "aria-label": label }, children);
Module._load = function (name, parent, isMain) {
  if (name.startsWith("@/")) return originalLoad.call(this, path.resolve(__dirname, "../../..", name.slice(2)), parent, isMain);
  if (name === "@phosphor-icons/react") return { UserPlusIcon: () => null };
  if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
  if (name === "next/image") return { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) };
  if (name === "@workspace/ui/components/ui/sidebar") return {
    Sidebar: box, SidebarContent: box, SidebarFooter: box, SidebarGroup: box, SidebarGroupContent: box,
    SidebarGroupLabel: box, SidebarHeader: box, SidebarMenu: box, SidebarMenuItem: box, SidebarRail: () => null,
    SidebarTrigger: ({ className, "aria-label": label }) => React.createElement("button", { className, "aria-label": label }),
    SidebarMenuButton: ({ children, className, isActive }) => React.cloneElement(React.Children.only(children), { className, "data-active": isActive }),
    useSidebar: () => ({ setOpenMobile: () => {}, toggleSidebar: () => {} }),
  };
  if (parent?.filename.endsWith("ClassChatScreen.tsx") && name === "../hooks/useClassChat") return { useClassChat: () => chatFixture };
  return originalLoad.call(this, name, parent, isMain);
};
const { getClassWorkspaceRoute, getClassWorkspaceLinks } = require("../utils/class-workspace.utils.ts");
const { TUTOR_CLASSES } = require("../data/classes.mock.ts");
const { ClassWorkspaceSidebar } = require("../components/ClassWorkspaceSidebar.tsx");
const { ClassDetailScreen } = require("../components/ClassDetailScreen.tsx");
const { ClassMembersScreen } = require("../components/ClassMembersScreen.tsx");
const { ClassWorkspaceSkeleton } = require("../components/ClassWorkspaceSkeleton.tsx");
const { ClassWorkspaceHeader } = require("../components/ClassWorkspaceHeader.tsx");
const { ClassSessionList } = require("../components/ClassSessionList.tsx");
const { ClassStatusBadge, SessionStatusBadge, AttendanceStateBadge, ClassKindBadge } = require("../components/ClassBadges.tsx");
const { getMockClassChatRoom, sendMockClassMessage } = require("../../tutor-class-chat/services/class-chat.mock.service.ts");
const { classChatQueryKeys } = require("../../tutor-class-chat/query-keys.ts");
const { classChatMessageSchema } = require("../../tutor-class-chat/schemas/class-chat.schema.ts");
const { ClassChatScreen } = require("../../tutor-class-chat/components/ClassChatScreen.tsx");
const { navigationConfig } = require("../../../../../packages/core/configs/navigation.ts");
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
const group = TUTOR_CLASSES.find((item) => item.id === "class-group-math");
const completed = TUTOR_CLASSES.find((item) => item.id === "class-group-review");

test("Tutor global navigation separates schedules, class work and connection chat without removing learner entries", () => {
  const work = navigationConfig.TUTOR.find((item) => item.groupName === "Công Việc");
  assert.deepEqual(work.items.map((item) => item.url), ["/lms/tutor/classes", "/lms/tutor/messages"]);
  assert.ok(navigationConfig.TUTOR.find((item) => item.groupName === "Tổng Quan").items.some((item) => item.url === "/lms/tutor/schedule"));
  const learnerNavigation = navigationConfig.LEARNER.flatMap((item) => item.items);
  assert.ok(learnerNavigation.some((item) => item.url === "/lms/learner/classes"));
  assert.ok(learnerNavigation.some((item) => item.url === "/lms/learner/chat"));
});

test("workspace routing resolves one class and section, preserves materials URLs and excludes fullscreen/other roles", () => {
  for (const section of ["sessions", "members", "messages"]) assert.deepEqual(getClassWorkspaceRoute(`/lms/tutor/classes/class-01/${section}`), { classId: "class-01", section });
  assert.deepEqual(getClassWorkspaceRoute("/lms/tutor/classes/class%20one/"), { classId: "class one", section: "overview" });
  assert.deepEqual(getClassWorkspaceRoute("/lms/tutor/materials/classes/class-01"), { classId: "class-01", section: "materials" });
  for (const url of ["/lms/tutor/classes", "/lms/tutor/materials", "/lms/tutor/materials/session-01/preview", "/lms/tutor/messages/room-01", "/lms/learner/classes/class-01", "/lms/tutor/classes/%ZZ", "/lms/tutor/classes/a%2Fb", "/lms/tutor/classes/a%5Cb", "/lms/tutor/classes/class-01/unknown"]) assert.equal(getClassWorkspaceRoute(url), null);
  assert.equal(getClassWorkspaceLinks("class one").materials, "/lms/tutor/materials/classes/class%20one");
});

test("class sidebar has five scoped sections, current state, brand and escape to class list", () => {
  const html = render(ClassWorkspaceSidebar, { workspace: { classId: group.id, section: "members" } });
  for (const href of Object.values(getClassWorkspaceLinks(group.id))) assert.ok(html.includes(`href="${href}"`));
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
  assert.match(html, /alt="BeeWise LMS"/);
  assert.match(html, /BeeWiseLMS-Logo-500x150\.svg/);
  assert.match(html, /BeeWiseLMS-Logo-500x500\.svg/);
  assert.match(html, /Về danh sách lớp/);
  assert.doesNotMatch(html, />LMS</);
  assert.ok(html.indexOf('aria-label="Về danh sách lớp"') < html.indexOf("<img "));
  assert.equal((html.match(/href="\/lms\/tutor\/classes"/g) ?? []).length, 2);
  assert.equal(html.split(group.title).length - 1, 1);
  assert.doesNotMatch(html, /\/lms\/tutor\/messages|underline/);
});

test("overview keeps class facts and actionable attendance; sessions live on a separate screen", () => {
  const html = render(ClassDetailScreen, { classId: group.id });
  assert.match(html, /BW-G201|Luyện tập hệ phương trình/);
  assert.match(html, /2 buổi chưa xác nhận điểm danh/);
  assert.ok(html.includes(`${group.id}/sessions`));
  assert.ok(html.includes(`${group.id}/members`));
  assert.doesNotMatch(html, /Tìm buổi học|class-session-status/);
  assert.ok(!html.includes(group.title));
  const archived = render(ClassDetailScreen, { classId: completed.id });
  assert.match(archived, /Lớp đã kết thúc/);
  assert.doesNotMatch(archived, /chưa xác nhận điểm danh/);
});

test("member cards retain names and emails; missing class never renders a foreign roster", () => {
  const html = render(ClassMembersScreen, { classId: group.id });
  assert.match(html, /Tìm học viên|minh.anh@example.com/);
  assert.match(html, /gia.huy@example.com/);
  assert.match(html, /Võ Thảo My/);
  const missing = render(ClassMembersScreen, { classId: "unknown-class" });
  assert.match(missing, /Không tìm thấy lớp học/);
  assert.doesNotMatch(missing, /example.com/);
});

test("each class owns one common room with its full roster and immutable snapshots", () => {
  const room = getMockClassChatRoom(group.id);
  assert.equal(room.participants.length, group.learnerIds.length + 1);
  assert.deepEqual(room.participants.filter((item) => item.role === "LEARNER").map((item) => item.id).sort(), [...group.learnerIds].sort());
  assert.equal(getMockClassChatRoom("class-ma-math").participants.length, 2);
  const before = room.messages.length;
  sendMockClassMessage(group.id, { content: "  Bài tập mới của lớp  " });
  assert.equal(room.messages.length, before);
  assert.equal(getMockClassChatRoom(group.id).messages.at(-1).content, "Bài tập mới của lớp");
  assert.ok(getMockClassChatRoom("class-ma-math").messages.every((message) => message.classId === "class-ma-math" && !message.content.includes("Bài tập mới của lớp")));
  assert.notDeepEqual(classChatQueryKeys.room(group.id), classChatQueryKeys.room("class-ma-math"));
  room.messages[0].content = "changed snapshot";
  assert.notEqual(getMockClassChatRoom(group.id).messages[0].content, "changed snapshot");
});

test("closed class service rejects writes even when UI is bypassed; input boundaries validate", () => {
  const room = getMockClassChatRoom(completed.id);
  assert.equal(room.readOnly, true);
  assert.throws(() => sendMockClassMessage(completed.id, { content: "Hi" }), /chỉ có thể xem/);
  assert.equal(getMockClassChatRoom(completed.id).messages.length, room.messages.length);
  assert.throws(() => sendMockClassMessage("missing", { content: "Hi" }), /Không tìm thấy/);
  for (const content of ["   ", "x".repeat(2001)]) assert.equal(classChatMessageSchema.safeParse({ content }).success, false);
  assert.equal(classChatMessageSchema.safeParse({ content: "x".repeat(2000) }).success, true);
});

test("archived class UI hides composer while active class offers a labelled common-room input", () => {
  const fixture = (classInfo) => ({ classInfo, room: getMockClassChatRoom(classInfo.id), loading: false, error: null,
    historyRef: { current: null }, sending: false, submit: async () => {},
    form: { register: () => ({ name: "content" }), formState: { errors: {} } } });
  chatFixture = fixture(completed);
  const archived = render(ClassChatScreen, { classId: completed.id });
  assert.match(archived, /Cuộc trò chuyện ở chế độ chỉ xem/);
  assert.doesNotMatch(archived, /<form|<textarea|Gửi tin nhắn lớp/);
  chatFixture = fixture(group);
  const active = render(ClassChatScreen, { classId: group.id });
  assert.match(active, /Tin nhắn cho cả lớp|<textarea/);
  assert.match(active, /Tin nhắn mock chỉ lưu/);
  assert.ok(!active.includes(group.title));
  assert.match(active, /role="log"/);
});

test("screen skeletons use labelled loading regions and reduced-motion-safe shapes", () => {
  for (const screen of ["overview", "sessions", "members"]) {
    const html = render(ClassWorkspaceSkeleton, { screen });
    assert.match(html, /role="status"/);
    assert.match(html, /motion-safe:animate-pulse/);
  }
});

test("badges follow compact benchmark status treatments and keep metadata distinct", () => {
  const active = render(ClassStatusBadge, { status: "active" });
  assert.match(active, /rounded-full|Đang học/);
  assert.match(active, /bg-secondary\/15/);
  assert.match(active, /text-foreground/);
  assert.match(active, /aria-hidden="true"/);
  assert.doesNotMatch(active, /bg-secondary text-foreground/);
  assert.match(render(ClassStatusBadge, { status: "upcoming" }), /bg-accent\/25/);
  assert.match(render(SessionStatusBadge, { status: "ongoing" }), /bg-primary\/10/);
  assert.match(render(AttendanceStateBadge, { record: { state: "confirmed" } }), /bg-secondary\/15/);
  const kind = render(ClassKindBadge, { kind: "group" });
  assert.match(kind, /border-border bg-card text-primary/);
  assert.match(kind, /Lớp nhóm/);
});

test("session screen has one visible title with compact labelled responsive filters", () => {
  const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement(ClassWorkspaceHeader, { classInfo: group, title: "Buổi học & điểm danh" }),
    React.createElement(ClassSessionList, { classInfo: group, onAttendance() {} }),
  ));
  assert.equal((html.match(/Buổi học &amp; điểm danh/g) ?? []).length, 1);
  assert.match(html, /aria-label="Danh sách buổi học"/);
  assert.match(html, /lg:grid-cols-\[minmax\(0,1fr\)_180px_180px\]/);
  assert.match(html, /for="class-session-status"/);
  assert.match(html, /for="class-attendance-state"/);
  assert.match(html, /h-11/);
  assert.ok(!html.includes(group.title));
});

after(() => {
  Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs; else delete require.extensions[".ts"];
  if (originalTsx) require.extensions[".tsx"] = originalTsx; else delete require.extensions[".tsx"];
});

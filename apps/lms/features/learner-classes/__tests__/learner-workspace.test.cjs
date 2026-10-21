/* eslint-disable @typescript-eslint/no-require-imports -- Native HTTP/SSR harness, not browser/provider E2E. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  Module = require("node:module"),
  path = require("node:path"),
  ts = require("typescript"),
  React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { QueryClient, QueryClientProvider } = require("@tanstack/react-query");
const originalLoad = Module._load,
  extensions = {
    ts: require.extensions[".ts"],
    tsx: require.extensions[".tsx"],
  };
const compile = (module, file) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    file,
  );
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
const id = "3612984e-8929-8022-e3d0-01b6dae175ad",
  actor = "11111111-1111-4111-8111-111111111111",
  sessionId = "22222222-2222-4222-8222-222222222222",
  foreign = "33333333-3333-4333-8333-333333333333";
let auth = { user: { id: actor, role: "LEARNER" }, isAuthLoading: false },
  payload,
  failure;
const calls = [],
  box = ({ children, className, "aria-label": label }) =>
    React.createElement("div", { className, "aria-label": label }, children);
Module._load = function (name, parent, isMain) {
  if (name === "@workspace/core/apiClient")
    return {
      apiClient: Object.fromEntries(
        ["get", "post", "put"].map((method) => [
          method,
          async (url, arg, config) => {
            calls.push({
              method,
              url,
              body: method === "get" ? undefined : arg,
              config: method === "get" ? arg : config,
            });
            if (failure) throw failure;
            return payload;
          },
        ]),
      ),
    };
  if (name === "../store/useAuthStore")
    return { useAuthStore: (selector) => selector(auth) };
  if (name === "next/link")
    return {
      __esModule: true,
      default: ({ children, ...props }) =>
        React.createElement("a", props, children),
    };
  if (name === "next/image")
    return {
      __esModule: true,
      default: ({ src, alt }) => React.createElement("img", { src, alt }),
    };
  if (name === "next/navigation")
    return { useRouter: () => ({ push() {}, replace() {} }) };
  if (name === "next/dynamic")
    return { __esModule: true, default: () => () => null };
  if (name === "@workspace/ui/components/ui/bee-toast")
    return { toast: { success() {}, error() {} } };
  if (name === "@workspace/ui/components/ui/sidebar")
    return {
      Sidebar: box,
      SidebarContent: box,
      SidebarFooter: box,
      SidebarGroup: box,
      SidebarGroupContent: box,
      SidebarGroupLabel: box,
      SidebarHeader: box,
      SidebarMenu: box,
      SidebarMenuItem: box,
      SidebarRail: () => null,
      SidebarTrigger: (props) =>
        React.createElement("button", { "aria-label": props["aria-label"] }),
      SidebarMenuButton: ({ children, asChild, disabled, isActive }) =>
        asChild
          ? React.cloneElement(React.Children.only(children), {
              "data-active": isActive,
            })
          : React.createElement("button", { disabled }, children),
      useSidebar: () => ({ setOpenMobile() {}, toggleSidebar() {} }),
    };
  return originalLoad.call(this, name, parent, isMain);
};
const core = path.resolve(__dirname, "../../../../../packages/core");
const { lmsClassKeys: keys } = require(
  path.join(core, "lms-classes/query-keys.ts"),
);
const { ApiError } = require(path.join(core, "sys-libs/error-handler.ts"));
const {
  learnerClassesService: service,
} = require("../services/learner-classes.service.ts");
const {
  learnerAdmissionsService: admissions,
  learnerAdmissionSchema,
} = require("../../group-admissions/services/learner-admissions.service.ts");
const calendar = require("../utils/learner-api-calendar.ts");
const {
  LearnerClassesScreen,
} = require("../components/LearnerClassesScreen.tsx");
const {
  LearnerClassOverviewScreen,
} = require("../components/LearnerClassOverviewScreen.tsx");
const {
  LearnerClassSidebar,
} = require("../components/LearnerClassSidebar.tsx");
const {
  LearnerApiClassCard,
} = require("../components/LearnerApiClassCard.tsx");
const {
  LearnerClassCalendar,
} = require("../components/LearnerClassCalendar.tsx");
const {
  LearnerClassQueryError,
} = require("../components/LearnerClassQueryError.tsx");
const {
  useLearnerSessionResources,
} = require("../hooks/useLearnerSessionResources.ts");
const {
  LearnerAdmissionDetails,
} = require("../../group-admissions/components/LearnerAdmissionDetails.tsx");
const fixture = {
  id,
  type: "GROUP",
  teachingOfferingId: null,
  programName: null,
  teachingItemName: "Toán",
  contextName: null,
  tutorId: foreign,
  teachingMode: "ONLINE",
  status: "ACTIVE",
  capacity: 6,
  activeMembers: 2,
  pricePerHour: 100000,
  sessionDurationMinutes: 60,
  numberOfSessions: 8,
  createdAt: "2026-10-13T02:00:00Z",
  title: "Lớp kiểm thử tích hợp",
  code: "TEST-L1",
  approvalStatus: "APPROVED",
  billingMode: "MONTHLY",
  openingAt: null,
  sessionCount: 4,
  learnerCount: 2,
  features: { attendance: true, feedback: false },
};
const session = {
  id: sessionId,
  classId: id,
  tutorId: foreign,
  learnerId: null,
  startAt: "2026-10-13T16:30:00Z",
  endAt: "2026-10-13T17:30:00Z",
  actualEndAt: null,
  teachingMode: "ONLINE",
  locationOrMeetingInfo: "Phòng kiểm thử",
  status: "COMPLETED",
  replacesSessionId: null,
  plannedScheduleId: null,
  actualStartAt: null,
  version: 1,
  durationMinutes: 60,
};
const admission = {
  id: sessionId,
  classId: id,
  learnerId: actor,
  status: "REGISTERED",
  version: 3,
  trialStartAt: null,
  trialEndAt: null,
  trialMeetingInfo: null,
  trialCompletedAt: null,
  missedLessonsAcknowledgedAt: null,
  enrollmentId: null,
  missedSessionIds: [],
  referredByTutorId: foreign,
  firstMonthFee: null,
  trialRequested: false,
};
function respond(data) {
  failure = null;
  payload = { success: true, data };
}
function client() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}
function render(Component, props = {}, cache = client()) {
  return renderToStaticMarkup(
    React.createElement(
      QueryClientProvider,
      { client: cache },
      React.createElement(Component, props),
    ),
  );
}
function seedClass(cache) {
  cache.setQueryData(keys.resource(actor, id, "learner-class"), fixture);
}
test("Learner list sends role-aware contract with cookies, filters and server paging", async () => {
  respond({ items: [fixture], total: 19, page: 2, pageSize: 6 });
  const result = await service.list({
    kind: "GROUP",
    search: "Toán",
    status: "ACTIVE",
    sort: "OLDEST",
    page: 2,
  });
  assert.equal(result.total, 19);
  assert.equal(result.items.length, 1);
  assert.equal(calls.at(-1).url, "/lms/classes");
  assert.deepEqual(calls.at(-1).config.params, {
    Type: "GROUP",
    Search: "Toán",
    Status: "ACTIVE",
    Sort: "OLDEST",
    Page: 2,
    PageSize: 6,
  });
  assert.equal(calls.at(-1).config.withCredentials, true);
  assert.equal("learnerId" in calls.at(-1).config.params, false);
});
test(".NET GUID and nullable fields validate; malformed envelopes fail closed", async () => {
  respond(fixture);
  assert.equal((await service.detail(id)).id, id);
  respond({ ...fixture, sessionCount: "four" });
  await assert.rejects(
    () => service.detail(id),
    (e) => e.statusCode === 502 && !e.message.includes("four"),
  );
});
test("session range/paging stay server-owned; a cross-class response is rejected", async () => {
  respond({ items: [session], total: 21, page: 2, pageSize: 6 });
  const result = await service.sessions(id, {
    page: 2,
    pageSize: 6,
    status: "all",
    ...calendar.monthRange("2026-10"),
  });
  assert.equal(result.total, 21);
  assert.equal(calls.at(-1).config.params.from, "2026-10-01T00:00:00+07:00");
  assert.equal(calls.at(-1).config.params.status, undefined);
  respond({ ...session, classId: foreign });
  await assert.rejects(
    () => service.session(id, sessionId),
    (e) => e.statusCode === 502,
  );
});
test("calendar uses Vietnam boundaries, year rollover and overlapping midnight sessions", () => {
  assert.equal(calendar.vietnamDate("2026-10-13T18:00:00Z"), "2026-10-14");
  assert.equal(calendar.nextMonth("2026-12", 1), "2027-01");
  assert.deepEqual(calendar.monthRange("2026-12"), {
    from: "2026-12-01T00:00:00+07:00",
    to: "2027-01-01T00:00:00+07:00",
  });
  assert.equal(
    calendar.sessionOverlapsDate(session.startAt, session.endAt, "2026-10-13"),
    true,
  );
  assert.equal(
    calendar.sessionOverlapsDate(session.startAt, session.endAt, "2026-10-14"),
    true,
  );
  assert.equal(
    calendar.sessionOverlapsDate(
      "2026-10-13T16:00:00Z",
      "2026-10-13T17:00:00Z",
      "2026-10-14",
    ),
    false,
  );
  const html = render(LearnerClassCalendar, {
    month: "2026-10",
    sessions: [session],
    onSelect() {},
  });
  assert.match(html, /2026-10-13/);
  assert.match(html, /2026-10-14/);
  assert.match(html, /grid-cols-7/);
});
test("card has one target and actual server facts, not invented material/progress/Tutor names", () => {
  const html = render(LearnerApiClassCard, { data: fixture });
  assert.equal((html.match(/<a /g) || []).length, 1);
  assert.match(html, /TEST-L1|4 buổi|Đang học|Vào lớp/);
  assert.doesNotMatch(html, /bài tập cần làm|tài liệu|Cô Nguyễn|50%/);
});
test("directory uses total and tab counts, not visible page length", () => {
  const cache = client(),
    defaults = {
      kind: "INDIVIDUAL",
      search: "",
      status: "all",
      sort: "NEWEST",
      page: 1,
    };
  cache.setQueryData(
    keys.resource(
      actor,
      "00000000-0000-0000-0000-000000000000",
      "learner-directory",
      defaults,
    ),
    { items: [fixture], total: 19, page: 1, pageSize: 6 },
  );
  for (const kind of ["INDIVIDUAL", "GROUP"])
    cache.setQueryData(
      keys.resource(
        actor,
        "00000000-0000-0000-0000-000000000000",
        "learner-count",
        kind,
      ),
      { items: [], total: kind === "GROUP" ? 8 : 11, page: 1, pageSize: 6 },
    );
  const html = render(LearnerClassesScreen, {}, cache);
  assert.match(html, /19 lớp phù hợp/);
  assert.match(html, /Lớp nhóm \(8\)|Lớp 1:1 \(11\)/);
  assert.match(html, /TEST-L1/);
  assert.doesNotMatch(html, /Dữ liệu minh họa/);
  cache.clear();
});
test("overview/sidebar share authorized identity and deferred modules stay gated", () => {
  const cache = client();
  seedClass(cache);
  const overview = render(LearnerClassOverviewScreen, { classId: id }, cache),
    sidebar = render(
      LearnerClassSidebar,
      { workspace: { classId: id, section: "overview" } },
      cache,
    );
  assert.match(overview, /Nội dung &amp; lịch học|4.*buổi/);
  assert.match(overview, /<h1[^>]*>Lớp kiểm thử/);
  assert.match(sidebar, /Lớp kiểm thử tích hợp/);
  assert.match(sidebar, /BeeWiseLMS-Logo-500x150.svg/);
  assert.match(sidebar, /chưa tích hợp/);
  assert.doesNotMatch(sidebar, /href="[^"]*materials/);
  cache.clear();
});
test("wrong role/loading/403 hide seeded data; back remains Learner", async () => {
  const cache = client();
  seedClass(cache);
  auth = { user: { id: actor, role: "TUTOR" }, isAuthLoading: false };
  const html = render(LearnerClassOverviewScreen, { classId: id }, cache);
  assert.doesNotMatch(html, /TEST-L1|Lớp kiểm thử/);
  assert.match(html, /\/lms\/learner\/classes/);
  assert.doesNotMatch(html, /\/lms\/tutor/);
  auth = { user: { id: actor, role: "LEARNER" }, isAuthLoading: true };
  assert.doesNotMatch(
    render(LearnerClassOverviewScreen, { classId: id }, cache),
    /TEST-L1/,
  );
  auth = { user: { id: actor, role: "LEARNER" }, isAuthLoading: false };
  failure = new ApiError("Forbidden", 403);
  await assert.rejects(
    () => service.detail(id),
    (e) => e.statusCode === 403,
  );
  failure = null;
  cache.clear();
});
test("only own mark is visible; no roster/history write/read and recording not preloaded", () => {
  const cache = client();
  cache.setQueryData(
    keys.resource(actor, id, "learner-session", sessionId),
    session,
  );
  cache.setQueryData(
    keys.resource(actor, id, "learner-personal-attendance", sessionId),
    {
      sessionId,
      status: "DRAFT",
      version: 0,
      marks: [
        { learnerId: foreign, status: "ABSENT" },
        { learnerId: actor, status: "UNMARKED" },
      ],
    },
  );
  function Probe() {
    const state = useLearnerSessionResources(id, sessionId, true, true);
    return React.createElement(
      "p",
      null,
      state.mark?.learnerId +
        ":" +
        state.mark?.status +
        ":" +
        (state.url ?? "no-recording"),
    );
  }
  const before = calls.length,
    html = render(Probe, {}, cache);
  assert.match(html, new RegExp(actor + ":UNMARKED:no-recording"));
  assert.doesNotMatch(html, new RegExp(foreign));
  assert.equal(calls.length, before);
  cache.clear();
});
test("trial preference is typed/versioned, distinct from confirm/missed/fee actions", async () => {
  assert.equal(learnerAdmissionSchema.parse(admission).trialRequested, false);
  respond(admission);
  await admissions.preference(sessionId, {
    expectedVersion: 3,
    trialRequested: true,
  });
  assert.equal(calls.at(-1).method, "put");
  assert.equal(
    calls.at(-1).url,
    "/lms/group-admissions/" + sessionId + "/trial-preference",
  );
  assert.deepEqual(calls.at(-1).body, {
    expectedVersion: 3,
    trialRequested: true,
  });
  for (const action of [
    "trial/confirm",
    "acknowledge-missed",
    "first-month-fee/accept",
    "cancel",
  ]) {
    await admissions.action(sessionId, action, 3);
    assert.equal(
      calls.at(-1).url,
      "/lms/group-admissions/" + sessionId + "/" + action,
    );
  }
  failure = new ApiError("stale", 409);
  await assert.rejects(
    () =>
      admissions.preference(sessionId, {
        expectedVersion: 2,
        trialRequested: true,
      }),
    (e) => e.statusCode === 409,
  );
  failure = null;
});
test("pre-opening auto-enrollment vs late optional trial, with no Tutor controls", () => {
  const cache = client();
  cache.setQueryData(
    keys.resource(actor, sessionId, "learner-admission"),
    admission,
  );
  let html = render(LearnerAdmissionDetails, { id: sessionId }, cache);
  assert.match(html, /Không học thử|Tôi muốn học thử|Tutor gửi yêu cầu ADD/);
  assert.doesNotMatch(html, /Báo giá lại|Duyệt báo giá|Xác nhận đã học thử/);
  cache.setQueryData(keys.resource(actor, sessionId, "learner-admission"), {
    ...admission,
    referredByTutorId: null,
    trialRequested: true,
  });
  html = render(LearnerAdmissionDetails, { id: sessionId }, cache);
  assert.match(html, /tự tạo enrollment/);
  assert.doesNotMatch(html, /Tôi muốn học thử|Tạo yêu cầu thanh toán/);
  cache.clear();
});
test("navigation keeps report/schedule, class library entries and class chat outside workspace", () => {
  const { navigationConfig } = require(
    path.join(core, "configs/navigation.ts"),
  );
  const groups = navigationConfig.LEARNER;
  assert.deepEqual(
    groups.find((g) => g.groupName === "Tổng Quan").items.map((i) => i.url),
    ["/lms/learner", "/lms/learner/schedule"],
  );
  assert.deepEqual(
    groups.find((g) => g.groupName === "Học Tập").items.map((i) => i.url),
    [
      "/lms/learner/classes",
      "/lms/learner/materials",
      "/lms/learner/exercises",
      "/lms/learner/chat",
    ],
  );
  const html = render(LearnerClassQueryError, {
    error: new ApiError("Denied", 403),
    onRetry() {},
    detail: true,
  });
  assert.match(html, /\/lms\/learner\/classes/);
  assert.doesNotMatch(html, /\/lms\/tutor/);
});
test("class progress uses server total, handles missing plans and never invents completion", () => {
  const { LearnerClassProgress } = require("../components/LearnerClassProgress.tsx");
  const cache = client();
  cache.setQueryData(keys.resource(actor, id, "learner-completed-count"), {items: [], total: 3, page: 1, pageSize: 1});
  const html = render(LearnerClassProgress, {classId:id, planned:8}, cache);
  assert.match(html, /aria-valuenow="38"/);
  assert.match(html, /3 buổi hoàn thành trên 8 buổi dự kiến/);
  const unplanned = render(LearnerClassProgress, {classId:id, planned:0}, cache);
  assert.doesNotMatch(unplanned, /role="progressbar"/);
  assert.match(unplanned, /Chưa có số buổi dự kiến/);
  cache.clear();
});
test("sessions retain server pagination and contextual details without status grouping or a monthly calendar", () => {
  const { LearnerClassSessionsScreen } = require("../components/LearnerClassSessionsScreen.tsx");
  const cache = client();
  seedClass(cache);
  const params = {page:1,pageSize:6,status:"all",...calendar.monthRange(calendar.vietnamDate(new Date().toISOString()).slice(0,7))};
  cache.setQueryData(keys.resource(actor,id,"learner-sessions",params), {items:[session,{...session,id:foreign,status:"SCHEDULED"}],total:21,page:1,pageSize:6});
  const html = render(LearnerClassSessionsScreen,{classId:id},cache);
  assert.doesNotMatch(html, /Lịch tháng|grid-cols-7/);
  assert.doesNotMatch(html, /Đang diễn ra &amp; sắp tới|Các buổi khác/);
  assert.match(html, /21.*buổi trong tháng/);
  // Preserves server order: COMPLETED (session) precedes SCHEDULED (foreign)
  assert.ok(html.indexOf("Đã hoàn thành") < html.indexOf("Chưa bắt đầu"));
  assert.equal((html.match(/>Xem buổi học</g)||[]).length,2);
  if (process.env.LMS_QA_DIR) fs.writeFileSync(path.join(process.env.LMS_QA_DIR,"sessions.html"), html);
  cache.clear();
});
test("sessions render metadata name, description, tutorName, and teachingItemName with neutral fallbacks", () => {
  const { LearnerClassSessionsScreen } = require("../components/LearnerClassSessionsScreen.tsx");
  const cache = client();
  seedClass(cache);
  const params = {page:1,pageSize:6,status:"all",...calendar.monthRange(calendar.vietnamDate(new Date().toISOString()).slice(0,7))};
  const namedSession = {
    ...session,
    id: foreign,
    name: "Buổi 1: Giới thiệu lập trình",
    description: "Nội dung tổng quan về biến, vòng lặp và cấu trúc dữ liệu.",
    status: "SCHEDULED",
    tutorName: "Thầy Hoàng",
    teachingItemName: "Lập trình C++",
  };
  const fallbackSession = {
    ...session,
    id: id,
    name: null,
    description: null,
    tutorName: null,
    teachingItemName: null,
    status: "ONGOING",
  };
  cache.setQueryData(keys.resource(actor,id,"learner-sessions",params), {items:[namedSession, fallbackSession],total:2,page:1,pageSize:6});
  const html = render(LearnerClassSessionsScreen,{classId:id},cache);
  assert.match(html, /Buổi 1: Giới thiệu lập trình/);
  assert.match(html, /Nội dung tổng quan về biến, vòng lặp và cấu trúc dữ liệu/);
  assert.match(html, /Gia sư: Thầy Hoàng/);
  assert.match(html, /Lập trình C\+\+/);
  assert.match(html, /Chưa có thông tin gia sư/);
  assert.match(html, /Chưa có môn học/);
  cache.clear();
});
test("Vietnam date-time range formatting and validation enforce UTC+7 without local timezone corruption", () => {
  // Midnight and month rollover in UTC+7
  const fromIso = calendar.toVietnamOffsetIso("2026-10-31T23:30");
  const toIso = calendar.toVietnamOffsetIso("2026-11-01T01:00");
  assert.equal(fromIso, "2026-10-31T23:30:00+07:00");
  assert.equal(toIso, "2026-11-01T01:00:00+07:00");
  assert.ok(Date.parse(toIso) > Date.parse(fromIso));

  const valid = calendar.validateCustomRange("2026-10-31T23:30", "2026-11-01T01:00");
  assert.equal(valid.valid, true);
  if (valid.valid) {
    assert.equal(valid.from, "2026-10-31T23:30:00+07:00");
    assert.equal(valid.to, "2026-11-01T01:00:00+07:00");
  }

  // Same time or start after end fails validation
  const equalTime = calendar.validateCustomRange("2026-11-01T01:00", "2026-11-01T01:00");
  assert.equal(equalTime.valid, false);
  assert.match(equalTime.error, /Thời gian bắt đầu phải trước thời gian kết thúc/);

  const reversed = calendar.validateCustomRange("2026-11-02T10:00", "2026-11-01T10:00");
  assert.equal(reversed.valid, false);

  // Missing fields fail validation
  const empty = calendar.validateCustomRange("", "2026-11-01T10:00");
  assert.equal(empty.valid, false);
  assert.match(empty.error, /Vui lòng chọn đầy đủ/);
});
test("LearnerActualSessionList renders custom date-time range and preserves server chronological order across mixed statuses", () => {
  const { LearnerActualSessionList } = require("../components/LearnerActualSessionList.tsx");
  const session1 = { ...session, id: foreign, name: "Buổi mở đầu", status: "COMPLETED", startAt: "2026-10-12T02:00:00Z" };
  const session2 = { ...session, id: "44444444-4444-4444-8444-444444444444", name: "Buổi giữa kỳ", status: "ONGOING", startAt: "2026-10-14T02:00:00Z" };
  const session3 = { ...session, id: id, name: "Buổi tổng kết", status: "SCHEDULED", startAt: "2026-10-18T02:00:00Z" };

  const html = renderToStaticMarkup(
    React.createElement(LearnerActualSessionList, {
      items: [session1, session2, session3],
      total: 3,
      page: 1,
      pageSize: 6,
      isCustom: true,
      onSelectSession() {},
      onPageChange() {},
    }),
  );
  assert.match(html, /3.*buổi học trong khoảng thời gian đã chọn/);
  // Chronological order across mixed statuses preserved
  const idx1 = html.indexOf("Buổi mở đầu");
  const idx2 = html.indexOf("Buổi giữa kỳ");
  const idx3 = html.indexOf("Buổi tổng kết");
  assert.ok(idx1 !== -1 && idx2 !== -1 && idx3 !== -1);
  assert.ok(idx1 < idx2 && idx2 < idx3);
  assert.equal((html.match(/>Xem buổi học</g) || []).length, 3);
});
test("LearnerSessionFilterBar displays Vietnam time labeling and responds to presets", () => {
  const { LearnerSessionFilterBar } = require("../components/LearnerSessionFilterBar.tsx");
  const html = renderToStaticMarkup(
    React.createElement(LearnerSessionFilterBar, {
      month: "2026-10",
      isCustom: true,
      status: "all",
      onChangeMonth() {},
      onApplyCustomRange() {},
      onResetMonthPreset() {},
      onChangeStatus() {},
    }),
  );
  assert.match(html, /Lọc theo khoảng ngày - giờ · Giờ Việt Nam \(UTC\+7\)/);
  assert.match(html, /Đang dùng lọc tùy chỉnh/);
  assert.match(html, /Đặt lại theo tháng/);
});
test("learning dashboard explicitly uses a coherent mock report without charts or live class targets", () => {
  const { LearnerReportScreen } = require("../../learner-overview/components/LearnerReportScreen.tsx");
  const { getLearnerDashboardMock } = require("../../learner-overview/services/learner-dashboard.mock.service.ts");
  const data = getLearnerDashboardMock();
  assert.equal(data.summary.completed, data.courses.reduce((sum,item) => sum+item.completed,0));
  assert.equal(data.summary.total,40);
  assert.equal(data.summary.pending,3);
  assert.equal(data.summary.average,8);
  assert.ok(data.assignments.every(item => data.courses.some(course => course.id===item.courseId)));
  assert.ok(data.sessions.every(item => data.courses.some(course => course.id===item.courseId)));
  const html = render(LearnerReportScreen);
  assert.match(html,/Dữ liệu minh họa/);
  assert.match(html,/Minh Anh Nguyễn/);
  assert.match(html,/26\/40/);
  assert.match(html,/Lớp đang theo học/);
  assert.match(html,/Bài tập của bạn/);
  assert.match(html,/Hồ sơ và lịch học/);
  assert.match(html,/Nhận xét từ gia sư/);
  assert.doesNotMatch(html,/Thời gian học tập|Lịch tháng|grid-cols-7.*grid-cols-7|<canvas/);
  assert.doesNotMatch(html,/href="[^"]*classes\/(math|english|physics)/);
  if(process.env.LMS_QA_DIR) fs.writeFileSync(path.join(process.env.LMS_QA_DIR,"dashboard.html"),html);
});
after(() => {
  Module._load = originalLoad;
  require.extensions[".ts"] = extensions.ts;
  require.extensions[".tsx"] = extensions.tsx;
});

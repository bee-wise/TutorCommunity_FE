/* eslint-disable @typescript-eslint/no-require-imports -- Native Node harness transpiles modules and mocks only API/Next boundaries. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { QueryClient, QueryClientProvider } = require("@tanstack/react-query");
const originalTs = require.extensions[".ts"];
const originalTsx = require.extensions[".tsx"];
const originalLoad = Module._load;
const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
let response;
let apiFailure;
const requests = [];
const ACTOR = "11111111-1111-4111-8111-111111111111";
const CLASS_ID = "22222222-2222-4222-8222-222222222222";
let auth = { user: { id: ACTOR, role: "TUTOR" }, isAuthLoading: false };
Module._load = function (name, parent, isMain) {
  if (name === "./GroupClassManagement") return { GroupClassManagement: () => null };
  if (name === "@workspace/core/apiClient") return { apiClient: { get: async (url, config) => {
    requests.push({ url, config });
    if (apiFailure) throw apiFailure;
    return response;
  } } };
  if (name === "@workspace/core/store/useAuthStore") return { useAuthStore: (selector) => selector(auth) };
  if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
  return originalLoad.call(this, name, parent, isMain);
};
const { ApiError } = require("@workspace/core/sys-libs/error-handler");
const { lmsClassSchema, lmsClassPageSchema, lmsClassQuerySchema } = require("../schemas/lms-class.schema.ts");
const { getTutorClasses, getTutorClassDetail, getClassQueryParams } = require("../services/classes.service.ts");
const { toClassQuery, toTutorClass, toTutorClassCard, shouldRetryClassQuery } = require("../utils/class-api.utils.ts");
const { tutorClassQueryKeys: keys } = require("../query-keys.ts");
const { useTutorClasses } = require("../hooks/useTutorClasses.ts");
const { useTutorClassDetail } = require("../hooks/useTutorClassDetail.ts");
const { ClassQueryErrorState } = require("../components/ClassQueryErrorState.tsx");
const { ClassDetailScreen } = require("../components/ClassDetailScreen.tsx");
const dto = (patch = {}) => ({
  id: CLASS_ID, type: "GROUP", tutorId: ACTOR, title: "Lớp Toán 10", code: "BW-G101",
  status: "ACTIVE", teachingOfferingId: null, programName: null, teachingItemName: null,
  contextName: null, teachingMode: "ONLINE", capacity: 20, activeMembers: 7, learnerCount: 7,
  pricePerHour: 150000, sessionDurationMinutes: 60, numberOfSessions: 12, sessionCount: 5,
  createdAt: "2026-10-13T02:00:00Z", openingAt: null, approvalStatus: "APPROVED", billingMode: "MONTHLY",
  features: { feedback: false, attendance: true }, ...patch,
});
const filters = { kind: "individual", search: "", status: "all", sort: "newest" };
const renderQuery = (client, Component, props) => renderToStaticMarkup(React.createElement(QueryClientProvider, { client }, React.createElement(Component, props)));

test("BE .NET Guid IDs without RFC UUID version/variant bits pass both DTO and detail-route validation", async () => {
  const id = "12345678-1111-0111-7111-123456789abc";
  const data = dto({ id, tutorId: id, teachingOfferingId: id });
  assert.equal(lmsClassSchema.safeParse(data).success, true);
  assert.equal(lmsClassQuerySchema.safeParse({ page: 1, pageSize: 6, teachingOfferingId: id }).success, true);
  response = { success: true, data };
  assert.equal((await getTutorClassDetail(id)).id, id);
  assert.equal(requests.at(-1).url, `/lms/classes/${id}`);
});

test("nullable legacy offering/context/program and nullable item list are safe; unknown enum is not upgraded to active", () => {
  const parsed = lmsClassSchema.parse(dto());
  const card = toTutorClassCard(parsed);
  assert.equal(card.learnerCount, 7);
  assert.equal(card.sessionCount, 5);
  assert.equal(card.attendancePendingCount, undefined);
  assert.deepEqual(card.learners, []);
  assert.equal(card.classInfo.subject, "Chưa có nội dung giảng dạy");
  assert.equal(card.classInfo.serverDetails.features.feedback, false);
  assert.equal(toTutorClass(dto({ status: "PENDING_PAYMENT" })).status, "pending_payment");
  assert.equal(toTutorClass(dto({ status: "CANCELLED" })).status, "cancelled");
  assert.equal(toTutorClass(dto({ status: null, type: null })).status, "unknown");
  assert.equal(toTutorClass(dto({ type: "NEW_TYPE" })).kind, "unknown");
  assert.deepEqual(lmsClassPageSchema.parse({ items: null, total: 0, page: 1, pageSize: 6 }).items, []);
});

test("query preserves BE paging/enum, exact offering ID and Swagger parameter names without actor or alias drift", () => {
  const query = toClassQuery({ ...filters, kind: "group", search: "  Toán  ", status: "pending_payment", sort: "oldest" }, 3);
  assert.deepEqual(query, { type: "GROUP", search: "Toán", status: "PENDING_PAYMENT", sort: "OLDEST", page: 3, pageSize: 6 });
  const params = getClassQueryParams({ ...query, teachingOfferingId: CLASS_ID });
  assert.equal(params.Page, 3);
  assert.equal(params.PageSize, 6);
  assert.equal(params.TeachingOfferingId, CLASS_ID);
  assert.equal(params.Type, "GROUP");
  assert.ok(!("TutorId" in params));
  assert.ok(!("Limit" in params));
  for (const patch of [{ page: 0 }, { pageSize: 101 }, { status: "upcoming" }, { search: "x".repeat(101) }]) {
    assert.equal(lmsClassQuerySchema.safeParse({ ...query, ...patch }).success, false);
  }
});

test("service uses core client, real routes, cookie credentials, cancellation signal and unwrapped ApiResponse", async () => {
  const signal = new AbortController().signal;
  response = { success: true, data: { items: [dto()], total: 47, page: 3, pageSize: 6 } };
  const page = await getTutorClasses({ ...toClassQuery(filters, 3) }, signal);
  assert.equal(page.total, 47);
  assert.equal(page.items.length, 1);
  assert.equal(page.page, 3);
  assert.equal(requests.at(-1).url, "/lms/classes");
  assert.equal(requests.at(-1).config.signal, signal);
  assert.equal(requests.at(-1).config.withCredentials, true);
  response = { success: true, data: dto() };
  assert.equal((await getTutorClassDetail(CLASS_ID)).id, CLASS_ID);
  assert.equal(requests.at(-1).url, `/lms/classes/${CLASS_ID}`);
  const before = requests.length;
  await assert.rejects(() => getTutorClassDetail("../other-class"));
  assert.equal(requests.length, before);
});

test("malformed responses fail closed and permission/not-found errors are never replaced by mock data or automatically retried", async () => {
  for (const data of [null, { ...dto(), learnerCount: "7" }, { ...dto(), createdAt: "bad-date" }]) {
    response = { success: true, data };
    await assert.rejects(() => getTutorClassDetail(CLASS_ID), (error) => error.code === "LMS_CLASS_CONTRACT_MISMATCH");
  }
  for (const status of [400, 401, 403, 404, 502]) {
    apiFailure = new ApiError("API rejection", status);
    await assert.rejects(() => getTutorClassDetail(CLASS_ID), (error) => error === apiFailure);
    assert.equal(shouldRetryClassQuery(0, apiFailure), false);
  }
  apiFailure = undefined;
  assert.equal(shouldRetryClassQuery(0, new ApiError("Network", 0)), true);
  assert.equal(shouldRetryClassQuery(1, new ApiError("Network", 0)), false);
});

test("query keys isolate actors, page, kind, status and sort; sidebar/detail share one detail key", () => {
  const query = toClassQuery(filters, 1);
  for (const patch of [{ page: 2 }, { type: "GROUP" }, { status: "ACTIVE" }, { sort: "OLDEST" }]) assert.notDeepEqual(keys.list(ACTOR, query), keys.list(ACTOR, { ...query, ...patch }));
  assert.notDeepEqual(keys.list(ACTOR, query), keys.list("another-tutor", query));
  assert.notDeepEqual(keys.detail(ACTOR, CLASS_ID), keys.detail("another-tutor", CLASS_ID));
  assert.deepEqual(keys.detail(ACTOR, CLASS_ID), keys.detail(ACTOR, CLASS_ID));
});

test("list hook uses server counts/page totals rather than one visible row; auth guards hide cached data and disable requests", () => {
  const client = new QueryClient();
  client.setQueryData(keys.list(ACTOR, toClassQuery(filters, 1)), { items: [dto()], total: 17, page: 1, pageSize: 6 });
  for (const [type, total] of [["INDIVIDUAL", 17], ["GROUP", 29]]) client.setQueryData(keys.list(ACTOR, { type, page: 1, pageSize: 1, sort: "NEWEST" }), { items: [dto()], total, page: 1, pageSize: 1 });
  let result;
  function Harness() { result = useTutorClasses(); return null; }
  renderQuery(client, Harness);
  assert.equal(result.total, 17);
  assert.equal(result.cards.length, 1);
  assert.equal(result.pageCount, 3);
  assert.deepEqual(result.classCounts, { individual: 17, group: 29 });
  for (const [role, status] of [["LEARNER", 403], [null, 401]]) {
    auth = { user: role ? { id: ACTOR, role } : null, isAuthLoading: false };
    renderQuery(client, Harness);
    assert.deepEqual(result.cards, []);
    assert.equal(result.error.statusCode, status);
    assert.deepEqual(result.classCounts, { individual: undefined, group: undefined });
    assert.ok(client.getQueryCache().getAll().every((query) => query.options.enabled === false));
  }
  auth = { user: { id: ACTOR, role: "TUTOR" }, isAuthLoading: true };
  renderQuery(client, Harness);
  assert.equal(result.loading, true);
  assert.deepEqual(result.cards, []);
  auth = { user: { id: ACTOR, role: "TUTOR" }, isAuthLoading: false };
  client.clear();
});

test("detail renders only server overview, null fallbacks and counts; loading and 403/404 have distinct UI", () => {
  const client = new QueryClient();
  client.setQueryData(keys.detail(ACTOR, CLASS_ID), dto());
  const html = renderQuery(client, ClassDetailScreen, { classId: CLASS_ID });
  assert.match(html, /7 học viên đang tham gia/);
  assert.match(html, /5 buổi trong lịch/);
  assert.match(html, /Chưa liên kết nội dung giảng dạy/);
  assert.doesNotMatch(html, /example.com|chưa xác nhận điểm danh|Dữ liệu lớp minh họa/);
  client.clear();
  const loading = renderQuery(client, ClassDetailScreen, { classId: CLASS_ID });
  assert.match(loading, /Đang tải không gian lớp/);
  assert.doesNotMatch(loading, /Không tìm thấy lớp học/);
  for (const [status, message] of [[403, "Không có quyền"], [404, "Không tìm thấy"], [401, "Bạn cần đăng nhập"]]) {
    const errorHtml = renderToStaticMarkup(React.createElement(ClassQueryErrorState, { error: new ApiError("test", status), onRetry() {}, detail: true }));
    assert.match(errorHtml, new RegExp(message));
    assert.doesNotMatch(errorHtml, /Thử lại/);
  }
  let detail;
  function DetailHarness() { detail = useTutorClassDetail("bad-class-id"); return null; }
  renderQuery(client, DetailHarness);
  assert.equal(detail.error.statusCode, 404);
  assert.equal(detail.classInfo, undefined);
  client.clear();
});

after(() => {
  Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs; else delete require.extensions[".ts"];
  if (originalTsx) require.extensions[".tsx"] = originalTsx; else delete require.extensions[".tsx"];
});

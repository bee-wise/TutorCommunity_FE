/* eslint-disable @typescript-eslint/no-require-imports -- Native Node tests compile feature sources in memory. */
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
const originalGlobals = { document: global.document, window: global.window };
const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText, filename);
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;

let states = [];
let cursor = 0;
Module._load = function (request, parent, isMain) {
  if (request === "react" && parent?.filename.endsWith("useEarnings.ts")) return {
    useMemo: (factory) => factory(),
    useState: (initial) => {
      const index = cursor++;
      if (!(index in states)) states[index] = initial;
      return [states[index], (value) => { states[index] = value; }];
    },
  };
  return originalLoad.call(this, request, parent, isMain);
};

const { EARNING_SESSIONS } = require("../data/earnings.mock.ts");
const { filterEarningSessions, isInPeriod, formatDateTime, exportEarningsToExcel } = require("../utils/earnings.utils.ts");
const { reportIssueSchema } = require("../types/earnings.schemas.ts");
const { useEarnings } = require("../hooks/useEarnings.ts");
const { EarningsTable } = require("../components/EarningsTable.tsx");
const { EarningsStatusBadge, EarningsReportStatusBadge } = require("../components/EarningsStatusBadge.tsx");
const filter = { period: "month", referenceDate: "2026-08-22", search: "", status: "all" };
const hook = () => { cursor = 0; return useEarnings(); };

test("day/week/month/year filters use the demo data and Monday-start weeks", () => {
  assert.equal(filterEarningSessions(EARNING_SESSIONS, filter).length, 8);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, period: "day" }).length, 1);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, period: "week" }).length, 5);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, period: "year" }).length, 11);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, filter).reduce((sum, session) => sum + session.fee, 0), 2230000);
});

test("Vietnam midnight and week boundaries are independent of host timezone", () => {
  const reference = new Date("2026-08-22T12:00:00+07:00");
  assert.equal(isInPeriod("2026-08-21T17:00:00Z", "day", reference), true);
  assert.equal(isInPeriod("2026-08-22T17:00:00Z", "day", reference), false);
  assert.equal(isInPeriod("2026-08-16T17:00:00Z", "week", reference), true);
  assert.equal(isInPeriod("2026-08-23T17:00:00Z", "week", reference), false);
  assert.match(formatDateTime("2026-08-21T17:15:00Z"), /22\/08\/2026/);
  assert.match(formatDateTime("2026-08-21T17:15:00Z"), /00:15/);
});

test("status and accent-insensitive search combine without mutating source", () => {
  const before = EARNING_SESSIONS.map((item) => item.id);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, status: "settled" }).length, 5);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, status: "reviewing" }).length, 1);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, search: "nguyen minh anh" })[0].id, "earning-01");
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, search: "VAT LY" }).length, 2);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, search: "nguyen minh anh", status: "settled" }).length, 0);
  assert.deepEqual(EARNING_SESSIONS.map((item) => item.id), before);
});

test("empty/invalid reference dates and no-match queries yield an empty state", () => {
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, referenceDate: "" }).length, 0);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, referenceDate: "invalid" }).length, 0);
  assert.equal(filterEarningSessions(EARNING_SESSIONS, { ...filter, search: "not-a-session" }).length, 0);
});

test("pagination keeps full export results and filter changes reset the page", () => {
  states = [];
  let earnings = hook();
  assert.equal(earnings.pagedSessions.length, 6);
  assert.equal(earnings.filteredSessions.length, 8);
  assert.equal(earnings.pageCount, 2);
  earnings.setPage(1);
  earnings = hook();
  assert.equal(earnings.pagedSessions.length, 2);
  assert.equal(earnings.totalFee, 2230000);
  earnings.setStatus("pending");
  earnings = hook();
  assert.equal(earnings.page, 0);
  assert.equal(earnings.filteredSessions.length, 2);
  earnings.setSearch("not-a-session");
  assert.equal(hook().filteredSessions.length, 0);
  hook().resetFilters();
  assert.equal(hook().filteredSessions.length, 8);
});

test("report schema trims input and rejects blank/short/oversized descriptions", () => {
  const data = { title: " Học phí buổi học chưa đúng ", description: " Kiểm tra học phí cho buổi học này. " };
  assert.equal(reportIssueSchema.parse(data).title, "Học phí buổi học chưa đúng");
  for (const description of ["            ", "ngắn", "x".repeat(2001)]) assert.equal(reportIssueSchema.safeParse({ ...data, description }).success, false);
  assert.equal(reportIssueSchema.safeParse({ ...data, title: "" }).success, false);
});

test("settlement and report statuses have explicit labels, not icon-only meaning", () => {
  for (const [status, label] of [["settled", "Đã quyết toán"], ["pending", "Chờ quyết toán"], ["reviewing", "Đang kiểm tra"]]) {
    const html = renderToStaticMarkup(React.createElement(EarningsStatusBadge, { status }));
    assert.ok(html.includes(label));
    assert.ok(!html.includes("<svg"));
  }
  const resolved = renderToStaticMarkup(React.createElement(EarningsReportStatusBadge, { status: "resolved" }));
  assert.ok(resolved.includes("Đã giải quyết"));
});

test("responsive table exposes totals, accessible actions, pagination and reset", () => {
  const props = { sessions: EARNING_SESSIONS.slice(0, 6), totalCount: 8, totalFee: 2230000, page: 0, pageCount: 2, onPageChange() {}, onResetFilters() {}, onViewDetail() {}, onReport() {} };
  const html = renderToStaticMarkup(React.createElement(EarningsTable, props));
  assert.ok(html.includes("8 buổi phù hợp"));
  assert.ok(html.includes("2.230.000"));
  assert.ok(html.includes("aria-label=\"Chi tiết thu nhập BH-220826-01\""));
  assert.ok(html.includes("lg:hidden"));
  assert.ok(html.includes("disabled=\"\""));
  assert.ok(!html.includes("earning-07"));
  const empty = renderToStaticMarkup(React.createElement(EarningsTable, { ...props, sessions: [], totalCount: 0 }));
  assert.ok(empty.includes("Đặt lại bộ lọc"));
  assert.ok(!empty.includes("<table"));
});

test("legacy Excel export includes all filtered rows and escapes cell content", async () => {
  let blob;
  let downloaded;
  let revoked;
  const create = URL.createObjectURL;
  const revoke = URL.revokeObjectURL;
  const callbacks = [];
  URL.createObjectURL = (value) => { blob = value; return "blob:earnings-test"; };
  URL.revokeObjectURL = (value) => { revoked = value; };
  global.window = { setTimeout: (callback) => { callbacks.push(callback); } };
  global.document = { createElement: () => ({ click() { downloaded = this.download; } }) };
  try {
    const sessions = filterEarningSessions(EARNING_SESSIONS, filter);
    exportEarningsToExcel(sessions.map((session, index) => index ? session : { ...session, learnerName: "=1+1", className: "<script>&Test" }));
    const text = await blob.text();
    assert.ok(downloaded.endsWith(".xls"));
    assert.equal((text.match(/<tr>/g) ?? []).length, 9);
    assert.ok(text.includes("&#" ) === false);
    assert.ok(text.includes("'&#") === false);
    assert.ok(text.includes("'=1+1"));
    assert.ok(text.includes("&lt;script&gt;&amp;Test"));
    assert.ok(text.includes("BH-040826-02"));
    assert.equal(revoked, undefined);
    callbacks.forEach((callback) => callback());
    assert.equal(revoked, "blob:earnings-test");
  } finally {
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
    global.document = originalGlobals.document;
    global.window = originalGlobals.window;
  }
});

after(() => {
  require.extensions[".ts"] = originalTs;
  require.extensions[".tsx"] = originalTsx;
  Module._load = originalLoad;
});

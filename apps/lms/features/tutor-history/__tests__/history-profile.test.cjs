/* eslint-disable @typescript-eslint/no-require-imports -- Native tests compile isolated feature modules in memory. */
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
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText, filename);
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
let request;
let response;
Module._load = function (name, parent, isMain) {
  if (name === "@phosphor-icons/react") {
    return new Proxy({}, {
      get: () => ({ className }) => React.createElement("span", { className, "aria-hidden": true }),
    });
  }
  if (name === "@workspace/core/configs/client") return { apiClient: { get: async (...args) => { request = args; return response; } } };
  if (name.startsWith("@/")) return originalLoad.call(this, path.resolve(__dirname, "../../..", name.slice(2)), parent, isMain);
  return originalLoad.call(this, name, parent, isMain);
};
const { mapHistoryConnections, filterHistory, connectionStatus, formatHistoryDate } = require("../utils/history.utils.ts");
const { HistoryStatusBadge } = require("../components/HistoryStatusBadge.tsx");
const { tutorProfileSchema } = require("../../tutor-profile/types/profile.schemas.ts");
const { getOwnTutorProfile } = require("../../tutor-profile/services/profile.service.ts");
const { ProfileTeachingDetails } = require("../../tutor-profile/components/ProfileTeachingDetails.tsx");
const { ProfileAccountDetails } = require("../../tutor-profile/components/ProfileAccountDetails.tsx");

const filters = { search: "", status: "all", from: "", to: "", sort: "newest" };
const requests = [
  { id: "c1", learnerId: "l1", status: "ACTIVE", connectionStage: "WAITING_FOR_TUTOR", createdAt: "2026-10-05T17:00:00Z", updatedAt: "2026-10-06T02:00:00Z", chatRoomId: "r1" },
  { id: "c2", learnerId: "l2", learnerName: "Trần Gia Huy", status: "CONVERTED_TO_CLASS", createdAt: "2026-10-04T18:00:00Z", updatedAt: "2026-10-05T03:00:00Z", chatRoomId: "r2" },
];
const rooms = [{ id: "r1", connectRequestId: "c1", recipientUserId: "l1", recipientName: "Nguyễn Minh Anh", createdAt: requests[0].createdAt, updatedAt: requests[0].updatedAt }];

test("history joins authorized rooms; no link is fabricated for unavailable chats", () => {
  const connections = mapHistoryConnections(requests, rooms);
  assert.equal(connections[0].learnerName, "Nguyễn Minh Anh");
  assert.equal(connections[0].roomId, "r1");
  assert.equal(connections[1].learnerName, "Trần Gia Huy");
  assert.equal(connections[1].roomId, undefined);
  assert.equal(connections[0].status, "waiting");
  assert.equal(connections[1].status, "converted");
});

test("all known outcomes and unknown values remain distinct", () => {
  for (const [raw, expected] of [["ACTIVE", "active"], ["CANCELLED", "cancelled"], ["TIMEOUT", "timeout"], ["CLOSED", "closed"], ["NEW_STATUS", "unknown"]]) assert.equal(connectionStatus({ ...requests[0], status: raw, connectionStage: "DISCUSSING" }), expected);
  assert.equal(connectionStatus({ ...requests[0], status: "PENDING" }), "waiting");
  const html = renderToStaticMarkup(React.createElement(HistoryStatusBadge, { status: "unknown" }));
  assert.ok(html.includes("Chưa rõ trạng thái"));
  assert.ok(!html.includes("Đã tạo lớp"));
});

test("names from participants override generic recipient data", () => {
  const joined = mapHistoryConnections(requests, [{ ...rooms[0], participants: [{ userId: "l1", name: "Đặng Thảo Vy", role: "LEARNER" }] }]);
  assert.equal(joined[0].learnerName, "Đặng Thảo Vy");
  assert.equal(mapHistoryConnections([{ ...requests[0], learnerId: null }], [])[0].learnerName, "Học viên chưa có tên");
});

test("filters compose status, accent-insensitive name, inclusive Vietnam date range and sort", () => {
  const connections = mapHistoryConnections(requests, rooms);
  assert.equal(filterHistory(connections, { ...filters, search: "nguyen minh anh" }).length, 1);
  assert.equal(filterHistory(connections, { ...filters, search: "nguyen", status: "converted" }).length, 0);
  assert.equal(filterHistory(connections, { ...filters, from: "2026-10-06", to: "2026-10-06" })[0].id, "c1");
  assert.equal(filterHistory(connections, { ...filters, from: "2026-10-07", to: "2026-10-05" }).length, 0);
  assert.equal(filterHistory(connections, { ...filters, sort: "oldest" })[0].id, "c2");
  assert.deepEqual(connections.map((item) => item.id), ["c1", "c2"]);
  assert.match(formatHistoryDate(requests[0].createdAt), /06\/10\/2026/);
  assert.equal(formatHistoryDate("invalid"), "Chưa có thời gian");
});

test("profile validates external data without synthesizing personal data", () => {
  const profile = tutorProfileSchema.parse({ id: "p1", displayName: "Nguyễn Minh Anh", introduction: null, achievements: null });
  assert.equal(profile.introduction, "");
  assert.deepEqual(profile.achievements, []);
  assert.equal(profile.hourlyRate, undefined);
  assert.equal(tutorProfileSchema.safeParse({ id: "p1", teachingOfferings: "not-an-array" }).success, false);
  assert.equal(tutorProfileSchema.safeParse({ id: "p1", hourlyRate: -100 }).success, false);
});

test("own profile service encodes identifiers, forwards cancellation and rejects failed envelopes", async () => {
  const signal = new AbortController().signal;
  response = { success: true, data: { id: "profile/01", displayName: "Nguyễn Minh Anh" } };
  assert.equal((await getOwnTutorProfile("profile/01", signal)).displayName, "Nguyễn Minh Anh");
  assert.equal(request[0], "/tutors/profile%2F01");
  assert.equal(request[1].signal, signal);
  response = { success: false, data: { id: "p1" } };
  await assert.rejects(getOwnTutorProfile("p1"));
});

test("teaching view safely renders missing data and keeps account contacts separate", () => {
  const profile = tutorProfileSchema.parse({ id: "p1", email: "private@example.com", phoneNumber: "0901234567" });
  const html = renderToStaticMarkup(React.createElement(ProfileTeachingDetails, { profile }));
  assert.ok(html.includes("Chưa có nội dung giới thiệu"));
  assert.ok(html.includes("Chưa cập nhật lịch có thể nhận lớp"));
  assert.ok(!html.includes("private@example.com"));
  assert.ok(!html.includes("0901234567"));
  assert.ok(!html.includes("undefined"));
  const account = renderToStaticMarkup(React.createElement(ProfileAccountDetails, { user: { id: "u1", fullName: "Nguyễn Minh Anh", email: "private@example.com", phoneNumber: "0901234567" } }));
  assert.ok(account.includes("private@example.com"));
  assert.ok(account.includes("Thông tin riêng tư"));
});

after(() => {
  require.extensions[".ts"] = originalTs;
  require.extensions[".tsx"] = originalTsx;
  Module._load = originalLoad;
});

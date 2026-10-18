/* eslint-disable @typescript-eslint/no-require-imports -- Native TypeScript/SSR harness; HTTP is stubbed, not provider E2E. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { QueryClient, QueryClientProvider } = require("@tanstack/react-query");
const extensions = {
  ts: require.extensions[".ts"],
  tsx: require.extensions[".tsx"],
};
const originalLoad = Module._load;
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
const actor = "11111111-1111-4111-8111-111111111111",
  id = "22222222-2222-4222-8222-222222222222",
  learner = "33333333-3333-4333-8333-333333333333";
let payload, failure;
const calls = [];
let auth = { user: { id: actor, role: "TUTOR" }, isAuthLoading: false };
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
  return originalLoad.call(this, name, parent, isMain);
};
const schemas = require("../schemas.ts");
const groupSchemas = require("../group.schemas.ts");
const { classSessionsService: sessions } = require("../sessions.service.ts");
const { classMembersService: members } = require("../members.service.ts");
const { classChatService: chat } = require("../chat.service.ts");
const {
  groupClassesService: groups,
  groupAdmissionsService: admissions,
} = require("../group.service.ts");
const lifecycle = require("../lifecycle.ts");
const { lmsClassKeys: keys } = require("../query-keys.ts");
const { useLmsClassResource } = require("../useLmsClassResource.ts");
const { ApiError } = require("../../sys-libs/error-handler.ts");
const session = (patch = {}) => ({
  id,
  classId: id,
  tutorId: actor,
  learnerId: null,
  startAt: "2026-10-13T02:00:00Z",
  endAt: "2026-10-13T03:00:00Z",
  actualStartAt: "2026-10-13T02:00:00Z",
  actualEndAt: "2026-10-13T03:00:00Z",
  teachingMode: "ONLINE",
  locationOrMeetingInfo: null,
  status: "COMPLETED",
  replacesSessionId: null,
  plannedScheduleId: null,
  version: 1,
  durationMinutes: 60,
  ...patch,
});
const mark = {
  learnerId: learner,
  status: "UNMARKED",
  absenceType: null,
  note: "",
  isLate: false,
  leftEarly: false,
};
const attendance = {
  sessionId: id,
  status: "DRAFT",
  version: 0,
  confirmedAt: null,
  marks: [mark],
};
const admission = {
  id,
  classId: id,
  learnerId: learner,
  status: "TRIAL_COMPLETED",
  version: 2,
  trialStartAt: null,
  trialEndAt: null,
  trialCompletedAt: "2026-10-13T03:00:00Z",
  trialMeetingInfo: null,
  missedLessonsAcknowledgedAt: null,
  enrollmentId: null,
  missedSessionIds: [],
  referredByTutorId: actor,
  firstMonthFee: null,
};
const draft = {
  title: "Lớp Toán 8",
  description: "Nội dung",
  teachingOfferingId: learner,
  teachingMode: "ONLINE",
  location: null,
  openingAt: "2026-10-20T02:00:00Z",
  capacity: 6,
  billingMode: "MONTHLY",
  sessionDurationMinutes: 60,
  numberOfSessions: 8,
  pricePerSession: 120000,
  highlight: null,
};
const group = {
  ...draft,
  id,
  code: "FE-test",
  tutorId: actor,
  programName: null,
  teachingItemName: null,
  contextName: null,
  totalAmount: 960000,
  approvalStatus: "DRAFT",
  status: "UPCOMING",
  isPublished: false,
  assignedConsultantId: null,
  approvalNote: null,
  version: 1,
  roadmap: [],
};
const respond = (data) => {
  payload = { success: true, data };
  failure = null;
};

test("UTC conversion is explicit Vietnam UTC+7 and round-trips independently of host timezone", () => {
  assert.equal(
    lifecycle.vietnamTimeToUtc("2026-10-13T09:00"),
    "2026-10-13T02:00:00.000Z",
  );
  assert.equal(
    lifecycle.utcToVietnamInput("2026-10-13T02:00:00Z"),
    "2026-10-13T09:00",
  );
  assert.throws(() => lifecycle.vietnamTimeToUtc("bad"));
});
test("attendance uses actualEndAt, exactly twelve hours, ACTIVE class and server ONGOING/COMPLETED only", () => {
  const end = Date.parse(session().actualEndAt),
    boundary = end + 12 * 3600000;
  assert.equal(
    lifecycle.canEditClassAttendance("ACTIVE", session(), boundary),
    true,
  );
  assert.equal(
    lifecycle.canEditClassAttendance("ACTIVE", session(), boundary + 1),
    false,
  );
  assert.equal(
    lifecycle.canEditClassAttendance(
      "ACTIVE",
      session({ actualEndAt: null }),
      end,
    ),
    false,
  );
  for (const state of ["UPCOMING", "COMPLETED", null])
    assert.equal(
      lifecycle.canEditClassAttendance(state, session(), end),
      false,
    );
  assert.equal(
    lifecycle.canEditClassAttendance(
      "ACTIVE",
      session({ status: "ONGOING", actualEndAt: null }),
      end,
    ),
    true,
  );
  assert.equal(
    lifecycle.canEditClassAttendance(
      "ACTIVE",
      session({ status: "SCHEDULED" }),
      end,
    ),
    false,
  );
});
test("GET sessions paging is server-owned and planned preview/batch use distinct exact routes", async () => {
  respond({ items: [session()], total: 17, page: 2, pageSize: 6 });
  assert.equal((await sessions.list(id, 2, "COMPLETED")).total, 17);
  assert.deepEqual(calls.at(-1).config.params, {
    page: 2,
    pageSize: 6,
    status: "COMPLETED",
  });
  const slot = {
    startAt: session().startAt,
    endAt: session().endAt,
    locationOrMeetingInfo: null,
    plannedScheduleId: learner,
  };
  respond({ sessions: [slot], conflicts: [] });
  await sessions.preview(id, [slot]);
  assert.equal(calls.at(-1).url, `/classes/${id}/sessions/preview`);
  respond({ sessions: [session()], conflicts: [] });
  await sessions.createBatch(id, { sessions: [slot], submitKey: id });
  assert.equal(calls.at(-1).body.submitKey, id);
  assert.equal(calls.at(-1).config.withCredentials, true);
});
test("complete sends no fabricated actualEndAt; start/cancel use returned version", async () => {
  respond(session());
  await sessions.complete(id);
  assert.equal(calls.at(-1).body, undefined);
  await sessions.start(id, 7);
  assert.deepEqual(calls.at(-1).body, { expectedVersion: 7 });
  await sessions.cancel(id, 7);
  assert.deepEqual(calls.at(-1).body, { expectedVersion: 7 });
});
test("fixed roster and attendance read do not write drafts; marks preserve late/leftEarly and UNMARKED", async () => {
  respond([
    { learnerId: learner, enrollmentId: id, capturedAt: session().startAt },
  ]);
  await sessions.roster(id);
  assert.equal(calls.at(-1).method, "get");
  respond(attendance);
  await sessions.attendance(id);
  assert.equal(calls.at(-1).method, "get");
  await sessions.saveAttendance(id, {
    expectedVersion: 0,
    status: "DRAFT",
    marks: [{ ...mark, isLate: true, leftEarly: true }],
  });
  assert.equal(calls.at(-1).method, "put");
  assert.equal(calls.at(-1).body.marks[0].status, "UNMARKED");
  assert.equal(calls.at(-1).body.marks[0].isLate, true);
  assert.equal(
    schemas.attendanceCommandSchema.safeParse({
      expectedVersion: -1,
      status: "CONFIRMED",
      marks: [],
    }).success,
    false,
  );
});
test("member contact-free DTO, request UUID retry and mandatory REJECT note follow contract", async () => {
  respond([
    {
      enrollmentId: id,
      learnerId: learner,
      displayName: null,
      joinedAt: session().startAt,
      avatarUrl: null,
      level: null,
    },
  ]);
  const rows = await members.current(id);
  assert.equal("email" in rows[0], false);
  respond({
    id,
    classId: id,
    learnerId: learner,
    operation: "ADD",
    reason: "Đi học",
    status: "PENDING",
    requestedBy: actor,
    requestedAt: session().startAt,
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
    cancelledAt: null,
    version: 1,
  });
  const command = {
    requestId: id,
    learnerId: learner,
    operation: "ADD",
    reason: "Đi học",
  };
  await members.create(id, command);
  await members.create(id, command);
  assert.deepEqual(calls.at(-1).body, calls.at(-2).body);
  assert.equal(
    groupSchemas.reviewGroupSchema.safeParse({
      expectedVersion: 1,
      decision: "REQUEST_CHANGES",
      reason: "",
    }).success,
    false,
  );
  assert.equal(
    schemas.reviewMemberChangeSchema.safeParse({
      expectedVersion: 1,
      decision: "REJECT",
      note: "",
    }).success,
    false,
  );
  await members.cancel(id, id, 3);
  assert.equal(
    calls.at(-1).url,
    `/lms/classes/${id}/member-change-requests/${id}/cancel`,
  );
});
test("group create/roadmap are independent from sessions, and lifecycle never assumes enrollment", async () => {
  respond(group);
  await groups.create({ id, draft });
  assert.equal(calls.at(-1).url, "/lms/group-classes");
  await groups.roadmap(id, { expectedVersion: 1, stages: [] });
  assert.equal(calls.at(-1).url, `/lms/group-classes/${id}/roadmap`);
  await groups.publish(id, 2);
  assert.deepEqual(calls.at(-1).body, { expectedVersion: 2 });
  respond({ classId: id, status: "ACTIVE", version: 3 });
  await groups.activate(id, 2);
  assert.equal(calls.at(-1).url, `/lms/group-classes/${id}/activate`);
});
test("roadmap duplicate UUID/order and invalid trial window fail before HTTP", () => {
  const stage = { id, title: "Mở đầu", order: 1, objective: null, lessons: [] };
  assert.equal(
    groupSchemas.roadmapCommandSchema.safeParse({
      expectedVersion: 1,
      stages: [stage, stage],
    }).success,
    false,
  );
  assert.equal(
    groupSchemas.trialSchema.safeParse({
      expectedVersion: 1,
      startAt: session().endAt,
      endAt: session().startAt,
      meetingInfo: null,
    }).success,
    false,
  );
});
test("referral/fee approval/payment use exact role-specific routes and server financial snapshot", async () => {
  respond(admission);
  await groups.refer(id, { admissionId: id, learnerId: learner });
  assert.equal(
    calls.at(-1).url,
    `/lms/group-classes/${id}/admissions/referrals`,
  );
  await admissions.proposeFee(id, { expectedVersion: 2, amount: 123000 });
  assert.equal(calls.at(-1).method, "put");
  await admissions.acceptFee(id, 3);
  assert.equal(
    calls.at(-1).url,
    `/lms/group-admissions/${id}/first-month-fee/accept`,
  );
  await admissions.reviewFee(id, { expectedVersion: 4, decision: "APPROVE" });
  assert.equal(
    calls.at(-1).url,
    `/lms/group-admissions/${id}/first-month-fee/review`,
  );
  const payment = {
    id,
    admissionId: id,
    chargeKey: "month-snapshot",
    orderCode: 101,
    amount: 123000,
    status: "PENDING",
    checkoutUrl: null,
    expiresAt: session().endAt,
    paidAt: null,
    platformFeeAmount: 24600,
    tutorAmount: 98400,
  };
  respond(payment);
  assert.equal(
    (await admissions.payment(id, { month: "2026-10-01" })).tutorAmount,
    98400,
  );
  assert.deepEqual(calls.at(-1).body, { month: "2026-10-01" });
  assert.equal(
    groupSchemas.paymentCommandSchema.safeParse({ month: "2026-10-02" })
      .success,
    false,
  );
  await admissions.refreshPayment(id);
  assert.equal(calls.at(-1).url, `/lms/group-payments/${id}/refresh`);
});
test("recording metadata/playback use distinct endpoints, revoke link with null and only allow HTTPS", async () => {
  respond({
    sessionId: id,
    visibility: "PUBLIC",
    version: 2,
    url: null,
    deletedAt: null,
  });
  await sessions.playback(id);
  assert.equal(calls.at(-1).url, `/class-sessions/${id}/recording/playback`);
  await sessions.saveRecording(id, {
    expectedVersion: 2,
    url: null,
    visibility: "PRIVATE",
  });
  assert.equal(calls.at(-1).body.url, null);
  for (const url of ["javascript:alert(1)", "http://example.com", "not-url"])
    assert.equal(lifecycle.safeExternalUrl(url), null);
  assert.equal(
    lifecycle.safeExternalUrl("https://example.com/recording"),
    "https://example.com/recording",
  );
});
test("class chat cursor/UUID/service isolate the room from connection chat", async () => {
  const message = {
    id,
    classId: id,
    senderId: actor,
    content: "Cùng học nhé",
    createdAt: session().startAt,
  };
  respond({ items: [message], nextCursor: learner, hasMore: true });
  await chat.messages(id, learner);
  assert.equal(calls.at(-1).config.params.cursor, learner);
  respond(message);
  const input = { messageId: id, content: "Cùng học nhé" };
  await chat.send(id, input);
  await chat.send(id, input);
  assert.deepEqual(calls.at(-1).body, calls.at(-2).body);
  assert.equal(calls.at(-1).url, `/lms/classes/${id}/chat/messages`);
  respond({
    token: "fixture-not-a-jwt",
    channel: `notification:${actor}`,
    expiresAt: session().endAt,
  });
  await chat.subscription(id);
  assert.equal(calls.at(-1).url, `/lms/classes/${id}/chat/subscription-token`);
});
test("class chat parses sender avatarUrl across GET history and POST send, supporting HTTPS, null, and legacy omitted fields", async () => {
  const msgValid = {
    id,
    classId: id,
    senderId: actor,
    content: "Chào bạn",
    createdAt: session().startAt,
    avatarUrl: "https://example.com/avatar1.jpg",
  };
  const msgNull = {
    id: learner,
    classId: id,
    senderId: learner,
    content: "Chào gia sư",
    createdAt: session().startAt,
    avatarUrl: null,
  };
  const msgLegacy = {
    id: "33333333-3333-4333-8333-333333333334",
    classId: id,
    senderId: learner,
    content: "Tin nhắn cũ không có field avatar",
    createdAt: session().startAt,
  };
  respond({ items: [msgValid, msgNull, msgLegacy], nextCursor: null, hasMore: false });
  const page = await chat.messages(id);
  assert.equal(page.items.length, 3);
  assert.equal(page.items[0].avatarUrl, "https://example.com/avatar1.jpg");
  assert.equal(page.items[1].avatarUrl, null);
  assert.equal(page.items[2].avatarUrl, undefined);

  // POST response with avatarUrl
  respond({ ...msgValid, id, avatarUrl: "https://example.com/avatar-sent.png" });
  const sentWithAvatar = await chat.send(id, { messageId: id, content: "Tin mới có avatar" });
  assert.equal(sentWithAvatar.avatarUrl, "https://example.com/avatar-sent.png");

  // POST response with null avatarUrl
  respond({ ...msgNull, id });
  const sentNullAvatar = await chat.send(id, { messageId: id, content: "Tin mới null avatar" });
  assert.equal(sentNullAvatar.avatarUrl, null);

  // POST response with omitted avatarUrl (legacy backend response)
  respond({ ...msgLegacy, id });
  const sentLegacyAvatar = await chat.send(id, { messageId: id, content: "Tin mới legacy" });
  assert.equal(sentLegacyAvatar.avatarUrl, undefined);
});
test("403/409 are propagated without mock or URL leakage; malformed envelope fails closed", async () => {
  failure = new ApiError("Forbidden", 403);
  await assert.rejects(
    () => members.current(id),
    (e) => e.statusCode === 403,
  );
  failure = new ApiError("Stale version", 409);
  await assert.rejects(
    () => sessions.start(id, 1),
    (e) => e.statusCode === 409,
  );
  failure = null;
  payload = {
    success: true,
    data: { url: "https://private.example/recording" },
  };
  await assert.rejects(
    () => sessions.recording(id),
    (e) => e.statusCode === 502 && !e.message.includes("private.example"),
  );
});
test("TanStack resource keys isolate class/actor/version scope; forbidden auth hides seeded server data", () => {
  assert.notDeepEqual(keys.class(actor, id), keys.class(learner, id));
  assert.notDeepEqual(
    keys.resource(actor, id, "sessions", 1),
    keys.resource(actor, id, "sessions", 2),
  );
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  client.setQueryData(keys.resource(actor, id, "probe"), { secret: "fixture" });
  function Probe() {
    const q = useLmsClassResource(id, "probe", async () => ({
      secret: "fixture",
    }));
    return React.createElement(
      "p",
      null,
      q.data?.secret ?? `status:${q.error?.statusCode ?? "loading"}`,
    );
  }
  const render = () =>
    renderToStaticMarkup(
      React.createElement(
        QueryClientProvider,
        { client },
        React.createElement(Probe),
      ),
    );
  assert.match(render(), /fixture/);
  auth = { user: { id: actor, role: "LEARNER" }, isAuthLoading: false };
  assert.match(render(), /status:403/);
  assert.doesNotMatch(render(), /fixture/);
  auth = { user: { id: actor, role: "TUTOR" }, isAuthLoading: true };
  assert.doesNotMatch(render(), /fixture/);
  client.clear();
  auth = { user: { id: actor, role: "TUTOR" }, isAuthLoading: false };
});
test("session metadata supports separate name/description per slot, limits, blank-to-null, and legacy compatibility", async () => {
  const vnName = "Buổi 1: Giới thiệu lập trình & Thuật toán cơ bản";
  const vnDesc = "Nội dung: Biến, kiểu dữ liệu, cấu trúc điều khiển. Tài liệu: Chương 1-3.";
  const slot1 = {
    name: vnName,
    description: vnDesc,
    startAt: "2026-10-20T08:00:00Z",
    endAt: "2026-10-20T09:30:00Z",
    locationOrMeetingInfo: "Phòng A101",
    plannedScheduleId: null,
  };
  const slot2 = {
    name: "   ",
    description: "",
    startAt: "2026-10-22T08:00:00Z",
    endAt: "2026-10-22T09:30:00Z",
    locationOrMeetingInfo: "https://zoom.us/j/123456",
    plannedScheduleId: null,
  };

  // Preview sends both slots with separate metadata and blank converted to null
  respond({ sessions: [slot1, slot2], conflicts: [] });
  await sessions.preview(id, [slot1, slot2]);
  const previewBody = calls.at(-1).body;
  assert.equal(previewBody.sessions[0].name, vnName);
  assert.equal(previewBody.sessions[0].description, vnDesc);
  assert.equal(previewBody.sessions[1].name, null);
  assert.equal(previewBody.sessions[1].description, null);

  // Batch create sends exact payload
  respond({ sessions: [session({ name: vnName, description: vnDesc })], conflicts: [] });
  await sessions.createBatch(id, { sessions: [slot1, slot2], submitKey: "test-submit-key" });
  const batchBody = calls.at(-1).body;
  assert.equal(batchBody.sessions[0].name, vnName);
  assert.equal(batchBody.sessions[0].description, vnDesc);
  assert.equal(batchBody.sessions[1].name, null);
  assert.equal(batchBody.sessions[1].description, null);

  // Exceeding limits fails validation
  assert.throws(() =>
    schemas.slotSchema.parse({
      ...slot1,
      name: "a".repeat(201),
    }),
  );
  assert.throws(() =>
    schemas.slotSchema.parse({
      ...slot1,
      description: "b".repeat(2001),
    }),
  );

  // Reschedule without metadata strictly omits name and description
  const rescheduleSlot = {
    startAt: "2026-10-25T08:00:00Z",
    endAt: "2026-10-25T09:30:00Z",
    locationOrMeetingInfo: "Phòng B202",
  };
  respond({ sessions: [session()], conflicts: [] });
  await sessions.reschedule(id, rescheduleSlot);
  const rescheduleBody = calls.at(-1).body;
  assert.equal("name" in rescheduleBody.session, false);
  assert.equal("description" in rescheduleBody.session, false);
  assert.equal(rescheduleBody.session.locationOrMeetingInfo, "Phòng B202");

  // Legacy response without name/description parses cleanly
  const legacyData = session();
  delete legacyData.name;
  delete legacyData.description;
  const parsedLegacy = schemas.sessionSchema.parse(legacyData);
  assert.equal(parsedLegacy.id, id);
  assert.equal(parsedLegacy.name, undefined);
  assert.equal(parsedLegacy.description, undefined);

  // Modern response with name/description parses cleanly
  const modernData = session({ name: vnName, description: vnDesc });
  const parsedModern = schemas.sessionSchema.parse(modernData);
  assert.equal(parsedModern.name, vnName);
  assert.equal(parsedModern.description, vnDesc);
});
test("session schema parses tutorName and teachingItemName across list and detail, supporting legacy/null/string", () => {
  const legacySession = session();
  assert.equal("tutorName" in legacySession, false);
  assert.equal("teachingItemName" in legacySession, false);
  const parsedLegacy = schemas.sessionSchema.parse(legacySession);
  assert.equal(parsedLegacy.tutorName, undefined);
  assert.equal(parsedLegacy.teachingItemName, undefined);

  const populatedSession = session({
    tutorName: "Thầy Minh",
    teachingItemName: "Toán 10",
  });
  const parsedPopulated = schemas.sessionSchema.parse(populatedSession);
  assert.equal(parsedPopulated.tutorName, "Thầy Minh");
  assert.equal(parsedPopulated.teachingItemName, "Toán 10");

  const nullSession = session({
    tutorName: null,
    teachingItemName: null,
  });
  const parsedNull = schemas.sessionSchema.parse(nullSession);
  assert.equal(parsedNull.tutorName, null);
  assert.equal(parsedNull.teachingItemName, null);

  const page = schemas.sessionPageSchema.parse({
    items: [legacySession, populatedSession, nullSession],
    total: 3,
    page: 1,
    pageSize: 6,
  });
  assert.equal(page.items.length, 3);
  assert.equal(page.items[0].tutorName, undefined);
  assert.equal(page.items[1].tutorName, "Thầy Minh");
  assert.equal(page.items[2].teachingItemName, null);
});
after(() => {
  Module._load = originalLoad;
  require.extensions[".ts"] = extensions.ts;
  require.extensions[".tsx"] = extensions.tsx;
});

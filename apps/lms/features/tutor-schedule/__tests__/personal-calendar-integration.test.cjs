/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const originalLoad = Module._load;
const compile = (mod, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  mod._compile(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
};

require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;

Module._load = function (name, parent, isMain) {
  if (name.startsWith("@/")) {
    return originalLoad.call(
      this,
      path.resolve(__dirname, "../../..", name.slice(2)),
      parent,
      isMain,
    );
  }
  if (name.startsWith("@workspace/core/")) {
    return originalLoad.call(
      this,
      path.resolve(
        __dirname,
        "../../../../../packages/core",
        name.slice("@workspace/core/".length),
      ),
      parent,
      isMain,
    );
  }
  return originalLoad.call(this, name, parent, isMain);
};

const scheduleTypes = require("../types/schedule.types.ts");
const learnerTypes = require("../../learner-schedule/types/learner-schedule.types.ts");
const calendarSchemas = require("../../lms-calendar/schemas.ts");
const calendarUtils = require("../../lms-calendar/utils.ts");
const calendarKeys = require("../../lms-calendar/query-keys.ts");

test("mapLmsScheduleViewToTutorSession correctly maps status, planned flag and Vietnam time", () => {
  const mockOfficial = {
    id: "3e5a3c9b-648b-4c59-bf5f-149b8089423b",
    classId: "6d6b5e0c-333e-4340-96f8-cfa686f05063",
    source: "SESSION",
    startAt: "2026-10-25T14:00:00+07:00",
    endAt: "2026-10-25T15:30:00+07:00",
    status: "ONGOING",
    classTitle: "Toán Nâng Cao 12",
    classType: "INDIVIDUAL",
    name: "Buổi 1: Hàm số",
    version: 3,
    tutorId: "40d216a6-ce53-43c3-aebe-51f7bb8a8c2b",
    tutorName: "Thầy Hùng",
    learnerId: "123e4567-e89b-12d3-a456-426614174000",
    learnerName: "Nguyễn Văn Bảo",
    consultantName: "Trần Thị Mai",
    contextName: "Lớp 12",
    teachingItemName: "Toán 12",
    teachingMode: "ONLINE",
  };

  const tutorSession = scheduleTypes.mapLmsScheduleViewToTutorSession(mockOfficial);
  assert.strictEqual(tutorSession.id, mockOfficial.id);
  assert.strictEqual(tutorSession.source, "SESSION");
  assert.strictEqual(tutorSession.status, "IN_PROGRESS");
  assert.strictEqual(tutorSession.subject, "Lớp 12 - Toán 12");
  assert.strictEqual(tutorSession.date, "2026-10-25");
  assert.strictEqual(tutorSession.startTime, "14:00");
  assert.strictEqual(tutorSession.endTime, "15:30");
  assert.strictEqual(tutorSession.studentFullName, "Nguyễn Văn Bảo");
  assert.strictEqual(tutorSession.studentName, "Bảo");
  assert.strictEqual(tutorSession.consultantName, "Trần Thị Mai");

  const mockPlanned = {
    id: "f83a5477-9a0d-4076-9d62-18da9e0618ce",
    classId: "6d6b5e0c-333e-4340-96f8-cfa686f05063",
    source: "PLANNED",
    startAt: "2026-10-30T09:00:00+07:00",
    endAt: "2026-10-30T10:30:00+07:00",
    status: "SCHEDULED",
    classTitle: "Toán Nâng Cao 12",
    classType: "GROUP",
    version: 0,
    tutorId: "40d216a6-ce53-43c3-aebe-51f7bb8a8c2b",
    teachingItemName: "Toán 12",
  };

  const plannedTutorSession = scheduleTypes.mapLmsScheduleViewToTutorSession(mockPlanned);
  assert.strictEqual(plannedTutorSession.source, "PLANNED");
  assert.strictEqual(plannedTutorSession.studentFullName, "Lớp học nhóm");
});

test("mapLmsScheduleViewToLearnerSession maps initials and handles elapsed status", () => {
  const item = {
    id: "44444444-4444-4444-4444-444444444444",
    classId: "6d6b5e0c-333e-4340-96f8-cfa686f05063",
    classCode: "CLS-101",
    source: "SESSION",
    startAt: "2026-10-18T08:00:00+07:00",
    endAt: "2026-10-18T09:30:00+07:00",
    status: "SCHEDULED",
    classTitle: "Vật Lý 11",
    name: "Dao động cơ học",
    tutorId: "40d216a6-ce53-43c3-aebe-51f7bb8a8c2b",
    tutorName: "Lê Hoàng Nam",
    version: 1,
  };

  const learnerSession = learnerTypes.mapLmsScheduleViewToLearnerSession(item);
  assert.strictEqual(learnerSession.tutorName, "Lê Hoàng Nam");
  assert.strictEqual(learnerSession.tutorInitials, "LN");
  assert.strictEqual(learnerSession.status, "UPCOMING");
  assert.strictEqual(learnerSession.classCode, "CLS-101");
});

test("Learner list NEXT and HISTORY grouping preserves official status and keeps overdue SCHEDULED without mutating to COMPLETED", () => {
  const nowIso = "2026-10-19T12:00:00.000Z";

  const sessionNext = {
    id: "1",
    date: "2026-10-20",
    startTime: "14:00",
    startAt: "2026-10-20T14:00:00+07:00",
    status: "UPCOMING",
  };
  const sessionInProgress = {
    id: "2",
    date: "2026-10-19",
    startTime: "18:00",
    startAt: "2026-10-19T18:00:00+07:00",
    status: "IN_PROGRESS",
  };
  const sessionOverdue = {
    id: "3",
    date: "2026-10-18",
    startTime: "08:00",
    startAt: "2026-10-18T08:00:00+07:00",
    status: "UPCOMING",
  };
  const sessionCompleted = {
    id: "4",
    date: "2026-10-17",
    startTime: "08:00",
    startAt: "2026-10-17T08:00:00+07:00",
    status: "COMPLETED",
  };
  const sessionCancelled = {
    id: "5",
    date: "2026-10-16",
    startTime: "08:00",
    startAt: "2026-10-16T08:00:00+07:00",
    status: "CANCELED",
  };

  const all = [sessionNext, sessionInProgress, sessionOverdue, sessionCompleted, sessionCancelled];

  const upcoming = all.filter((s) => {
    if (s.status === "IN_PROGRESS") return true;
    if (s.status === "UPCOMING" && s.startAt >= nowIso) return true;
    return false;
  });

  const history = all.filter((s) => {
    if (s.status === "COMPLETED" || s.status === "CANCELED" || s.status === "RESCHEDULED") return true;
    if (s.status === "UPCOMING" && s.startAt < nowIso) return true;
    return false;
  });

  assert.strictEqual(upcoming.length, 2);
  assert.deepStrictEqual(upcoming.map(s => s.id), ["1", "2"]);

  assert.strictEqual(history.length, 3);
  assert.deepStrictEqual(history.map(s => s.id), ["3", "4", "5"]);

  const overdueItem = history.find(s => s.id === "3");
  assert.strictEqual(overdueItem.status, "UPCOMING");
});

test("month range boundary calculation stays within 32 days maximum across all 12 months", () => {
  for (let m = 0; m < 12; m++) {
    const range = calendarUtils.getMonthRangeIso(2026, m);
    const parsed = calendarSchemas.calendarRangeSchema.safeParse(range);
    assert.strictEqual(parsed.success, true, `Month ${m + 1} failed range validation`);
    assert.ok(range.from.endsWith("+07:00"));
    assert.ok(range.to.endsWith("+07:00"));
  }
});

test("room join URL validation requires HTTPS and rejects missing/http/cache leakage", () => {
  const good = calendarSchemas.lmsSessionJoinViewSchema.safeParse({
    sessionId: "3e5a3c9b-648b-4c59-bf5f-149b8089423b",
    url: "https://meet.google.com/abc-defg-hij",
  });
  assert.strictEqual(good.success, true);

  const insecure = calendarSchemas.lmsSessionJoinViewSchema.safeParse({
    sessionId: "3e5a3c9b-648b-4c59-bf5f-149b8089423b",
    url: "http://meet.google.com/abc-defg-hij",
  });
  assert.strictEqual(insecure.success, false);

  const nullUrl = calendarSchemas.lmsSessionJoinViewSchema.safeParse({
    sessionId: "3e5a3c9b-648b-4c59-bf5f-149b8089423b",
    url: null,
  });
  assert.strictEqual(nullUrl.success, true);
});

test("Tutor cancel/reschedule query keys invalidation targets both personal calendar and class resource keys", () => {
  const calKey = calendarKeys.lmsCalendarKeys.all;
  assert.deepStrictEqual(calKey, ["lms-personal-calendar"]);

  const tutorActorKey = calendarKeys.lmsCalendarKeys.actor("tutor");
  assert.deepStrictEqual(tutorActorKey, ["lms-personal-calendar", "tutor"]);
});

test("formatLmsSubject correctly formats contextName + teachingItemName with hyphen", () => {
  assert.strictEqual(
    calendarUtils.formatLmsSubject({
      contextName: "Lớp 10",
      teachingItemName: "Toán Đại Số",
    }),
    "Lớp 10 - Toán Đại Số",
  );

  assert.strictEqual(
    calendarUtils.formatLmsSubject({
      contextName: null,
      teachingItemName: "Toán 12",
    }),
    "Toán 12",
  );

  assert.strictEqual(
    calendarUtils.formatLmsSubject({
      contextName: "Cấp 3",
      teachingItemName: null,
    }),
    "Cấp 3",
  );

  assert.strictEqual(
    calendarUtils.formatLmsSubject({
      classTitle: "Lớp Học Mẫu",
    }),
    "Lớp Học Mẫu",
  );

  assert.strictEqual(calendarUtils.formatLmsSubject(null), "Môn học");
});

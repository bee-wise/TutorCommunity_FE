/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function loadTsModule(relativePath) {
  const fullPath = path.resolve(__dirname, relativePath);
  const source = fs.readFileSync(fullPath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = { exports: {} };
  const fn = new Function("require", "exports", "module", "__filename", "__dirname", compiled);
  fn(require, mod.exports, mod, fullPath, path.dirname(fullPath));
  return mod.exports;
}

const schemas = loadTsModule("../schemas.ts");
const utils = loadTsModule("../utils.ts");
const queryKeys = loadTsModule("../query-keys.ts");

test("lmsScheduleView parses SESSION and PLANNED with ONGOING alias normalization", () => {
  const sessionItem = {
    id: "e44c2069-cf4d-458f-b98a-aa2aa6fa6041",
    classId: "6d6b5e0c-333e-4340-96f8-cfa686f05063",
    source: "SESSION",
    startAt: "2026-10-20T08:00:00+07:00",
    endAt: "2026-10-20T10:00:00+07:00",
    status: "ONGOING",
    classTitle: "Toán Nâng Cao 10",
    classType: "INDIVIDUAL",
    name: "Buổi 1: Hàm số bậc hai",
    description: "Khảo sát và vẽ đồ thị hàm số",
    version: 1,
    tutorId: "40d216a6-ce53-43c3-aebe-51f7bb8a8c2b",
    tutorName: "Nguyễn Văn A",
    teachingItemName: "Toán 10",
    location: "Google Meet",
  };

  const parsedSession = schemas.lmsScheduleViewSchema.parse(sessionItem);
  assert.strictEqual(parsedSession.source, "SESSION");
  assert.strictEqual(parsedSession.status, "IN_PROGRESS");
  assert.strictEqual(schemas.isOfficialSession(parsedSession), true);
  assert.strictEqual(schemas.isPlannedSchedule(parsedSession), false);

  const plannedItem = {
    id: "f83a5477-9a0d-4076-9d62-18da9e0618ce",
    classId: "6d6b5e0c-333e-4340-96f8-cfa686f05063",
    source: "PLANNED",
    startAt: "2026-10-25T08:00:00+07:00",
    endAt: "2026-10-25T10:00:00+07:00",
    status: "SCHEDULED",
    classTitle: "Toán Nâng Cao 10",
    version: 0,
    tutorId: "40d216a6-ce53-43c3-aebe-51f7bb8a8c2b",
  };

  const parsedPlanned = schemas.lmsScheduleViewSchema.parse(plannedItem);
  assert.strictEqual(parsedPlanned.source, "PLANNED");
  assert.strictEqual(schemas.isOfficialSession(parsedPlanned), false);
  assert.strictEqual(schemas.isPlannedSchedule(parsedPlanned), true);
});

test("calendar range boundary validates <= 32 days and from < to", () => {
  const valid = schemas.calendarRangeSchema.safeParse({
    from: "2026-10-01T00:00:00+07:00",
    to: "2026-11-01T00:00:00+07:00",
  });
  assert.strictEqual(valid.success, true);

  const inverted = schemas.calendarRangeSchema.safeParse({
    from: "2026-11-01T00:00:00+07:00",
    to: "2026-10-01T00:00:00+07:00",
  });
  assert.strictEqual(inverted.success, false);

  const tooLong = schemas.calendarRangeSchema.safeParse({
    from: "2026-10-01T00:00:00+07:00",
    to: "2026-11-05T00:00:00+07:00",
  });
  assert.strictEqual(tooLong.success, false);
});

test("getMonthRangeIso formats Vietnam +07:00 boundaries correctly across month & year boundary", () => {
  const oct = utils.getMonthRangeIso(2026, 9);
  assert.strictEqual(oct.from, "2026-10-01T00:00:00+07:00");
  assert.strictEqual(oct.to, "2026-11-01T00:00:00+07:00");

  const dec = utils.getMonthRangeIso(2026, 11);
  assert.strictEqual(dec.from, "2026-12-01T00:00:00+07:00");
  assert.strictEqual(dec.to, "2027-01-01T00:00:00+07:00");
});

test("parseVietnamDateTime handles Vietnam timezone correctly", () => {
  const result = utils.parseVietnamDateTime("2026-10-19T08:30:00+07:00");
  assert.strictEqual(result.year, 2026);
  assert.strictEqual(result.month, 10);
  assert.strictEqual(result.day, 19);
  assert.strictEqual(result.hour, 8);
  assert.strictEqual(result.minute, 30);
  assert.strictEqual(result.dateKey, "2026-10-19");
  assert.strictEqual(result.timeString, "08:30");
});

test("join schema enforces HTTPS room url and rejects insecure http", () => {
  const validHttps = schemas.lmsSessionJoinViewSchema.safeParse({
    sessionId: "e44c2069-cf4d-458f-b98a-aa2aa6fa6041",
    url: "https://meet.google.com/xyz-abc-def",
  });
  assert.strictEqual(validHttps.success, true);

  const insecureHttp = schemas.lmsSessionJoinViewSchema.safeParse({
    sessionId: "e44c2069-cf4d-458f-b98a-aa2aa6fa6041",
    url: "http://meet.google.com/xyz-abc-def",
  });
  assert.strictEqual(insecureHttp.success, false);

  const nullUrl = schemas.lmsSessionJoinViewSchema.safeParse({
    sessionId: "e44c2069-cf4d-458f-b98a-aa2aa6fa6041",
    url: null,
  });
  assert.strictEqual(nullUrl.success, true);
});

test("query keys are correctly scoped by actor and operation", () => {
  const keys = queryKeys.lmsCalendarKeys;
  assert.deepStrictEqual(keys.actor("tutor"), ["lms-personal-calendar", "tutor"]);
  assert.deepStrictEqual(keys.kpis("tutor"), ["lms-personal-calendar", "tutor", "kpis"]);
  assert.deepStrictEqual(keys.upcoming("learner"), ["lms-personal-calendar", "learner", "upcoming"]);
  assert.deepStrictEqual(keys.detail("tutor", "123"), ["lms-personal-calendar", "tutor", "detail", "123"]);
});

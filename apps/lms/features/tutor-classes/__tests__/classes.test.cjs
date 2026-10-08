/* eslint-disable @typescript-eslint/no-require-imports -- Native Node harness compiles feature modules in memory. */
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
const compile = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
require.extensions[".ts"] = compile;
require.extensions[".tsx"] = compile;
Module._load = function (name, parent, isMain) {
  if (name.startsWith("@/"))
    return originalLoad.call(
      this,
      path.resolve(__dirname, "../../..", name.slice(2)),
      parent,
      isMain,
    );
  if (name === "next/link")
    return {
      __esModule: true,
      default: ({ children, ...props }) =>
        React.createElement("a", props, children),
    };
  return originalLoad.call(this, name, parent, isMain);
};
const {
  TUTOR_CLASSES,
  CLASS_ROSTER,
  TUTOR_CLASS_SESSIONS,
} = require("../data/classes.mock.ts");
const {
  canMarkAttendance,
  filterTutorClasses,
  formatClassDate,
  getTutorClassCardModel,
} = require("../utils/classes.utils.ts");
const { attendanceCommandSchema } = require("../types/attendance.schemas.ts");
const { saveMockAttendance } = require("../services/attendance.service.ts");
const { useAttendanceStore: store } = require("../store/attendance.store.ts");
const { TutorClassCard } = require("../components/TutorClassCard.tsx");
const {
  AttendanceLearnerCard,
} = require("../components/AttendanceLearnerCard.tsx");
const { ClassFilters } = require("../components/ClassFilters.tsx");
const { ClassSessionCard } = require("../components/ClassSessionCard.tsx");
const { ClassPagination } = require("../components/ClassPagination.tsx");
const { ClassesSkeleton } = require("../components/ClassesSkeleton.tsx");
const { useForm } = require("react-hook-form");
const activeGroup = TUTOR_CLASSES.find(
  (item) => item.id === "class-group-math",
);
const ongoing = TUTOR_CLASS_SESSIONS.find(
  (item) => item.id === "demo-group-math-live",
);
const command = (overrides = {}) => ({
  classId: activeGroup.id,
  sessionId: ongoing.id,
  state: "confirmed",
  expectedVersion: 0,
  entries: activeGroup.learnerIds.map((learnerId) => ({
    learnerId,
    status: "present",
    note: "",
  })),
  ...overrides,
});

test("class filtering preserves 1:1/group structure, supports learners without accents and sorts without mutation", () => {
  const filters = { kind: "group", status: "all", search: "", sort: "newest" };
  const before = TUTOR_CLASSES.map((item) => item.id);
  assert.equal(
    filterTutorClasses(TUTOR_CLASSES, CLASS_ROSTER, filters).length,
    3,
  );
  assert.equal(
    filterTutorClasses(TUTOR_CLASSES, CLASS_ROSTER, {
      ...filters,
      kind: "individual",
    }).length,
    7,
  );
  assert.equal(
    filterTutorClasses(TUTOR_CLASSES, CLASS_ROSTER, {
      ...filters,
      search: "nguyen minh anh",
      status: "active",
    })[0].id,
    activeGroup.id,
  );
  assert.equal(
    filterTutorClasses(TUTOR_CLASSES, CLASS_ROSTER, {
      ...filters,
      sort: "oldest",
    })[0].id,
    "class-group-review",
  );
  assert.equal(
    filterTutorClasses(TUTOR_CLASSES, CLASS_ROSTER, {
      ...filters,
      sort: "status",
    })[0].status,
    "active",
  );
  assert.deepEqual(
    TUTOR_CLASSES.map((item) => item.id),
    before,
  );
});

test("ongoing and completed sessions can be marked; scheduled/cancelled and non-active classes cannot", () => {
  assert.equal(canMarkAttendance(activeGroup, ongoing), true);
  assert.equal(
    canMarkAttendance(activeGroup, { ...ongoing, status: "completed" }),
    true,
  );
  for (const status of ["scheduled", "cancelled"])
    assert.equal(canMarkAttendance(activeGroup, { ...ongoing, status }), false);
  for (const status of ["upcoming", "completed"])
    assert.equal(canMarkAttendance({ ...activeGroup, status }, ongoing), false);
  assert.equal(
    canMarkAttendance(activeGroup, { ...ongoing, classId: "other" }),
    false,
  );
});

test("drafts and confirmed commands accept present and unmarked entries; reject invalid notes", () => {
  const draft = command({
    state: "draft",
    entries: command().entries.map((entry) => ({
      ...entry,
      status: "unmarked",
    })),
  });
  assert.equal(attendanceCommandSchema.safeParse(draft).success, true);
  const confirmed = command({
    state: "confirmed",
    entries: command().entries.map((entry) => ({
      ...entry,
      status: "present",
    })),
  });
  assert.equal(attendanceCommandSchema.safeParse(confirmed).success, true);
  assert.equal(
    attendanceCommandSchema.safeParse({ ...draft, state: "confirmed" }).success,
    true,
  );
  assert.equal(
    attendanceCommandSchema.safeParse(
      command({
        entries: command().entries.map((entry) => ({
          ...entry,
          note: "x".repeat(501),
        })),
      }),
    ).success,
    false,
  );
});

test("mutation rejects duplicate, missing, foreign learner IDs and sessions belonging to another class", () => {
  const entries = command().entries;
  assert.throws(() =>
    saveMockAttendance(
      command({ entries: [entries[0], entries[0], entries[2]] }),
    ),
  );
  assert.throws(() =>
    saveMockAttendance(command({ entries: entries.slice(1) })),
  );
  assert.throws(() =>
    saveMockAttendance(
      command({
        entries: [
          { ...entries[0], learnerId: "outsider" },
          ...entries.slice(1),
        ],
      }),
    ),
  );
  assert.throws(() =>
    saveMockAttendance(command({ sessionId: "session-ma-01" })),
  );
  assert.throws(() => saveMockAttendance(command({ classId: "missing" })));
});

test("service guards lifecycle even if UI controls are bypassed", () => {
  assert.throws(() =>
    saveMockAttendance(command({ sessionId: "session-group-math-02" })),
  );
  assert.throws(() =>
    saveMockAttendance(
      command({
        classId: "class-ma-math",
        sessionId: "demo-ma-math-cancelled",
        entries: [
          { learnerId: "learner-minh-anh", status: "present", note: "" },
        ],
      }),
    ),
  );
  assert.throws(() =>
    saveMockAttendance(
      command({
        classId: "class-group-review",
        sessionId: "session-group-review-01",
        entries: [
          { learnerId: "learner-minh-anh", status: "present", note: "" },
          { learnerId: "learner-gia-huy", status: "present", note: "" },
        ],
      }),
    ),
  );
});

test("versions prevent stale writes; confirmed revisions cannot regress to drafts", () => {
  const first = saveMockAttendance(command());
  assert.equal(first.version, 1);
  assert.throws(() => saveMockAttendance(command(), first), /đã thay đổi/);
  const second = saveMockAttendance(command({ expectedVersion: 1 }), first);
  assert.equal(second.version, 2);
  assert.equal(first.version, 1);
  assert.throws(
    () =>
      saveMockAttendance(
        command({ expectedVersion: 2, state: "draft" }),
        second,
      ),
    /bản nháp/,
  );
});

test("store atomically keeps before/after history and failed writes leave data unchanged", () => {
  store.setState({ records: {}, revisions: [] });
  const first = store.getState().save(command({ state: "draft" }));
  const second = store
    .getState()
    .save(command({ expectedVersion: first.version }));
  assert.equal(second.state, "confirmed");
  assert.equal(store.getState().revisions.length, 2);
  assert.equal(store.getState().revisions[0].previous, null);
  assert.equal(store.getState().revisions[1].previous.state, "draft");
  const before = structuredClone(store.getState().records);
  assert.throws(() => store.getState().save(command()));
  assert.deepEqual(store.getState().records, before);
  assert.equal(store.getState().revisions.length, 2);
});

test("class card has one navigation target, correct labels and actionable missing attendance", () => {
  const html = renderToStaticMarkup(
    React.createElement(
      TutorClassCard,
      getTutorClassCardModel(
        activeGroup,
        CLASS_ROSTER,
        TUTOR_CLASS_SESSIONS,
        {},
      ),
    ),
  );
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.ok(html.includes("/lms/tutor/classes/class-group-math"));
  assert.ok(html.includes("BW-G201"));
  assert.ok(html.includes("2 buổi chưa xác nhận điểm danh"));
  const records = Object.fromEntries(
    TUTOR_CLASS_SESSIONS.filter(
      (session) =>
        session.classId === activeGroup.id &&
        ["ongoing", "completed"].includes(session.status),
    ).map((session) => [session.id, { state: "confirmed" }]),
  );
  const completed = renderToStaticMarkup(
    React.createElement(
      TutorClassCard,
      getTutorClassCardModel(
        activeGroup,
        CLASS_ROSTER,
        TUTOR_CLASS_SESSIONS,
        records,
      ),
    ),
  );
  assert.ok(!completed.includes("chưa xác nhận điểm danh"));
  assert.match(formatClassDate("2026-10-05T17:00:00Z"), /06\/10\/2026/);
});

function AttendanceCardHarness({ editable, learner = CLASS_ROSTER[0] }) {
  const form = useForm({
    defaultValues: {
      entries: [{ learnerId: learner.id, status: "present", note: "" }],
    },
  });
  return React.createElement(AttendanceLearnerCard, {
    learner,
    index: 0,
    form,
    editable,
  });
}

test("attendance card renders learner identity and three labelled exclusive radio choices (present, absent & unmarked)", () => {
  const html = renderToStaticMarkup(
    React.createElement(AttendanceCardHarness, { editable: true }),
  );
  assert.ok(html.includes(CLASS_ROSTER[0].fullName));
  assert.ok(html.includes(CLASS_ROSTER[0].email));
  assert.ok(html.includes('data-slot="avatar"'));
  assert.equal((html.match(/type="radio"/g) ?? []).length, 3);
  assert.equal((html.match(/name="entries\.0\.status"/g) ?? []).length, 3);
  for (const status of ["present", "absent", "unmarked"])
    assert.ok(html.includes(`value="${status}"`));
  assert.ok(!html.includes('role="combobox"'));
  assert.ok(html.includes("<article"));
  assert.ok(html.includes("<fieldset"));
  assert.ok(html.includes("<legend"));
  assert.equal((html.match(/checked=""/g) ?? []).length, 1);
  assert.ok(html.includes(`for="attendance-${CLASS_ROSTER[0].id}-note"`));
  assert.ok(!html.includes("<tr"));
});

test("read-only attendance retains identity and status without editable inputs; missing email has a fallback", () => {
  const html = renderToStaticMarkup(
    React.createElement(AttendanceCardHarness, {
      editable: false,
      learner: { ...CLASS_ROSTER[0], email: null },
    }),
  );
  assert.ok(html.includes("Chưa có email"));
  assert.ok(html.includes("Có mặt"));
  assert.ok(!html.includes('type="radio"'));
  assert.ok(!html.includes("<textarea"));
  assert.ok(!html.includes("<input"));
});

test("class filters expose two pressed choices, named search and labelled selects without an icon cluster", () => {
  const html = renderToStaticMarkup(
    React.createElement(ClassFilters, {
      filters: {
        kind: "group",
        search: "Minh Anh",
        status: "active",
        sort: "newest",
      },
      counts: { individual: 7, group: 3 },
      onChange() {},
    }),
  );
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.equal((html.match(/aria-pressed="false"/g) ?? []).length, 1);
  assert.ok(html.includes('value="Minh Anh"'));
  for (const id of ["classes-status", "classes-sort"]) {
    assert.ok(html.includes(`for="${id}"`));
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.equal((html.match(/<svg /g) ?? []).length, 3);
  assert.ok(!html.includes("underline"));
});

test("session card keeps the permitted action visible and gives read-only classes a view action", () => {
  const render = (classInfo, session, record) =>
    renderToStaticMarkup(
      React.createElement(ClassSessionCard, {
        classInfo,
        session,
        record,
        onAttendance() {},
      }),
    );
  const editable = render(activeGroup, ongoing);
  assert.ok(editable.includes(ongoing.topic));
  assert.ok(editable.includes("Đang diễn ra"));
  assert.ok(editable.includes('data-variant="default"'));
  assert.ok(editable.includes(">Điểm danh</button>"));
  const confirmed = render(activeGroup, ongoing, {
    state: "confirmed",
    updatedAt: ongoing.taughtAt,
  });
  assert.ok(confirmed.includes("Chỉnh sửa điểm danh"));
  for (const [classInfo, session] of [
    [{ ...activeGroup, status: "completed" }, ongoing],
    [activeGroup, { ...ongoing, status: "scheduled" }],
    [activeGroup, { ...ongoing, status: "cancelled" }],
  ]) {
    const html = render(classInfo, session);
    assert.ok(html.includes(">Xem điểm danh</button>"));
    assert.ok(html.includes('data-variant="outline"'));
  }
});

test("card model scopes roster and sessions to the class and only prompts actionable attendance", () => {
  const before = structuredClone(TUTOR_CLASS_SESSIONS);
  const model = getTutorClassCardModel(
    activeGroup,
    CLASS_ROSTER,
    TUTOR_CLASS_SESSIONS,
    {},
  );
  assert.deepEqual(
    model.learners.map((learner) => learner.id).sort(),
    [...activeGroup.learnerIds].sort(),
  );
  assert.equal(model.attendancePendingCount, 2);
  const completed = getTutorClassCardModel(
    { ...activeGroup, status: "completed" },
    CLASS_ROSTER,
    TUTOR_CLASS_SESSIONS,
    {},
  );
  assert.equal(completed.attendancePendingCount, 0);
  assert.deepEqual(TUTOR_CLASS_SESSIONS, before);
  const html = renderToStaticMarkup(React.createElement(TutorClassCard, model));
  assert.ok(html.includes("19/08/2026"));
  assert.ok(!html.includes("underline"));
});

test("pagination disables boundary actions and loading states mirror responsive layouts", () => {
  const html = renderToStaticMarkup(
    React.createElement(ClassPagination, {
      page: 0,
      pageCount: 2,
      label: "Phân trang lớp học",
      onPageChange() {},
    }),
  );
  assert.ok(html.includes('aria-label="Phân trang lớp học"'));
  assert.equal((html.match(/disabled=""/g) ?? []).length, 1);
  assert.ok(html.includes("Trang 1 / 2"));
  assert.equal(
    renderToStaticMarkup(
      React.createElement(ClassPagination, {
        page: 0,
        pageCount: 1,
        label: "Pagination",
        onPageChange() {},
      }),
    ),
    "",
  );
  for (const detail of [false, true]) {
    const loading = renderToStaticMarkup(
      React.createElement(ClassesSkeleton, { detail }),
    );
    assert.ok(loading.includes('role="status"'));
    assert.ok(loading.includes('aria-hidden="true"'));
    assert.ok(loading.includes("motion-safe:animate-pulse"));
  }
});

after(() => {
  require.extensions[".ts"] = originalTs;
  require.extensions[".tsx"] = originalTsx;
  Module._load = originalLoad;
});

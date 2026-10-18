/* eslint-disable @typescript-eslint/no-require-imports -- Native Node test transpiles the small TypeScript utility. */
const { after, test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

const originalTs = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  module._compile(output, filename);
};
after(() => {
  if (originalTs) require.extensions[".ts"] = originalTs;
  else delete require.extensions[".ts"];
});

const {
  calculateSessionEndAt,
  mapSchedulerSlots,
  computeSchedulerSignature,
  computeIdempotencySignature,
} = require("../utils/session-schedule.utils.ts");

test("giờ kết thúc bằng giờ bắt đầu cộng thời lượng lớp", () => {
  assert.equal(
    calculateSessionEndAt("2026-10-15T01:00:00.000Z", 60),
    "2026-10-15T02:00:00.000Z",
  );
});

test("buổi học qua nửa đêm chuyển sang ngày hôm sau tại Việt Nam", () => {
  const endAt = calculateSessionEndAt("2026-10-15T16:30:00.000Z", 90);
  assert.equal(endAt, "2026-10-15T18:00:00.000Z");
  assert.equal(
    new Date(Date.parse(endAt) + 7 * 60 * 60 * 1000).toISOString().slice(0, 16),
    "2026-10-16T01:00",
  );
});

test("thời lượng không hợp lệ không tạo ra giờ kết thúc", () => {
  assert.throws(() => calculateSessionEndAt("2026-10-15T01:00:00.000Z", 0));
  assert.throws(() => calculateSessionEndAt("2026-10-15T01:00:00.000Z", -30));
});

test("production mapSchedulerSlots: preserves per-slot metadata, trims blank to null, and ensures preview/create parity", () => {
  const formSlots = [
    {
      name: "  Buổi 1: Tổng quan & Nhập môn  ",
      description: "  Giới thiệu mục tiêu khóa học và chuẩn bị môi trường.  ",
      start: "2026-10-25T08:00",
      meeting: "Phòng A101",
      planned: "plan-1",
    },
    {
      name: "Buổi 2: Cấu trúc điều khiển",
      description: "Câu lệnh rẽ nhánh và vòng lặp trong giải thuật.",
      start: "2026-10-27T08:00",
      meeting: "https://zoom.us/j/123",
      planned: "plan-2",
    },
    {
      name: "   ",
      description: "",
      start: "2026-10-29T08:00",
      meeting: "",
      planned: "",
    },
  ];

  const now = Date.parse("2026-10-20T00:00:00.000Z");
  const previewPayload = mapSchedulerSlots(formSlots, 90, { now });
  const createPayload = mapSchedulerSlots(formSlots, 90, { now });

  // Preview and Create parity
  assert.deepEqual(previewPayload, createPayload);

  // Per-slot metadata verification
  assert.equal(previewPayload.length, 3);
  assert.equal(previewPayload[0].name, "Buổi 1: Tổng quan & Nhập môn");
  assert.equal(
    previewPayload[0].description,
    "Giới thiệu mục tiêu khóa học và chuẩn bị môi trường.",
  );
  assert.equal(previewPayload[0].startAt, "2026-10-25T01:00:00.000Z");
  assert.equal(previewPayload[0].endAt, "2026-10-25T02:30:00.000Z");

  assert.equal(previewPayload[1].name, "Buổi 2: Cấu trúc điều khiển");
  assert.equal(
    previewPayload[1].description,
    "Câu lệnh rẽ nhánh và vòng lặp trong giải thuật.",
  );

  // Blank or whitespace strings are trimmed to null
  assert.equal(previewPayload[2].name, null);
  assert.equal(previewPayload[2].description, null);
});

test("production computeSchedulerSignature: name/description edits invalidate previous preview signature", () => {
  const initialSlots = [
    {
      name: "Buổi 1: Nhập môn",
      description: "Mô tả ban đầu",
      start: "2026-10-25T08:00",
      meeting: "",
      planned: "",
    },
  ];
  const initialSignature = computeSchedulerSignature(initialSlots, 60);

  // Editing name invalidates signature
  const editedNameSlots = [
    { ...initialSlots[0], name: "Buổi 1: Nhập môn (Đã cập nhật)" },
  ];
  const nameEditSignature = computeSchedulerSignature(editedNameSlots, 60);
  assert.notEqual(initialSignature, nameEditSignature);

  // Editing description invalidates signature
  const editedDescSlots = [
    { ...initialSlots[0], description: "Nội dung chi tiết hơn sau cập nhật" },
  ];
  const descEditSignature = computeSchedulerSignature(editedDescSlots, 60);
  assert.notEqual(initialSignature, descEditSignature);

  // Identical slots preserve signature
  const identicalSlots = [{ ...initialSlots[0] }];
  assert.equal(
    initialSignature,
    computeSchedulerSignature(identicalSlots, 60),
  );
});

test("production computeIdempotencySignature: payload signature tracks metadata and changes idempotency key", () => {
  const now = Date.parse("2026-10-20T00:00:00.000Z");
  const slotA = {
    name: "Buổi A",
    description: "Mô tả A",
    start: "2026-10-25T08:00",
    meeting: "",
    planned: "",
  };
  const payloadA = mapSchedulerSlots([slotA], 60, { now });
  const sigA = computeIdempotencySignature(payloadA);

  const slotB = {
    ...slotA,
    description: "Mô tả B đã đổi",
  };
  const payloadB = mapSchedulerSlots([slotB], 60, { now });
  const sigB = computeIdempotencySignature(payloadB);

  // Changing metadata changes idempotency signature
  assert.notEqual(sigA, sigB);

  // Identical payload keeps exact same idempotency signature
  const payloadAClone = mapSchedulerSlots([{ ...slotA }], 60, { now });
  assert.equal(sigA, computeIdempotencySignature(payloadAClone));
});

test("production mapSchedulerSlots: strictly omits name and description when isReschedule is true", () => {
  const now = Date.parse("2026-10-20T00:00:00.000Z");
  const rescheduleSlot = {
    name: "Tên không nên gửi",
    description: "Mô tả không nên gửi",
    start: "2026-10-28T14:00",
    meeting: "Phòng mới B205",
    planned: "",
  };

  const result = mapSchedulerSlots([rescheduleSlot], 90, {
    isReschedule: true,
    now,
  });

  assert.equal(result.length, 1);
  assert.equal("name" in result[0], false);
  assert.equal("description" in result[0], false);
  assert.equal(result[0].startAt, "2026-10-28T07:00:00.000Z");
  assert.equal(result[0].endAt, "2026-10-28T08:30:00.000Z");
  assert.equal(result[0].locationOrMeetingInfo, "Phòng mới B205");
});



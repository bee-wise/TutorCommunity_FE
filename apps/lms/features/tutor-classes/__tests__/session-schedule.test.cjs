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

const { calculateSessionEndAt } = require("../utils/session-schedule.utils.ts");

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

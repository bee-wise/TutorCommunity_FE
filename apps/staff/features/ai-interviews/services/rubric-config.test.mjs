import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const filename = new URL("./rubric-config.ts", import.meta.url);
const compiled = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loaded = { exports: {} };
new Function("require", "module", "exports", compiled)(createRequire(filename), loaded, loaded.exports);
const { parseRubricConfig, serializeRubricToml, prepareRubricVersion, replaceRubricValue } = loaded.exports;
const config = { meta: { version: "v1", language: "vi" }, questions: [{ q_code: "Q1", text: "Câu hỏi\nNêu ví dụ", prep_seconds: 30, answer_seconds: 90, weight: 0.5, criteria: [{ code: "Q1.C1", levels: ["0", "1", "2", "3", "4"] }] }], thresholds: { pass: 70 }, extra: { enabled: true, "key.with.dots": "Giữ nguyên" } };

test("creating a rubric changes only its version and preserves arbitrary config fields", () => {
  const next = prepareRubricVersion(config, "v1", " v2 ", ["v1"]);
  assert.equal(next.meta.version, "v2"); assert.equal(config.meta.version, "v1");
  assert.deepEqual(next.questions, config.questions); assert.deepEqual(next.extra, config.extra);
  assert.throws(() => prepareRubricVersion(config, "v1", "v1", ["v1"]), /tồn tại/);
});
test("a missing or ambiguous version never silently invents a TOML structure", () => {
  assert.throws(() => prepareRubricVersion({ questions: [] }, "v1", "v2", []), /version/);
  assert.throws(() => prepareRubricVersion({ version: "v1", meta: { version: "v1" } }, "v1", "v2", []), /version/);
});
test("nested time, criterion and threshold edits preserve sibling fields", () => {
  const updated = replaceRubricValue(config, ["questions", 0, "answer_seconds"], 120);
  assert.equal(updated.questions[0].answer_seconds, 120); assert.equal(config.questions[0].answer_seconds, 90);
  assert.deepEqual(updated.questions[0].criteria, config.questions[0].criteria);
  assert.throws(() => replaceRubricValue(config, ["missing"], 1), /Không tìm thấy/);
});
test("unsupported TOML values are rejected instead of dropping config data", () => {
  for (const source of ['{"value":null}', '["Q1"]', '{"value":1e400}', 'invalid']) assert.throws(() => parseRubricConfig(source));
});
test("TOML escapes text and treats dotted keys as literal keys", () => {
  const serialized = serializeRubricToml(config);
  assert.ok(serialized.includes('"key.with.dots" = "Giữ nguyên"'));
  assert.ok(serialized.includes('"text" = "Câu hỏi\\nNêu ví dụ"'));
});
test("generated TOML roundtrips nested rubric config through Python tomllib", { skip: !process.env.BEEWISE_PYTHON }, () => {
  const result = spawnSync(process.env.BEEWISE_PYTHON, ["-c", "import json,sys,tomllib; print(json.dumps(tomllib.loads(sys.stdin.read()),ensure_ascii=False))"], { input: serializeRubricToml(config), encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr); assert.deepEqual(JSON.parse(result.stdout), config);
});

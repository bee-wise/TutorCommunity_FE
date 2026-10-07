/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS hooks transpile TypeScript in memory and mock API boundaries for the native Node test runner. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");

// Compile source in memory; all API and toast boundaries are mocked.
const originalTs = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
};
const originalLoad = Module._load;
let post = async () => { throw new Error("Unexpected API call"); };
const notices = [];
Module._load = function (request, parent, isMain) {
  if (request === "@workspace/core/configs/client") return { apiClient: { post: (...args) => post(...args) } };
  if (request === "@workspace/ui/components/ui/bee-toast") return { toast: Object.fromEntries(["success", "error", "warning", "info"].map((key) => [key, (...args) => notices.push({ key, args })])) };
  return originalLoad.call(this, request, parent, isMain);
};
const memory = new Map();
global.localStorage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };

const { QueryClient } = require("@tanstack/react-query");
const { useClassMaterialsStore: library, canEditClass, MATERIAL_STORAGE_KEY } = require("../store/class-materials.store.ts");
const { useAIJobsStore: jobs } = require("../store/ai-jobs.store.ts");
const { CLASS_MATERIALS, MATERIAL_CLASSES, CLASS_LEARNERS } = require("../data/classroom.mock.ts");
const { MOCK_AI_RESPONSE } = require("../mockData.ts");
const { filterMaterialClasses } = require("../utils/class-library.utils.ts");
const { startClassGeneration } = require("../services/ai-generation.service.ts");
const { aiAnalyze } = require("../api/analyze.api.ts");
const { validateMaterialFile } = require("../services/local-files.service.ts");
const { PersistedMaterialsSchema } = require("../types/material.schemas.ts");
const client = new QueryClient({ defaultOptions: { mutations: { gcTime: Infinity, retry: false } } });
const reset = () => { library.setState({ materials: structuredClone(CLASS_MATERIALS) }); jobs.setState({ jobs: {} }); };
const tick = async (predicate) => {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await new Promise((resolve) => setTimeout(resolve, 5)); }
  assert.fail("Timed out waiting for the background mutation");
};

test("class filters separate 1:1/groups, search learners, sort and do not mutate source", () => {
  const before = MATERIAL_CLASSES.map((item) => item.id);
  const filter = { kind: "group", search: "", status: "all", sort: "newest" };
  const newest = filterMaterialClasses(MATERIAL_CLASSES, CLASS_LEARNERS, filter);
  assert.equal(newest[0].id, "class-group-english");
  assert.equal(filterMaterialClasses(MATERIAL_CLASSES, CLASS_LEARNERS, { ...filter, sort: "oldest" })[0].id, "class-group-review");
  assert.equal(filterMaterialClasses(MATERIAL_CLASSES, CLASS_LEARNERS, { ...filter, sort: "status" })[0].status, "active");
  assert.equal(filterMaterialClasses(MATERIAL_CLASSES, CLASS_LEARNERS, { ...filter, search: "Gia Huy", status: "active" }).length, 1);
  assert.deepEqual(MATERIAL_CLASSES.map((item) => item.id), before);
});

test("completed classes cannot add, edit or publish materials", () => {
  reset();
  assert.equal(canEditClass("class-gh-math"), false);
  const before = structuredClone(library.getState().materials);
  const completed = before.find((item) => item.classId === "class-kl-math");
  library.getState().updateMaterial(completed.id, { title: "Should not change", status: "published" });
  library.getState().addMaterial({ ...completed, id: "new-completed" });
  assert.deepEqual(library.getState().materials, before);
});

test("a detached AI mutation completes once, saves a class draft and can be published", async () => {
  reset(); let resolve; let calls = 0;
  post = () => { calls++; return new Promise((done) => { resolve = done; }); };
  const input = { transcript: "Zoom transcript", subject: "Toán", num_questions: 4 };
  startClassGeneration(client, "class-group-math", "session-group-math-01", input);
  startClassGeneration(client, "class-group-math", "session-group-math-01", input);
  assert.equal(jobs.getState().jobs["class-group-math"].status, "running");
  await tick(() => Boolean(resolve));
  resolve(structuredClone(MOCK_AI_RESPONSE));
  await tick(() => jobs.getState().jobs["class-group-math"].status === "ready");
  assert.equal(calls, 1);
  const id = jobs.getState().jobs["class-group-math"].materialId;
  const material = library.getState().materials.find((item) => item.id === id);
  assert.equal(material.classId, "class-group-math"); assert.equal(material.status, "draft");
  assert.deepEqual(material.data, MOCK_AI_RESPONSE);
  library.getState().updateMaterial(id, { status: "published" });
  assert.equal(library.getState().materials.filter((item) => item.id === id).length, 1);
  assert.equal(library.getState().materials.find((item) => item.id === id).status, "published");
  assert.equal(PersistedMaterialsSchema.safeParse(JSON.parse(memory.get(MATERIAL_STORAGE_KEY))).success, true);
});

test("AI failure is retained and can be retried", async () => {
  reset(); post = async () => { throw new Error("AI unavailable"); };
  const input = { transcript: "Zoom transcript", subject: "Toán", num_questions: 4 };
  startClassGeneration(client, "class-ma-math", "session-ma-01", input);
  await tick(() => jobs.getState().jobs["class-ma-math"].status === "error");
  assert.equal(jobs.getState().jobs["class-ma-math"].error, "AI unavailable");
  post = async () => ({ data: structuredClone(MOCK_AI_RESPONSE) });
  startClassGeneration(client, "class-ma-math", "session-ma-01", input);
  await tick(() => jobs.getState().jobs["class-ma-math"].status === "ready");
});

test("AI rejects malformed payloads instead of publishing them", async () => {
  post = async () => ({ summary: { title: "Missing quiz" } });
  await assert.rejects(aiAnalyze({ transcript: "Zoom", subject: "Toán", num_questions: 4 }), /không đúng định dạng/);
});

test("AI does not start for completed classes, foreign or incomplete sessions", () => {
  reset(); let calls = 0; post = async () => { calls++; return MOCK_AI_RESPONSE; };
  const input = { transcript: "Zoom", subject: "Toán", num_questions: 4 };
  startClassGeneration(client, "class-group-review", "session-group-review-01", input);
  startClassGeneration(client, "class-group-math", "session-ma-01", input);
  startClassGeneration(client, "class-group-math", "session-group-math-02", input);
  assert.deepEqual(jobs.getState().jobs, {}); assert.equal(calls, 0);
});

test("upload validates allowed extensions, size and empty files", () => {
  assert.equal(validateMaterialFile({ name: "lesson.PDF", size: 512 }), null);
  assert.match(validateMaterialFile({ name: "script.exe", size: 512 }), /Chỉ hỗ trợ/);
  assert.match(validateMaterialFile({ name: "large.pdf", size: 21 * 1024 * 1024 }), /20 MB/);
  assert.match(validateMaterialFile({ name: "empty.docx", size: 0 }), /trống/);
});

test("storage failure keeps edits in memory and surfaces a warning", () => {
  reset(); const set = global.localStorage.setItem;
  global.localStorage.setItem = () => { throw new Error("Quota exceeded"); };
  library.getState().updateMaterial("material-01", { title: "Retained in memory" });
  assert.equal(library.getState().materials.find((item) => item.id === "material-01").title, "Retained in memory");
  assert.ok(notices.some((notice) => notice.key === "warning"));
  global.localStorage.setItem = set;
});

after(() => {
  client.clear(); Module._load = originalLoad;
  if (originalTs) require.extensions[".ts"] = originalTs; else delete require.extensions[".ts"];
  delete global.localStorage;
});

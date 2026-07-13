/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

function loadTs(fileName) {
  const sourcePath = path.join(__dirname, fileName);
  const source = fs.readFileSync(sourcePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const loaded = new Module(sourcePath, module);
  loaded.filename = sourcePath;
  loaded.paths = Module._nodeModulePaths(__dirname);
  loaded._compile(compiled.outputText, sourcePath);
  return { exports: loaded.exports, source };
}

const fixtures = loadTs("tutor-approved.fixtures.ts");
const uiSource = fs.readFileSync(path.join(__dirname, "tutor-approved.ui.tsx"), "utf8");
const previewSource = fs.readFileSync(path.join(__dirname, "tutor-approved.preview.tsx"), "utf8");

test("ready tutor has separate approved listing and LMS permissions", () => {
  const state = fixtures.exports.createTutorApprovedState("ready");
  assert.equal(state.permissions.isProfileApproved, true);
  assert.equal(state.permissions.isProfilePublic, true);
  assert.equal(state.permissions.canReceiveNewConnections, true);
  assert.equal(state.permissions.canAccessTutorLms, true);
});

test("expired listing hides profile and pauses only new connections", () => {
  const state = fixtures.exports.createTutorApprovedState("listing-expired");
  assert.equal(state.listingStatus, "EXPIRED");
  assert.equal(state.permissions.isProfilePublic, false);
  assert.equal(state.permissions.canReceiveNewConnections, false);
  assert.equal(state.permissions.canAccessTutorLms, true);
  assert.ok(state.chats.length > 0);
});

test("no-connections scenario exposes the empty chat state", () => {
  assert.deepEqual(fixtures.exports.createTutorApprovedState("no-connections").chats, []);
});

test("chat UI does not expose Accept or Decline connection actions", () => {
  assert.doesNotMatch(uiSource, /Accept request|Decline request|acceptRequest|declineRequest/);
});

test("MockUI does not import payment or API clients", () => {
  assert.doesNotMatch(uiSource, /apiClient|authService|paymentService|axios\.|fetch\(/);
});

test("capture mode removes preview controls", () => {
  assert.match(previewSource, /toolbar=\{!capture/);
  assert.match(previewSource, /capture=\{capture\}/);
});

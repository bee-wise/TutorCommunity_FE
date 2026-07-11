/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const sourcePath = path.join(__dirname, "auth-redirect.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
});

const redirectModule = new Module(sourcePath, module);
redirectModule.filename = sourcePath;
redirectModule.paths = Module._nodeModulePaths(__dirname);
redirectModule._compile(compiled.outputText, sourcePath);

const { getRoleRedirectPath, getSafeInternalReturnUrl } = redirectModule.exports;

test("blocks external returnUrl values", () => {
  assert.equal(getSafeInternalReturnUrl("https://malicious-site.com"), null);
  assert.equal(getSafeInternalReturnUrl("//malicious-site.com"), null);
});

test("allows internal returnUrl values", () => {
  assert.equal(getSafeInternalReturnUrl("/tutors/123?connect=1"), "/tutors/123?connect=1");
});

test("learner prefers safe returnUrl", () => {
  assert.equal(
    getRoleRedirectPath(
      { role: "LEARNER" },
      { returnUrl: "/tutors/123", preferReturnUrl: true },
    ),
    "/tutors/123",
  );
});

test("tutor without LMS access goes to onboarding route", () => {
  assert.equal(
    getRoleRedirectPath({ role: "TUTOR", canAccessTutorLms: false }),
    "/tutor/onboarding",
  );
});

test("tutor with LMS access goes to tutor LMS", () => {
  assert.equal(
    getRoleRedirectPath({ role: "TUTOR", canAccessTutorLms: true }),
    "/tutor/home",
  );
});

test("approved tutor missing post-approval information completes onboarding", () => {
  assert.equal(
    getRoleRedirectPath({ role: "TUTOR", tutorProfileStatus: "APPROVED", canAccessTutorLms: false }),
    "/tutor/post-approval",
  );
});

test("approved tutor with completed post-approval information goes to Tutor Home", () => {
  assert.equal(
    getRoleRedirectPath({ role: "TUTOR", tutorProfileStatus: "APPROVED", bankInformationCompleted: true, availabilityCompleted: true }),
    "/tutor/home",
  );
});

test("internal staff goes to operations portal", () => {
  assert.equal(getRoleRedirectPath({ role: "ADMIN" }), "/staff");
  assert.equal(getRoleRedirectPath({ role: "CONSULTANT" }), "/staff");
});

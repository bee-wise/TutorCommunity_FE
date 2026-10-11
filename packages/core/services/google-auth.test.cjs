/* eslint-disable @typescript-eslint/no-require-imports -- Node harness loads local TypeScript with a mocked API client. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const originalTs = require.extensions[".ts"];
const originalLoad = Module._load;
const calls = [];
const responses = [];

require.extensions[".ts"] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  module._compile(output, filename);
};
Module._load = function (request, parent, isMain) {
  if (request === "@workspace/core/apiClient" && parent?.filename.endsWith("auth.service.ts")) {
    return { apiClient: { post: async (...args) => {
      calls.push(args);
      return responses.shift();
    } } };
  }
  return originalLoad.call(this, request, parent, isMain);
};
after(() => {
  require.extensions[".ts"] = originalTs;
  Module._load = originalLoad;
});

const { authService } = require(path.resolve(__dirname, "auth.service.ts"));

test("Google challenge sends application, CSRF header and credentials", async () => {
  responses.push({ success: true, data: { nonce: "fresh-nonce", expiresAt: "2030-01-01T00:00:00Z" } });
  assert.equal((await authService.googleChallenge("SALE")).nonce, "fresh-nonce");
  const [url, body, config] = calls.at(-1);
  assert.equal(url, "/auth/google/challenge");
  assert.deepEqual(body, { application: "SALE" });
  assert.equal(config.headers["X-BeeWise-CSRF"], "1");
  assert.equal(config.headers["Content-Type"], "application/json");
  assert.equal(config.withCredentials, true);
});

test("exchange recognizes each backend status without treating it as a login session", async () => {
  for (const status of ["AUTHENTICATED", "REGISTRATION_REQUIRED", "LINK_REQUIRED"]) {
    responses.push({ success: true, data: { status, email: "user@example.com" } });
    const result = await authService.googleExchange("opaque-credential");
    assert.equal(result.status, status);
    const [url, body] = calls.at(-1);
    assert.equal(url, "/auth/google");
    assert.deepEqual(body, { idToken: "opaque-credential" });
  }
});

test("Google registration and linking send only their permitted fields", async () => {
  responses.push({ success: true });
  await authService.googleRegister({ firstName: "An", lastName: "Nguyen", phoneNumber: "0900000000", role: "LEARNER", agreeTerms: true });
  assert.equal(calls.at(-1)[0], "/auth/google/register");
  assert.deepEqual(Object.keys(calls.at(-1)[1]).sort(), ["agreeTerms", "firstName", "lastName", "phoneNumber", "role"]);

  responses.push({ success: true });
  await authService.googleLink({ currentPassword: "password", agreeLink: true });
  assert.equal(calls.at(-1)[0], "/auth/google/link");
  assert.deepEqual(Object.keys(calls.at(-1)[1]).sort(), ["agreeLink", "currentPassword"]);
});

test("an unsuccessful exchange envelope does not advance the flow", async () => {
  responses.push({ success: false, error: { code: "GOOGLE_REGISTER_ON_SALE", message: "Đăng ký trên Sale" } });
  await assert.rejects(authService.googleExchange("opaque-credential"), (error) => {
    assert.equal(error.code, "GOOGLE_REGISTER_ON_SALE");
    return true;
  });
});

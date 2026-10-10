/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness loads local TypeScript. */
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { NextRequest } = require("next/server");

const originalTs = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  module._compile(compiled.outputText, filename);
};
after(() => {
  require.extensions[".ts"] = originalTs;
});

const { getLmsRoleFromToken, getLmsRoleRedirectPath } = require("../utils/lms-role.ts");
const { proxy } = require(path.resolve(__dirname, "../../../proxy.ts"));
const tokenFor = (role) => `header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`;
const requestFor = (pathname, role) => new NextRequest(`http://localhost:3001${pathname}`, {
  headers: { cookie: `beewise_access_token=${tokenFor(role)}` },
});

test("JWT role decoding accepts base64url and ignores malformed payloads", () => {
  assert.equal(getLmsRoleFromToken(tokenFor("tutor")), "TUTOR");
  assert.equal(getLmsRoleFromToken(tokenFor("LEARNER")), "LEARNER");
  assert.equal(getLmsRoleFromToken("invalid"), null);
});

test("role route mapping keeps valid workspace and redirects mismatched workspace", () => {
  assert.equal(getLmsRoleRedirectPath("/lms/tutor/dashboard", "TUTOR"), null);
  assert.equal(getLmsRoleRedirectPath("/lms/learner/classes/123", "LEARNER"), null);
  assert.equal(getLmsRoleRedirectPath("/lms/tutor/dashboard", "LEARNER"), "/lms/learner");
  assert.equal(getLmsRoleRedirectPath("/lms/learner/classes/123", "TUTOR"), "/lms/tutor/dashboard");
  assert.equal(getLmsRoleRedirectPath("/lms", "LEARNER"), "/lms/learner");
  assert.equal(getLmsRoleRedirectPath("/lms", null), "/login");
});

test("proxy redirects learner cookie away from tutor content after account switch", () => {
  const response = proxy(requestFor("/lms/tutor/dashboard", "LEARNER"));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "http://localhost:3001/lms/learner");
});

test("proxy allows tutor route for tutor cookie and redirects tutor away from learner route", () => {
  assert.equal(proxy(requestFor("/lms/tutor/dashboard", "TUTOR")).status, 200);
  assert.equal(
    proxy(requestFor("/lms/learner/classes", "TUTOR")).headers.get("location"),
    "http://localhost:3001/lms/tutor/dashboard",
  );
});

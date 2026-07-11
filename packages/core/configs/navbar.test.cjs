/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const navbarPath = path.join(__dirname, "navbar.ts");
const source = fs.readFileSync(navbarPath, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
});

const navbarModule = new Module(navbarPath, module);
navbarModule.filename = navbarPath;
navbarModule.paths = Module._nodeModulePaths(__dirname);
navbarModule._compile(compiled.outputText, navbarPath);

const { getNavbarConfig, resolveNavbarState } = navbarModule.exports;

test("resolves guest navbar state", () => {
  assert.equal(resolveNavbarState({ isAuthenticated: false }), "GUEST");
});

test("resolves learner navbar state", () => {
  assert.equal(
    resolveNavbarState({ isAuthenticated: true, role: "LEARNER" }),
    "LEARNER",
  );
});

test("learner sees LMS CTA only when lmsAccessEnabled is true", () => {
  const withoutLms = getNavbarConfig({
    state: "LEARNER",
    lmsAccessEnabled: false,
  });
  const withLms = getNavbarConfig({
    state: "LEARNER",
    lmsAccessEnabled: true,
  });

  assert.equal(withoutLms.rightItems.some((item) => item.label === "Vào LMS"), false);
  assert.equal(withLms.rightItems.some((item) => item.label === "Vào LMS"), true);
});

test("resolves tutor draft and pending verification as onboarding", () => {
  assert.equal(
    resolveNavbarState({
      isAuthenticated: true,
      role: "TUTOR",
      tutorOnboardingStatus: "PROFILE_DRAFT",
    }),
    "TUTOR_ONBOARDING",
  );
  assert.equal(
    resolveNavbarState({
      isAuthenticated: true,
      role: "TUTOR",
      tutorOnboardingStatus: "PENDING_VERIFICATION",
    }),
    "TUTOR_ONBOARDING",
  );
});

test("rejected tutor receives rejection menu item", () => {
  const config = getNavbarConfig({
    state: "TUTOR_ONBOARDING",
    tutorOnboardingStatus: "REJECTED",
  });

  assert.equal(
    config.centerItems.some((item) => item.label === "Xem lý do từ chối"),
    true,
  );
});

test("approved tutor does not see LMS CTA without LMS access", () => {
  const config = getNavbarConfig({
    state: "TUTOR_APPROVED",
    tutorOnboardingStatus: "APPROVED",
    lmsAccessEnabled: false,
  });

  assert.equal(config.rightItems.some((item) => item.label === "Vào LMS"), false);
});

test("completed tutor sees LMS CTA when LMS access is enabled", () => {
  assert.equal(
    resolveNavbarState({
      isAuthenticated: true,
      role: "TUTOR",
      tutorOnboardingStatus: "COMPLETED",
    }),
    "TUTOR_APPROVED",
  );

  const config = getNavbarConfig({
    state: "TUTOR_APPROVED",
    tutorOnboardingStatus: "COMPLETED",
    lmsAccessEnabled: true,
  });

  assert.equal(config.rightItems.some((item) => item.label === "Vào LMS"), true);
});

test("admin and consultant resolve to internal staff", () => {
  assert.equal(
    resolveNavbarState({ isAuthenticated: true, role: "ADMIN" }),
    "INTERNAL_STAFF",
  );
  assert.equal(
    resolveNavbarState({ isAuthenticated: true, role: "CONSULTANT" }),
    "INTERNAL_STAFF",
  );
});

test("guest config uses standardized labels", () => {
  const config = getNavbarConfig({ state: "GUEST" });
  const labels = [
    ...config.centerItems.map((item) => item.label),
    ...config.rightItems.map((item) => item.label),
  ];

  assert.deepEqual(labels, [
    "Gia sư",
    "Cách hoạt động",
    "Trở thành gia sư",
    "Đăng nhập",
    "Tìm gia sư",
  ]);
});

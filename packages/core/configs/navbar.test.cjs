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
navbarModule.require = (request) =>
  request === "../constants/tutor-links"
    ? { TUTOR_LMS_URL: "https://superlms.beewise.vn" }
    : require(request);
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

test("onboarding tutor navbar is restricted to the onboarding journey", () => {
  const config = getNavbarConfig({
    state: "TUTOR_ONBOARDING",
    tutorOnboardingStatus: "REJECTED",
  });

  assert.deepEqual(config.centerItems, [
    { label: "Quy trình đăng ký", href: "/tutor/onboarding" },
  ]);
  assert.equal(config.homeHref, "/tutor/onboarding");
  assert.equal(config.showNotifications, false);
  assert.deepEqual(config.accountItems, [
    { label: "Đăng xuất", href: "/", action: "logout" },
  ]);
});

test("password change is absent from navigation and account menus", () => {
  for (const state of ["GUEST", "LEARNER", "TUTOR_ONBOARDING", "TUTOR_APPROVED"]) {
    const config = getNavbarConfig({ state });
    const items = [...config.centerItems, ...config.rightItems, ...config.accountItems];
    assert.equal(items.some((item) => item.href === "/change-password"), false);
  }
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
      lmsAccessEnabled: true,
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

test("approved tutor stays in onboarding until AI interview is completed", () => {
  assert.equal(
    resolveNavbarState({
      isAuthenticated: true,
      role: "TUTOR",
      tutorOnboardingStatus: "APPROVED",
      tutorProfileStatus: "APPROVED",
      isInterviewed: false,
      lmsAccessEnabled: false,
    }),
    "TUTOR_ONBOARDING",
  );
});

test("interviewed tutor uses post-approval navbar when LMS access is disabled", () => {
  assert.equal(
    resolveNavbarState({
      isAuthenticated: true,
      role: "TUTOR",
      tutorOnboardingStatus: "APPROVED",
      tutorProfileStatus: "APPROVED",
      isInterviewed: true,
      lmsAccessEnabled: false,
    }),
    "TUTOR_APPROVED",
  );
});

test("stale onboarding status cannot bypass profile approval", () => {
  assert.equal(
    resolveNavbarState({
      isAuthenticated: true,
      role: "TUTOR",
      tutorOnboardingStatus: "APPROVED",
      tutorProfileStatus: "PENDING_REVIEW",
      isInterviewed: true,
    }),
    "TUTOR_ONBOARDING",
  );
  assert.equal(
    resolveNavbarState({
      isAuthenticated: true,
      role: "TUTOR",
      tutorOnboardingStatus: "PROFILE_SUBMITTED",
      tutorProfileStatus: "APPROVED",
      isInterviewed: true,
    }),
    "TUTOR_APPROVED",
  );
});

test("private tutor header hides availability and payment while keeping onboarding details", () => {
  for (const lmsAccessEnabled of [false, true]) {
    const config = getNavbarConfig({
      state: "TUTOR_APPROVED",
      tutorOnboardingStatus: lmsAccessEnabled ? "COMPLETED" : "APPROVED",
      lmsAccessEnabled,
      isPublic: false,
    });
    const labels = config.centerItems.map((item) => item.label);
    assert.equal(labels.includes("Lịch rảnh"), false);
    assert.equal(labels.includes("Thông tin thanh toán"), false);
    if (!lmsAccessEnabled) assert.equal(labels.includes("Bổ sung thông tin"), true);
  }
});

test("public tutor header shows availability and payment during onboarding", () => {
  const config = getNavbarConfig({
    state: "TUTOR_APPROVED",
    tutorOnboardingStatus: "APPROVED",
    lmsAccessEnabled: false,
    isPublic: true,
  });
  const labels = config.centerItems.map((item) => item.label);
  assert.equal(labels.includes("Lịch rảnh"), true);
  assert.equal(labels.includes("Thông tin thanh toán"), true);
});

test("staff roles resolve to guest navbar state", () => {
  assert.equal(
    resolveNavbarState({ isAuthenticated: true, role: "ADMIN" }),
    "GUEST",
  );
  assert.equal(
    resolveNavbarState({ isAuthenticated: true, role: "CONSULTANT" }),
    "GUEST",
  );
  assert.equal(
    resolveNavbarState({ isAuthenticated: true, role: "STAFF" }),
    "GUEST",
  );
});

test("guest config uses standardized labels", () => {
  const config = getNavbarConfig({ state: "GUEST" });
  const labels = [
    ...config.centerItems.map((item) => item.label),
    ...config.rightItems.map((item) => item.label),
  ];

  assert.deepEqual(labels, [
    "Gia sư 1:1",
    "Tìm lớp",
    "Trở thành gia sư",
    "Về chúng tôi",
    "Đăng nhập",
    "Tìm gia sư",
  ]);
});

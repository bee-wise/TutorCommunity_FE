/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

function loadTsModule(relativePath) {
  const sourcePath = path.join(__dirname, relativePath);
  const source = fs.readFileSync(sourcePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  const mod = new Module(sourcePath, module);
  mod.filename = sourcePath;
  mod.paths = Module._nodeModulePaths(__dirname);
  mod._compile(compiled.outputText, sourcePath);
  return mod.exports;
}

const {
  parseTutorOnboardingScenario,
  resolveTutorOnboardingView,
} = loadTsModule("tutor-onboarding.resolver.ts");
const { applyTutorOnboardingAction } = loadTsModule("tutor-onboarding.actions.ts");

const baseState = {
  scenario: "journey",
  selectedStepId: "profile",
  profile: {
    headline: "Gia sư Toán",
    subjects: ["Toán"],
    education: "Đại học Sư phạm",
    experience: "2 năm",
    teachingMethod: "Cá nhân hóa",
    documents: ["Thẻ sinh viên"],
  },
  availabilitySlots: [],
  bankInfo: {
    bankName: "Ngân hàng ABC",
    accountNumber: "0123456789",
    accountHolder: "NGUYEN MINH ANH",
  },
};

test("journey keeps LMS blocked and shows seven step statuses", () => {
  const view = resolveTutorOnboardingView(baseState);
  assert.equal(Object.keys(view.stepStatuses).length, 7);
  assert.equal(view.canAccessTutorLms, false);
  assert.equal(view.stepStatuses.lms, "BLOCKED");
});

test("completed is the only scenario that enables Tutor LMS", () => {
  const approved = resolveTutorOnboardingView({
    ...baseState,
    scenario: "approved",
  });
  const completed = resolveTutorOnboardingView({
    ...baseState,
    scenario: "completed",
  });

  assert.equal(approved.canAccessTutorLms, false);
  assert.equal(approved.navbarVariant, "TUTOR_ONBOARDING");
  assert.equal(completed.canAccessTutorLms, true);
  assert.equal(completed.navbarVariant, "TUTOR_APPROVED");
});

test("unknown scenario is safe and does not enable LMS", () => {
  assert.equal(parseTutorOnboardingScenario("nope"), "unknown");
  const view = resolveTutorOnboardingView({
    ...baseState,
    scenario: "unknown",
  });

  assert.equal(view.currentScreen, "UNKNOWN");
  assert.equal(view.canAccessTutorLms, false);
});

test("rejected edit action returns to profile draft", () => {
  const nextState = applyTutorOnboardingAction(
    { ...baseState, scenario: "rejected", selectedStepId: "verification" },
    "edit-rejected-profile",
  );

  assert.equal(nextState.scenario, "profile-draft");
  assert.equal(nextState.selectedStepId, "profile");
});

test("preview source does not call backend APIs", () => {
  const files = [
    "tutor-onboarding.preview.tsx",
    "tutor-onboarding.provider.tsx",
    "tutor-onboarding.actions.ts",
    "tutor-onboarding.fixtures.ts",
    "components/TutorOnboardingLayout.tsx",
    "components/TutorOnboardingScreens.tsx",
  ];
  const forbidden = [
    "fetch(",
    "axios",
    "apiClient",
    "authService",
    "/auth/me",
    "/auth/login",
    "/auth/refresh",
    "/auth/logout",
  ];

  for (const file of files) {
    const source = fs.readFileSync(path.join(__dirname, file), "utf8");
    for (const token of forbidden) {
      assert.equal(
        source.includes(token),
        false,
        `${file} should not include ${token}`,
      );
    }
  }
});

/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const read = (file) => fs.readFileSync(path.join(__dirname, file), "utf8");
const card = read("components/TutorCard.tsx");
const controller = read("components/TutorListController.tsx");
const results = read("components/TutorListResults.tsx");

test("Tutor Card keeps the public profile route contract", () => {
  assert.match(card, /tutorProfileHref\s*=\s*`\/tutors\/\$\{tutor\.profileId\}/);
});

test("Tutor Card does not render private tutor information", () => {
  assert.doesNotMatch(card, /bankAccount|identityDocument|phoneNumber|email|studentCardUrl/);
});

test("Tutor Card uses a large image and an inline best-match badge", () => {
  assert.match(card, /sm:h-24 sm:w-24/);
  assert.match(card, /Phù hợp nhất/);
  assert.doesNotMatch(card, /ribbon/i);
});

test("Tutor Card formats contextName and teachingItemName and provides extra offerings tooltip", () => {
  assert.match(card, /formatOfferingCombination/);
  assert.match(card, /TooltipProvider/);
  assert.match(card, /TooltipContent/);
  assert.match(card, /Tất cả môn giảng dạy/);
});

test("Tutor Search UI keeps search local and exposes loading and empty states", () => {
  assert.doesNotMatch(controller, /axios|apiClient|fetch\(/);
  assert.match(results, /TutorCardSkeleton/);
  assert.match(results, /Không tìm thấy gia sư/);
  assert.match(results, /Xóa bộ lọc/);
});

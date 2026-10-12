import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatReviewFieldNumber,
  formatReviewFieldText,
  formatReviewPreview,
} from "./review-value-format.ts";

test("translates profile enums without changing unrelated text", () => {
  assert.equal(formatReviewFieldText("gender", "female"), "Nữ");
  assert.equal(formatReviewFieldText("studentYear", "YEAR_4"), "Sinh viên năm 4");
  assert.equal(formatReviewFieldText("teachingModes", "OFFLINE"), "Trực tiếp");
  assert.equal(formatReviewFieldText("type", "CERTIFICATE"), "Chứng chỉ");
  assert.equal(formatReviewFieldText("headline", "ONLINE"), "ONLINE");
});

test("formats date-only fields in Vietnam order without timezone shifts", () => {
  assert.equal(formatReviewFieldText("dateOfBirth", "2000-01-02"), "02/01/2000");
  assert.equal(formatReviewFieldText("startDate", "2024-12-31T00:00:00Z"), "31/12/2024");
  assert.equal(formatReviewFieldText("dateOfBirth", "2024-02-31"), "2024-02-31");
});

test("formats money and queue previews", () => {
  assert.match(formatReviewFieldNumber("basePrice", 150000), /150\.000/);
  assert.equal(formatReviewPreview("gender", '"male"'), "Nam");
  assert.equal(formatReviewPreview("teachingModes", '["ONLINE","OFFLINE"]'), "Trực tuyến, Trực tiếp");
  assert.equal(formatReviewPreview("achievements", '[{"type":"AWARD"}]'), "1 mục được cập nhật");
});

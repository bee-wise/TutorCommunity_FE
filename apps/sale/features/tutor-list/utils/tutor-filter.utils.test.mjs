import assert from "node:assert/strict";
import test from "node:test";
import { countActiveFilters, mapFiltersToManualQuery } from "./tutor-filter.utils.ts";

const filters = {
  programId: "program-id",
  programVersionId: "version-id",
  contextId: "context-id",
  teachingItemId: "teaching-item-id",
  hasContext: null,
  city: "Hà Nội",
  teachingMode: "online",
  level: "all",
  maxPricePerSession: 250000,
  minRating: null,
  availableOnly: false,
  sortBy: "rating",
};

test("manual tutor search uses offering identifiers instead of legacy catalog fields", () => {
  const query = mapFiltersToManualQuery("Toán", filters, 2);
  assert.deepEqual(
    {
      programId: query.programId,
      programVersionId: query.programVersionId,
      contextId: query.contextId,
      teachingItemId: query.teachingItemId,
    },
    {
      programId: "program-id",
      programVersionId: "version-id",
      contextId: "context-id",
      teachingItemId: "teaching-item-id",
    },
  );
  assert.equal(query.keyword, "Toán");
  assert.equal(query.page, 2);
  assert.equal(query.subjectId, undefined);
  assert.equal(query.gradeLevelId, undefined);
  assert.equal(countActiveFilters(filters, true), 6);
});

test("an offering without context sends hasContext=false", () => {
  const query = mapFiltersToManualQuery("", {
    ...filters,
    contextId: null,
    teachingItemId: null,
    hasContext: false,
  }, 1);
  assert.equal(query.hasContext, false);
  assert.equal(query.contextId, undefined);
});

test("orphaned context and item selections are not sent without a program", () => {
  const query = mapFiltersToManualQuery("", {
    ...filters,
    programId: null,
    programVersionId: null,
  }, 1);
  assert.equal(query.contextId, undefined);
  assert.equal(query.teachingItemId, undefined);
  assert.equal(query.programVersionId, undefined);
});

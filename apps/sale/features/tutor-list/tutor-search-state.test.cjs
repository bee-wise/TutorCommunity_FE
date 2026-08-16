/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const hook = fs.readFileSync(
  path.join(__dirname, "hooks/useTutorSearch.ts"),
  "utf8",
);

test("clearing filters preserves AI and manual search queries", () => {
  const clearFiltersHandler = hook.match(
    /const handleClearFilters = \(\) => \{([\s\S]*?)\n  \};/,
  );

  assert.ok(clearFiltersHandler, "handleClearFilters must exist");
  assert.match(clearFiltersHandler[1], /setFiltersByMode/);
  assert.match(clearFiltersHandler[1], /\[searchMode\]: DEFAULT_FILTERS/);
  assert.doesNotMatch(clearFiltersHandler[1], /setQueries|cachedQueries/);
});

test("AI results are filtered from the cached server response", () => {
  assert.match(
    hook,
    /applyLocalFiltersToAIResults\(aiTutors \|\| \[\], filtersByMode\.ai\)/,
  );
});

test("manual and AI modes keep independent filter state", () => {
  assert.match(hook, /cachedFiltersByMode: Record<SearchMode, TutorFilters>/);
  assert.match(hook, /const filters = filtersByMode\[searchMode\]/);
  assert.match(
    hook,
    /mapFiltersToManualQuery\(queries\.manual, filtersByMode\.manual, page\)/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import { learningCatalogIdSchema } from "./learning-catalog-id.schema.ts";

test("catalog IDs accept seeded GUIDs with nonstandard version bits", () => {
  assert.equal(
    learningCatalogIdSchema.safeParse("3acafcbb-9105-fe3d-6413-db923a062c04").success,
    true,
  );
  assert.equal(
    learningCatalogIdSchema.safeParse("631a20ee-60b5-ee99-b46a-bfd100cf2a21").success,
    true,
  );
});

test("catalog IDs still reject malformed paths", () => {
  assert.equal(learningCatalogIdSchema.safeParse("not-an-id").success, false);
});

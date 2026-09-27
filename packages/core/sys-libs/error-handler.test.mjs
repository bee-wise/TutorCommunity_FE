import assert from "node:assert/strict";
import { test } from "node:test";
import { AxiosError } from "axios";
import { ApiError, handleApiError } from "./error-handler.ts";

test("preserves a normalized API error and its backend code", () => {
  const error = new ApiError(
    "LMS access has not been activated for this account.",
    403,
    "LMS_ACCESS_NOT_ACTIVATED",
  );

  assert.equal(handleApiError(error), error);
  assert.equal(handleApiError(error).code, "LMS_ACCESS_NOT_ACTIVATED");
});

test("reads the activation code from the backend error envelope", () => {
  const error = new AxiosError("Request failed", "ERR_BAD_RESPONSE", undefined, undefined, {
    status: 403,
    data: {
      success: false,
      error: {
        code: "LMS_ACCESS_NOT_ACTIVATED",
        message: "LMS access has not been activated for this account.",
      },
    },
  });

  const result = handleApiError(error);
  assert.equal(result.statusCode, 403);
  assert.equal(result.code, "LMS_ACCESS_NOT_ACTIVATED");
});

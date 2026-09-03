import type {
  TutorProfileEditorValues,
  TutorProfileMutationResult,
} from "../schemas/profile-editor.schema";
import type { ProfileMediaState } from "../types/profile-editor.types";

const MOCK_LATENCY_MS = 650;

function waitForMockRequest(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_LATENCY_MS);
  });
}

export const tutorProfileEditorService = {
  async submitForReview(
    profile: TutorProfileEditorValues,
    media: ProfileMediaState,
  ): Promise<TutorProfileMutationResult> {
    void profile;
    void media;
    await waitForMockRequest();
    return { status: "PENDING_REVIEW", updatedAt: new Date().toISOString() };
  },
};

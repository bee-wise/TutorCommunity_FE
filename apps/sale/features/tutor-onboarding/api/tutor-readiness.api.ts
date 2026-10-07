import { apiClient } from "@workspace/core/configs/client";
import { getTutorReadiness } from "@workspace/core/services/tutor-readiness.service";

export type { TutorReadiness } from "@workspace/core/services/tutor-readiness.service";

export type ReadinessAvailability = {
  day: string;
  from: string;
  to: string;
};

export type ReadinessBank = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export type ReadinessDetails = {
  availability?: ReadinessAvailability[];
  bank?: ReadinessBank;
};

export const tutorReadinessApi = {
  get: getTutorReadiness,

  async create(details: Required<ReadinessDetails>): Promise<void> {
    await apiClient.post("/tutors/profile/readiness/details", details);
  },

  async update(details: ReadinessDetails): Promise<void> {
    await apiClient.patch("/tutors/profile/readiness/details", details);
  },
};

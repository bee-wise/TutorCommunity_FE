import { z } from "zod";
import { admissionSchema } from "@workspace/core/lms-classes/group.schemas";
import { guid, versionCommand } from "@workspace/core/lms-classes/schemas";
import {
  getLmsResource,
  postLmsCommand,
  putLmsCommand,
} from "@workspace/core/lms-classes/api-response";

export const learnerAdmissionSchema = admissionSchema.extend({
  trialRequested: z.boolean(),
});
export type LearnerAdmission = z.infer<typeof learnerAdmissionSchema>;
const preferenceSchema = versionCommand.extend({ trialRequested: z.boolean() });
export const learnerAdmissionsService = {
  get: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `/lms/group-admissions/${guid.parse(id)}`,
      learnerAdmissionSchema,
      signal,
    ),
  preference: (id: string, input: z.infer<typeof preferenceSchema>) =>
    putLmsCommand(
      `/lms/group-admissions/${guid.parse(id)}/trial-preference`,
      learnerAdmissionSchema,
      preferenceSchema.parse(input),
    ),
  action: (
    id: string,
    action:
      | "trial/confirm"
      | "acknowledge-missed"
      | "first-month-fee/accept"
      | "cancel",
    version: number,
  ) =>
    postLmsCommand(
      `/lms/group-admissions/${guid.parse(id)}/${action}`,
      learnerAdmissionSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
};

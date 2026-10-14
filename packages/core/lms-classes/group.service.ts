import { z } from "zod";
import {
  getLmsResource,
  postLmsCommand,
  putLmsCommand,
  nullableList,
} from "./api-response";
import { guid, versionCommand } from "./schemas";
import {
  groupSchema,
  createGroupSchema,
  updateGroupSchema,
  roadmapCommandSchema,
  reviewGroupSchema,
  groupHistorySchema,
  lifecycleSchema,
  admissionSchema,
  referSchema,
  joinSchema,
  trialSchema,
  feeCommandSchema,
  reviewFeeSchema,
  paymentSchema,
  paymentCommandSchema,
} from "./group.schemas";

const groupPath = (id: string) => `/lms/group-classes/${guid.parse(id)}`;
const admissionPath = (id: string) => `/lms/group-admissions/${guid.parse(id)}`;
export const groupClassesService = {
  get: (id: string, signal?: AbortSignal) =>
    getLmsResource(groupPath(id), groupSchema, signal),
  create: (input: z.infer<typeof createGroupSchema>) =>
    postLmsCommand(
      "/lms/group-classes",
      groupSchema,
      createGroupSchema.parse(input),
    ),
  update: (id: string, input: z.infer<typeof updateGroupSchema>) =>
    putLmsCommand(groupPath(id), groupSchema, updateGroupSchema.parse(input)),
  roadmap: (id: string, input: z.infer<typeof roadmapCommandSchema>) =>
    putLmsCommand(
      `${groupPath(id)}/roadmap`,
      groupSchema,
      roadmapCommandSchema.parse(input),
    ),
  submit: (id: string, version: number) =>
    postLmsCommand(
      `${groupPath(id)}/submit`,
      groupSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  publish: (id: string, version: number) =>
    postLmsCommand(
      `${groupPath(id)}/publish`,
      groupSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  review: (id: string, input: z.infer<typeof reviewGroupSchema>) =>
    postLmsCommand(
      `${groupPath(id)}/review`,
      groupSchema,
      reviewGroupSchema.parse(input),
    ),
  pending: (page: number, signal?: AbortSignal) =>
    getLmsResource(
      "/lms/group-classes/pending",
      nullableList(groupSchema),
      signal,
      { page, pageSize: 20 },
    ),
  recruitment: (page: number, signal?: AbortSignal) =>
    getLmsResource(
      "/lms/group-classes/recruitment",
      nullableList(groupSchema),
      signal,
      { page, pageSize: 20 },
    ),
  history: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `${groupPath(id)}/approval-history`,
      nullableList(groupHistorySchema),
      signal,
    ),
  activate: (id: string, version: number) =>
    postLmsCommand(
      `${groupPath(id)}/activate`,
      lifecycleSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  complete: (id: string, version: number) =>
    postLmsCommand(
      `${groupPath(id)}/complete`,
      lifecycleSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  admissions: (id: string, page = 1, signal?: AbortSignal) =>
    getLmsResource(
      `${groupPath(id)}/admissions`,
      nullableList(admissionSchema),
      signal,
      { page, pageSize: 20 },
    ),
  refer: (id: string, input: z.infer<typeof referSchema>) =>
    postLmsCommand(
      `${groupPath(id)}/admissions/referrals`,
      admissionSchema,
      referSchema.parse(input),
    ),
  join: (id: string, input: z.infer<typeof joinSchema>) =>
    postLmsCommand(
      `${groupPath(id)}/admissions`,
      admissionSchema,
      joinSchema.parse(input),
    ),
};
export const groupAdmissionsService = {
  get: (id: string, signal?: AbortSignal) =>
    getLmsResource(admissionPath(id), admissionSchema, signal),
  proposeTrial: (id: string, input: z.infer<typeof trialSchema>) =>
    postLmsCommand(
      `${admissionPath(id)}/trial/propose`,
      admissionSchema,
      trialSchema.parse(input),
    ),
  confirmTrial: (id: string, version: number) =>
    postLmsCommand(
      `${admissionPath(id)}/trial/confirm`,
      admissionSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  completeTrial: (id: string, version: number) =>
    postLmsCommand(
      `${admissionPath(id)}/trial/complete`,
      admissionSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  acknowledgeMissed: (id: string, version: number) =>
    postLmsCommand(
      `${admissionPath(id)}/acknowledge-missed`,
      admissionSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  cancel: (id: string, version: number) =>
    postLmsCommand(
      `${admissionPath(id)}/cancel`,
      admissionSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  proposeFee: (id: string, input: z.infer<typeof feeCommandSchema>) =>
    putLmsCommand(
      `${admissionPath(id)}/first-month-fee`,
      admissionSchema,
      feeCommandSchema.parse(input),
    ),
  acceptFee: (id: string, version: number) =>
    postLmsCommand(
      `${admissionPath(id)}/first-month-fee/accept`,
      admissionSchema,
      versionCommand.parse({ expectedVersion: version }),
    ),
  reviewFee: (id: string, input: z.infer<typeof reviewFeeSchema>) =>
    postLmsCommand(
      `${admissionPath(id)}/first-month-fee/review`,
      admissionSchema,
      reviewFeeSchema.parse(input),
    ),
  payment: (id: string, input: z.infer<typeof paymentCommandSchema>) =>
    postLmsCommand(
      `${admissionPath(id)}/payments`,
      paymentSchema,
      paymentCommandSchema.parse(input),
    ),
  getPayment: (id: string, signal?: AbortSignal) =>
    getLmsResource(
      `/lms/group-payments/${guid.parse(id)}`,
      paymentSchema,
      signal,
    ),
  refreshPayment: (id: string) =>
    postLmsCommand(
      `/lms/group-payments/${guid.parse(id)}/refresh`,
      paymentSchema,
    ),
};

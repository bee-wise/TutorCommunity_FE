import { z } from "zod";
import { apiClient } from "../../apiClient";
import {
  answerMetadataSchema,
  consentRequestSchema,
  consentSchema,
  eligibilitySchema,
  interviewStateSchema,
  micCheckSchema,
  policySchema,
  startRequestSchema,
  statusSchema,
  type AnswerRequest,
  type ConsentRequest,
  type StartRequest,
} from "../schemas/tutor.schema";
import {
  attemptGrantRequestSchema,
  auditLogSchema,
  decisionRequestSchema,
  integrityEventBatchSchema,
  integrityEventPageSchema,
  interviewListItemSchema,
  overrideRequestSchema,
  packageSchema,
  summarySchema,
  type AttemptGrantRequest,
  type DecisionRequest,
  type IntegrityEvent,
  type OverrideRequest,
} from "../schemas/review.schema";
import {
  policyCreatedSchema,
  policyItemSchema,
  policyRequestSchema,
  rubricDetailSchema,
  rubricSummarySchema,
  type PolicyRequest,
} from "../schemas/admin.schema";
import type { InterviewListParams } from "../queryKeys";

const root = "/ai/interview";
const pathId = (id: string) => encodeURIComponent(id);
const multipartConfig = {
  timeout: 120000,
  headers: { "Content-Type": undefined },
};
async function get<T extends z.ZodType>(
  path: string,
  schema: T,
  params?: object,
  signal?: AbortSignal,
): Promise<z.infer<T>> {
  const response: unknown = await apiClient.get(`${root}${path}`, {
    params,
    signal,
  });
  return schema.parse(response);
}
async function post<T extends z.ZodType>(
  path: string,
  body: unknown,
  schema: T,
): Promise<z.infer<T>> {
  const response: unknown = await apiClient.post(
    `${root}${path}`,
    body,
    body instanceof FormData ? multipartConfig : undefined,
  );
  return schema.parse(response);
}
export function validateInterviewAudio(audio: Blob): void {
  if (audio.size < 1024)
    throw new Error("Không thu được âm thanh. Hãy kiểm tra micro và ghi lại.");
  if (audio.size > 25 * 1024 * 1024) throw new Error("Bản ghi âm vượt 25 MB.");
  if (!/^audio\/(webm|mp4)(;|$)/.test(audio.type))
    throw new Error("Trình duyệt cần hỗ trợ audio/webm hoặc audio/mp4.");
}
export const interviewApi = {
  getPolicy: () => get("/policy", policySchema),
  getEligibility: () => get("/me/eligibility", eligibilitySchema),
  getState: (id: string) =>
    get(`/interviews/${pathId(id)}`, interviewStateSchema),
  createConsent: (values: ConsentRequest) =>
    post("/consents", consentRequestSchema.parse(values), consentSchema),
  startInterview: (values: StartRequest) =>
    post("/interviews", startRequestSchema.parse(values), interviewStateSchema),
  resumeInterview: (id: string) =>
    post(`/interviews/${pathId(id)}/resume`, {}, interviewStateSchema),
  heartbeat: (id: string) =>
    post(`/interviews/${pathId(id)}/heartbeat`, {}, statusSchema),
  abandonInterview: (id: string) =>
    post(`/interviews/${pathId(id)}/abandon`, {}, statusSchema),
  submitInterview: (id: string) =>
    post(`/interviews/${pathId(id)}/submit`, {}, statusSchema),
  checkMicrophone: (audio: Blob) => {
    validateInterviewAudio(audio);
    const data = new FormData();
    data.append(
      "audio",
      audio,
      audio.type.startsWith("audio/mp4") ? "mic.mp4" : "mic.webm",
    );
    return post("/mic-check", data, micCheckSchema);
  },
  answerInterview: (id: string, values: AnswerRequest) => {
    validateInterviewAudio(values.audio);
    const metadata = answerMetadataSchema.parse(values);
    const data = new FormData();
    data.append("q_code", metadata.q_code);
    data.append("kind", metadata.kind);
    data.append("duration_ms", String(metadata.duration_ms));
    data.append(
      "audio",
      values.audio,
      values.audio.type.startsWith("audio/mp4") ? "answer.mp4" : "answer.webm",
    );
    return post(`/interviews/${pathId(id)}/answer`, data, interviewStateSchema);
  },
  getList: (params: InterviewListParams, signal?: AbortSignal) =>
    get("/interviews", z.array(interviewListItemSchema), params, signal),
  getPackage: (id: string) =>
    get(`/interviews/${pathId(id)}/package`, packageSchema),
  sendIntegrityEvents: (id: string, events: IntegrityEvent[]) =>
    post(
      `/interviews/${pathId(id)}/integrity-events`,
      integrityEventBatchSchema.parse({ events }),
      z.unknown(),
    ),
  getIntegrityEvents: (
    id: string,
    params?: { page?: number; pageSize?: number },
    signal?: AbortSignal,
  ) =>
    get(
      `/interviews/${pathId(id)}/integrity-events`,
      integrityEventPageSchema,
      params,
      signal,
    ),
  overrideCriterion: (id: string, values: OverrideRequest) =>
    post(
      `/interviews/${pathId(id)}/override`,
      overrideRequestSchema.parse(values),
      z.object({
        criterion_code: z.string(),
        override_level: z.number(),
        overall_score: z.number().nullable(),
        summary: summarySchema,
      }),
    ),
  decideInterview: (id: string, values: DecisionRequest) =>
    post(
      `/interviews/${pathId(id)}/decision`,
      decisionRequestSchema.parse(values),
      z.object({ decision_id: z.number(), status: z.string() }),
    ),
  grantAttempt: (tutorId: string, values: AttemptGrantRequest) =>
    post(
      `/tutors/${pathId(tutorId)}/attempt-grants`,
      attemptGrantRequestSchema.parse(values),
      z.object({ grant_id: z.number(), attempts_allowed: z.number() }),
    ),
  getAudit: (entity: string, entityId: string) =>
    get("/audit-logs", z.array(auditLogSchema), {
      entity,
      entity_id: entityId,
      limit: 100,
    }),
  rescoreInterview: (id: string) =>
    post(`/interviews/${pathId(id)}/rescore`, {}, statusSchema),
  async deleteTutorData(tutorId: string) {
    const response: unknown = await apiClient.delete(
      `${root}/tutors/${pathId(tutorId)}/interview-data`,
    );
    return z
      .object({ tutor_id: z.string(), interviews_deleted: z.number() })
      .parse(response);
  },
  getPolicies: () => get("/policies", z.array(policyItemSchema)),
  createPolicy: (values: PolicyRequest) =>
    post("/policies", policyRequestSchema.parse(values), policyCreatedSchema),
  activatePolicy: (version: string) =>
    apiClient.post(`${root}/policies/${pathId(version)}/activate`, {}),
  getRubrics: () => get("/rubrics", z.array(rubricSummarySchema)),
  getRubric: (version: string) =>
    get(`/rubrics/${pathId(version)}`, rubricDetailSchema),
  uploadRubric: (file: File, note: string) => {
    if (
      !file.name.toLowerCase().endsWith(".toml") ||
      !file.size ||
      file.size > 1024 * 1024
    )
      throw new Error("Chọn file TOML không rỗng, tối đa 1 MB.");
    const data = new FormData();
    data.append("file", file);
    if (note.trim())
      data.append("note", z.string().max(2000).parse(note.trim()));
    return post("/rubrics", data, rubricSummarySchema);
  },
  activateRubric: (version: string) =>
    apiClient.post(`${root}/rubrics/${pathId(version)}/activate`, {}),
};

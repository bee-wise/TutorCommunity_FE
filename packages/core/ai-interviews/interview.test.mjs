import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { AxiosError } from "axios";
const dirname = path.dirname(fileURLToPath(import.meta.url));
const modules = new Map();
function loadTs(file) {
  const filename = path.resolve(dirname, file);
  if (modules.has(filename)) return modules.get(filename).exports;
  const compiledModule = { exports: {} }; modules.set(filename, compiledModule);
  const localRequire = createRequire(filename);
  const requireTs = (specifier) => {
    if (specifier.startsWith(".")) return loadTs(path.resolve(path.dirname(filename), specifier) + ".ts");
    if (specifier.startsWith("@workspace/core/")) return loadTs(path.resolve(dirname, "..", specifier.slice("@workspace/core/".length)) + ".ts");
    return localRequire(specifier);
  };
  const source = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "module", "exports", source)(requireTs, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
const { consentRequestSchema, startRequestSchema, interviewStateSchema } = loadTs("schemas/tutor.schema.ts");
const { decisionRequestSchema, overrideRequestSchema } = loadTs("schemas/review.schema.ts");
const { interviewApi, validateInterviewAudio } = loadTs("services/interview.api.ts");
const { apiClient } = loadTs("../apiClient.ts");
const { ApiError, handleApiError } = loadTs("../sys-libs/error-handler.ts");
const status = loadTs("interview-status.ts");
const id = "12345678-1234-4234-9234-123456789abc";
const state = { interview_id: id, status: "IN_PROGRESS", all_answered: true, prompt: null };

test("consent requires all four actual pre-checks and the current policy version", () => {
  assert.equal(consentRequestSchema.safeParse({ policy_version: "v1", checks: { camera: true, mic: false, network: true, time_confirmed: true } }).success, false);
  assert.equal(consentRequestSchema.safeParse({ policy_version: "v1", checks: { camera: true, mic: true, network: true, time_confirmed: true } }).success, true);
  assert.equal(consentRequestSchema.safeParse({ policy_version: "v1", checks: { camera: true, mic: true, network: true, time: true } }).success, false);
  assert.equal(consentRequestSchema.safeParse({ policy_version: "v1", checks: { camera: true, mic: true, network: true, time_confirmed: true, time: true } }).success, false);
});
test("start requires a valid consent and a supported recording container", () => {
  assert.equal(startRequestSchema.safeParse({ consent_id: id, video_mime: "video/mp4" }).success, true);
  assert.equal(startRequestSchema.safeParse({ consent_id: id, video_mime: "video/avi" }).success, false);
});
test("consent API sends time_confirmed and rejects the legacy time key before making a request", async () => {
  const original = apiClient.defaults.adapter; const calls = [];
  apiClient.defaults.adapter = async (request) => { calls.push(request); return { data: { consent_id: id }, status: 201, statusText: "Created", headers: {}, config: request }; };
  const payload = { policy_version: "v1", checks: { camera: true, mic: true, network: true, time_confirmed: true } };
  try {
    assert.deepEqual(await interviewApi.createConsent(payload), { consent_id: id });
    assert.equal(calls[0].url, "/ai/interview/consents");
    assert.equal(calls[0].withCredentials, true);
    assert.deepEqual(JSON.parse(calls[0].data), payload);
    assert.throws(() => interviewApi.createConsent({ policy_version: "v1", checks: { camera: true, mic: true, network: true, time: true } }));
    assert.equal(calls.length, 1);
  } finally { apiClient.defaults.adapter = original; }
});
test("revision and rejection require reasons; approving does not", () => {
  assert.equal(decisionRequestSchema.safeParse({ decision: "APPROVED" }).success, true);
  for (const decision of ["REJECTED", "NEEDS_REVISION"]) assert.equal(decisionRequestSchema.safeParse({ decision, reason: "   " }).success, false);
});
test("criterion overrides require integer levels 0–4 and a meaningful reason", () => {
  for (const new_level of [-1, 1.5, 5]) assert.equal(overrideRequestSchema.safeParse({ criterion_code: "Q3.C1", new_level, reason: "Có bằng chứng" }).success, false);
  assert.equal(overrideRequestSchema.safeParse({ criterion_code: "Q3.C1", new_level: 3, reason: "x" }).success, false);
});
test("audio validation rejects video payloads, empty audio and oversized audio", () => {
  assert.throws(() => validateInterviewAudio(new Blob(["x"], { type: "audio/webm" })));
  assert.throws(() => validateInterviewAudio(new Blob([new Uint8Array(2048)], { type: "video/webm" })));
  assert.throws(() => validateInterviewAudio(new Blob([new Uint8Array(25 * 1024 * 1024 + 1)], { type: "audio/mp4" })));
  validateInterviewAudio(new Blob([new Uint8Array(2048)], { type: "audio/webm;codecs=opus" }));
});
test("the AI detail envelope preserves stable error codes and Vietnamese messages", () => {
  const result = handleApiError(new AxiosError("Failed", "ERR_BAD_RESPONSE", undefined, undefined, { status: 409, data: { detail: { code: "processing", message: "Đang xử lý câu trả lời." } }, headers: {} }));
  assert.equal(result.code, "processing"); assert.equal(result.message, "Đang xử lý câu trả lời.");
  assert.equal(result.statusCode, 409); assert.ok(result instanceof ApiError);
});
test("server state supports recording retries, followups and submission", () => {
  assert.equal(interviewStateSchema.parse(state).all_answered, true);
  assert.equal(interviewStateSchema.parse({ interview_id: id, status: "SYSTEM_ERROR" }).retry, false);
});
test("review and attempt controls distinguish active, reviewable and finished sessions", () => {
  for (const active of ["IN_PROGRESS", "INTERRUPTED", "SYSTEM_ERROR"]) assert.equal(status.canGrantInterviewAttempt(active), false);
  assert.equal(status.canGrantInterviewAttempt("ABANDONED"), true);
  assert.equal(status.isReviewableInterview("PENDING_REVIEW"), true);
  assert.equal(status.isReviewableInterview("APPROVED"), false);
});
test("a processing response waits for progress, but accepts followups, retries and completion", () => {
  const prompt = { q_code: "Q1", kind: "main" };
  const pending = { status: "IN_PROGRESS", all_answered: false, retry: false, prompt };
  assert.equal(status.isAnswerStillProcessing(pending, prompt), true);
  for (const next of [{ ...pending, retry: true }, { ...pending, all_answered: true }, { ...pending, prompt: { q_code: "Q1", kind: "followup" } }, { ...pending, prompt: { q_code: "Q2", kind: "main" } }, { ...pending, status: "SYSTEM_ERROR" }]) assert.equal(status.isAnswerStillProcessing(next, prompt), false);
});
test("API sends audio-only multipart to the correct route, keeps credentials and waits for AI", async () => {
  const original = apiClient.defaults.adapter;
  let config;
  apiClient.defaults.adapter = async (request) => { config = request; return { data: state, status: 200, statusText: "OK", headers: {}, config: request }; };
  try {
    const audio = new Blob([new Uint8Array(2048)], { type: "audio/mp4" });
    const result = await interviewApi.answerInterview(id, { q_code: "Q1", kind: "main", duration_ms: 5000, audio });
    assert.equal(config.url, `/ai/interview/interviews/${id}/answer`);
    assert.equal(config.baseURL, apiClient.defaults.baseURL); assert.equal(config.withCredentials, true);
    assert.equal(config.timeout, 120000); assert.ok(config.data instanceof FormData);
    assert.equal(config.data.get("kind"), "main"); assert.equal(config.data.get("duration_ms"), "5000");
    assert.equal(config.data.get("audio").type, "audio/mp4"); assert.equal(config.data.has("video"), false);
    assert.equal(result.interview_id, id);
  } finally { apiClient.defaults.adapter = original; }
});
test("mic checks do not create or consume interview attempts", async () => {
  const original = apiClient.defaults.adapter; const calls = [];
  apiClient.defaults.adapter = async (request) => { calls.push(request.url); return { data: { ok: true }, status: 200, statusText: "OK", headers: {}, config: request }; };
  try { await interviewApi.checkMicrophone(new Blob([new Uint8Array(2048)], { type: "audio/webm" })); assert.deepEqual(calls, ["/ai/interview/mic-check"]); }
  finally { apiClient.defaults.adapter = original; }
});
test("R2 video uploads use the signed content type without session credentials", async () => {
  const { uploadInterviewVideo } = loadTs("services/video-upload.ts");
  const original = global.fetch; let options;
  global.fetch = async (_url, request) => { options = request; return { ok: true }; };
  try {
    await uploadInterviewVideo({ url: "https://example.test/signed", content_type: "video/mp4", key: "video", method: "PUT" }, new Blob(["video"]));
    assert.equal(options.method, "PUT"); assert.equal(options.credentials, "omit");
    assert.equal(options.headers["Content-Type"], "video/mp4");
  } finally { global.fetch = original; }
});

test("MediaRecorder produces audio-only mic samples and separate audio/video answers", async () => {
  const previous = { MediaRecorder: global.MediaRecorder, MediaStream: global.MediaStream, AudioContext: global.AudioContext };
  const tracks = [{ kind: "audio", readyState: "live", stop() { this.readyState = "ended"; } }, { kind: "video", readyState: "live", stop() { this.readyState = "ended"; } }];
  class FakeStream {
    constructor(selected = tracks) { this.tracks = selected; }
    getAudioTracks() { return this.tracks.filter((track) => track.kind === "audio"); }
    getTracks() { return this.tracks; }
  }
  class FakeRecorder {
    static isTypeSupported(type) { return type.includes("webm"); }
    constructor(stream, options) { this.stream = stream; this.mimeType = options.mimeType; this.state = "inactive"; }
    start() { this.state = "recording"; }
    stop() { this.state = "inactive"; this.ondataavailable?.({ data: new Blob([new Uint8Array(2048)], { type: this.mimeType }) }); this.onstop?.(); }
  }
  class FakeAudioContext {
    async resume() {}
    async close() {}
    createAnalyser() { return { fftSize: 32, getByteTimeDomainData(samples) { samples.fill(130); } }; }
    createMediaStreamSource() { return { connect() {} }; }
  }
  global.MediaRecorder = FakeRecorder; global.MediaStream = FakeStream; global.AudioContext = FakeAudioContext;
  const { InterviewRecorder, getRecordingFormats } = loadTs("../../../apps/sale/features/ai-interviews/services/interview-recorder.ts");
  const recorder = new InterviewRecorder(new FakeStream(), getRecordingFormats());
  try {
    await recorder.start(false); await new Promise((resolve) => setTimeout(resolve, 120));
    const mic = await recorder.stop(); assert.equal(mic.video, null); assert.ok(mic.audio.type.startsWith("audio/"));
    await recorder.start(true); await new Promise((resolve) => setTimeout(resolve, 120));
    const stopped = recorder.stop(); assert.equal(recorder.stop(), stopped);
    const answer = await stopped; assert.ok(answer.audio.type.startsWith("audio/")); assert.ok(answer.video.type.startsWith("video/")); assert.ok(answer.durationMs > 0);
    await recorder.start(false); tracks[0].readyState = "ended";
    await assert.rejects(recorder.stop(), /Micro/);
  } finally { recorder.dispose(); Object.assign(global, previous); }
});

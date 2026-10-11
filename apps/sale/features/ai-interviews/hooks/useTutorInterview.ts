"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useInterviewEligibilityQuery, useInterviewIdentity, useInterviewPolicyQuery, useInterviewStateQuery,
} from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { interviewKeys } from "@workspace/core/ai-interviews/queryKeys";
import { isAnswerStillProcessing } from "@workspace/core/ai-interviews/interview-status";
import { interviewApi, validateInterviewAudio } from "@workspace/core/ai-interviews/services/interview.api";
import type { InterviewState } from "@workspace/core/ai-interviews/schemas/tutor.schema";
import { ApiError, getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { authService } from "@workspace/core/services/auth.service";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { toast } from "@workspace/ui/components/ui/bee-toast";
import { useInterviewMedia } from "./useInterviewMedia";
import { useInterviewUploads } from "./useInterviewUploads";
import type { CapturedAnswer } from "../services/interview-recorder";

export type InterviewPhase = "policy" | "precheck" | "ready" | "intro" | "preparing" | "starting" | "recording" | "processing" | "complete" | "paused";

export function useTutorInterview() {
  const userId = useInterviewIdentity();
  const client = useQueryClient();
  const policy = useInterviewPolicyQuery();
  const eligibility = useInterviewEligibilityQuery();
  const [createdId, setCreatedId] = useState("");
  const [newAttempt, setNewAttempt] = useState(false);
  const interviewId = createdId || (newAttempt ? "" : eligibility.data?.interview_id || eligibility.data?.resumable_interview_id || "");
  const stateQuery = useInterviewStateQuery(interviewId);
  const state = stateQuery.data;
  const media = useInterviewMedia();
  const uploads = useInterviewUploads();
  const [phase, setPhase] = useState<InterviewPhase>("policy");
  const [policyConfirmed, setPolicyConfirmed] = useState(false);
  const [timeConfirmed, setTimeConfirmed] = useState(false);
  const [micOk, setMicOk] = useState(false);
  const [micRecording, setMicRecording] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [error, setError] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const busy = useRef(false);
  const draft = useRef<{ recording: CapturedAnswer; prompt: NonNullable<InterviewState["prompt"]> } | null>(null);
  const micTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const consent = useMutation({ mutationFn: interviewApi.createConsent, retry: false });
  const start = useMutation({ mutationFn: interviewApi.startInterview, retry: false });
  const resume = useMutation({ mutationFn: interviewApi.resumeInterview, retry: false });
  const answer = useMutation({ mutationFn: (values: Parameters<typeof interviewApi.answerInterview>[1]) => interviewApi.answerInterview(interviewId, values), retry: false });
  const submit = useMutation({ mutationFn: interviewApi.submitInterview, retry: false });
  const abandon = useMutation({ mutationFn: interviewApi.abandonInterview, retry: false });
  const microphone = useMutation({ mutationFn: interviewApi.checkMicrophone, retry: false });
  const heartbeat = useMutation({ mutationFn: interviewApi.heartbeat, retry: false });

  useEffect(() => () => {
    if (micTimer.current) clearTimeout(micTimer.current);
    if (resyncTimer.current) clearTimeout(resyncTimer.current);
  }, []);
  function showError(value: unknown) {
    const message = getApiErrorMessage(value); setError(message); toast.error(message);
  }
  function cacheState(next: InterviewState) {
    setNewAttempt(false);
    setCreatedId(next.interview_id);
    client.setQueryData(interviewKeys.state(userId, next.interview_id), next);
    void client.invalidateQueries({ queryKey: interviewKeys.eligibility(userId) });
  }
  function prepare(next: InterviewState | undefined = state) {
    if (!next) return;
    setError(""); draft.current = null; setHasDraft(false);
    if (next.all_answered) { setPhase("complete"); return; }
    if (!next.prompt || next.status !== "IN_PROGRESS") { setPhase("paused"); return; }
    setRemaining(next.prompt.prep_seconds);
    setDeadline(Date.now() + next.prompt.prep_seconds * 1000); setPhase("preparing");
  }
  async function syncState(waitForProcessing = false) {
    try {
      const next = await interviewApi.getState(interviewId); cacheState(next);
      const previous = draft.current?.prompt;
      if (waitForProcessing && previous && isAnswerStillProcessing(next, previous)) {
        resyncTimer.current = setTimeout(() => { void syncState(true); }, 3000);
        return;
      }
      draft.current = null; setHasDraft(false);
      if (next.status === "IN_PROGRESS") prepare(next); else setPhase("paused");
    } catch (value) { showError(value); setPhase("paused"); }
  }
  async function handleFailure(value: unknown) {
    showError(value); setPhase("paused");
    if (!(value instanceof ApiError)) return;
    if (["policy_outdated", "consent_invalid"].includes(value.code ?? "")) {
      setPolicyConfirmed(false); setMicOk(false); setPhase("policy");
      await policy.refetch(); await eligibility.refetch();
    } else if (value.code === "processing") {
      setPhase("processing");
      resyncTimer.current = setTimeout(() => { void syncState(true); }, 3000);
    } else if (["unexpected_question", "not_all_answered"].includes(value.code ?? "")) {
      await syncState();
    } else if (["system_error", "not_in_progress", "interview_open", "no_attempts_left", "resume_window_expired", "not_resumable"].includes(value.code ?? "")) {
      draft.current = null; setHasDraft(false); await eligibility.refetch(); await stateQuery.refetch();
    }
  }
  async function checkMic() {
    if (busy.current) return;
    const recorder = media.recorderRef.current;
    if (!recorder) return;
    busy.current = true; setMicOk(false); setError(""); setMicRecording(true);
    try {
      await recorder.start(false);
      await new Promise<void>((resolve) => { micTimer.current = setTimeout(resolve, 5000); });
      const recording = await recorder.stop();
      const result = await microphone.mutateAsync(recording.audio);
      if (!result.ok) throw new Error(result.message || "Micro chưa đạt. Hãy nói rõ hơn và thử lại.");
      setMicOk(true); toast.success("Micro đã đạt kiểm tra.");
    } catch (value) { showError(value); }
    finally { busy.current = false; setMicRecording(false); }
  }
  async function confirmChecks() {
    if (!policy.data || !micOk || !timeConfirmed || !media.stream || busy.current) return;
    if (!navigator.onLine) { showError(new Error("Hãy kết nối Internet trước khi xác nhận kiểm tra.")); return; }
    setError(""); busy.current = true;
    try {
      const open = eligibility.data?.state === "IN_PROGRESS" || Boolean(eligibility.data?.resumable_interview_id);
      if (!open) await consent.mutateAsync({ policy_version: policy.data.version, checks: { camera: true, mic: true, network: true, time_confirmed: true } });
      setPhase("ready");
    } catch (value) { await handleFailure(value); }
    finally { busy.current = false; }
  }
  async function beginInterview() {
    const recorder = media.recorderRef.current;
    if (!recorder || !micOk || busy.current) return;
    busy.current = true; setError("");
    try {
      const openId = eligibility.data?.resumable_interview_id || (eligibility.data?.state === "IN_PROGRESS" ? eligibility.data.interview_id : null);
      const next = openId
        ? await resume.mutateAsync(openId)
        : await start.mutateAsync({ consent_id: consent.data?.consent_id || eligibility.data?.consent_id || "", video_mime: recorder.formats.videoMime });
      cacheState(next);
      if (next.intro) setPhase("intro"); else prepare(next);
    } catch (value) {
      await eligibility.refetch();
      await handleFailure(value);
    }
    finally { busy.current = false; }
  }
  async function beginRecording() {
    if (busy.current || !state?.prompt) return;
    busy.current = true; setPhase("starting"); setError("");
    try {
      if (!media.recorderRef.current) throw new Error("Hãy kiểm tra lại camera và micro.");
      const videoMime = state.prompt.video_upload.content_type.split(";")[0];
      if (media.recorderRef.current.formats.videoMime !== videoMime) throw new Error("Buổi trước dùng định dạng video khác. Hãy tiếp tục bằng trình duyệt đã bắt đầu buổi này.");
      await media.recorderRef.current.start(true);
      setRemaining(state.prompt.answer_seconds);
      setDeadline(Date.now() + state.prompt.answer_seconds * 1000); setPhase("recording");
    } catch (value) { showError(value); setPhase("paused"); }
    finally { busy.current = false; }
  }
  async function sendAnswer() {
    if (!draft.current) return;
    const { recording, prompt } = draft.current;
    const next = await answer.mutateAsync({ q_code: prompt.q_code, kind: prompt.kind, duration_ms: recording.durationMs, audio: recording.audio });
    cacheState(next); prepare(next);
  }
  async function finishRecording() {
    if (busy.current || !state?.prompt) return;
    busy.current = true; setPhase("processing");
    try {
      if (!media.recorderRef.current) throw new Error("Không có thiết bị ghi hình.");
      const recording = await media.recorderRef.current.stop();
      if (!recording.video?.size) throw new Error("Không thu được video. Hãy kiểm tra lại camera.");
      validateInterviewAudio(recording.audio);
      draft.current = { recording, prompt: state.prompt };
      setHasDraft(true);
      uploads.upload(state.prompt, recording.video); await sendAnswer();
    } catch (value) { await handleFailure(value); }
    finally { busy.current = false; }
  }
  async function retryAnswer() {
    if (busy.current) return;
    busy.current = true; setPhase("processing"); setError("");
    try { await sendAnswer(); } catch (value) { await handleFailure(value); }
    finally { busy.current = false; }
  }
  const onDeadline = useEffectEvent(() => {
    if (phase === "preparing") void beginRecording();
    if (phase === "recording") void finishRecording();
  });
  useEffect(() => {
    if (phase !== "preparing" && phase !== "recording") return;
    let triggered = false;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); setRemaining(seconds);
      if (!seconds && !triggered) { triggered = true; onDeadline(); }
    };
    const timer = setInterval(tick, 200); tick();
    return () => clearInterval(timer);
  }, [phase, deadline]);
  const onHeartbeat = useEffectEvent(() => {
    heartbeat.mutate(interviewId, { onError: (value) => {
      showError(value);
      if (phase !== "recording" && phase !== "processing") setPhase("paused");
    } });
  });
  const sessionActive = ["intro", "preparing", "starting", "recording", "processing", "complete", "paused"].includes(phase) && state?.status === "IN_PROGRESS";
  useEffect(() => {
    if (!sessionActive || !interviewId) return;
    const timer = setInterval(onHeartbeat, 30000);
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", beforeUnload);
    return () => { clearInterval(timer); window.removeEventListener("beforeunload", beforeUnload); };
  }, [sessionActive, interviewId]);
  async function submitInterview() {
    if (busy.current || !state?.all_answered) return;
    busy.current = true; setError("");
    try {
      await uploads.waitForUploads();
      const result = await submit.mutateAsync(interviewId);
      cacheState({ ...state, ...result }); media.releaseDevices();
      toast.success("Đã nộp bài phỏng vấn. BeeWise sẽ xét duyệt kết quả.");
      void client.invalidateQueries({ queryKey: ["me"] });
      try { const me = await authService.getMe(); if (me.success && me.data) useAuthStore.getState().login(me.data); }
      catch { /* Submission succeeded; auth is refreshed again on the next navigation. */ }
    } catch (value) { await handleFailure(value); }
    finally { busy.current = false; }
  }
  async function abandonInterview() {
    if (busy.current) return;
    busy.current = true;
    try {
      const result = await abandon.mutateAsync(interviewId);
      if (state) cacheState({ ...state, ...result });
      media.releaseDevices(); setPhase("paused"); toast.success("Đã kết thúc buổi phỏng vấn.");
    } catch (value) { await handleFailure(value); }
    finally { busy.current = false; }
  }
  return {
    policy, eligibility, stateQuery, state, phase, policyConfirmed, setPolicyConfirmed, timeConfirmed, setTimeConfirmed,
    micOk, setMicOk, micRecording, remaining, error, media, uploads,
    pending: consent.isPending || start.isPending || resume.isPending || submit.isPending || abandon.isPending,
    micPending: microphone.isPending, hasDraft,
    startNewAttempt: () => { setCreatedId(""); setNewAttempt(true); setPolicyConfirmed(false); setMicOk(false); setPhase("policy"); },
    nextFromPolicy: () => { if (policyConfirmed) setPhase("precheck"); },
    checkMic, confirmChecks, beginInterview, prepare, beginRecording, finishRecording, retryAnswer, syncState, submitInterview, abandonInterview,
    recheckDevices: () => { setMicOk(false); setPhase("precheck"); void media.requestDevices(); },
  };
}

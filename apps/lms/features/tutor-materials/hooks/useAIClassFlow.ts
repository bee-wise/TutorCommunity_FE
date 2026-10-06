"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CLASS_SESSIONS } from "../data/classroom.mock";
import { useAIJobsStore } from "../store/ai-jobs.store";
import { useClassMaterialsStore } from "../store/class-materials.store";
import { startClassGeneration } from "../services/ai-generation.service";
import type { MaterialClass } from "../types/class-materials.types";

export function useAIClassFlow(classInfo: MaterialClass, initialMaterialId?: string, initialSessionId?: string) {
  const sessions = CLASS_SESSIONS.filter((item) => item.classId === classInfo.id && item.completed);
  const [sessionId, setSessionId] = useState(initialSessionId ?? sessions[0]?.id ?? "");
  const [transcript, setTranscript] = useState("");
  const [questions, setQuestions] = useState(4);
  const [stage, setStage] = useState<1 | 2>(1);
  const job = useAIJobsStore((state) => state.jobs[classInfo.id]);
  const [resultId, setResultId] = useState(initialMaterialId);
  const [ignorePreviousResult, setIgnorePreviousResult] = useState(false);
  const materials = useClassMaterialsStore((state) => state.materials);
  const queryClient = useQueryClient();
  const session = sessions.find((item) => item.id === sessionId);
  const result = materials.find((item) => item.classId === classInfo.id && item.id === (resultId ?? (ignorePreviousResult ? undefined : job?.materialId)));
  const isRunning = job?.status === "running";
  const step = result && !isRunning ? 3 : isRunning ? 2 : stage;

  function review() {
    if (!session) return;
    setTranscript(session.zoomTranscript ?? "");
    setStage(2);
  }
  function generate() {
    if (!session || !transcript.trim() || isRunning) return;
    setResultId(undefined);
    setIgnorePreviousResult(false);
    startClassGeneration(queryClient, classInfo.id, session.id, { transcript: transcript.trim(), subject: classInfo.subject, num_questions: questions });
  }
  function restart() {
    setResultId(undefined);
    setIgnorePreviousResult(true);
    setStage(1);
  }
  return { sessions, sessionId, setSessionId, session, transcript, setTranscript, questions, setQuestions, step, setStage, review, generate, restart, isRunning, job, result };
}
export type AIClassFlow = ReturnType<typeof useAIClassFlow>;

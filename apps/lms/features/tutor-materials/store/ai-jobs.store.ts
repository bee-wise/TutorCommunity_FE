"use client";

import { create } from "zustand";
import type { AIJob } from "../types/class-materials.types";

interface AIJobsState {
  jobs: Record<string, AIJob>;
  setJob: (job: AIJob) => void;
}
export const useAIJobsStore = create<AIJobsState>((set) => ({
  jobs: {},
  setJob: (job) =>
    set((state) => ({ jobs: { ...state.jobs, [job.classId]: job } })),
}));

"use client";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import { learnerClassesService } from "../services/learner-classes.service";

export function useLearnerClassProgress(classId: string) {
  return useLmsClassResource(classId, "learner-completed-count",
    (signal) => learnerClassesService.sessions(classId, { page: 1, pageSize: 1, status: "COMPLETED" }, signal),
    { roles: ["LEARNER"] },
  );
}
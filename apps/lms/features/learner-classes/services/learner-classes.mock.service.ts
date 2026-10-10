import { LEARNER_CLASSES, LEARNER_CLASS_SESSIONS, LEARNER_SHARED_MATERIALS } from "../../learner-materials/data/learner-materials.mock";
import { LEARNER_EXERCISES } from "../../learner-exercises/data/learner-exercises.mock";
import { LEARNER_TUITION_CLASSES } from "../../learner-tuition-fee/data/tuition-fee.mock";
import type { LearnerClassWorkspaceSummary, LearnerWorkspaceSession } from "../types/learner-classes.types";

const PENDING_EXERCISE_STATUSES = new Set(["not_started", "in_progress", "overdue"]);

export function getLearnerClassSummaries(): LearnerClassWorkspaceSummary[] {
  return LEARNER_CLASSES.map((classInfo) => {
    const sessions = LEARNER_CLASS_SESSIONS.filter((session) => session.classId === classInfo.id);
    const sessionIds = new Set(sessions.map((session) => session.id));
    const exercises = LEARNER_EXERCISES.filter((exercise) => exercise.classId === classInfo.id);
    return {
      classInfo,
      sessionCount: sessions.length,
      completedSessionCount: sessions.filter((session) => session.status === "COMPLETED").length,
      materialCount: LEARNER_SHARED_MATERIALS.filter((material) => sessionIds.has(material.sessionId)).length,
      pendingExerciseCount: exercises.filter((exercise) => PENDING_EXERCISE_STATUSES.has(exercise.status)).length,
      tuitionId: LEARNER_TUITION_CLASSES.find((item) => item.learnerClassId === classInfo.id)?.id,
    };
  });
}

export function getLearnerClassSummary(classId: string): LearnerClassWorkspaceSummary | undefined {
  return getLearnerClassSummaries().find((item) => item.classInfo.id === classId);
}

export function getLearnerWorkspaceSessions(classId: string): LearnerWorkspaceSession[] {
  return LEARNER_CLASS_SESSIONS.filter((session) => session.classId === classId)
    .map((session) => {
      const exercises = LEARNER_EXERCISES.filter((exercise) => exercise.classId === classId && exercise.sessionId === session.id);
      return {
        session,
        materialCount: LEARNER_SHARED_MATERIALS.filter((material) => material.sessionId === session.id).length,
        exerciseCount: exercises.length,
        pendingExerciseCount: exercises.filter((exercise) => PENDING_EXERCISE_STATUSES.has(exercise.status)).length,
      };
    })
    .sort((a, b) => a.session.sequence - b.session.sequence);
}

import type { LearnerClass, LearnerClassSession } from "../../learner-materials/types/learner-materials.types";

export interface LearnerClassWorkspaceSummary {
  classInfo: LearnerClass;
  sessionCount: number;
  completedSessionCount: number;
  materialCount: number;
  pendingExerciseCount: number;
  tuitionId?: string;
}

export interface LearnerWorkspaceSession {
  session: LearnerClassSession;
  materialCount: number;
  exerciseCount: number;
  pendingExerciseCount: number;
}

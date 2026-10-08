import type { Learner } from "../types";
import type { ClassMaterial, ClassSession, MaterialClass } from "../types/class-materials.types";
import type { MaterialLibraryCard } from "../types/material-library.types";

export function getMaterialLibraryCard(classInfo: MaterialClass, learners: readonly Learner[], sessions: readonly ClassSession[], materials: readonly ClassMaterial[]): MaterialLibraryCard {
  const classSessions = sessions.filter((session) => session.classId === classInfo.id);
  const classMaterials = materials.filter((material) => material.classId === classInfo.id);
  const publishedSessions = new Set(classMaterials.filter((material) => material.status === "published").map((material) => material.sessionId));
  return {
    classInfo,
    learners: learners.filter((learner) => classInfo.learnerIds.includes(learner.id)),
    sessionCount: classSessions.length,
    materialCount: classMaterials.length,
    missingPublishedCount: classSessions.filter((session) => session.completed && !publishedSessions.has(session.id)).length,
  };
}

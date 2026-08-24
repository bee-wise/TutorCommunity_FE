import type {
  LearnerClass,
  LearnerClassSession,
  LearnerClassSummary,
  LearnerSharedMaterial,
} from "../types/learner-materials.types";

export function formatLibraryDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function buildClassSummaries(
  classes: LearnerClass[],
  sessions: LearnerClassSession[],
  materials: LearnerSharedMaterial[],
): LearnerClassSummary[] {
  return classes.map((classInfo) => {
    const classSessions = sessions.filter((session) => session.classId === classInfo.id);
    const sessionIds = new Set(classSessions.map((session) => session.id));
    const classMaterials = materials.filter((material) => sessionIds.has(material.sessionId));
    const latestMaterialAt = classMaterials
      .map((material) => material.sharedAt)
      .sort((a, b) => b.localeCompare(a))[0];
    return {
      classInfo,
      sessionCount: classSessions.length,
      completedSessionCount: classSessions.filter((session) => session.status === "COMPLETED").length,
      materialCount: classMaterials.length,
      latestMaterialAt,
    };
  });
}


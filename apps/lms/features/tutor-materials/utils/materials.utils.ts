import type {
  Learner,
  LearnerMaterialSummary,
  LearningSession,
  TutorMaterial,
} from "../types";

export function formatMaterialDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function buildLearnerSummaries(
  learners: Learner[],
  sessions: LearningSession[],
  materials: TutorMaterial[],
): LearnerMaterialSummary[] {
  return learners.map((learner) => {
    const learnerSessions = sessions.filter((session) => session.learnerId === learner.id);
    const learnerMaterials = materials.filter((material) => material.learnerId === learner.id);
    const coveredSessionIds = new Set(learnerMaterials.map((material) => material.sessionId));
    const latestSessionAt = learnerSessions.reduce(
      (latest, session) => (session.taughtAt > latest ? session.taughtAt : latest),
      learner.joinedAt,
    );

    return {
      learner,
      subjects: [...new Set(learnerSessions.map((session) => session.subject))],
      sessionCount: learnerSessions.length,
      materialCount: learnerMaterials.length,
      missingMaterialCount: learnerSessions.filter(
        (session) => session.completed && !coveredSessionIds.has(session.id),
      ).length,
      latestSessionAt,
    };
  });
}

export function getMaterialFileType(file: File): TutorMaterial["fileType"] {
  const extension = file.name.split(".").pop()?.toLocaleLowerCase();
  if (extension === "doc" || extension === "docx") return "DOCX";
  if (extension === "ppt" || extension === "pptx") return "PPTX";
  return "PDF";
}


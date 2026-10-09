import type {
  ClassLibraryFilters, ClassSessionFilters, LearnerClass, LearnerClassSession,
  LearnerClassSummary, LearnerSessionSummary, LearnerSharedMaterial, SessionMaterialFilters,
} from "../types/learner-materials.types";

export const DEFAULT_CLASS_FILTERS: ClassLibraryFilters = { search: "", subject: "all", kind: "individual", status: "all", sort: "newest" };
export const DEFAULT_SESSION_FILTERS: ClassSessionFilters = { search: "", status: "all", availability: "all" };
export const DEFAULT_MATERIAL_FILTERS: SessionMaterialFilters = { search: "", source: "all", fileType: "all" };

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh",
});

export function formatLibraryDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Chưa có thời gian" : dateFormatter.format(date);
}

function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").replace(/[đĐ]/g, "d").toLocaleLowerCase("vi").trim();
}

export function buildClassSummaries(classes: readonly LearnerClass[], sessions: readonly LearnerClassSession[], materials: readonly LearnerSharedMaterial[]): LearnerClassSummary[] {
  return classes.map((classInfo) => {
    const classSessions = sessions.filter((session) => session.classId === classInfo.id);
    const sessionIds = new Set(classSessions.map((session) => session.id));
    const classMaterials = materials.filter((material) => sessionIds.has(material.sessionId));
    const latestMaterialAt = classMaterials.reduce<string | undefined>((latest, material) => !latest || Date.parse(material.sharedAt) > Date.parse(latest) ? material.sharedAt : latest, undefined);
    return {
      classInfo, sessionCount: classSessions.length,
      completedSessionCount: classSessions.filter((session) => session.status === "COMPLETED").length,
      materialCount: classMaterials.length, newMaterialCount: classMaterials.filter((material) => material.isNew).length, latestMaterialAt,
    };
  });
}

export function filterClassSummaries(summaries: readonly LearnerClassSummary[], filters: ClassLibraryFilters): LearnerClassSummary[] {
  const query = normalizeSearch(filters.search);
  const statusOrder = { active: 0, upcoming: 1, completed: 2 };
  return summaries.filter(({ classInfo }) => classInfo.kind === filters.kind
    && (filters.status === "all" || classInfo.status === filters.status)
    && (filters.subject === "all" || classInfo.subject === filters.subject)
    && normalizeSearch(`${classInfo.title} ${classInfo.code} ${classInfo.subject} ${classInfo.level} ${classInfo.tutorName}`).includes(query))
    .sort((a, b) => {
      const byDate = Date.parse(b.classInfo.startedAt) - Date.parse(a.classInfo.startedAt);
      if (filters.sort === "status") return statusOrder[a.classInfo.status] - statusOrder[b.classInfo.status] || byDate || a.classInfo.id.localeCompare(b.classInfo.id);
      return (filters.sort === "oldest" ? -byDate : byDate) || a.classInfo.id.localeCompare(b.classInfo.id);
    });
}

export function buildSessionSummaries(classId: string, sessions: readonly LearnerClassSession[], materials: readonly LearnerSharedMaterial[]): LearnerSessionSummary[] {
  const counts = new Map<string, number>();
  for (const material of materials) counts.set(material.sessionId, (counts.get(material.sessionId) ?? 0) + 1);
  return sessions.filter((session) => session.classId === classId).map((session) => ({ session, materialCount: counts.get(session.id) ?? 0 }));
}

export function filterSessionSummaries(summaries: readonly LearnerSessionSummary[], filters: ClassSessionFilters): LearnerSessionSummary[] {
  const query = normalizeSearch(filters.search);
  return summaries.filter(({ session, materialCount }) => normalizeSearch(`${session.topic} Buổi ${session.sequence}`).includes(query)
    && (filters.status === "all" || session.status === filters.status)
    && (filters.availability === "all" || (filters.availability === "available" ? materialCount > 0 : materialCount === 0)));
}

export function filterSharedMaterials(sessionId: string, materials: readonly LearnerSharedMaterial[], filters: SessionMaterialFilters): LearnerSharedMaterial[] {
  const query = normalizeSearch(filters.search);
  return materials.filter((material) => material.sessionId === sessionId
    && normalizeSearch(`${material.title} ${material.description}`).includes(query)
    && (filters.source === "all" || material.source === filters.source)
    && (filters.fileType === "all" || material.fileType === filters.fileType));
}


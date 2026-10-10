import type { ClassLibraryFilters, LearnerClassSessionStatus } from "../../learner-materials/types/learner-materials.types";
import type { LearnerClassWorkspaceSummary, LearnerWorkspaceSession } from "../types/learner-classes.types";

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").replace(/[đĐ]/g, "d").toLocaleLowerCase("vi").trim();
}

export function filterLearnerClasses(items: readonly LearnerClassWorkspaceSummary[], filters: ClassLibraryFilters): LearnerClassWorkspaceSummary[] {
  const query = normalize(filters.search);
  const statusOrder = { active: 0, upcoming: 1, completed: 2 };
  return items.filter(({ classInfo }) => classInfo.kind === filters.kind
    && (filters.status === "all" || classInfo.status === filters.status)
    && (filters.subject === "all" || classInfo.subject === filters.subject)
    && normalize(`${classInfo.title} ${classInfo.code} ${classInfo.subject} ${classInfo.level} ${classInfo.tutorName}`).includes(query))
    .sort((a, b) => {
      const date = Date.parse(b.classInfo.startedAt) - Date.parse(a.classInfo.startedAt);
      if (filters.sort === "status") return statusOrder[a.classInfo.status] - statusOrder[b.classInfo.status] || date;
      return (filters.sort === "oldest" ? -date : date) || a.classInfo.id.localeCompare(b.classInfo.id);
    });
}

export function filterLearnerSessions(items: readonly LearnerWorkspaceSession[], search: string, status: "all" | LearnerClassSessionStatus): LearnerWorkspaceSession[] {
  const query = normalize(search);
  return items.filter(({ session }) => normalize(`${session.topic} Buổi ${session.sequence}`).includes(query)
    && (status === "all" || session.status === status));
}

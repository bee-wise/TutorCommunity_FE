import { LEARNER_TUITION_CLASSES } from "../../learner-tuition-fee/data/tuition-fee.mock";

export type LearnerWorkspaceSection = "overview" | "sessions" | "materials" | "exercises" | "tuition";
export interface LearnerWorkspaceRoute { classId: string; section: LearnerWorkspaceSection }

export const LEARNER_WORKSPACE_LABELS: Record<LearnerWorkspaceSection, string> = {
  overview: "Thông tin lớp",
  sessions: "Buổi học",
  materials: "Tài liệu lớp học",
  exercises: "Bài tập",
  tuition: "Học phí",
};

function decodeClassId(segment: string): string | null {
  try {
    const classId = decodeURIComponent(segment);
    return classId.trim() && !/[/\\]/.test(classId) ? classId : null;
  } catch {
    return null;
  }
}

export function getLearnerWorkspaceRoute(pathname: string): LearnerWorkspaceRoute | null {
  const classRoute = pathname.match(/^\/lms\/learner\/classes\/([^/]+)(?:\/(sessions))?\/?$/);
  const materialRoute = pathname.match(/^\/lms\/learner\/materials\/classes\/([^/]+)(?:\/sessions\/[^/]+)?\/?$/);
  const exerciseRoute = pathname.match(/^\/lms\/learner\/exercises\/classes\/([^/]+)(?:\/sessions\/[^/]+)?\/?$/);
  const tuitionRoute = pathname.match(/^\/lms\/learner\/tuition-fee\/([^/]+)\/?$/);
  const tuitionClass = tuitionRoute && LEARNER_TUITION_CLASSES.find((item) => item.id === tuitionRoute[1]);
  const segment = classRoute?.[1] ?? materialRoute?.[1] ?? exerciseRoute?.[1] ?? tuitionClass?.learnerClassId;
  if (!segment) return null;
  const classId = decodeClassId(segment);
  if (!classId) return null;
  return {
    classId,
    section: materialRoute ? "materials" : exerciseRoute ? "exercises" : tuitionRoute ? "tuition" : classRoute?.[2] ? "sessions" : "overview",
  };
}

export function getLearnerWorkspaceLinks(classId: string) {
  const id = encodeURIComponent(classId);
  const root = `/lms/learner/classes/${id}`;
  const tuitionId = LEARNER_TUITION_CLASSES.find((item) => item.learnerClassId === classId)?.id;
  return {
    overview: root,
    sessions: `${root}/sessions`,
    materials: `/lms/learner/materials/classes/${id}`,
    exercises: `/lms/learner/exercises/classes/${id}`,
    tuition: tuitionId ? `/lms/learner/tuition-fee/${encodeURIComponent(tuitionId)}` : null,
  };
}

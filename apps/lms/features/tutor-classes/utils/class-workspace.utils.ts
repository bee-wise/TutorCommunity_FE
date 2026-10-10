export type ClassWorkspaceSection = "overview" | "sessions" | "members" | "materials" | "messages";
export interface ClassWorkspaceRoute { classId: string; section: ClassWorkspaceSection }

export const CLASS_WORKSPACE_LABELS: Record<ClassWorkspaceSection, string> = {
  overview: "Thông tin lớp", sessions: "Buổi học & điểm danh", members: "Thành viên",
  materials: "Tài liệu", messages: "Tin nhắn lớp",
};

export function getClassWorkspaceRoute(pathname: string): ClassWorkspaceRoute | null {
  const match = pathname.match(/^\/lms\/tutor\/classes\/([^/]+)(?:\/(sessions|members|messages))?\/?$/);
  const materials = pathname.match(/^\/lms\/tutor\/materials\/classes\/([^/]+)\/?$/);
  const segment = match?.[1] ?? materials?.[1];
  if (!segment) return null;
  try {
    const classId = decodeURIComponent(segment);
    if (!classId.trim() || /[/\\]/.test(classId)) return null;
    const section: ClassWorkspaceSection = materials ? "materials"
      : match?.[2] === "sessions" ? "sessions" : match?.[2] === "members" ? "members"
        : match?.[2] === "messages" ? "messages" : "overview";
    return { classId, section };
  } catch { return null; }
}

export function getClassWorkspaceLinks(classId: string) {
  const id = encodeURIComponent(classId);
  const root = `/lms/tutor/classes/${id}`;
  return { overview: root, sessions: `${root}/sessions`, members: `${root}/members`,
    materials: `/lms/tutor/materials/classes/${id}`, messages: `${root}/messages` };
}

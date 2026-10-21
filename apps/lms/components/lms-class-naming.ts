export interface LmsClassNameSource {
  title?: string | null;
  /** Lĩnh vực, e.g. "Ngoại Ngữ". */
  programName?: string | null;
  /** Môn học, e.g. "Tiếng Anh giao tiếp". */
  contextName?: string | null;
  /** Trình độ / nội dung giảng dạy, e.g. "Cơ bản". */
  teachingItemName?: string | null;
}

/**
 * One reading of the class naming fields for every class screen: contextName is the subject,
 * teachingItemName the level, programName the field. The class title is shown only when it adds something.
 */
export function getClassNaming(source: LmsClassNameSource) {
  const field = source.programName?.trim() || undefined;
  const level = source.teachingItemName?.trim() || undefined;
  const subject = source.contextName?.trim() || level || source.title?.trim() || "Lớp học";
  const title = source.title?.trim();
  const name = title && title !== subject && title !== level ? title : undefined;
  return { field, subject, level: subject === level ? undefined : level, name };
}

export function getClassKindLabel(type?: string | null) {
  const kind = type?.toUpperCase();
  return kind === "GROUP" ? "Lớp nhóm" : kind === "INDIVIDUAL" ? "Lớp 1 kèm 1" : "Chưa xác định loại lớp";
}

export function getTeachingModeLabel(mode?: string | null) {
  return mode === "ONLINE" ? "Trực tuyến" : mode === "OFFLINE" ? "Trực tiếp" : "Chưa xác định hình thức";
}

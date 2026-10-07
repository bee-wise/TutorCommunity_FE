import type { TutorMaterial } from "../types";
export function formatMaterialDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(value));
}
export function getMaterialFileType(file: File): TutorMaterial["fileType"] {
  const extension = file.name.split(".").pop()?.toLocaleLowerCase();
  if (extension === "doc" || extension === "docx") return "DOCX";
  if (extension === "ppt" || extension === "pptx") return "PPTX";
  return "PDF";
}


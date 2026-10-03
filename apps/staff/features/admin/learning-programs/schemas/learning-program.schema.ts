import { z } from "zod";

export const learningCatalogItemSchema = z.object({
  id: z.string().uuid(),
  code: z.string().nullish(),
  name: z.string().nullish(),
  type: z.string().nullish(),
  status: z.string().nullish(),
  programId: z.string().uuid().nullish(),
  programVersionId: z.string().uuid().nullish(),
  teachingItemId: z.string().uuid().nullish(),
  contextId: z.string().uuid().nullish(),
  effectiveFrom: z.string().nullish(),
  publishedAt: z.string().nullish(),
  publishedBy: z.string().uuid().nullish(),
});

export type LearningCatalogItem = z.infer<typeof learningCatalogItemSchema>;

export function getProgramTypeLabel(
  type: string | null | undefined,
  types: LearningCatalogItem[] = [],
): string {
  if (!type) return "Chưa phân loại";
  return types.find((item) => item.code === type)?.name || type;
}

export const programTypeFormSchema = z.object({
  code: z.string().trim().min(2, "Nhập mã loại chương trình."),
  name: z.string().trim().min(2, "Nhập tên loại chương trình."),
});
export type ProgramTypeFormValues = z.infer<typeof programTypeFormSchema>;

export const programFormSchema = z.object({
  code: z.string().trim().min(2, "Nhập mã chương trình."),
  name: z.string().trim().min(2, "Nhập tên chương trình."),
  type: z.string().trim().min(1, "Chọn loại chương trình."),
});
export type ProgramFormValues = z.infer<typeof programFormSchema>;

export const teachingItemFormSchema = z.object({
  code: z.string().trim().min(2, "Nhập mã nội dung dạy."),
  name: z.string().trim().min(2, "Nhập tên nội dung dạy."),
});
export type TeachingItemFormValues = z.infer<typeof teachingItemFormSchema>;

export const versionFormSchema = z.object({
  name: z.string().trim().min(2, "Nhập tên phiên bản (ít nhất 2 ký tự)."),
  effectiveFrom: z.string(),
});
export type VersionFormValues = z.infer<typeof versionFormSchema>;

export const contextTypes = [
  "GRADE",
  "LEVEL",
  "MAJOR",
  "EXAM_TRACK",
  "CERT_LEVEL",
  "OTHER",
] as const;
export const contextTypeLabels: Record<(typeof contextTypes)[number], string> =
  {
    GRADE: "Lớp học",
    LEVEL: "Trình độ",
    MAJOR: "Chuyên ngành",
    EXAM_TRACK: "Hướng luyện thi",
    CERT_LEVEL: "Cấp chứng chỉ",
    OTHER: "Khác",
  };

export const contextFormSchema = z.object({
  code: z.string().trim().min(1, "Nhập mã ngữ cảnh."),
  name: z.string().trim().min(2, "Nhập tên ngữ cảnh."),
  type: z.enum(contextTypes),
});
export type ContextFormValues = z.infer<typeof contextFormSchema>;

export const mappingFormSchema = z.object({
  teachingItemId: z.string().uuid("Chọn môn / nội dung dạy."),
  contextId: z.union([z.string().uuid(), z.literal("__none__")]),
});
export type MappingFormValues = z.infer<typeof mappingFormSchema>;

export const bulkMappingFormSchema = z.object({
  mappings: z.array(mappingFormSchema).min(1, "Chọn ít nhất một tổ hợp."),
});
export type BulkMappingFormValues = z.infer<typeof bulkMappingFormSchema>;

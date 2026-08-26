export interface FilePreviewRule {
  acceptedTypes: string[];
  maxBytes: number;
}

export function validatePreviewFile(
  file: File,
  rule: FilePreviewRule,
): string | null {
  if (!rule.acceptedTypes.includes(file.type)) {
    return "Định dạng file chưa được hỗ trợ.";
  }
  if (file.size > rule.maxBytes) {
    return `Dung lượng file tối đa ${Math.round(rule.maxBytes / 1024 / 1024)} MB.`;
  }
  return null;
}

export function isLocalPreviewUrl(value: string): boolean {
  return value.startsWith("blob:");
}

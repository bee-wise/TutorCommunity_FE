import { z } from "zod";

export type RubricValue = string | number | boolean | RubricValue[] | { [key: string]: RubricValue };
export type RubricConfig = Record<string, RubricValue>;
export type RubricPath = (string | number)[];
const valueSchema: z.ZodType<RubricValue> = z.lazy(() => z.union([
  z.string(), z.number().finite(), z.boolean(), z.array(valueSchema), z.record(z.string(), valueSchema),
]));
export const rubricConfigSchema = z.record(z.string(), valueSchema);

export function parseRubricConfig(source: string): RubricConfig {
  return rubricConfigSchema.parse(JSON.parse(source));
}

// The API returns the entire TOML document as JSON. Preserve its keys and nesting;
// the backend remains responsible for validating the rubric's domain structure.
export function serializeRubricToml(config: RubricConfig): string {
  const encode = (value: RubricValue): string => {
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) return `[${value.map(encode).join(", ")}]`;
    return `{ ${Object.entries(value).map(([key, entry]) => `${JSON.stringify(key)} = ${encode(entry)}`).join(", ")} }`;
  };
  const parsed = rubricConfigSchema.parse(config);
  return Object.entries(parsed).map(([key, value]) => `${JSON.stringify(key)} = ${encode(value)}`).join("\n") + "\n";
}

export function findRubricVersionPaths(config: RubricConfig, version: string): RubricPath[] {
  const paths: RubricPath[] = [];
  const visit = (value: RubricValue, path: RubricPath) => {
    if (Array.isArray(value)) value.forEach((entry, index) => visit(entry, [...path, index]));
    else if (typeof value === "object") Object.entries(value).forEach(([key, entry]) => {
      const next = [...path, key];
      if (key === "version" && entry === version) paths.push(next);
      else visit(entry, next);
    });
  };
  visit(config, []);
  return paths;
}

export function replaceRubricValue(value: RubricValue, path: RubricPath, replacement: RubricValue): RubricValue {
  const [key, ...rest] = path;
  if (key === undefined) return replacement;
  if (Array.isArray(value) && typeof key === "number") return value.map((entry, index) => index === key ? replaceRubricValue(entry, rest, replacement) : entry);
  if (typeof value === "object" && !Array.isArray(value) && typeof key === "string" && key in value) return { ...value, [key]: replaceRubricValue(value[key]!, rest, replacement) };
  throw new Error("Không tìm thấy trường cấu hình cần cập nhật.");
}

export function prepareRubricVersion(config: RubricConfig, currentVersion: string, nextVersion: string, existingVersions: string[]): RubricConfig {
  const version = z.string().trim().min(1, "Nhập phiên bản mới.").max(50).parse(nextVersion);
  if (existingVersions.includes(version) || version === currentVersion) throw new Error("Phiên bản đã tồn tại. Hãy dùng một phiên bản mới.");
  const paths = findRubricVersionPaths(config, currentVersion);
  if (paths.length !== 1) throw new Error("Không xác định được trường version trong cấu hình. Hãy chỉnh và tải lên file TOML theo mẫu của backend.");
  return rubricConfigSchema.parse(replaceRubricValue(config, paths[0]!, version));
}

export function downloadRubricToml(config: RubricConfig, version: string): void {
  const blob = new Blob([serializeRubricToml(config)], { type: "application/toml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a"); anchor.href = url;
  anchor.download = `rubric-${version.replace(/[^a-zA-Z0-9._-]/g, "_")}.toml`;
  anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

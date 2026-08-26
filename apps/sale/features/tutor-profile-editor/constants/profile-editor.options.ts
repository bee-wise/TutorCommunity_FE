export const TEACHING_MODE_VALUES = [
  "Online",
  "Tại nhà",
  "Online & tại nhà",
] as const;

export type TeachingModeValue = (typeof TEACHING_MODE_VALUES)[number];

export const TEACHING_MODE_OPTIONS: Array<{
  value: TeachingModeValue;
  label: TeachingModeValue;
}> = TEACHING_MODE_VALUES.map((value) => ({ value, label: value }));

export function normalizeTeachingMode(items: string[]): TeachingModeValue {
  const hasOnline = items.some((item) => item.toLocaleLowerCase("vi").includes("online"));
  const hasHome = items.some((item) => item.toLocaleLowerCase("vi").includes("tại nhà"));

  if (hasOnline && hasHome) return "Online & tại nhà";
  if (hasHome) return "Tại nhà";
  return "Online";
}

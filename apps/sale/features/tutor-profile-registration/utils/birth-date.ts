export const MIN_TUTOR_AGE = 17;

export function getLatestEligibleBirthDate(today = new Date()): Date {
  const limit = new Date(
    today.getFullYear() - MIN_TUTOR_AGE,
    today.getMonth(),
    today.getDate(),
  );
  if (limit.getMonth() !== today.getMonth()) limit.setDate(0);
  return limit;
}

export function parseBirthDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(0);
  parsed.setFullYear(year, month - 1, day);
  parsed.setHours(0, 0, 0, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) return undefined;
  return parsed;
}

export function formatBirthDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isEligibleBirthDate(date: Date, today = new Date()): boolean {
  return date <= getLatestEligibleBirthDate(today);
}

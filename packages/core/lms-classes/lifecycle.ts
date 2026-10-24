import type { ClassSessionDto } from "./schemas";

export function canEditClassAttendance(
  classStatus: string | null | undefined,
  session: ClassSessionDto,
  now: number,
) {
  if (classStatus !== "ACTIVE") return false;
  if (session.status === "ONGOING") return true;
  if (session.status !== "COMPLETED" || !session.actualEndAt) return false;
  const end = Date.parse(session.actualEndAt);
  return Number.isFinite(end) && now >= end && now <= end + 12 * 60 * 60 * 1000;
}
export function vietnamTimeToUtc(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new Error("Nhập ngày giờ Việt Nam hợp lệ.");
  const date = new Date(`${value}:00+07:00`);
  if (!Number.isFinite(date.getTime()))
    throw new Error("Ngày giờ không hợp lệ.");
  return date.toISOString();
}
export function utcToVietnamInput(value: string) {
  const date = new Date(Date.parse(value) + 7 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 16);
}
export function safeExternalUrl(value: string | null | undefined) {
  try {
    if (value && new URL(value).protocol === "https:") return value;
  } catch {
    /* Reject untrusted protocol. */
  }
  return null;
}

/**
 * One spelling per session status. BE names the running state IN_PROGRESS (ONGOING is its alias)
 * and may write CANCELED or CANCELLED; casing and spaces are ignored.
 */
export function normalizeSessionStatus(value: string | null | undefined) {
  const status = value?.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (!status) return value;
  return status === "IN_PROGRESS" ? "ONGOING" : status === "CANCELED" ? "CANCELLED" : status;
}

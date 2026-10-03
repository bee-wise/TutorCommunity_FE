export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSessionTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const hhmm = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `${hhmm} Hôm nay`;
  if (isYesterday) return `${hhmm} Hôm qua`;
  const isSameYear = date.getFullYear() === now.getFullYear();
  const dayMonth = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
  if (isSameYear) return `${hhmm} ${dayMonth}`;
  return `${hhmm} ${dayMonth}/${date.getFullYear()}`;
}

export function shouldShowSessionDivider(
  currentCreatedAt: string,
  prevCreatedAt?: string | null,
  thresholdHours: number = 2,
): boolean {
  if (!prevCreatedAt) return true;
  const curr = new Date(currentCreatedAt).getTime();
  const prev = new Date(prevCreatedAt).getTime();
  if (Number.isNaN(curr) || Number.isNaN(prev)) return false;
  return Math.abs(curr - prev) >= thresholdHours * 60 * 60 * 1000;
}

export function formatWorkspaceTime(value: string, withDate = false): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: withDate ? "2-digit" : undefined,
    month: withDate ? "2-digit" : undefined,
    year: withDate ? "numeric" : undefined,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(-2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "BW"
  );
}

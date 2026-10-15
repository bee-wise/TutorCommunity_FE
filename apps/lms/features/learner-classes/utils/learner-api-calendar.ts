export function vietnamDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
export function monthRange(month: string) {
  const [year, number] = month.split("-").map(Number);
  const end = new Date(Date.UTC(year, number, 1)).toISOString().slice(0, 10);
  return { from: `${month}-01T00:00:00+07:00`, to: `${end}T00:00:00+07:00` };
}
export function nextMonth(month: string, offset: number) {
  const [year, number] = month.split("-").map(Number);
  return new Date(Date.UTC(year, number - 1 + offset, 1))
    .toISOString()
    .slice(0, 7);
}
export function sessionOverlapsDate(
  startAt: string,
  endAt: string,
  date: string,
) {
  const start = Date.parse(`${date}T00:00:00+07:00`);
  return Date.parse(endAt) > start && Date.parse(startAt) < start + 86_400_000;
}
export function displaySessionTime(start: string, end: string) {
  const time = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${time.format(new Date(start))} - ${time.format(new Date(end))}`;
}
export const learnerSessionLabels: Record<string, string> = {
  SCHEDULED: "Chưa bắt đầu",
  ONGOING: "Đang diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
  RESCHEDULED: "Đã đổi lịch",
};

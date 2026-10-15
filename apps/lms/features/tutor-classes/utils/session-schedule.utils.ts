export function calculateSessionEndAt(startAt: string, durationMinutes: number) {
  const start = Date.parse(startAt);
  if (!Number.isFinite(start)) throw new Error("Giờ bắt đầu không hợp lệ.");
  if (!Number.isSafeInteger(durationMinutes) || durationMinutes <= 0)
    throw new Error("Thời lượng mỗi buổi học phải lớn hơn 0 phút.");

  const end = new Date(start + durationMinutes * 60_000);
  if (Number.isNaN(end.getTime()))
    throw new Error("Không tính được giờ kết thúc buổi học.");
  return end.toISOString();
}

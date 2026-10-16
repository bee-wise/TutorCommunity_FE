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

export interface SchedulerSlotRow {
  name?: string;
  description?: string;
  start: string;
  meeting?: string;
  planned?: string;
}

export interface MapSchedulerSlotsOptions {
  isReschedule?: boolean;
  group?: boolean;
  now?: number;
}

export function computeSchedulerSignature(
  slots: unknown[] | undefined,
  durationMinutes: number,
) {
  return JSON.stringify({
    slots: slots ?? [],
    durationMinutes,
  });
}

export function computeIdempotencySignature(payload: unknown) {
  return JSON.stringify(payload);
}

export function parseVietnamTimeToUtc(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new Error("Nhập ngày giờ Việt Nam hợp lệ.");
  const date = new Date(`${value}:00+07:00`);
  if (!Number.isFinite(date.getTime()))
    throw new Error("Ngày giờ không hợp lệ.");
  return date.toISOString();
}

export function mapSchedulerSlots(
  slots: SchedulerSlotRow[],
  durationMinutes: number,
  options?: MapSchedulerSlotsOptions,
) {
  const isReschedule = options?.isReschedule ?? false;
  const group = options?.group ?? false;
  const now = options?.now ?? Date.now();

  return slots.map((s) => {
    const startAt = parseVietnamTimeToUtc(s.start);
    const endAt = calculateSessionEndAt(startAt, durationMinutes);
    if (Date.parse(startAt) < now)
      throw new Error("Giờ bắt đầu không được ở trong quá khứ.");
    if (Date.parse(endAt) < now)
      throw new Error("Giờ kết thúc không được ở trong quá khứ.");
    if (Date.parse(endAt) <= Date.parse(startAt))
      throw new Error("Giờ kết thúc phải sau giờ bắt đầu.");
    if (group && !s.planned && !isReschedule)
      throw new Error("Chọn hoặc tạo lịch dự kiến cho từng buổi GROUP.");

    return {
      ...(isReschedule
        ? {}
        : {
            name: s.name?.trim() ? s.name.trim() : null,
            description: s.description?.trim() ? s.description.trim() : null,
          }),
      startAt,
      endAt,
      locationOrMeetingInfo: s.meeting || null,
      plannedScheduleId: s.planned || null,
    };
  });
}


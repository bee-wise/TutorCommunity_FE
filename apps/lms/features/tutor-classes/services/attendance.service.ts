import { TUTOR_CLASSES, TUTOR_CLASS_SESSIONS } from "../data/classes.mock";
import { attendanceCommandSchema, type AttendanceCommand } from "../types/attendance.schemas";
import type { SessionAttendance } from "../types/classes.types";
import { canMarkAttendance } from "../utils/classes.utils";

// Pure mock boundary. No network request and no claim that data was saved to BE.
export function saveMockAttendance(input: AttendanceCommand, current?: SessionAttendance): SessionAttendance {
  const command = attendanceCommandSchema.parse(input);
  const classInfo = TUTOR_CLASSES.find((item) => item.id === command.classId);
  const session = TUTOR_CLASS_SESSIONS.find((item) => item.id === command.sessionId);
  if (!classInfo || !session || !canMarkAttendance(classInfo, session)) throw new Error("Buổi học này không cho phép chỉnh sửa điểm danh.");
  if ((current?.version ?? 0) !== command.expectedVersion) throw new Error("Điểm danh đã thay đổi. Đóng và mở lại buổi học để tải bản mới nhất.");
  if (command.entries.length !== classInfo.learnerIds.length || command.entries.some((entry) => !classInfo.learnerIds.includes(entry.learnerId))) throw new Error("Danh sách điểm danh không khớp học viên của lớp.");
  if (current && (current.classId !== command.classId || current.sessionId !== command.sessionId)) throw new Error("Bản điểm danh không thuộc buổi học này.");
  if (current?.state === "confirmed" && command.state === "draft") throw new Error("Không thể chuyển điểm danh đã xác nhận về bản nháp.");
  return { classId: command.classId, sessionId: command.sessionId, state: command.state,
    version: command.expectedVersion + 1, entries: command.entries.map((entry) => ({ ...entry })), updatedAt: new Date().toISOString() };
}

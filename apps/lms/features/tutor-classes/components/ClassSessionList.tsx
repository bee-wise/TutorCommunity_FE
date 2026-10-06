"use client";

import { useMemo, useState } from "react";
import { LmsSelect } from "@/components/LmsSelect";
import { actionClass, inputClass, panelClass, primaryActionClass } from "@/components/lms-page-ui";
import { TUTOR_CLASS_SESSIONS } from "../data/classes.mock";
import { useAttendanceStore } from "../store/attendance.store";
import { SESSION_LABELS, type TutorClass, type TutorClassSession } from "../types/classes.types";
import { canMarkAttendance, formatClassDate, normalizeClassSearch } from "../utils/classes.utils";
import { AttendanceStateBadge, SessionStatusBadge } from "./ClassBadges";

export function ClassSessionList({ classInfo, onAttendance }: { classInfo: TutorClass; onAttendance: (session: TutorClassSession) => void }) {
  const records = useAttendanceStore((state) => state.records);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [attendance, setAttendance] = useState("all");
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => TUTOR_CLASS_SESSIONS.filter((session) => session.classId === classInfo.id
    && normalizeClassSearch(`${session.topic} ${session.id}`).includes(normalizeClassSearch(search))
    && (status === "all" || session.status === status)
    && (attendance === "all" || (attendance === "unmarked" ? !records[session.id] : records[session.id]?.state === attendance)))
    .sort((a, b) => b.taughtAt.localeCompare(a.taughtAt)), [classInfo.id, search, status, attendance, records]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  return <section className={`${panelClass} space-y-4`} aria-labelledby="class-sessions-title">
    <div><h2 id="class-sessions-title" className="font-nunito text-lg font-extrabold text-primary">Buổi học & điểm danh</h2><p className="mt-1 text-sm text-muted-foreground">{filtered.length} buổi phù hợp · Giờ Việt Nam</p></div>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-2 sm:col-span-2"><span className="text-sm font-bold">Tìm buổi học</span><input type="search" className={inputClass} value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Nội dung hoặc mã buổi học…" /></label>
      <div className="grid gap-2"><label htmlFor="class-session-status" className="text-sm font-bold">Trạng thái buổi</label><LmsSelect id="class-session-status" value={status} options={[{ value: "all", label: "Tất cả buổi học" }, ...Object.entries(SESSION_LABELS).map(([value, label]) => ({ value, label }))]} onValueChange={(value) => { setStatus(value); setPage(0); }} /></div>
      <div className="grid gap-2"><label htmlFor="class-attendance-state" className="text-sm font-bold">Điểm danh</label><LmsSelect id="class-attendance-state" value={attendance} options={[{ value: "all", label: "Tất cả điểm danh" }, { value: "unmarked", label: "Chưa điểm danh" }, { value: "draft", label: "Bản nháp" }, { value: "confirmed", label: "Đã xác nhận" }]} onValueChange={(value) => { setAttendance(value); setPage(0); }} /></div>
    </div>
    {!filtered.length ? <div className="space-y-3 py-6 text-center"><p className="text-sm text-muted-foreground">Không có buổi học phù hợp.</p><button type="button" className={actionClass} onClick={() => { setSearch(""); setStatus("all"); setAttendance("all"); setPage(0); }}>Đặt lại bộ lọc</button></div> : <div className="divide-y divide-border">{filtered.slice(currentPage * 6, (currentPage + 1) * 6).map((session) => <article key={session.id} className="space-y-3 py-4">
      <div className="flex flex-wrap gap-2"><SessionStatusBadge status={session.status} /><AttendanceStateBadge record={records[session.id]} /></div>
      <h3 className="font-nunito text-lg font-extrabold leading-relaxed text-primary">{session.topic}</h3>
      <p className="text-sm text-muted-foreground">{formatClassDate(session.taughtAt)} · {session.durationMinutes} phút</p>
      <p className="break-all text-xs text-muted-foreground">Mã buổi: {session.id}</p>
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{records[session.id] ? `Cập nhật ${formatClassDate(records[session.id].updatedAt)}` : "Chưa có dữ liệu điểm danh"}</span><button type="button" onClick={() => onAttendance(session)} className={canMarkAttendance(classInfo, session) ? primaryActionClass : actionClass}>{canMarkAttendance(classInfo, session) ? records[session.id]?.state === "confirmed" ? "Chỉnh sửa điểm danh" : "Điểm danh" : "Xem điểm danh"}</button></div>
    </article>)}</div>}
    {pageCount > 1 && <nav aria-label="Phân trang buổi học" className="flex items-center justify-end gap-3"><button type="button" className={actionClass} disabled={!currentPage} onClick={() => setPage(currentPage - 1)}>Trước</button><span aria-live="polite" className="text-sm text-muted-foreground">{currentPage + 1} / {pageCount}</span><button type="button" className={actionClass} disabled={currentPage + 1 === pageCount} onClick={() => setPage(currentPage + 1)}>Sau</button></nav>}
  </section>;
}

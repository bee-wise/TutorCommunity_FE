"use client";

import { EyeIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { LmsStatusBadge } from "@/components/LmsStatusBadge";
import { LMS_SESSION_STATUS } from "@/components/lms-session-status";
import type { Session } from "../types/schedule.types";

interface ListViewProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
}

const HEADERS = ["Mã lớp", "Môn học", "Học viên", "Thời gian", "Học phí", "Phòng học", "Trạng thái", "Thao tác"];

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatFee(fee?: number): string {
  if (fee == null) return "—";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(fee);
}

function SessionStatus({ session }: { session: Session }) {
  const status = LMS_SESSION_STATUS[session.status];
  return <LmsStatusBadge status={status.tone} label={status.label} />;
}

function RoomCell({ session, onSessionClick }: { session: Session; onSessionClick: (session: Session) => void }) {
  if (session.source === "PLANNED") return <span className="text-xs font-medium italic text-muted-foreground">Lịch dự kiến</span>;
  if (session.status === "IN_PROGRESS") {
    return (
      <Button type="button" size="sm" className="min-h-11 text-xs" onClick={() => onSessionClick(session)}>
        <VideoCameraIcon className="size-3.5" aria-hidden="true" />
        Vào phòng
      </Button>
    );
  }
  if (session.status === "UPCOMING") return <span className="text-xs font-medium text-muted-foreground">Chưa đến giờ</span>;
  return <span className="text-xs text-muted-foreground">—</span>;
}

export function ListView({ sessions, onSessionClick }: ListViewProps) {
  if (sessions.length === 0) {
    return <EmptyState imageAlt="" title="Không có buổi học nào phù hợp" description="Thử thay đổi bộ lọc để xem thêm kết quả." />;
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft" aria-label="Danh sách buổi dạy">
      {/* Phones: one card per session; the whole card opens the detail sheet. */}
      <ul className="divide-y divide-border md:hidden">
        {sessions.map((session) => (
          <li key={session.id}>
            <button type="button" onClick={() => onSessionClick(session)} className="block min-h-11 w-full space-y-2 px-4 py-4 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold tabular-nums">{formatDate(session.date)} · {session.startTime} – {session.endTime}</span>
                <SessionStatus session={session} />
              </span>
              <span className="block text-sm font-bold">{session.subject}{session.subjectLevel ? ` ${session.subjectLevel}` : ""}</span>
              <span className="block text-xs text-muted-foreground">{session.studentFullName}{session.source === "PLANNED" ? " · Lịch dự kiến" : ""}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              {HEADERS.map((header, index) => (
                <th key={header} scope="col" className={`whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground ${index === HEADERS.length - 1 ? "text-right" : "text-left"}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sessions.map((session) => (
              <tr key={session.id} className="transition-colors hover:bg-muted">
                <td className="whitespace-nowrap px-4 py-3.5"><span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">{session.classCode ?? session.classId.slice(0, 8)}</span></td>
                <td className="whitespace-nowrap px-4 py-3.5"><span className="font-bold">{session.subject}</span><span className="ml-1 text-xs text-muted-foreground">{session.subjectLevel}</span></td>
                <td className="whitespace-nowrap px-4 py-3.5 font-medium">{session.studentFullName}</td>
                <td className="whitespace-nowrap px-4 py-3.5"><p className="font-medium tabular-nums">{formatDate(session.date)}</p><p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{session.startTime} – {session.endTime}</p></td>
                <td className="whitespace-nowrap px-4 py-3.5 font-bold tabular-nums">{formatFee(session.feeVnd)}</td>
                <td className="whitespace-nowrap px-4 py-3.5"><RoomCell session={session} onSessionClick={onSessionClick} /></td>
                <td className="whitespace-nowrap px-4 py-3.5"><SessionStatus session={session} /></td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right">
                  <Button type="button" variant="outline" size="sm" className="min-h-11 text-xs" onClick={() => onSessionClick(session)}>
                    <EyeIcon className="size-3.5" aria-hidden="true" />
                    Chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
        Hiển thị <span className="font-bold text-foreground">{sessions.length}</span> buổi học
      </p>
    </section>
  );
}

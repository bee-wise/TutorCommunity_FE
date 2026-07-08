"use client";

import { ExternalLink, Eye } from "lucide-react";
import { cn } from "@/src/helpers/utils";
import type { Session } from "../types/schedule.types";
import { STATUS_COLORS, STATUS_LABELS } from "../types/schedule.types";

interface ListViewProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
}

function StatusBadge({ status }: { status: Session["status"] }) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        colors.bg,
        colors.text,
        colors.border,
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", colors.dot)} />
      {STATUS_LABELS[status]}
    </span>
  );
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatFee(fee: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(fee);
}

export function ListView({ sessions, onSessionClick }: ListViewProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center">
            <Eye className="size-7 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">
            Không có buổi học nào phù hợp
          </p>
          <p className="text-xs text-muted-foreground/70">
            Thử thay đổi bộ lọc để xem thêm kết quả.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Sticky header */}
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Mã lớp
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Môn học
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Học viên
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Thời gian
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Học phí
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Phòng học
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Trạng thái
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="group transition-colors duration-100 hover:bg-muted/30 cursor-pointer"
                onClick={() => onSessionClick(session)}
              >
                {/* Class ID */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    {session.classId}
                  </span>
                </td>

                {/* Subject */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-semibold text-foreground">
                    {session.subject}
                  </span>
                  <span className="text-muted-foreground ml-1 text-xs">
                    {session.subjectLevel}
                  </span>
                </td>

                {/* Student */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-[#cfe1fa] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#280f91]">
                        {session.studentFullName.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-foreground text-sm">
                      {session.studentFullName}
                    </span>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <p className="font-medium text-foreground">
                    {formatDate(session.date)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session.startTime} – {session.endTime}
                  </p>
                </td>

                {/* Fee */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-semibold text-foreground text-sm">
                    {formatFee(session.feeVnd)}
                  </span>
                </td>

                {/* Classroom Link */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {session.status !== "CANCELED" ? (
                    <a
                      href={session.classroomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#cfe1fa]/60 text-[#280f91] text-xs font-semibold hover:bg-[#280f91] hover:text-white transition-colors border border-[#280f91]/20"
                    >
                      <ExternalLink className="size-3" strokeWidth={2} />
                      Meet
                    </a>
                  ) : (
                    <span className="text-muted-foreground/40 text-xs">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <StatusBadge status={session.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSessionClick(session);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground border border-border/50 hover:bg-[#280f91] hover:text-white hover:border-[#280f91] transition-all duration-150"
                  >
                    <Eye className="size-3.5" strokeWidth={1.75} />
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/40 bg-muted/20 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Hiển thị{" "}
          <span className="font-semibold text-foreground">{sessions.length}</span>{" "}
          buổi học
        </p>
      </div>
    </div>
  );
}

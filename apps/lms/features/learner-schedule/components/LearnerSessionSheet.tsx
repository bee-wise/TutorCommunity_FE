"use client";

import {
  VideoCameraIcon as VideoCamera,
  ExclamationTriangleIcon as Warning,
  XMarkIcon as X,
} from "@heroicons/react/24/outline";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/ui/sheet";
import type { LearnerSession } from "../types/learner-schedule.types";
import { LEARNER_STATUS_LABELS } from "../types/learner-schedule.types";
import { formatLearnerSessionDate } from "../utils/calendar.utils";

const STATUS_CLASS = {
  UPCOMING: "border-accent/40 bg-accent/15 text-warning",
  COMPLETED: "border-secondary/25 bg-secondary/10 text-foreground",
  CANCELED: "border-error/60 bg-error/18 text-destructive",
} as const;

interface LearnerSessionSheetProps {
  session: LearnerSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelRequest: (session: LearnerSession) => void;
}

export function LearnerSessionSheet({
  session,
  open,
  onOpenChange,
  onCancelRequest,
}: LearnerSessionSheetProps) {
  if (!session) return null;
  const isUpcoming = session.status === "UPCOMING";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col border-l border-border bg-card p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border bg-muted/25 px-5 py-5 text-left sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_CLASS[session.status]}`}
              >
                {LEARNER_STATUS_LABELS[session.status]}
              </span>
              <SheetTitle className="mt-3 text-xl font-extrabold">
                {session.subject} - {session.topic}
              </SheetTitle>
              <SheetDescription className="mt-1">
                {session.level}
              </SheetDescription>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Đóng chi tiết"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-card"
            >
              <X width={17} height={17} />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3 rounded-xl border border-border p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-sm font-extrabold text-white">
              {session.tutorInitials}
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Gia sư phụ trách</p>
              <p className="mt-0.5 font-extrabold">{session.tutorName}</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem
              label="Ngày học"
              value={formatLearnerSessionDate(session.date)}
            />
            <InfoItem
              label="Khung giờ"
              value={`${session.startTime} - ${session.endTime}`}
            />
            <InfoItem label="Mã lớp" value={session.classCode} />
            <InfoItem label="Tư vấn viên" value={session.consultantName} />
          </dl>

          {session.notes && (
            <div className="mt-5 rounded-xl border border-accent/30 bg-accent/10 p-4">
              <p className="text-xs font-bold text-warning">Ghi chú chuẩn bị</p>
              <p className="mt-1.5 text-sm leading-6 text-foreground">
                {session.notes}
              </p>
            </div>
          )}

          {session.cancellation ? (
            <div className="mt-5 rounded-xl border border-error/60 bg-destructive/10 p-4">
              <p className="text-xs font-bold text-destructive">
                Lý do học viên hủy lịch
              </p>
              <p className="mt-1.5 text-sm leading-6 text-foreground">
                {session.cancellation.reasonText}
              </p>
            </div>
          ) : null}
        </div>

        <div className="border-t border-border p-5 sm:px-6">
          {isUpcoming ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-highlight bg-accent/15 p-3 text-warning">
                <div className="flex items-center gap-1.5 text-xs font-extrabold">
                  <Warning width={16} height={16} />
                  Lưu ý học phí
                </div>
                <p className="mt-1 text-xs leading-5">
                  Tự nguyện hủy lịch có thể làm mất học phí của buổi này. Nếu
                  cần đổi lịch, hãy liên hệ tư vấn viên {session.consultantName}
                  .
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onCancelRequest(session)}
                  className="h-11 rounded-xl border border-destructive/50 text-sm font-bold text-destructive hover:bg-destructive/10"
                >
                  Hủy lịch học
                </button>
                <a
                  href={session.classroomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white transition-colors hover:bg-primary/90 active:scale-[0.98]"
                >
                  <VideoCamera width={18} height={18} /> Vào lớp học
                </a>
              </div>
            </div>
          ) : (
            <p className="rounded-xl bg-muted px-4 py-3 text-center text-sm font-semibold text-muted-foreground">
              {session.status === "COMPLETED"
                ? "Buổi học đã hoàn thành"
                : "Buổi học đã được hủy"}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-foreground">{value}</dd>
    </div>
  );
}

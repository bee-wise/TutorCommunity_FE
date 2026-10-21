"use client";

import Image from "next/image";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { LmsDateTile, type LmsDateTileTone } from "../../../components/LmsDateTile";
import { statusTone } from "../../../components/lms-status";
import { ClassPagination } from "../../tutor-classes/components/ClassPagination";
import {
  learnerSessionLabels,
  vietnamDate,
} from "../utils/learner-api-calendar";
import { learnerAction } from "./LearnerApiClassCard";

const BEE_FLOWER =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_360/v1790760176/bee-flower.png";

const TIME_ZONE = "Asia/Ho_Chi_Minh";
const TILE_TONE: Record<string, LmsDateTileTone> = {
  SCHEDULED: "accent",
  ONGOING: "primary",
  COMPLETED: "secondary",
};

function clock(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "--:--"
    : new Intl.DateTimeFormat("vi-VN", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

interface LearnerActualSessionListProps {
  items: ClassSessionDto[];
  total: number;
  page: number;
  pageSize: number;
  isCustom: boolean;
  onSelectSession: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function LearnerActualSessionList({
  items,
  total,
  page,
  pageSize,
  isCustom,
  onSelectSession,
  onPageChange,
}: LearnerActualSessionListProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section aria-label="Buổi học thực tế" className="space-y-4">
      <p role="status" className="px-1 text-xs font-semibold text-muted-foreground">
        {total} {isCustom ? "buổi học trong khoảng thời gian đã chọn" : "buổi trong tháng"} · Giờ Việt Nam
      </p>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((session) => {
            const isOngoing = session.status === "ONGOING";
            const isCancelled = session.status === "CANCELLED";
            const online = Boolean(session.locationOrMeetingInfo?.startsWith("http")) || session.teachingMode === "ONLINE";

            return (
              <article
                key={session.id}
                className={`flex flex-col gap-4 rounded-3xl border bg-card p-4 shadow-soft sm:flex-row sm:p-5 ${
                  isOngoing ? "border-primary" : "border-border"
                } ${isCancelled ? "opacity-80" : ""}`}
              >
                <LmsDateTile value={session.startAt} tone={TILE_TONE[session.status ?? ""] ?? "muted"} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-lms text-base font-extrabold leading-snug text-foreground sm:text-lg [overflow-wrap:anywhere]">
                        {session.name ? session.name : vietnamDate(session.startAt).split("-").reverse().join("/")}
                      </h2>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-extrabold tabular-nums text-foreground">
                          <ClockIcon className="size-4 text-primary" aria-hidden="true" />
                          {clock(session.startAt)} – {clock(session.endAt)}
                        </span>
                        <span className="font-semibold">{session.durationMinutes} phút</span>
                      </p>
                    </div>
                    <SessionStatus status={session.status} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold ${online ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                      {online ? <VideoCameraIcon className="size-3.5" aria-hidden="true" /> : <MapPinIcon className="size-3.5" aria-hidden="true" />}
                      {online ? "Trực tuyến" : "Trực tiếp"}
                    </span>
                    {session.teachingItemName && (
                      <span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">{session.teachingItemName}</span>
                    )}
                    {session.tutorName && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">
                        <span className="grid size-4 place-items-center rounded-full bg-primary text-[9px] font-extrabold text-primary-foreground" aria-hidden="true">
                          {session.tutorName.trim().charAt(0).toUpperCase()}
                        </span>
                        {session.tutorName}
                      </span>
                    )}
                  </div>

                  {session.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground [overflow-wrap:anywhere]">{session.description}</p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    {session.locationOrMeetingInfo ? (
                      session.locationOrMeetingInfo.startsWith("http") ? (
                        <a
                          href={session.locationOrMeetingInfo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-primary bg-card px-3.5 text-xs font-bold text-primary transition-all hover:bg-muted active:scale-[0.98]"
                        >
                          <VideoCameraIcon className="size-4 shrink-0" aria-hidden="true" />
                          <span>Vào phòng học trực tuyến</span>
                          <ArrowRightIcon className="size-3.5 shrink-0" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground [overflow-wrap:anywhere]">
                          <MapPinIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                          {session.locationOrMeetingInfo}
                        </span>
                      )
                    ) : (
                      <span />
                    )}
                    <Button
                      variant={isOngoing ? "default" : "outline"}
                      className={`${learnerAction} shrink-0 px-5 text-xs font-bold`}
                      onClick={() => onSelectSession(session.id)}
                    >
                      Xem buổi học
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptySessions isCustom={isCustom} />
      )}

      <ClassPagination
        page={page - 1}
        pageCount={pageCount}
        label="Phân trang buổi học"
        onPageChange={(p) => onPageChange(p + 1)}
      />
    </section>
  );
}

function SessionStatus({ status }: { status: string | null | undefined }) {
  const isOngoing = status === "ONGOING";
  const isCompleted = status === "COMPLETED";

  const tone = isOngoing
    ? `border ${statusTone.active}`
    : isCompleted
      ? `border ${statusTone.done}`
      : status === "CANCELLED"
        ? `border ${statusTone.cancelled}`
        : status === "SCHEDULED"
          ? `border ${statusTone.pending}`
          : `border ${statusTone.planned}`;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}>
      {isOngoing && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
      )}
      {isCompleted && <CheckCircleIcon className="size-3.5 text-secondary" aria-hidden="true" />}
      {learnerSessionLabels[status ?? ""] ?? "Chưa xác định"}
    </span>
  );
}

function EmptySessions({ isCustom = false }: { isCustom?: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center shadow-2xs">
      <Image src={BEE_FLOWER} alt="Ong BeeWise bay tới một bông hoa" width={180} height={180} className="h-auto w-40" />
      <h3 className="mt-3 font-lms text-base font-extrabold text-foreground">Không có buổi học phù hợp</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {isCustom
          ? "Không tìm thấy buổi học nào trong khoảng thời gian đã chọn theo bộ lọc hiện tại."
          : "Không tìm thấy buổi học nào trong tháng này theo bộ lọc hiện tại."}
      </p>
    </div>
  );
}

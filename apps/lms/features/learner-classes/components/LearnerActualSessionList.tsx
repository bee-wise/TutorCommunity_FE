"use client";

import { statusTone } from "../../../components/lms-status";

import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  MapPinIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { ClassSessionDto } from "@workspace/core/lms-classes/schemas";
import { ClassPagination } from "../../tutor-classes/components/ClassPagination";
import {
  learnerSessionLabels,
  vietnamDate,
  displaySessionTime,
} from "../utils/learner-api-calendar";
import { learnerAction } from "./LearnerApiClassCard";

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
    <section aria-label="Buổi học thực tế" className="space-y-6">
      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <p role="status" className="font-semibold">
          {total}{" "}
          {isCustom
            ? "buổi học trong khoảng thời gian đã chọn"
            : "buổi trong tháng"}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          {items.map((session) => {
            const isOngoing = session.status === "ONGOING";
            const isCompleted = session.status === "COMPLETED";

            return (
              <article
                key={session.id}
                className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                  isOngoing ? "bg-muted" : "hover:bg-muted/30"
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                      isOngoing
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-secondary/15 text-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <CalendarDaysIcon className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-lms text-base font-extrabold text-foreground [overflow-wrap:anywhere] break-words">
                        {session.name
                          ? session.name
                          : vietnamDate(session.startAt)
                              .split("-")
                              .reverse()
                              .join("/")}
                      </h2>
                      <SessionStatus status={session.status} />
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold tabular-nums text-foreground">
                      {session.name && (
                        <>
                          <span className="font-medium text-muted-foreground">
                            {vietnamDate(session.startAt)
                              .split("-")
                              .reverse()
                              .join("/")}
                          </span>
                          <span className="font-normal text-muted-foreground">
                            ·
                          </span>
                        </>
                      )}
                      <span>
                        {displaySessionTime(session.startAt, session.endAt)}
                      </span>
                      <span className="font-normal text-muted-foreground">
                        · {session.durationMinutes} phút
                      </span>
                      <span className="font-normal text-muted-foreground">
                        ·
                      </span>
                      <span className="font-medium text-muted-foreground">
                        {session.teachingItemName ?? "Chưa có môn học"}
                      </span>
                      <span className="font-normal text-muted-foreground">
                        ·
                      </span>
                      <span className="font-medium text-muted-foreground">
                        {session.tutorName
                          ? `Gia sư: ${session.tutorName}`
                          : "Chưa có thông tin gia sư"}
                      </span>
                    </div>

                    {session.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                        {session.description}
                      </p>
                    )}

                    {session.locationOrMeetingInfo && (
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                        {session.locationOrMeetingInfo.startsWith("http") ? (
                          <a
                            href={session.locationOrMeetingInfo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-primary transition-colors hover:text-primary/80"
                          >
                            <VideoCameraIcon
                              className="size-4 shrink-0"
                              aria-hidden="true"
                            />
                            <span>Phòng học trực tuyến</span>
                            <ArrowRightIcon
                              className="size-3.5 shrink-0"
                              aria-hidden="true"
                            />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground [overflow-wrap:anywhere]">
                            <MapPinIcon
                              className="size-4 shrink-0 text-primary"
                              aria-hidden="true"
                            />
                            <span>{session.locationOrMeetingInfo}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant={isOngoing ? "default" : "outline"}
                  className={`${learnerAction} shrink-0 font-bold shadow-2xs hover:bg-muted`}
                  onClick={() => onSelectSession(session.id)}
                >
                  Xem buổi học
                </Button>
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
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${tone}`}
    >
      {isOngoing && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
      )}
      {isCompleted && (
        <CheckCircleIcon
          className="size-3.5 text-secondary"
          aria-hidden="true"
        />
      )}
      {learnerSessionLabels[status ?? ""] ?? "Chưa xác định"}
    </span>
  );
}

function EmptySessions({ isCustom = false }: { isCustom?: boolean }) {
  return (
    <div className="space-y-3 rounded-3xl border border-dashed border-border bg-card p-8 text-center shadow-2xs">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <CalendarDaysIcon
          className="size-6 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-lms text-base font-extrabold text-foreground">
          Không có buổi học phù hợp
        </h3>
        <p className="text-sm text-muted-foreground">
          {isCustom
            ? "Không tìm thấy buổi học nào trong khoảng thời gian đã chọn theo bộ lọc hiện tại."
            : "Không tìm thấy buổi học nào trong tháng này theo bộ lọc hiện tại."}
        </p>
      </div>
    </div>
  );
}

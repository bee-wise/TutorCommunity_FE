"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  MapPinIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { ClassFilterSelect } from "../../tutor-classes/components/ClassFilterSelect";
import { ClassPagination } from "../../tutor-classes/components/ClassPagination";
import { LearnerClassQueryError } from "./LearnerClassQueryError";
import { useLearnerSessionsQuery } from "../hooks/useLearnerSessionsQuery";
import {
  learnerSessionLabels,
  vietnamDate,
  displaySessionTime,
} from "../utils/learner-api-calendar";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";
import { learnerAction, LearnerClassStatus } from "./LearnerApiClassCard";

const Details = dynamic(() =>
  import("./LearnerSessionDetailDialog").then(
    (m) => m.LearnerSessionDetailDialog,
  ),
);

const groups = [
  {
    id: "upcoming",
    title: "Đang diễn ra & sắp tới",
    statuses: ["ONGOING", "SCHEDULED"],
  },
  { id: "completed", title: "Đã hoàn thành", statuses: ["COMPLETED"] },
  {
    id: "other",
    title: "Các buổi khác",
    statuses: ["CANCELLED", "RESCHEDULED"],
  },
];

export function LearnerClassSessionsScreen({ classId }: { classId: string }) {
  const listing = useLearnerSessionsQuery(classId);
  const [selected, setSelected] = useState("");
  const { overview, actual, planned, view } = listing;

  if (overview.loading) return <LearnerWorkspaceSkeleton view="sessions" />;
  if (overview.error || !overview.data)
    return (
      <LearnerClassQueryError
        error={overview.error}
        onRetry={() => void overview.refetch()}
        detail
      />
    );

  const data = overview.data;
  const query = view === "planned" ? planned : actual;

  return (
    <div className="mx-auto max-w-[1300px] space-y-6 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      {/* Header Area */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-card px-3 py-0.5 font-mono text-xs font-bold text-muted-foreground shadow-2xs">
              {data.code ?? data.id}
            </span>
            <LearnerClassStatus status={data.status} />
            <span className="inline-flex rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-bold text-foreground shadow-2xs">
              {data.type === "GROUP"
                ? "Lớp nhóm"
                : data.type === "INDIVIDUAL"
                  ? "Lớp 1:1"
                  : "Chưa xác định loại lớp"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link href={"/lms/learner/classes/" + classId}>
                <InformationCircleIcon className="size-4" aria-hidden="true" />
                <span>Thông tin lớp</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-10 rounded-xl border-border bg-card px-3.5 text-xs font-bold text-foreground hover:bg-muted transition-all active:scale-[0.98]"
            >
              <Link href={"/lms/learner/chat/classes/" + classId}>
                <ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" />
                <span>Tin nhắn lớp</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <h1 className="font-lms text-2xl font-extrabold sm:text-3xl">
              Buổi học
            </h1>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              {data.title ?? data.code}
              {data.teachingItemName ? ` · ${data.teachingItemName}` : ""}
            </p>
          </div>

          <div role="group" aria-label="Cách xem buổi học" className="flex gap-2">
            {(["list", "planned"] as const).map((value) => (
              <Button
                key={value}
                className={`${learnerAction} ${view === value ? "shadow-soft font-bold" : ""}`}
                aria-pressed={view === value}
                variant={view === value ? "default" : "outline"}
                onClick={() => listing.changeView(value)}
              >
                {value === "list" ? "Buổi học thực tế" : "Lịch dự kiến"}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Filter toolbar when viewing actual sessions */}
      {view === "list" && (
        <section
          aria-label="Bộ lọc buổi học"
          className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-soft"
        >
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-foreground">Thời gian · giờ Việt Nam</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className={`${learnerAction} size-10 p-0`}
                aria-label="Tháng trước"
                onClick={() => listing.changeMonth(-1)}
              >
                <ChevronLeftIcon className="size-4" aria-hidden="true" />
              </Button>
              <span className="min-w-28 text-center text-sm font-extrabold tabular-nums">
                Tháng {listing.month.split("-").reverse().join("/")}
              </span>
              <Button
                variant="outline"
                className={`${learnerAction} size-10 p-0`}
                aria-label="Tháng sau"
                onClick={() => listing.changeMonth(1)}
              >
                <ChevronRightIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <label className="grid w-full gap-1.5 text-xs font-bold text-foreground sm:w-60">
            <span>Trạng thái buổi</span>
            <ClassFilterSelect
              value={listing.status}
              onValueChange={(value) =>
                listing.changeStatus(
                  Object.hasOwn(learnerSessionLabels, value)
                    ? (value as typeof listing.status)
                    : "all",
                )
              }
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                ...Object.entries(learnerSessionLabels).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
            />
          </label>
        </section>
      )}

      {query.loading ? (
        <LearnerWorkspaceSkeleton view="sessions" />
      ) : query.error ? (
        <LearnerClassQueryError
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : view === "planned" ? (
        <section aria-label="Lịch dự kiến" className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
            <CalendarDaysIcon className="size-5 shrink-0 text-warning" aria-hidden="true" />
            <p>
              Lịch dự kiến chưa phải buổi học thực tế, không dùng để điểm danh hay truy cập bản ghi.
            </p>
          </div>

          {(planned.data?.length ?? 0) > 0 && (
            <div className="divide-y divide-border rounded-3xl border border-border bg-card px-5 shadow-soft">
              {[...(planned.data ?? [])]
                .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))
                .map((session, index) => (
                  <article
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted font-mono text-xs font-extrabold text-muted-foreground">
                        #{index + 1}
                      </span>
                      <div>
                        <h2 className="font-lms text-base font-extrabold text-foreground">
                          {vietnamDate(session.startAt).split("-").reverse().join("/")}
                        </h2>
                        <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                          {displaySessionTime(session.startAt, session.endAt)}
                        </p>
                      </div>
                    </div>
                    <SessionStatus status={session.status} />
                  </article>
                ))}
            </div>
          )}
          {!planned.data?.length && <EmptySessions planned />}
        </section>
      ) : (
        <section aria-label="Buổi học thực tế" className="space-y-6">
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <p role="status" className="font-semibold">
              {actual.data?.total ?? 0} buổi trong tháng · Nhóm theo trạng thái trên trang hiện tại
            </p>
          </div>

          {groups.map((group) => {
            const sessions = (actual.data?.items ?? [])
              .filter((session) =>
                group.id === "other"
                  ? !["ONGOING", "SCHEDULED", "COMPLETED"].includes(
                      session.status ?? "",
                    )
                  : group.statuses.includes(session.status ?? ""),
              )
              .sort((a, b) =>
                group.id === "completed"
                  ? Date.parse(b.startAt) - Date.parse(a.startAt)
                  : Date.parse(a.startAt) - Date.parse(b.startAt),
              );

            return (
              sessions.length > 0 && (
                <section
                  key={group.id}
                  aria-label={group.title}
                  className="space-y-3"
                >
                  <h2 className="text-base font-extrabold">{group.title}</h2>
                  <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                    {sessions.map((session) => {
                      const isOngoing = session.status === "ONGOING";
                      const isCompleted = session.status === "COMPLETED";

                      return (
                        <article
                          key={session.id}
                          className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition-colors ${
                            isOngoing ? "bg-primary/5" : "hover:bg-muted/30"
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
                              <CalendarDaysIcon
                                className="size-5"
                                aria-hidden="true"
                              />
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-lms text-base font-extrabold text-foreground [overflow-wrap:anywhere] break-words">
                                  {session.name
                                    ? session.name
                                    : vietnamDate(session.startAt)
                                        .split("-")
                                        .reverse()
                                        .join("/")}
                                </h3>
                                <SessionStatus status={session.status} />
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold tabular-nums text-foreground">
                                {session.name && (
                                  <>
                                    <span className="font-medium text-muted-foreground">
                                      {vietnamDate(session.startAt)
                                        .split("-")
                                        .reverse()
                                        .join("/")}
                                    </span>
                                    <span className="font-normal text-muted-foreground">·</span>
                                  </>
                                )}
                                <span>{displaySessionTime(session.startAt, session.endAt)}</span>
                                <span className="font-normal text-muted-foreground">
                                  · {session.durationMinutes} phút
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
                                      <ArrowTopRightOnSquareIcon
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
                            onClick={() => setSelected(session.id)}
                          >
                            Xem buổi học
                          </Button>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )
            );
          })}

          {!actual.data?.items.length && <EmptySessions />}

          <ClassPagination
            page={listing.page - 1}
            pageCount={Math.max(
              1,
              Math.ceil((actual.data?.total ?? 0) / (actual.data?.pageSize ?? 6)),
            )}
            label="Phân trang buổi học"
            onPageChange={(page) => listing.setPage(page + 1)}
          />
        </section>
      )}

      {selected && (
        <Details
          key={classId + ":" + selected}
          classId={classId}
          sessionId={selected}
          group={data.type === "GROUP"}
          attendanceEnabled={data.features.attendance}
          onClose={() => setSelected("")}
        />
      )}
    </div>
  );
}

function SessionStatus({ status }: { status: string | null | undefined }) {
  const isOngoing = status === "ONGOING";
  const isCompleted = status === "COMPLETED";

  const tone = isOngoing
    ? "border border-primary/30 bg-primary/10 text-primary"
    : isCompleted
      ? "border border-secondary/30 bg-secondary/15 text-foreground"
      : status === "CANCELLED"
        ? "border border-destructive/30 bg-destructive/10 text-destructive"
        : status === "SCHEDULED"
          ? "border border-accent/40 bg-accent/20 text-warning"
          : "border border-border bg-muted text-muted-foreground";

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
        <CheckCircleIcon className="size-3.5 text-secondary" aria-hidden="true" />
      )}
      {learnerSessionLabels[status ?? ""] ?? "Chưa xác định"}
    </span>
  );
}

function EmptySessions({ planned = false }: { planned?: boolean }) {
  return (
    <div className="space-y-3 rounded-3xl border border-dashed border-border bg-card p-8 text-center shadow-2xs">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <CalendarDaysIcon className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="font-lms text-base font-extrabold text-foreground">
          {planned ? "Chưa có lịch dự kiến" : "Không có buổi học phù hợp"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {planned
            ? "Lớp học chưa được thiết lập lịch học dự kiến."
            : "Không tìm thấy buổi học nào trong tháng này theo bộ lọc hiện tại."}
        </p>
      </div>
    </div>
  );
}
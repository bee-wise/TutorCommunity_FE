"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { LmsClassHeader } from "../../../components/LmsClassHeader";
import { getClassKindLabel, getClassNaming } from "../../../components/lms-class-naming";
import { LearnerClassQueryError } from "./LearnerClassQueryError";
import { useLearnerSessionsQuery } from "../hooks/useLearnerSessionsQuery";
import {
  vietnamDate,
  displaySessionTime,
} from "../utils/learner-api-calendar";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";
import { learnerAction, LearnerClassStatus } from "./LearnerApiClassCard";
import { LearnerSessionFilterBar } from "./LearnerSessionFilterBar";
import { LearnerActualSessionList } from "./LearnerActualSessionList";

const Details = dynamic(() =>
  import("./LearnerSessionDetailDialog").then(
    (m) => m.LearnerSessionDetailDialog,
  ),
);

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
  const naming = getClassNaming(data);
  const query = view === "planned" ? planned : actual;

  return (
    <div className="mx-auto max-w-[1300px] space-y-6 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <LmsClassHeader
        field={naming.field}
        subject={naming.subject}
        name={naming.name}
        level={naming.level}
        badges={
          <>
            <LearnerClassStatus status={data.status} />
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold">{getClassKindLabel(data.type)}</span>
          </>
        }
        actions={
          <>
            <Button asChild variant="outline" className="min-h-11">
              <Link href={"/lms/learner/classes/" + classId}><InformationCircleIcon className="size-4" aria-hidden="true" />Thông tin lớp</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link href={"/lms/learner/chat/classes/" + classId}><ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" />Tin nhắn lớp</Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-lms text-xl font-extrabold">Buổi học</h2>
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

      {/* Filter toolbar when viewing actual sessions */}
      {view === "list" && (
        <LearnerSessionFilterBar
          month={listing.month}
          isCustom={listing.isCustom}
          status={listing.status}
          onChangeMonth={listing.changeMonth}
          onApplyCustomRange={listing.applyCustomRange}
          onResetMonthPreset={listing.resetMonthPreset}
          onChangeStatus={listing.changeStatus}
        />
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
                    <span className="inline-flex rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground">
                      {session.status ?? "Dự kiến"}
                    </span>
                  </article>
                ))}
            </div>
          )}
          {!planned.data?.length && (
            <div className="space-y-3 rounded-3xl border border-dashed border-border bg-card p-8 text-center shadow-2xs">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <CalendarDaysIcon className="size-6 text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="font-lms text-base font-extrabold text-foreground">
                  Chưa có lịch dự kiến
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lớp học chưa được thiết lập lịch học dự kiến.
                </p>
              </div>
            </div>
          )}
        </section>
      ) : (
        <LearnerActualSessionList
          items={actual.data?.items ?? []}
          total={actual.data?.total ?? 0}
          page={listing.page}
          pageSize={actual.data?.pageSize ?? 6}
          isCustom={listing.isCustom}
          onSelectSession={setSelected}
          onPageChange={listing.setPage}
        />
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
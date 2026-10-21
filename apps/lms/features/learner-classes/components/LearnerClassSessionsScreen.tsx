"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { LmsDateTile } from "../../../components/LmsDateTile";
import { LmsHeroBanner, LmsHeroProgress } from "../../../components/LmsHeroBanner";
import { useLearnerClassProgress } from "../hooks/useLearnerClassProgress";
import { LearnerClassQueryError } from "./LearnerClassQueryError";
import { useLearnerSessionsQuery } from "../hooks/useLearnerSessionsQuery";
import {
  vietnamDate,
  displaySessionTime,
} from "../utils/learner-api-calendar";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";
import { LearnerSessionFilterBar } from "./LearnerSessionFilterBar";
import { LearnerActualSessionList } from "./LearnerActualSessionList";

const BEE_MEDITATE = "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_360/v1789966153/8.png";

function LearnerSessionsHero({ classId, planned, created, attendance }: { classId: string; planned: number; created: number; attendance: boolean }) {
  const progress = useLearnerClassProgress(classId);
  const completed = progress.data?.total ?? 0;
  return (
    <LmsHeroBanner title="Buổi học" description={attendance ? "Theo dõi lịch học, phòng học và điểm danh của từng buổi." : "Theo dõi lịch học và phòng học của từng buổi."} mascot="pencil">
      <LmsHeroProgress
        label="Buổi đã hoàn thành so với kế hoạch"
        value={completed}
        max={planned}
        note={`${created} buổi đã được xếp lịch`}
      />
    </LmsHeroBanner>
  );
}

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
  const query = view === "planned" ? planned : actual;

  return (
    <div className="mx-auto max-w-[1300px] space-y-6 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <LearnerSessionsHero classId={classId} planned={data.numberOfSessions} created={data.sessionCount} attendance={data.features.attendance} />

      <div role="group" aria-label="Cách xem buổi học" className="inline-flex gap-1 rounded-full bg-card p-1 shadow-soft ring-1 ring-border">
        {(["list", "planned"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={view === value}
            onClick={() => listing.changeView(value)}
            className={`min-h-10 rounded-full px-5 text-sm font-bold transition-all active:scale-[0.98] motion-reduce:transition-none ${
              view === value ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {value === "list" ? "Buổi học thực tế" : "Lịch dự kiến"}
          </button>
        ))}
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
          <div className="flex items-center gap-3 rounded-2xl border border-accent bg-card p-4 text-sm text-foreground">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <CalendarDaysIcon className="size-5" aria-hidden="true" />
            </span>
            <p>Lịch dự kiến chưa phải buổi học thực tế, không dùng để điểm danh hay truy cập bản ghi.</p>
          </div>

          {(planned.data?.length ?? 0) > 0 && (
            <ul className="space-y-3">
              {[...(planned.data ?? [])]
                .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))
                .map((session) => (
                  <li key={session.id} className="flex items-center gap-4 rounded-3xl border border-dashed border-border bg-card p-4 shadow-soft">
                    <LmsDateTile value={session.startAt} tone="muted" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-lms text-base font-extrabold text-foreground">
                        {vietnamDate(session.startAt).split("-").reverse().join("/")}
                      </h3>
                      <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-muted-foreground">
                        <ClockIcon className="size-4 text-primary" aria-hidden="true" />
                        {displaySessionTime(session.startAt, session.endAt)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-dashed border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                      {session.status === "CANCELLED" ? "Đã hủy" : "Dự kiến"}
                    </span>
                  </li>
                ))}
            </ul>
          )}
          {!planned.data?.length && (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center shadow-2xs">
              <Image src={BEE_MEDITATE} alt="Ong BeeWise đang thư giãn" width={180} height={180} className="h-auto w-36" />
              <h3 className="mt-3 font-lms text-base font-extrabold text-foreground">Chưa có lịch dự kiến</h3>
              <p className="mt-1 text-sm text-muted-foreground">Lớp học chưa được thiết lập lịch học dự kiến.</p>
            </div>
          )}
        </section>      ) : (
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
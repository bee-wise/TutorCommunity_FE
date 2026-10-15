"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
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
import { LearnerClassCalendar } from "./LearnerClassCalendar";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";
import { learnerAction } from "./LearnerApiClassCard";

const Details = dynamic(() =>
  import("./LearnerSessionDetailDialog").then(
    (m) => m.LearnerSessionDetailDialog,
  ),
);
export function LearnerClassSessionsScreen({ classId }: { classId: string }) {
  const listing = useLearnerSessionsQuery(classId),
    [selected, setSelected] = useState("");
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
  const data = overview.data,
    query = view === "planned" ? planned : actual;
  return (
    <main className="mx-auto max-w-[1180px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-nunito text-2xl font-extrabold text-primary">
          Buổi học
        </h1>
        <div
          role="group"
          aria-label="Cách xem lịch"
          className="flex flex-wrap gap-2"
        >
          {(["list", "calendar", "planned"] as const).map((v) => (
            <Button
              key={v}
              className={learnerAction}
              aria-pressed={view === v}
              variant={view === v ? "default" : "outline"}
              onClick={() => listing.changeView(v)}
            >
              {v === "list"
                ? "Danh sách"
                : v === "calendar"
                  ? "Lịch tháng"
                  : "Lịch dự kiến"}
            </Button>
          ))}
        </div>
      </header>
      {view !== "planned" && (
        <section
          aria-label="Bộ lọc buổi học"
          className="flex flex-wrap items-end justify-between gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className={learnerAction}
              aria-label="Tháng trước"
              onClick={() => listing.changeMonth(-1)}
            >
              Tháng trước
            </Button>
            <span className="px-2 text-sm font-bold tabular-nums">
              {listing.month.split("-").reverse().join("/")}
            </span>
            <Button
              variant="outline"
              className={learnerAction}
              aria-label="Tháng sau"
              onClick={() => listing.changeMonth(1)}
            >
              Tháng sau
            </Button>
          </div>
          <label className="grid w-full gap-1 text-xs font-bold sm:w-56">
            Trạng thái
            <ClassFilterSelect
              value={listing.status}
              onValueChange={(v) =>
                listing.changeStatus(
                  Object.hasOwn(learnerSessionLabels, v)
                    ? (v as typeof listing.status)
                    : "all",
                )
              }
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                ...Object.entries(learnerSessionLabels).map(
                  ([value, label]) => ({ value, label }),
                ),
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
        <section className="space-y-3" aria-label="Lịch dự kiến">
          <p className="text-sm text-muted-foreground">
            Lịch dự kiến chưa phải buổi học thực tế, không dùng để điểm danh hay
            truy cập bản ghi.
          </p>
          {planned.data?.map((s) => (
            <article
              key={s.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-soft"
            >
              <h2 className="font-bold text-primary">
                {vietnamDate(s.startAt)}
              </h2>
              <p className="mt-2 text-sm">
                {displaySessionTime(s.startAt, s.endAt)} ·{" "}
                {learnerSessionLabels[s.status ?? ""] ??
                  s.status ??
                  "Chưa xác định"}
              </p>
            </article>
          ))}
          {!planned.data?.length && <p>Chưa có lịch dự kiến.</p>}
        </section>
      ) : (
        <section className="space-y-4" aria-label="Buổi học thực tế">
          <p role="status" className="text-sm text-muted-foreground">
            {actual.data?.total ?? 0} buổi trong tháng (giờ Việt Nam)
          </p>
          {view === "calendar" ? (
            <LearnerClassCalendar
              month={listing.month}
              sessions={actual.data?.items ?? []}
              onSelect={setSelected}
            />
          ) : (
            <div className="space-y-3">
              {actual.data?.items.map((s) => (
                <article
                  key={s.id}
                  className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 space-y-2">
                    <h2 className="font-nunito font-extrabold text-primary">
                      {vietnamDate(s.startAt)}
                    </h2>
                    <p className="text-sm font-semibold">
                      {displaySessionTime(s.startAt, s.endAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {s.durationMinutes} phút ·{" "}
                      {learnerSessionLabels[s.status ?? ""] ?? "Chưa xác định"}
                    </p>
                  </div>
                  <Button
                    variant={s.status === "ONGOING" ? "default" : "outline"}
                    className={learnerAction}
                    onClick={() => setSelected(s.id)}
                  >
                    Xem buổi học
                  </Button>
                </article>
              ))}
              {!actual.data?.items.length && (
                <p className="rounded-3xl border border-border p-6">
                  Không có buổi học phù hợp trong tháng này.
                </p>
              )}
            </div>
          )}
          {view === "calendar" && (actual.data?.total ?? 0) > 100 && (
            <p className="text-sm">
              Lịch đang hiển thị tối đa 100 buổi mỗi trang. Chuyển trang để xem
              tiếp.
            </p>
          )}
          <ClassPagination
            page={listing.page - 1}
            pageCount={Math.max(
              1,
              Math.ceil(
                (actual.data?.total ?? 0) / (actual.data?.pageSize ?? 6),
              ),
            )}
            label="Phân trang buổi học"
            onPageChange={(p) => listing.setPage(p + 1)}
          />
        </section>
      )}
      {selected && (
        <Details
          key={`${classId}:${selected}`}
          classId={classId}
          sessionId={selected}
          group={data.type === "GROUP"}
          attendanceEnabled={data.features.attendance}
          onClose={() => setSelected("")}
        />
      )}
    </main>
  );
}

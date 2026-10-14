"use client";

import { useState } from "react";
import Link from "next/link";
import { classMembersService } from "@workspace/core/lms-classes/members.service";
import { classSessionsService as service } from "@workspace/core/lms-classes/sessions.service";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import { safeExternalUrl } from "@workspace/core/lms-classes/lifecycle";
import { Button } from "@workspace/ui/components/ui/button";
import { ClassPagination } from "../../tutor-classes/components/ClassPagination";
import { ClassQueryErrorState } from "../../tutor-classes/components/ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "../../tutor-classes/components/ClassWorkspaceSkeleton";
import { formatClassDate } from "../../tutor-classes/utils/classes.utils";

const button = "min-h-11 rounded-full transition-all active:scale-[0.98]";
function SessionResources({
  classId,
  id,
  group,
}: {
  classId: string;
  id: string;
  group: boolean;
}) {
  const marks = useLmsClassResource(
    classId,
    "learner-attendance",
    (s) => service.attendance(id, s),
    { roles: ["LEARNER"], params: [id], enabled: group },
  );
  const recording = useLmsClassResource(
    classId,
    "learner-recording",
    (s) => service.playback(id, s),
    { roles: ["LEARNER"], params: [id], enabled: group },
  );
  const link =
    recording.data?.visibility === "PUBLIC"
      ? safeExternalUrl(recording.data.url)
      : null;
  return (
    <div className="space-y-3">
      {group && (
        <>
          <section>
            <h3 className="text-sm font-bold">Điểm danh của bạn</h3>
            {marks.loading ? (
              <p role="status">Đang tải...</p>
            ) : marks.error ? (
              <p className="text-sm">
                Không đọc được điểm danh hoặc không còn quyền.
              </p>
            ) : (
              marks.data?.marks
                .filter((m) => m.learnerId === marks.actor.id)
                .map((m) => (
                  <p className="text-sm" key={m.learnerId}>
                    {m.status} {m.isLate ? "(Đi muộn)" : ""}{" "}
                    {m.leftEarly ? "(Rời sớm)" : ""}
                    {m.note ? `: ${m.note}` : ""}
                  </p>
                ))
            )}
          </section>
          {recording.loading ? (
            <p role="status">Đang kiểm tra quyền bản ghi...</p>
          ) : link ? (
            <Button asChild variant="outline" className={button}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                Xem bản ghi
              </a>
            </Button>
          ) : (
            <p className="text-sm">
              Chưa có bản ghi PUBLIC khả dụng hoặc bạn không còn quyền xem.
              Không áp dụng hạn 30 ngày.
            </p>
          )}
        </>
      )}
    </div>
  );
}
export function LearnerApiSessionsScreen({ classId }: { classId: string }) {
  const [page, setPage] = useState(1),
    [selected, setSelected] = useState("");
  const overview = useLmsClassResource(
    classId,
    "learner-overview",
    (s) => classMembersService.overview(classId, s),
    { roles: ["LEARNER"] },
  );
  const query = useLmsClassResource(
    classId,
    "learner-sessions",
    (s) => service.list(classId, page, undefined, s),
    { roles: ["LEARNER"], params: [page], enabled: Boolean(overview.data) },
  );
  const error = overview.error ?? query.error;
  return (
    <main className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <h1 className="font-nunito text-2xl font-extrabold text-primary">
        Buổi học lớp
      </h1>
      <Button asChild variant="outline" className={button}>
        <Link href="/lms/learner/chat">Danh sách lớp</Link>
      </Button>
      {overview.loading || query.loading ? (
        <ClassWorkspaceSkeleton />
      ) : error ? (
        <ClassQueryErrorState
          error={error}
          onRetry={() => {
            void overview.refetch();
            void query.refetch();
          }}
        />
      ) : (
        <>
          <h2 className="text-lg font-bold">{overview.data?.title}</h2>
          {query.data?.items.map((s) => (
            <article
              key={s.id}
              className="space-y-3 rounded-3xl border border-border bg-card p-5 shadow-soft"
            >
              <h3 className="font-nunito text-base font-extrabold text-primary">
                {formatClassDate(s.startAt)}
              </h3>
              <p className="text-sm">
                {s.durationMinutes} phút · {s.status}
              </p>
              {["ONGOING", "COMPLETED"].includes(s.status ?? "") && (
                <Button
                  variant="outline"
                  className={button}
                  onClick={() => setSelected(s.id)}
                >
                  Điểm danh & bản ghi
                </Button>
              )}
              {selected === s.id && (
                <SessionResources
                  classId={classId}
                  id={s.id}
                  group={overview.data?.type === "GROUP"}
                />
              )}
            </article>
          ))}
          {!query.data?.items.length && <p>Chưa có buổi học trên trang này.</p>}
          <ClassPagination
            page={page - 1}
            pageCount={Math.max(
              1,
              Math.ceil((query.data?.total ?? 0) / (query.data?.pageSize ?? 6)),
            )}
            onPageChange={(p) => setPage(p + 1)}
            label="Phân trang buổi học"
          />
        </>
      )}
    </main>
  );
}

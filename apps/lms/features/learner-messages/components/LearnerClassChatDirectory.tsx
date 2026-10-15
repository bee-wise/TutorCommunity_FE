"use client";

import { useState } from "react";
import Link from "next/link";
import { classMembersService } from "@workspace/core/lms-classes/members.service";
import { useLmsClassResource } from "@workspace/core/lms-classes/useLmsClassResource";
import { Button } from "@workspace/ui/components/ui/button";
import { ClassPagination } from "../../tutor-classes/components/ClassPagination";
import { ClassQueryErrorState } from "../../tutor-classes/components/ClassQueryErrorState";
import { ClassWorkspaceSkeleton } from "../../tutor-classes/components/ClassWorkspaceSkeleton";

const button = "min-h-11 rounded-full transition-all active:scale-[0.98]";
export function LearnerClassChatDirectory() {
  const [page, setPage] = useState(1);
  const query = useLmsClassResource(
    "00000000-0000-0000-0000-000000000000",
    "learner-chat-classes",
    (s) => classMembersService.classes(page, s),
    { roles: ["LEARNER"], params: [page] },
  );
  return (
    <main className="mx-auto max-w-[1400px] space-y-5 p-4 sm:p-6">
      <h1 className="font-nunito text-2xl font-extrabold text-primary">
        Tin nhắn lớp học
      </h1>
      {query.loading ? (
        <ClassWorkspaceSkeleton />
      ) : query.error ? (
        <ClassQueryErrorState
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          {([false, true] as const).map((archived) => {
            const classes =
              query.data?.items.filter(
                (c) =>
                  (c.status === "COMPLETED" || c.status === "CANCELLED") ===
                  archived,
              ) ?? [];
            return classes.length ? (
              <section key={String(archived)} className="space-y-3">
                <h2 className="font-nunito text-lg font-extrabold text-primary">
                  {archived
                    ? "Cuộc trò chuyện chỉ xem lại"
                    : "Lớp đang học & sắp khai giảng"}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {classes.map((c) => (
                    <article
                      key={c.id}
                      className={`space-y-4 rounded-3xl border border-border bg-card p-5 ${archived ? "" : "shadow-soft"}`}
                    >
                      <h3 className="font-nunito text-lg font-extrabold text-primary">
                        {c.title ?? "Lớp học"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {c.code} · {c.status}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          asChild
                          variant={archived ? "outline" : "default"}
                          className={button}
                        >
                          <Link href={`/lms/learner/chat/classes/${c.id}`}>
                            {archived ? "Xem tin nhắn" : "Mở tin nhắn lớp"}
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className={button}>
                          <Link href={`/lms/learner/class-sessions/${c.id}`}>
                            Buổi học & bản ghi
                          </Link>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null;
          })}
          {!query.data?.items.length && (
            <p>Không có lớp được cấp quyền trên trang này.</p>
          )}
          <ClassPagination
            page={page - 1}
            pageCount={Math.max(
              1,
              Math.ceil(
                (query.data?.total ?? 0) / (query.data?.pageSize ?? 20),
              ),
            )}
            onPageChange={(p) => setPage(p + 1)}
            label="Phân trang lớp trò chuyện"
          />
        </>
      )}
      <Button asChild variant="outline" className={button}>
        <Link href="/lms/learner/group-classes">Lớp nhóm tuyển sinh</Link>
      </Button>
    </main>
  );
}

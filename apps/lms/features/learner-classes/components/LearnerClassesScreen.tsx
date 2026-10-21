"use client";
import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { ClassPagination } from "../../tutor-classes/components/ClassPagination";
import { LearnerClassQueryError } from "./LearnerClassQueryError";
import { useLearnerClassesQuery } from "../hooks/useLearnerClassesQuery";
import { LearnerApiClassCard, learnerAction } from "./LearnerApiClassCard";
import { LearnerApiClassFilters } from "./LearnerApiClassFilters";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";

export function LearnerClassesScreen({
  initialKind,
}: { initialKind?: string } = {}) {
  const directory = useLearnerClassesQuery(initialKind),
    { query, filters } = directory;
  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-5 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-lms text-2xl font-extrabold leading-tight text-primary sm:text-3xl">
          Lớp học
        </h1>
        <Button asChild variant="outline" className={learnerAction}>
          <Link href="/lms/learner/group-classes">Đăng ký lớp nhóm</Link>
        </Button>
      </header>
      <LearnerApiClassFilters
        filters={filters}
        counts={directory.counts}
        onChange={directory.update}
        onReset={directory.reset}
      />
      {query.loading || directory.pendingSearch ? (
        <LearnerWorkspaceSkeleton view="classes" />
      ) : query.error ? (
        <LearnerClassQueryError
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <section aria-label="Danh sách lớp học" className="space-y-4">
          <p role="status" className="text-sm text-muted-foreground">
            {query.data?.total ?? 0} lớp phù hợp
          </p>
          {query.data?.items.length ? (
            <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
              {query.data.items.map((data) => (
                <LearnerApiClassCard key={data.id} data={data} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
              <h2 className="font-lms text-lg font-extrabold text-foreground">
                Chưa có lớp phù hợp
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Chỉ hiển thị lớp đã được cấp quyền và đã khai giảng. Đăng ký
                hoặc thanh toán chưa có quyền LMS được theo dõi riêng.
              </p>
            </div>
          )}
          <ClassPagination
            page={filters.page - 1}
            pageCount={Math.max(
              1,
              Math.ceil((query.data?.total ?? 0) / (query.data?.pageSize ?? 6)),
            )}
            label="Phân trang lớp học"
            onPageChange={(p) => directory.update({ page: p + 1 })}
          />
        </section>
      )}
    </main>
  );
}

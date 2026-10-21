"use client";
import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { LmsPageHeader } from "../../../components/LmsPageHeader";
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
      <LmsPageHeader
        title="Lớp học"
        actions={
          <Button asChild variant="outline" className={learnerAction}>
            <Link href="/lms/learner/group-classes">Đăng ký lớp nhóm</Link>
          </Button>
        }
      />
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
            <EmptyState
              imageAlt=""
              title="Chưa có lớp phù hợp"
              description="Chỉ hiển thị lớp đã được cấp quyền và đã khai giảng."
              action={
                <Button asChild variant="outline" className={learnerAction}>
                  <Link href="/lms/learner/group-classes">Đăng ký lớp nhóm</Link>
                </Button>
              }
            />
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

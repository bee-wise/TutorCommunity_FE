"use client";
import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { LearnerClassQueryError } from "./LearnerClassQueryError";
import { useLearnerClassQuery } from "../hooks/useLearnerClassesQuery";
import { LearnerWorkspaceSkeleton } from "./LearnerWorkspaceSkeleton";
import { learnerAction } from "./LearnerApiClassCard";

export function LearnerClassOverviewScreen({ classId }: { classId: string }) {
  const query = useLearnerClassQuery(classId);
  if (query.loading) return <LearnerWorkspaceSkeleton view="detail" />;
  if (query.error || !query.data)
    return (
      <LearnerClassQueryError
        error={query.error}
        onRetry={() => void query.refetch()}
        detail
      />
    );
  const data = query.data;
  return (
    <main className="mx-auto max-w-[1180px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-nunito text-2xl font-extrabold text-primary">
        Thông tin lớp
      </h1>
      {data.status === "COMPLETED" && (
        <p className="rounded-2xl border border-border p-4 text-sm">
          Lớp đã kết thúc. Tin nhắn chỉ xem lại; bản ghi vẫn được kiểm tra quyền
          khi mở.
        </p>
      )}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
        <h2 className="font-nunito text-lg font-extrabold text-primary">
          Chi tiết lớp
        </h2>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Fact label="Mã lớp" value={data.code ?? data.id} />
          <Fact
            label="Môn học"
            value={data.teachingItemName ?? "Chưa có môn học"}
          />
          <Fact
            label="Chương trình"
            value={data.programName ?? "Chưa có chương trình"}
          />
          <Fact
            label="Cấp độ / bối cảnh"
            value={data.contextName ?? "Chưa có thông tin"}
          />
          <Fact
            label="Loại lớp"
            value={
              data.type === "GROUP"
                ? "Lớp nhóm"
                : data.type === "INDIVIDUAL"
                  ? "Lớp 1:1"
                  : "Chưa xác định"
            }
          />
          <Fact
            label="Hình thức"
            value={
              data.teachingMode === "ONLINE"
                ? "Trực tuyến"
                : data.teachingMode === "OFFLINE"
                  ? "Trực tiếp"
                  : "Chưa xác định"
            }
          />
          <Fact
            label="Thời lượng dự kiến"
            value={`${data.sessionDurationMinutes} phút/buổi`}
          />
          <Fact label="Buổi học đã tạo" value={`${data.sessionCount} buổi`} />
          <Fact
            label="Học viên hiện tại"
            value={`${data.learnerCount} học viên`}
          />
          <Fact label="Mã gia sư phụ trách" value={data.tutorId} />
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className={learnerAction}>
            <Link href={`/lms/learner/classes/${classId}/sessions`}>
              Xem buổi học
            </Link>
          </Button>
          <Button asChild variant="outline" className={learnerAction}>
            <Link href={`/lms/learner/chat/classes/${classId}`}>
              Tin nhắn lớp
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="break-words text-sm font-bold [overflow-wrap:anywhere]">
        {value}
      </dd>
    </div>
  );
}

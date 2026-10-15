import Link from "next/link";
import type { LearnerApiClass } from "../services/learner-classes.service";

export const learnerAction =
  "min-h-11 rounded-full transition-all active:scale-[0.98] motion-reduce:transform-none";
export function LearnerClassStatus({
  status,
}: {
  status: string | null | undefined;
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status === "ACTIVE" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-primary"}`}
    >
      {status === "ACTIVE"
        ? "Đang học"
        : status === "COMPLETED"
          ? "Đã kết thúc"
          : "Chưa xác định"}
    </span>
  );
}
export function LearnerApiClassCard({ data }: { data: LearnerApiClass }) {
  return (
    <Link
      href={`/lms/learner/classes/${data.id}`}
      className="group flex h-full min-w-0 flex-col rounded-3xl border border-border bg-card p-5 shadow-soft outline-none transition-all hover:-translate-y-1 hover:border-primary hover:shadow-soft-hover active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-muted-foreground">
          {data.code ?? data.id.slice(0, 8)}
        </span>
        <LearnerClassStatus status={data.status} />
      </div>
      <h2 className="mt-4 line-clamp-2 font-nunito text-lg font-extrabold leading-snug text-primary">
        {data.title ?? "Chưa có tên lớp"}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {data.teachingItemName ?? "Chưa có môn học"}
        {data.contextName ? ` · ${data.contextName}` : ""}
      </p>
      <dl className="my-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Buổi đã tạo</dt>
          <dd className="mt-1 font-bold tabular-nums">
            {data.sessionCount} buổi
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Hình thức</dt>
          <dd className="mt-1 font-bold">
            {data.teachingMode === "ONLINE"
              ? "Trực tuyến"
              : data.teachingMode === "OFFLINE"
                ? "Trực tiếp"
                : "Chưa xác định"}
          </dd>
        </div>
      </dl>
      <span className="mt-auto flex min-h-11 items-center justify-center rounded-full border border-primary px-4 text-sm font-bold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
        {data.status === "COMPLETED" ? "Xem lại lớp" : "Vào lớp"}
      </span>
    </Link>
  );
}

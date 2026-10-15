"use client";
import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import {
  useLearnerRecruitment,
  useJoinLearnerGroup,
} from "../hooks/useLearnerRecruitment";
import { LearnerAdmissionDetails } from "./LearnerAdmissionDetails";
import { learnerAction } from "../../learner-classes/components/LearnerApiClassCard";
import { LearnerWorkspaceSkeleton } from "../../learner-classes/components/LearnerWorkspaceSkeleton";
import { LearnerClassQueryError } from "../../learner-classes/components/LearnerClassQueryError";
export function LearnerAdmissionScreen({
  admissionId,
  paymentId,
}: {
  admissionId: string;
  paymentId?: string;
}) {
  return (
    <main className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-nunito text-2xl font-extrabold text-primary">
          Đăng ký lớp nhóm
        </h1>
        <Button asChild variant="outline" className={learnerAction}>
          <Link href="/lms/learner/group-classes">Danh sách tuyển sinh</Link>
        </Button>
      </header>
      <LearnerAdmissionDetails
        key={admissionId}
        id={admissionId}
        paymentId={paymentId}
      />
    </main>
  );
}
function RecruitingCard({ data }: { data: GroupDto }) {
  const { join, busy } = useJoinLearnerGroup(data.id);
  return (
    <article className="flex h-full flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <p className="text-xs font-bold text-muted-foreground">
        {data.code ?? data.id.slice(0, 8)}
      </p>
      <h2 className="font-nunito text-lg font-extrabold leading-snug text-primary">
        {data.title ?? "Chưa có tên lớp"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {data.teachingItemName ?? "Chưa có môn học"}
        {data.contextName ? ` · ${data.contextName}` : ""}
      </p>
      <p className="text-sm">
        {data.billingMode === "MONTHLY"
          ? "Học phí theo tháng"
          : data.billingMode === "FULL_COURSE"
            ? "Học phí cả khóa"
            : "Chưa có cách tính học phí"}
      </p>
      <p className="text-sm">
        {data.numberOfSessions} buổi dự kiến, {data.sessionDurationMinutes}{" "}
        phút/buổi
      </p>
      <Button
        className={`${learnerAction} mt-auto`}
        disabled={busy}
        onClick={() => void join()}
      >
        {busy ? "Đang đăng ký..." : "Đăng ký học thử"}
      </Button>
    </article>
  );
}
export function LearnerGroupAdmissionsScreen() {
  const controller = useLearnerRecruitment(),
    { query, page, setPage, form } = controller;
  return (
    <main className="mx-auto max-w-[1400px] space-y-5 p-4 sm:p-6">
      <h1 className="font-nunito text-2xl font-extrabold text-primary">
        Lớp nhóm tuyển sinh
      </h1>
      <form
        onSubmit={controller.open}
        className="flex flex-wrap items-end gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft"
      >
        <label className="grid min-w-0 flex-1 gap-1.5 text-xs font-bold">
          Tiếp tục đăng ký từ mã đã nhận
          <Input
            className="min-h-11 rounded-2xl"
            {...form.register("id")}
            placeholder="Mã đăng ký GUID từ gia sư hoặc thông báo"
          />
        </label>
        <Button variant="outline" className={learnerAction}>
          Mở đăng ký
        </Button>
        {form.formState.errors.id && (
          <p role="alert" className="w-full text-sm text-destructive">
            {form.formState.errors.id.message}
          </p>
        )}
      </form>
      {query.loading ? (
        <LearnerWorkspaceSkeleton view="classes" />
      ) : query.error ? (
        <LearnerClassQueryError
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {query.data?.map((data) => (
              <RecruitingCard
                key={`${query.actor.id}:${data.id}`}
                data={data}
              />
            ))}
          </div>
          {!query.data?.length && (
            <p className="rounded-3xl border border-border p-6">
              Chưa có lớp đang tuyển sinh ở trang này.
            </p>
          )}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className={learnerAction}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Trước
            </Button>
            <span className="text-sm">Trang {page}</span>
            <Button
              variant="outline"
              className={learnerAction}
              disabled={(query.data?.length ?? 0) < 20}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau
            </Button>
          </div>
        </>
      )}
    </main>
  );
}

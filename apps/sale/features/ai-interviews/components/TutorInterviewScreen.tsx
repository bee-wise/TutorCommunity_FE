"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import {
  interviewStatusLabels,
  isOpenInterview,
} from "@workspace/core/ai-interviews/interview-status";
import { useTutorInterview } from "../hooks/useTutorInterview";
import { InterviewSetup } from "./InterviewSetup";
import { InterviewSession } from "./InterviewSession";

export function TutorInterviewScreen() {
  const interview = useTutorInterview();
  const { eligibility, policy, state, stateQuery } = interview;
  if (
    eligibility.isPending ||
    policy.isPending ||
    (stateQuery.isFetching && !state)
  )
    return <Skeleton className="h-96 w-full rounded-[32px]" />;
  const loadError = eligibility.error || policy.error || stateQuery.error;
  if (loadError)
    return (
      <section
        role="alert"
        className="rounded-3xl border border-border bg-card p-6"
      >
        <p className="text-sm text-destructive">
          {getApiErrorMessage(loadError)}
        </p>
        <Button
          variant="outline"
          className="mt-4 rounded-full transition-all active:scale-[0.98]"
          onClick={() => {
            void eligibility.refetch();
            void policy.refetch();
            if (stateQuery.isEnabled) void stateQuery.refetch();
          }}
        >
          Thử lại
        </Button>
      </section>
    );
  if (state && !isOpenInterview(state.status))
    return (
      <section className="rounded-[32px] border border-border bg-card p-6 shadow-[var(--bw-shadow-soft)]">
        <h2 className="text-xl font-bold">
          {interviewStatusLabels[state.status] ?? state.status}
        </h2>
        <p className="mt-4 text-sm leading-6">
          {state.status === "APPROVED"
            ? "Kết quả đã được phê duyệt. Bạn có thể tiếp tục hoàn thiện thông tin gia sư khi tài khoản được đồng bộ."
            : state.status === "NEEDS_REVISION"
              ? "Vui lòng cập nhật hồ sơ theo phản hồi của Consultant. Buổi phỏng vấn này sẽ được xét duyệt lại."
              : "Buổi phỏng vấn đã kết thúc. Quyết định cuối cùng do Consultant xét duyệt."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="rounded-full transition-all active:scale-[0.98]"
            onClick={() => {
              void stateQuery.refetch();
              void eligibility.refetch();
            }}
          >
            Cập nhật trạng thái
          </Button>
          {state.status === "NEEDS_REVISION" && (
            <Button
              asChild
              className="rounded-full transition-all active:scale-[0.98]"
            >
              <Link href="/tutor/profile/edit">Bổ sung hồ sơ</Link>
            </Button>
          )}
          {eligibility.data &&
            eligibility.data.attempts_used <
              eligibility.data.attempts_allowed &&
            ["REJECTED", "ABANDONED", "SUPERSEDED"].includes(state.status) && (
              <Button
                className="rounded-full transition-all active:scale-[0.98]"
                onClick={interview.startNewAttempt}
              >
                Chuẩn bị lượt phỏng vấn mới
              </Button>
            )}
        </div>
      </section>
    );
  if (eligibility.data?.state === "USED" && !state)
    return (
      <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--bw-shadow-soft)]">
        <h2 className="text-xl font-bold">Đã sử dụng lượt phỏng vấn</h2>
        <p className="mt-4 text-sm">
          Liên hệ Consultant để xem kết quả hoặc được cấp lại lượt nếu cần.
        </p>
      </section>
    );
  const setup = ["policy", "precheck", "ready"].includes(interview.phase);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold leading-snug">Phỏng vấn AI</h2>
        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold">
          Đã phỏng vấn {eligibility.data?.attempts_used} /{" "}
          {eligibility.data?.attempts_allowed} lượt
        </span>
      </div>
      {interview.error && (
        <p
          role="alert"
          className="rounded-2xl border border-destructive bg-card p-4 text-sm text-destructive"
        >
          {interview.error}
        </p>
      )}
      {interview.media.deviceError && !setup && (
        <p role="alert" className="text-sm text-destructive">
          {interview.media.deviceError}
        </p>
      )}
      {setup ? (
        <InterviewSetup interview={interview} />
      ) : (
        <InterviewSession interview={interview} />
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
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
import { InterviewResult } from "./InterviewResult";
import {
  InterviewNotice,
  interviewButtonClass,
  interviewPanelClass,
} from "./InterviewUi";

export function TutorInterviewScreen() {
  const interview = useTutorInterview();
  const { eligibility, policy, state, stateQuery } = interview;
  const canContinue = Boolean(
    eligibility.data?.resumable_interview_id ||
    (eligibility.data?.state === "IN_PROGRESS" &&
      eligibility.data.interview_id),
  );
  const terminal = Boolean(state && !isOpenInterview(state.status));
  const needsPolicy =
    interview.phase === "policy" &&
    !canContinue &&
    !terminal &&
    eligibility.data?.state !== "USED";
  const showHeaderAndSteps = interview.phase === "policy";
  const focused =
    !["policy", "precheck"].includes(interview.phase) &&
    (!state || isOpenInterview(state.status));

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (focused) {
      document.body.dataset.interviewFocused = "true";
    } else {
      delete document.body.dataset.interviewFocused;
    }
    return () => {
      delete document.body.dataset.interviewFocused;
    };
  }, [focused]);

  if (
    eligibility.isPending ||
    (policy.isPending && needsPolicy) ||
    (stateQuery.isFetching && !state)
  )
    return (
      <div aria-label="Đang tải phỏng vấn" className="space-y-5">
        <Skeleton className="h-9 w-60 rounded-xl" />
        <Skeleton className="h-16 rounded-2xl" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    );
  const loadError =
    eligibility.error || (needsPolicy && policy.error) || stateQuery.error;
  const setup = ["policy", "precheck"].includes(interview.phase);

  const title = (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-nunito text-primary text-2xl font-extrabold leading-snug sm:text-3xl">
        Phỏng vấn cùng Bee
      </h1>
      {eligibility.data && (
        <p className="text-xs text-muted-foreground">
          Lượt phỏng vấn{" "}
          <strong className="ml-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold tabular-nums text-foreground">
            {eligibility.data?.attempts_used} /{" "}
            {eligibility.data?.attempts_allowed}
          </strong>
        </p>
      )}
    </header>
  );
  if (loadError)
    return (
      <div className="space-y-5">
        {title}
        <section className={`${interviewPanelClass} p-5 sm:p-7`}>
          <InterviewNotice tone="error">
            {getApiErrorMessage(loadError)}
          </InterviewNotice>
          <Button
            variant="outline"
            className={`mt-5 ${interviewButtonClass}`}
            onClick={() => {
              void eligibility.refetch();
              void policy.refetch();
              if (stateQuery.isEnabled) void stateQuery.refetch();
            }}
          >
            Thử lại
          </Button>
        </section>
      </div>
    );
  if (state && terminal) {
    const message =
      state.status === "APPROVED"
        ? "Kết quả đã được phê duyệt. Bạn có thể tiếp tục hoàn thiện thông tin gia sư khi tài khoản được đồng bộ."
        : state.status === "NEEDS_REVISION"
          ? "Vui lòng cập nhật hồ sơ theo phản hồi của Consultant. Buổi phỏng vấn này sẽ được xét duyệt lại."
          : ["COMPLETED", "AI_PROCESSING", "PENDING_REVIEW"].includes(
                state.status,
              )
            ? "Bài phỏng vấn đã được ghi nhận và đang chờ xét duyệt. Bạn có thể cập nhật trạng thái để theo dõi kết quả."
            : "Buổi phỏng vấn đã kết thúc. Liên hệ Consultant để xem phản hồi hoặc được cấp thêm lượt nếu cần.";
    return (
      <div className="space-y-5">
        {title}
        <InterviewResult
          title={interviewStatusLabels[state.status] ?? state.status}
          message={message}
          tone={
            state.status === "APPROVED"
              ? "success"
              : ["NEEDS_REVISION", "REJECTED", "ABANDONED"].includes(
                    state.status,
                  )
                ? "warning"
                : "waiting"
          }
        >
          <Button
            variant="outline"
            className={interviewButtonClass}
            onClick={() => {
              void stateQuery.refetch();
              void eligibility.refetch();
            }}
          >
            <ArrowPathIcon aria-hidden="true" className="size-4" />
            Cập nhật trạng thái
          </Button>
          {state.status === "NEEDS_REVISION" && (
            <Button asChild className={interviewButtonClass}>
              <Link href="/tutor/profile/edit">Bổ sung hồ sơ</Link>
            </Button>
          )}
          {eligibility.data &&
            eligibility.data.attempts_used <
              eligibility.data.attempts_allowed &&
            ["REJECTED", "ABANDONED", "SUPERSEDED"].includes(state.status) && (
              <Button
                className={interviewButtonClass}
                onClick={interview.startNewAttempt}
              >
                Chuẩn bị lượt phỏng vấn mới
              </Button>
            )}
        </InterviewResult>
      </div>
    );
  }
  if (eligibility.data?.state === "USED" && !state)
    return (
      <div className="space-y-5">
        {title}
        <InterviewResult
          title="Cảm ơn bạn đã tham gia phỏng vấn cùng Bee"
          message="Bee đã ghi nhận kết quả. Vui lòng chờ phản hồi chính thức từ BeeWise."
          tone="warning"
        />
      </div>
    );
  return (
    <div className="space-y-3.5">
      {showHeaderAndSteps && title}
      {interview.error && (
        <InterviewNotice tone="error">{interview.error}</InterviewNotice>
      )}
      {interview.media.deviceError && !setup && (
        <InterviewNotice tone="error">
          {interview.media.deviceError}
        </InterviewNotice>
      )}
      {interview.phase === "policy" && canContinue ? (
        <section className={`${interviewPanelClass} p-5 sm:p-7`}>
          <h2 className="font-nunito text-xl font-extrabold sm:text-2xl">
            Tiếp tục thực hiện phỏng vấn
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Kiểm tra lại camera và micro trước khi quay lại câu hỏi đang làm.
          </p>
          <Button
            className={`mt-5 ${interviewButtonClass}`}
            onClick={interview.continueExisting}
          >
            Tiếp tục buổi phỏng vấn
          </Button>
        </section>
      ) : setup ? (
        <InterviewSetup interview={interview} />
      ) : (
        <InterviewSession interview={interview} />
      )}
    </div>
  );
}

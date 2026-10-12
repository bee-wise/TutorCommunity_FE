"use client";

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
import { InterviewProgress } from "./InterviewProgress";
import { InterviewResult } from "./InterviewResult";
import {
  InterviewNotice,
  interviewButtonClass,
  interviewPanelClass,
} from "./InterviewUi";

export function TutorInterviewScreen() {
  const interview = useTutorInterview();
  const { eligibility, policy, state, stateQuery } = interview;
  if (
    eligibility.isPending ||
    policy.isPending ||
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
  const loadError = eligibility.error || policy.error || stateQuery.error;
  const terminal = Boolean(state && !isOpenInterview(state.status));
  const setup = ["policy", "precheck", "ready"].includes(interview.phase);
  const title = (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-nunito text-2xl font-extrabold leading-snug sm:text-3xl">
        Phỏng vấn AI
      </h1>
      {eligibility.data && <p className="text-xs text-muted-foreground">
        Lượt phỏng vấn{" "}
        <strong className="ml-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold tabular-nums text-foreground">
          {eligibility.data?.attempts_used} /{" "}
          {eligibility.data?.attempts_allowed}
        </strong>
      </p>}
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
          title="Đã sử dụng lượt phỏng vấn"
          message="Liên hệ Consultant để xem kết quả hoặc được cấp lại lượt nếu cần."
          tone="warning"
        />
      </div>
    );
  return (
    <div className="space-y-5">
      {title}
      <InterviewProgress phase={interview.phase} />
      {interview.error && (
        <InterviewNotice tone="error">{interview.error}</InterviewNotice>
      )}
      {interview.media.deviceError && !setup && (
        <InterviewNotice tone="error">
          {interview.media.deviceError}
        </InterviewNotice>
      )}
      {setup ? (
        <InterviewSetup interview={interview} />
      ) : (
        <InterviewSession interview={interview} />
      )}
    </div>
  );
}

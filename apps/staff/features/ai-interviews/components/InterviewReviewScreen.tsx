"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowPathIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useInterviewPackageQuery } from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import {
  canGrantInterviewAttempt,
  isReviewableInterview,
} from "@workspace/core/ai-interviews/interview-status";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { Button } from "@workspace/ui/components/ui/button";
import { InterviewReviewHeader } from "./InterviewReviewHeader";
import {
  actionClass,
  InterviewQueryState,
  InterviewStatus,
  panelClass,
} from "./InterviewUi";
import { InterviewReport } from "./InterviewReport";
import { InterviewAnswers } from "./InterviewAnswers";
import { InterviewHistory } from "./InterviewHistory";
import { InterviewTutorProfile } from "./InterviewTutorProfile";
import {
  InterviewAttemptGrant,
  InterviewDecisionForm,
} from "./InterviewDecisionForm";
import { InterviewAdminActions } from "./InterviewAdminActions";

const sections = [
  { value: "overview", label: "Tổng quan" },
  { value: "answers", label: "Câu trả lời & điểm" },
  { value: "profile", label: "Hồ sơ gia sư" },
  { value: "history", label: "Lịch sử" },
] as const;
type ReviewSection = (typeof sections)[number]["value"];
export function InterviewReviewScreen({
  id,
  role,
}: {
  id: string;
  role: "consultant" | "admin";
}) {
  const router = useRouter();
  const userRole = useAuthStore((store) => store.user?.role?.toLowerCase());
  const query = useInterviewPackageQuery(id);
  const [section, setSection] = useState<ReviewSection>("overview");
  if (userRole !== role)
    return <p className="p-6 text-sm">Đang xác minh quyền truy cập…</p>;
  const data = query.data;
  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" className={actionClass}>
          <Link href={`/${role}/ai-interviews`}>
            <ArrowLeftIcon className="size-4" />
            Danh sách phỏng vấn
          </Link>
        </Button>
        <Button
          variant="outline"
          className={actionClass}
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          <ArrowPathIcon
            className={`size-4 ${query.isFetching ? "animate-spin" : ""}`}
          />
          Cập nhật hồ sơ và bản ghi
        </Button>
        {data && (
          <Button
            asChild
            variant="default"
            className={`xl:hidden ${actionClass}`}
          >
            <a href="#interview-actions">
              {role === "consultant" ? "Xét duyệt" : "Thao tác"}
            </a>
          </Button>
        )}
      </div>
      <InterviewQueryState
        pending={query.isPending}
        error={query.error}
        retry={() => void query.refetch()}
      />
      {data && (
        <>
          <InterviewReviewHeader data={data} />
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-5">
              <nav
                aria-label="Nội dung hồ sơ phỏng vấn"
                className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1.5"
              >
                {sections.map((item) => (
                  <Button
                    key={item.value}
                    variant={section === item.value ? "default" : "ghost"}
                    aria-pressed={section === item.value}
                    className={`shrink-0 ${actionClass}`}
                    onClick={() => setSection(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>
              <div hidden={section !== "overview"}>
                <InterviewReport data={data} />
              </div>
              {section === "answers" && (
                <InterviewAnswers
                  data={data}
                  canOverride={
                    role === "consultant" &&
                    isReviewableInterview(data.interview.status)
                  }
                />
              )}
              {section === "profile" && <InterviewTutorProfile data={data} />}
              {section === "history" && <InterviewHistory data={data} />}
            </div>
            <aside
              id="interview-actions"
              className="scroll-mt-24 space-y-4 xl:sticky xl:top-24"
            >
              {role === "consultant" ? (
                <InterviewDecisionForm
                  id={id}
                  enabled={data.interview.status === "PENDING_REVIEW"}
                />
              ) : (
                <section className={panelClass}>
                  <h2 className="font-nunito text-lg font-extrabold">
                    Trạng thái xét duyệt
                  </h2>
                  <div className="mt-4">
                    <InterviewStatus status={data.interview.status} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Consultant thực hiện chấm lại tiêu chí và ra quyết định xét
                    duyệt.
                  </p>
                </section>
              )}
              <InterviewAttemptGrant
                key={id}
                id={id}
                tutorId={data.interview.tutor_id}
                enabled={canGrantInterviewAttempt(data.interview.status)}
              />
              {role === "admin" && (
                <InterviewAdminActions
                  id={id}
                  tutorId={data.interview.tutor_id}
                  canRescore={isReviewableInterview(data.interview.status)}
                  onDeleted={() => router.replace("/admin/ai-interviews")}
                />
              )}
            </aside>
          </div>
        </>
      )}
    </main>
  );
}

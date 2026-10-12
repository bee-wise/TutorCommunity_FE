"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useInterviewListQuery } from "@workspace/core/ai-interviews/hooks/useInterviewQueries";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";
import { interviewStatusLabels } from "@workspace/core/ai-interviews/interview-status";

import { actionClass, InterviewQueryState } from "./InterviewUi";

import { InterviewQueueTable } from "./InterviewQueueTable";

export function InterviewQueueScreen({
  role,
}: {
  role: "consultant" | "admin";
}) {
  const userRole = useAuthStore((store) => store.user?.role?.toLowerCase());
  const [status, setStatus] = useState(
    role === "consultant" ? "PENDING_REVIEW" : "all",
  );
  const [offset, setOffset] = useState(0);
  const query = useInterviewListQuery({
    status: status === "all" ? undefined : status,
    offset,
    limit: 20,
  });
  function selectStatus(value: string) {
    setStatus(value);
    setOffset(0);
  }
  if (userRole !== role)
    return <p className="p-6 text-sm">Đang xác minh quyền truy cập…</p>;
  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-nunito text-3xl leading-[1.2] font-black">
          Phỏng vấn AI
        </h1>
        {role === "admin" && (
          <Button asChild variant="outline" className={actionClass}>
            <Link href="/admin/ai-interviews/settings">
              <AdjustmentsHorizontalIcon className="size-4" />
              Cấu hình phỏng vấn
            </Link>
          </Button>
        )}
      </div>
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4 sm:p-5">
          <div className="flex flex-wrap gap-2" aria-label="Bộ lọc nhanh">
            {[
              { value: "PENDING_REVIEW", label: "Chờ xét duyệt" },
              { value: "NEEDS_REVISION", label: "Cần bổ sung" },
              { value: "all", label: "Tất cả" },
            ].map((item) => (
              <Button
                key={item.value}
                variant={status === item.value ? "default" : "ghost"}
                className={actionClass}
                aria-pressed={status === item.value}
                onClick={() => selectStatus(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Select value={status} onValueChange={selectStatus}>
              <SelectTrigger
                aria-label="Lọc trạng thái phỏng vấn"
                className="min-h-11 w-full rounded-2xl sm:w-52"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(interviewStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className={actionClass}
              disabled={query.isFetching}
              aria-label="Cập nhật danh sách"
              onClick={() => void query.refetch()}
            >
              <ArrowPathIcon
                className={`size-4 ${query.isFetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <InterviewQueryState
            pending={query.isPending}
            error={query.error}
            retry={() => void query.refetch()}
          />
        </div>
        {query.data && (
          <>
            {!query.data.length ? (
              <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/5">
                  <DocumentMagnifyingGlassIcon className="size-6 text-primary" />
                </span>
                <h2 className="font-nunito text-lg font-extrabold">
                  Không có buổi phỏng vấn
                </h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Bộ lọc hiện tại chưa có hồ sơ. Chọn trạng thái khác hoặc cập
                  nhật danh sách.
                </p>
              </div>
            ) : (
              <InterviewQueueTable items={query.data} role={role} />
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 sm:p-5">
              <span className="text-xs text-muted-foreground">
                Trang {Math.floor(offset / 20) + 1} · {query.data.length} buổi
                trên trang
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className={actionClass}
                  disabled={!offset || query.isFetching}
                  onClick={() => setOffset((value) => value - 20)}
                >
                  Trang trước
                </Button>
                <Button
                  variant="outline"
                  className={actionClass}
                  disabled={query.data.length < 20 || query.isFetching}
                  onClick={() => setOffset((value) => value + 20)}
                >
                  Trang tiếp
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

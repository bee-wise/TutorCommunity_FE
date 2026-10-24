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

import { actionClass, InterviewQueryState } from "./InterviewUi";

import { InterviewQueueTable } from "./InterviewQueueTable";

const filters = [
  { value: "PENDING_REVIEW", label: "Chờ xét duyệt" },
  { value: "NEEDS_REVISION", label: "Cần bổ sung" },
  { value: "APPROVED", label: "Đã phê duyệt" },
  { value: "REJECTED", label: "Đã từ chối" },
  { value: "all", label: "Tất cả" },
];

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
    <main className="mx-auto w-full max-w-[1200px] space-y-5 p-4 sm:p-6">
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
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-border px-3 sm:px-5">
          <nav
            aria-label="Lọc theo trạng thái"
            className="flex min-w-0 gap-1 overflow-x-auto overflow-y-hidden"
          >
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-current={status === item.value ? "page" : undefined}
                onClick={() => selectStatus(item.value)}
                className={`relative min-h-14 shrink-0 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 px-3.5 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-4 ${status === item.value ? "text-primary after:bg-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <Button
            variant="ghost"
            className={`${actionClass} shrink-0`}
            disabled={query.isFetching}
            aria-label="Cập nhật danh sách"
            onClick={() => void query.refetch()}
          >
            <ArrowPathIcon
              className={`size-4 ${query.isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Cập nhật</span>
          </Button>
        </div>
        {(query.isPending || query.error) && (
          <div className="p-4 sm:p-5">
            <InterviewQueryState
              pending={query.isPending}
              error={query.error}
              retry={() => void query.refetch()}
            />
          </div>
        )}
        {query.data && (
          <>
            {!query.data.length ? (
              <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-primary">
                  <DocumentMagnifyingGlassIcon className="size-7" />
                </span>
                <h2 className="font-nunito text-lg font-extrabold">
                  Không có buổi phỏng vấn nào
                </h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Chưa có hồ sơ ở trạng thái này. Thử chọn tab khác hoặc cập
                  nhật danh sách.
                </p>
              </div>
            ) : (
              <InterviewQueueTable items={query.data} role={role} />
            )}
            {(offset > 0 || query.data.length >= 20) && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5">
                <span className="text-xs text-muted-foreground">
                  Trang {Math.floor(offset / 20) + 1}
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
            )}
          </>
        )}
      </section>
    </main>
  );
}

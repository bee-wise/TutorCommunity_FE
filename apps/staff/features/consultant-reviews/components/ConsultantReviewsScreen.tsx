"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { sortBySubmittedAt, type ReviewSort } from "../data/review-sort";
import { useReviewQueues } from "../hooks/useConsultantReviews";
import type { PendingFieldChange } from "../schemas/consultant-review.schema";
import { FieldChangeDialog } from "./FieldChangeDialog";
import { FieldChangeItem, ReviewQueueItem } from "./ReviewQueueItems";
import { ReviewQueueTabs, type ReviewTab } from "./ReviewQueueTabs";

const PAGE_SIZE = 20;

export function ConsultantReviewsScreen() {
  const [activeTab, setActiveTab] = useState<ReviewTab>("newProfiles");
  const [page, setPage] = useState(1);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [selectedChange, setSelectedChange] =
    useState<PendingFieldChange | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchDraft.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchDraft]);

  const { profileReviews, fieldReviews, tabCounts, refreshQueues } = useReviewQueues(search);
  const reviews = activeTab === "fieldChanges" ? fieldReviews : profileReviews;

  const sortedProfiles = useMemo(
    () => sortBySubmittedAt(
      (profileReviews.data?.profiles ?? []).filter((profile) =>
        activeTab === "newProfiles" ? profile.reviewCount === 0 : profile.reviewCount > 0,
      ),
      sort,
    ),
    [profileReviews.data?.profiles, activeTab, sort],
  );
  const sortedChanges = useMemo(
    () => sortBySubmittedAt(fieldReviews.data?.fieldChanges ?? [], sort),
    [fieldReviews.data?.fieldChanges, sort],
  );
  const totalCount =
    activeTab === "fieldChanges" ? sortedChanges.length : sortedProfiles.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const profiles = sortedProfiles.slice(start, start + PAGE_SIZE);
  const fieldChanges = sortedChanges.slice(start, start + PAGE_SIZE);

  function switchTab(next: ReviewTab) {
    setActiveTab(next);
    setPage(1);
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchDraft.trim());
    setPage(1);
  }

  return (
    <main className="min-w-0 bg-background px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-nunito text-3xl font-extrabold leading-[1.2] sm:text-4xl">
            Hồ sơ gia sư
          </h1>
          <Button
            type="button"
            variant="outline"
            onClick={refreshQueues}
            disabled={profileReviews.isFetching || fieldReviews.isFetching}
            className="min-h-11 rounded-full px-5 font-bold transition-all active:scale-[0.98]"
          >
            <ArrowPathIcon className={`size-4 ${profileReviews.isFetching || fieldReviews.isFetching ? "animate-spin" : ""}`} aria-hidden="true" /> Làm mới
          </Button>
        </header>

        <ReviewQueueTabs value={activeTab} counts={tabCounts} onChange={switchTab} />

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <form onSubmit={applySearch} className="flex min-w-0 flex-1 gap-2">
              <label htmlFor="review-search" className="sr-only">
                Tìm gia sư
              </label>
              <div className="relative min-w-0 max-w-md flex-1">
                <MagnifyingGlassIcon
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="review-search"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  placeholder="Tên hoặc email gia sư"
                  className="min-h-11 w-full rounded-full border border-input bg-background py-2.5 pl-9 pr-10 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
                {reviews.isFetching && searchDraft.trim() ? (
                  <ArrowPathIcon
                    className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                    aria-hidden="true"
                  />
                ) : searchDraft ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchDraft("");
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground active:scale-95"
                    aria-label="Xóa từ khóa tìm kiếm"
                  >
                    <XMarkIcon className="size-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </form>
            <div className="flex items-center gap-2 sm:shrink-0">
              <label
                htmlFor="review-sort"
                className="text-sm font-medium text-muted-foreground"
              >
                Sắp xếp
              </label>
              <Select
                value={sort}
                onValueChange={(value) => {
                  setSort(value === "oldest" ? "oldest" : "newest");
                  setPage(1);
                }}
              >
                <SelectTrigger id="review-sort" className="min-h-11 min-w-44 rounded-full font-semibold">
                  <SelectValue placeholder="Chọn thứ tự" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất trước</SelectItem>
                  <SelectItem value="oldest">Cũ nhất trước</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {reviews.isPending ? (
            <div
              className="space-y-3 p-4"
              role="status"
              aria-label="Đang tải toàn bộ hàng chờ"
            >
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : reviews.isError ? (
            <div className="p-6" role="alert">
              <p className="flex items-center gap-2 font-semibold text-destructive">
                <ExclamationCircleIcon className="size-5" aria-hidden="true" /> Không tải được hàng chờ
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {getApiErrorMessage(reviews.error)}
              </p>
              <Button
                type="button"
                onClick={() => void reviews.refetch()}
                className="mt-4 rounded-xl font-bold active:scale-[0.98]"
              >
                Thử lại
              </Button>
            </div>
          ) : totalCount === 0 ? (
            <div className="px-6 py-14 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <UserCircleIcon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-nunito text-lg font-bold">
                {search
                  ? "Không tìm thấy yêu cầu phù hợp"
                  : "Hàng chờ hiện trống"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Thử từ khóa khác để tìm gia sư."
                  : activeTab === "newProfiles"
                    ? "Chưa có hồ sơ mới cần xét duyệt."
                    : activeTab === "resubmittedProfiles"
                      ? "Chưa có hồ sơ gửi lại cần xét duyệt."
                      : "Chưa có thay đổi thông tin cần xét duyệt."}
              </p>
            </div>
          ) : activeTab !== "fieldChanges" ? (
            <div role="tabpanel" aria-label={activeTab === "newProfiles" ? "Hồ sơ mới" : "Duyệt lại hồ sơ"}>
              {profiles.map((profile) => (
                <ReviewQueueItem key={profile.profileId} profile={profile} />
              ))}
            </div>
          ) : (
            <div role="tabpanel" aria-label="Thay đổi thông tin">
              {fieldChanges.map((request) => (
                <FieldChangeItem
                  key={request.requestId}
                  request={request}
                  onReview={() => setSelectedChange(request)}
                />
              ))}
            </div>
          )}

          {!reviews.isPending && !reviews.isError && totalCount > 0 && (
            <nav
              aria-label="Phân trang xét duyệt"
              className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm sm:px-6"
            >
              <span className="text-muted-foreground">
                Trang {currentPage}/{pageCount}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="rounded-xl border-border bg-card font-bold text-foreground transition-all hover:border-primary hover:bg-card hover:text-primary active:scale-[0.98] disabled:opacity-40"
                >
                  Trước
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                  className="rounded-xl border-border bg-card font-bold text-foreground transition-all hover:border-primary hover:bg-card hover:text-primary active:scale-[0.98] disabled:opacity-40"
                >
                  Tiếp
                </Button>
              </div>
            </nav>
          )}
        </section>
      </div>
      <FieldChangeDialog
        request={selectedChange}
        onClose={() => setSelectedChange(null)}
      />
    </main>
  );
}

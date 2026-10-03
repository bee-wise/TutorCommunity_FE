"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  CircleNotch,
  MagnifyingGlass,
  NotePencil,
  UserCircle,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import type { ReviewQueue } from "../api/consultant-reviews.api";
import { formatReviewDate, readableFieldName } from "../data/profile-fields";
import { sortBySubmittedAt, type ReviewSort } from "../data/review-sort";
import { useReviewList } from "../hooks/useConsultantReviews";
import type {
  PendingFieldChange,
  PendingProfile,
} from "../schemas/consultant-review.schema";
import { FieldChangeDialog } from "./FieldChangeDialog";

const PAGE_SIZE = 20;

function ReviewQueueItem({ profile }: { profile: PendingProfile }) {
  return (
    <article className="grid min-w-0 gap-4 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
      <div className="flex min-w-0 gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
          <UserCircle size={22} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-nunito text-base font-extrabold text-foreground">
            {profile.displayName ||
              profile.tutorFullName ||
              "Gia sư chưa đặt tên"}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {profile.tutorEmail || profile.profileId}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-foreground">
            {profile.profileHeadline ||
              [profile.universityName, profile.major]
                .filter(Boolean)
                .join(" · ") ||
              "Chưa có giới thiệu"}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Nộp lúc {formatReviewDate(profile.submittedAt)}
          </p>
        </div>
      </div>
      <Link
        href={`/consultant/tutors/${encodeURIComponent(profile.profileId)}`}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-card px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Bắt đầu xét duyệt <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

function FieldChangeItem({
  request,
  onReview,
}: {
  request: PendingFieldChange;
  onReview: () => void;
}) {
  return (
    <article className="grid min-w-0 gap-4 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
      <div className="flex min-w-0 gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-secondary">
          <NotePencil size={21} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-nunito text-base font-extrabold text-foreground">
            {readableFieldName(request.fieldName)}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {request.requestedByFullName ||
              request.requestedByEmail ||
              "Gia sư"}
            {request.requestedByFullName && request.requestedByEmail
              ? ` · ${request.requestedByEmail}`
              : ""}
          </p>
          <p className="mt-1 line-clamp-2 break-words text-sm text-foreground">
            {request.newValue || "Giá trị trống"}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Yêu cầu lúc {formatReviewDate(request.requestedAt)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReview}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary bg-card px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Xem thay đổi <ArrowRight size={16} aria-hidden="true" />
      </button>
    </article>
  );
}

export function ConsultantReviewsScreen() {
  const [queue, setQueue] = useState<ReviewQueue>("profiles");
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

  const reviews = useReviewList({ queue, search });

  const sortedProfiles = useMemo(
    () => sortBySubmittedAt(reviews.data?.profiles ?? [], sort),
    [reviews.data?.profiles, sort],
  );
  const sortedChanges = useMemo(
    () => sortBySubmittedAt(reviews.data?.fieldChanges ?? [], sort),
    [reviews.data?.fieldChanges, sort],
  );
  const totalCount =
    queue === "profiles" ? sortedProfiles.length : sortedChanges.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const profiles = sortedProfiles.slice(start, start + PAGE_SIZE);
  const fieldChanges = sortedChanges.slice(start, start + PAGE_SIZE);

  function switchQueue(next: ReviewQueue) {
    setQueue(next);
    setPage(1);
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchDraft.trim());
    setPage(1);
  }

  return (
    <main className="min-w-0 bg-muted/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-primary">Khu vực xét duyệt</p>
            <h1 className="mt-1 font-nunito text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Hồ sơ gia sư
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Xử lý hồ sơ mới và các yêu cầu chỉnh sửa đã gửi lên.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void reviews.refetch()}
            disabled={reviews.isFetching}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <ArrowClockwise size={17} aria-hidden="true" /> Làm mới
          </button>
        </header>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-4 sm:px-6">
            <div
              className="flex rounded-lg bg-muted p-1"
              role="tablist"
              aria-label="Loại yêu cầu xét duyệt"
            >
              <button
                role="tab"
                aria-selected={queue === "profiles"}
                type="button"
                onClick={() => switchQueue("profiles")}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${queue === "profiles" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Hồ sơ mới
              </button>
              <button
                role="tab"
                aria-selected={queue === "fieldChanges"}
                type="button"
                onClick={() => switchQueue("fieldChanges")}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${queue === "fieldChanges" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Thay đổi thông tin
              </button>
            </div>
            {!reviews.isPending && !reviews.isError && (
              <span className="rounded-md border border-border px-2.5 py-1 text-xs font-bold text-red-600">
                {totalCount} chờ xử lý
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <form onSubmit={applySearch} className="flex min-w-0 flex-1 gap-2">
              <label htmlFor="review-search" className="sr-only">
                Tìm gia sư
              </label>
              <div className="relative min-w-0 max-w-md flex-1">
                <MagnifyingGlass
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="review-search"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  placeholder="Tên hoặc email gia sư"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                {reviews.isFetching && searchDraft.trim() ? (
                  <CircleNotch
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Xóa từ khóa tìm kiếm"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </form>
            <div className="flex items-center gap-2">
              <label
                htmlFor="review-sort"
                className="text-sm font-medium text-muted-foreground"
              >
                Sắp xếp
              </label>
              <select
                id="review-sort"
                value={sort}
                onChange={(event) => {
                  setSort(
                    event.target.value === "oldest" ? "oldest" : "newest",
                  );
                  setPage(1);
                }}
                className="min-h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="newest">Mới nhất trước</option>
                <option value="oldest">Cũ nhất trước</option>
              </select>
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
                  className="h-20 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : reviews.isError ? (
            <div className="p-6" role="alert">
              <p className="flex items-center gap-2 font-semibold text-destructive">
                <WarningCircle size={20} /> Không tải được hàng chờ
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {getApiErrorMessage(reviews.error)}
              </p>
              <button
                type="button"
                onClick={() => void reviews.refetch()}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Thử lại
              </button>
            </div>
          ) : totalCount === 0 ? (
            <div className="px-6 py-14 text-center">
              <UserCircle
                size={32}
                className="mx-auto text-secondary"
                aria-hidden="true"
              />
              <h2 className="mt-3 font-nunito text-lg font-bold">
                {search
                  ? "Không tìm thấy yêu cầu phù hợp"
                  : "Hàng chờ hiện trống"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Thử từ khóa khác để tìm gia sư."
                  : queue === "profiles"
                    ? "Chưa có hồ sơ mới cần xét duyệt."
                    : "Chưa có thay đổi thông tin cần xét duyệt."}
              </p>
            </div>
          ) : queue === "profiles" ? (
            <div role="tabpanel" aria-label="Hồ sơ mới">
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
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="rounded-lg border border-border bg-card px-3 py-2 font-semibold text-foreground hover:border-primary hover:text-primary disabled:opacity-40"
                >
                  Trước
                </button>
                <button
                  type="button"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                  className="rounded-lg border border-border bg-card px-3 py-2 font-semibold text-foreground hover:border-primary hover:text-primary disabled:opacity-40"
                >
                  Tiếp
                </button>
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

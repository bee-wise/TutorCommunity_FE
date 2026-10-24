"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import {
  formatProfileReviewStatus,
  formatReviewDate,
  type ProfileFieldName,
} from "../data/profile-fields";
import type { ProfileReview } from "../schemas/consultant-review.schema";
import { ProfileReviewComparisonOverview } from "./ProfileReviewComparisonOverview";

const LIST_HREF = "/consultant/tutors";

export function ProfileReviewHeader({
  profileId,
  review,
  reviewable,
  resubmittedFields,
  onLocateField,
}: {
  profileId: string;
  review?: ProfileReview;
  reviewable: boolean;
  resubmittedFields?: ProfileFieldName[];
  onLocateField: (field: ProfileFieldName) => void;
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const statusLabel = reviewable
    ? review?.reviewCount
      ? "Chờ duyệt lại"
      : "Đang chờ duyệt"
    : formatProfileReviewStatus(review?.status);

  async function copyProfileId() {
    await navigator.clipboard.writeText(profileId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <header className="rounded-3xl bg-primary px-5 py-5 text-primary-foreground shadow-[var(--shadow-soft)] sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-primary-foreground/40 bg-card px-3.5 font-bold text-primary transition-all hover:bg-card/90 active:scale-[0.98]"
          >
            <Link href={LIST_HREF}>
              <ArrowLeftIcon className="size-4" aria-hidden="true" /> Về hàng
              chờ
            </Link>
          </Button>
          {review && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInfoOpen(true)}
              className="h-10 rounded-xl border-primary-foreground/40 bg-card px-3.5 font-bold text-primary transition-all hover:bg-card/90 active:scale-[0.98]"
            >
              <InformationCircleIcon className="size-4" aria-hidden="true" />{" "}
              Thông tin hồ sơ
            </Button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary-foreground/80">
              {review?.reviewCount
                ? "Duyệt lại hồ sơ gia sư"
                : "Xét duyệt hồ sơ gia sư"}
            </p>
            <h1 className="mt-1 truncate font-nunito text-2xl font-extrabold leading-tight sm:text-3xl">
              {review?.profile.displayName || "Hồ sơ gia sư"}
            </h1>
          </div>
          {review && (
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${reviewable ? "bg-accent text-accent-foreground" : "border border-primary-foreground/50 text-primary-foreground"}`}
            >
              {statusLabel}
            </span>
          )}
        </div>
      </header>

      {review && resubmittedFields && (
        <ProfileReviewComparisonOverview
          reviewCount={review.reviewCount}
          fields={resubmittedFields}
          onLocateField={onLocateField}
        />
      )}

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-xl rounded-3xl border-border">
          <DialogHeader className="text-left">
            <span className="mb-2 flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <InformationCircleIcon className="size-5" aria-hidden="true" />
            </span>
            <DialogTitle className="font-nunito text-xl font-extrabold text-foreground">
              Thông tin hồ sơ
            </DialogTitle>
            <DialogDescription>
              Định danh và trạng thái của lượt xét duyệt này.
            </DialogDescription>
          </DialogHeader>

          {review && (
            <dl className="divide-y divide-border rounded-2xl border border-border px-4 text-sm">
              <div className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
                <dt className="text-muted-foreground">Tên hiển thị</dt>
                <dd className="font-semibold text-foreground">
                  {review.profile.displayName || "Chưa đặt tên"}
                </dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
                <dt className="text-muted-foreground">Trạng thái</dt>
                <dd className="font-semibold text-foreground">{statusLabel}</dd>
              </div>
              <div className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
                <dt className="text-muted-foreground">Mã hồ sơ</dt>
                <dd className="flex min-w-0 items-center gap-2">
                  <span className="min-w-0 break-all font-mono text-xs text-foreground">
                    {profileId}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-xs"
                    onClick={() => void copyProfileId()}
                    className="size-8 shrink-0 rounded-lg border-border text-primary transition-all active:scale-95"
                    aria-label={
                      copied ? "Đã sao chép mã hồ sơ" : "Sao chép mã hồ sơ"
                    }
                  >
                    {copied ? (
                      <CheckIcon className="size-4" aria-hidden="true" />
                    ) : (
                      <ClipboardDocumentIcon
                        className="size-4"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                </dd>
              </div>
              {review.reviewedAt && (
                <div className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
                  <dt className="text-muted-foreground">Xử lý gần nhất</dt>
                  <dd className="font-semibold text-foreground">
                    {formatReviewDate(review.reviewedAt)}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setInfoOpen(false)}
              className="rounded-xl font-bold active:scale-[0.98]"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

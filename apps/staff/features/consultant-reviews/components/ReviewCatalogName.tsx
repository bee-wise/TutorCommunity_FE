"use client";

import type { ReviewCatalogResource } from "../api/consultant-reviews.api";
import { useReviewCatalogName } from "../hooks/useConsultantReviews";

export function ReviewCatalogName({ resource, id }: { resource: ReviewCatalogResource; id: string }) {
  const name = useReviewCatalogName(resource, id);
  return (
    <span className="inline-flex max-w-full flex-col">
      <span className="font-semibold">{name.data || (name.isPending ? "Đang tải tên..." : "Chưa tra được tên")}</span>
      {!name.data && <span className="break-all text-xs text-muted-foreground">Mã: {id}</span>}
    </span>
  );
}

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { readableFieldName, safeDocumentUrl } from "../data/profile-fields";
import { formatReviewFieldNumber, formatReviewFieldText } from "../data/review-value-format";
import { ReviewCatalogName } from "./ReviewCatalogName";

export function ReviewValue({ value, fieldName, depth = 0 }: { value: unknown; fieldName?: string | null; depth?: number }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">Chưa cung cấp</span>;
  }
  if (typeof value === "boolean") return <span>{value ? "Có" : "Không"}</span>;
  if (typeof value === "number") return <span>{formatReviewFieldNumber(fieldName ?? undefined, value)}</span>;
  if (typeof value === "string") {
    const resource = fieldName === "universityId" ? "universities"
      : fieldName === "majorId" ? "majors"
      : fieldName === "specializationIds" ? "specializations"
      : null;
    if (resource && /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value)) {
      return <ReviewCatalogName resource={resource} id={value} />;
    }
    const url = safeDocumentUrl(value);
    const linkLabel = fieldName === "videoUrl" ? "Xem video"
      : fieldName === "avatarUrl" || fieldName === "imageUrl" ? "Xem ảnh"
      : "Mở tài liệu";
    return url ? (
      <a className="inline-flex max-w-full items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 break-all font-semibold text-primary transition-all hover:border-primary hover:text-primary/80 active:scale-[0.98]" href={url} target="_blank" rel="noopener noreferrer">
        {linkLabel} <ArrowTopRightOnSquareIcon className="size-4 shrink-0" aria-hidden="true" />
      </a>
    ) : <span className="break-words whitespace-pre-wrap">{formatReviewFieldText(fieldName ?? undefined, value)}</span>;
  }
  if (Array.isArray(value)) {
    if (!value.length) return <span className="text-muted-foreground">Chưa có mục nào</span>;
    return (
      <div className="space-y-2">
        {value.map((item: unknown, index) => (
          <div key={index} className="rounded-xl border border-border bg-background px-3 py-2">
            <span className="mr-2 text-xs font-semibold text-muted-foreground">{index + 1}.</span>
            <ReviewValue value={item} fieldName={fieldName} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    if (depth > 4) return <span className="text-muted-foreground">Dữ liệu lồng nhau</span>;
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return <span className="text-muted-foreground">Chưa có dữ liệu</span>;
    return (
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        {entries.map(([key, item]) => (
          <div key={key} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{readableFieldName(key)}</dt>
            <dd className="mt-0.5 text-sm"><ReviewValue value={item} fieldName={key} depth={depth + 1} /></dd>
          </div>
        ))}
      </dl>
    );
  }
  return <span className="text-muted-foreground">Không thể hiển thị dữ liệu</span>;
}

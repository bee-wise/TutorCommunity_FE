import { ArrowSquareOut } from "@phosphor-icons/react";
import { readableFieldName, safeDocumentUrl } from "../data/profile-fields";

export function ReviewValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground">Chưa cung cấp</span>;
  }
  if (typeof value === "boolean") return <span>{value ? "Có" : "Không"}</span>;
  if (typeof value === "number") return <span>{value.toLocaleString("vi-VN")}</span>;
  if (typeof value === "string") {
    const url = safeDocumentUrl(value);
    return url ? (
      <a className="inline-flex max-w-full items-center gap-1 break-all font-medium text-primary underline-offset-2 hover:underline" href={url} target="_blank" rel="noopener noreferrer">
        Mở tài liệu <ArrowSquareOut size={15} aria-hidden />
      </a>
    ) : <span className="break-words whitespace-pre-wrap">{value}</span>;
  }
  if (Array.isArray(value)) {
    if (!value.length) return <span className="text-muted-foreground">Chưa có mục nào</span>;
    return (
      <div className="space-y-2">
        {value.map((item: unknown, index) => (
          <div key={index} className="rounded-lg border border-border bg-muted/30 px-3 py-2">
            <span className="mr-2 text-xs font-semibold text-muted-foreground">{index + 1}.</span>
            <ReviewValue value={item} depth={depth + 1} />
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
            <dd className="mt-0.5 text-sm"><ReviewValue value={item} depth={depth + 1} /></dd>
          </div>
        ))}
      </dl>
    );
  }
  return <span className="text-muted-foreground">Không thể hiển thị dữ liệu</span>;
}

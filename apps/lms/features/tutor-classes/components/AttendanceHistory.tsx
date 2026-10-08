import { ChevronDownIcon } from "@heroicons/react/20/solid";
import type { AttendanceRevision } from "../types/classes.types";
import { formatClassDate } from "../utils/classes.utils";
import { classOutlineButton } from "./classes-ui";

export function AttendanceHistory({ revisions, sessionId }: { revisions: readonly AttendanceRevision[]; sessionId: string }) {
  const recent = revisions.filter((revision) => revision.next.sessionId === sessionId).slice(-5).reverse();
  return (
    <details className="group/history">
      <summary className={`${classOutlineButton} inline-flex w-fit cursor-pointer list-none items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden`}>
        Lịch sử lưu điểm danh<ChevronDownIcon className="size-4 transition-transform group-open/history:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
      </summary>
      <ol className="mt-3 space-y-2">
        {recent.map((revision) => (
          <li key={revision.next.version} className="rounded-xl border border-border bg-muted/30 px-3.5 py-3">
            <p className="text-xs font-bold">Phiên bản {revision.next.version}: {revision.next.state === "confirmed" ? "Đã xác nhận" : "Bản nháp"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatClassDate(revision.next.updatedAt)}</p>
          </li>
        ))}
      </ol>
      {!recent.length && <p className="mt-3 text-xs text-muted-foreground">Chưa có lịch sử lưu trong phiên này.</p>}
    </details>
  );
}

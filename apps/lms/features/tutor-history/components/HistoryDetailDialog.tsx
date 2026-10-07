import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/ui/dialog";
import { actionClass, primaryActionClass } from "@/components/lms-page-ui";
import type { HistoryConnection } from "../types/history.types";
import { formatHistoryDate } from "../utils/history.utils";
import { HistoryStatusBadge } from "./HistoryStatusBadge";

const STAGES: Record<string, string> = { WAITING_FOR_TUTOR: "Chờ gia sư phản hồi", DISCUSSING: "Trao đổi nhu cầu học", TRIAL_SCHEDULED: "Đã hẹn học thử", AWAITING_DECISION: "Chờ xác nhận sau học thử", CONVERTED_TO_CLASS: "Đã tạo lớp" };

export function HistoryDetailDialog({ connection, onClose }: { connection: HistoryConnection | null; onClose: () => void }) {
  return (
    <Dialog open={!!connection} onOpenChange={(open) => { if (!open) onClose(); }}>
      {connection && <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl border-border bg-card p-5 shadow-soft sm:p-6">
        <DialogHeader className="pr-6 text-left"><DialogTitle className="font-nunito text-xl font-extrabold leading-relaxed text-primary">{connection.learnerName}</DialogTitle><DialogDescription className="break-all">Mã kết nối: {connection.id}</DialogDescription></DialogHeader>
        <HistoryStatusBadge status={connection.status} />
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Ngày kết nối</dt><dd className="mt-1 font-bold">{formatHistoryDate(connection.createdAt)}</dd></div>
          <div><dt className="text-muted-foreground">Cập nhật gần nhất</dt><dd className="mt-1 font-bold">{formatHistoryDate(connection.updatedAt)}</dd></div>
          <div><dt className="text-muted-foreground">Giai đoạn</dt><dd className="mt-1 font-bold">{STAGES[connection.stage] ?? "Chưa có thông tin"}</dd></div>
          {connection.closedAt && <div><dt className="text-muted-foreground">Ngày đóng cuộc trò chuyện</dt><dd className="mt-1 font-bold">{formatHistoryDate(connection.closedAt)}</dd></div>}
        </dl>
        {connection.closeReason && <div className="rounded-2xl border border-border p-4 text-sm"><p className="font-bold">Lý do đóng</p><p className="mt-2 whitespace-pre-wrap break-words leading-relaxed">{connection.closeReason}</p></div>}
        {!connection.roomId && <p className="text-sm text-muted-foreground">Chưa có cuộc trò chuyện khả dụng cho kết nối này.</p>}
        <DialogFooter className="gap-2 border-t border-border pt-4"><button type="button" onClick={onClose} className={actionClass}>Đóng</button>{connection.roomId && <Link href={`/lms/tutor/messages/${encodeURIComponent(connection.roomId)}`} className={primaryActionClass}>Xem cuộc trò chuyện</Link>}</DialogFooter>
      </DialogContent>}
    </Dialog>
  );
}

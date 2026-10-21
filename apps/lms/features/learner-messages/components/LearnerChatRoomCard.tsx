import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { LmsStatusBadge } from "../../../components/LmsStatusBadge";
import { formatClassIdentifier } from "../../tutor-classes/utils/classes.utils";

export interface LearnerChatRoom {
  id: string;
  code?: string | null;
  title?: string | null;
  status?: string | null;
  type?: string | null;
}

export function isArchivedRoom(room: LearnerChatRoom) {
  return room.status === "COMPLETED" || room.status === "CANCELLED";
}

export function LearnerChatRoomCard({ room }: { room: LearnerChatRoom }) {
  const archived = isArchivedRoom(room);
  const isGroup = room.type === "GROUP" || room.type === "group";
  return (
    <article className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-2 border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-primary"><ChatBubbleLeftRightIcon className="size-5" aria-hidden="true" /></span>
            <span className="font-mono text-xs font-bold text-muted-foreground">{formatClassIdentifier(room.code ?? room.id)}</span>
          </div>
          <LmsStatusBadge status={archived ? "cancelled" : "done"} label={archived ? "Đã kết thúc" : "Đang học"} />
        </div>
        <div className="space-y-2">
          <h3 className="line-clamp-1 font-lms text-lg font-extrabold">{room.title ?? "Lớp học"}</h3>
          <span className="inline-flex rounded-lg bg-muted px-2 py-1 text-[11px] font-bold text-muted-foreground">{isGroup ? "Lớp nhóm" : "Lớp 1 kèm 1"}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
        <Button asChild variant={archived ? "outline" : "default"} className="min-h-11 flex-1 px-4 text-xs">
          <Link href={`/lms/learner/chat/classes/${room.id}`}><ChatBubbleLeftRightIcon className="size-4" aria-hidden="true" />{archived ? "Xem tin nhắn" : "Mở tin nhắn lớp"}</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 px-3.5 text-xs"><Link href={`/lms/learner/classes/${room.id}/sessions`}>Buổi học</Link></Button>
      </div>
    </article>
  );
}

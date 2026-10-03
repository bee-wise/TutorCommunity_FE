import { CalendarDays, Hash, Info, UsersRound } from "lucide-react";
import { closeReasons } from "../data/workspace-options";
import { formatWorkspaceTime, initials } from "../utils/format";
import type { WorkspaceRoom } from "../types/workspace";

export function RoomDetails({ room }: { room: WorkspaceRoom }) {
  return (
    <aside className="h-full overflow-y-auto rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex items-center gap-2 text-primary">
        <Info className="size-4" />
        <h2 className="font-nunito text-sm font-extrabold text-foreground sm:text-base">
          Thông tin hỗ trợ
        </h2>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <UsersRound className="size-4 text-primary" />
          {room.kind === "group" ? "Kết nối 3 bên" : "Tư vấn riêng"}
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {room.kind === "group"
            ? "Tư vấn viên cùng học viên và gia sư trao đổi trong một phòng."
            : "Giao diện minh họa cho tư vấn viên trao đổi riêng với một người."}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Người tham gia
        </p>
        <div className="mt-2.5 space-y-2.5">
          {room.participants.map((person) => (
            <div key={person.id} className="flex items-center gap-2.5">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${
                  person.role === "CONSULTANT"
                    ? "bg-secondary/15 text-secondary"
                    : person.role === "TUTOR"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-primary"
                }`}
              >
                {initials(person.name)}
              </span>
              <span className="min-w-0">
                <strong className="block truncate text-xs font-bold text-foreground">
                  {person.name}
                </strong>
                <small className="text-[11px] text-muted-foreground">
                  {person.role === "LEARNER"
                    ? "Học viên"
                    : person.role === "TUTOR"
                      ? "Gia sư"
                      : "Tư vấn viên"}
                </small>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-border pt-4 text-xs">
        <div className="flex items-start gap-2 text-muted-foreground">
          <CalendarDays className="mt-0.5 size-4 shrink-0" />
          <span>
            Bắt đầu
            <br />
            <strong className="font-semibold text-foreground">
              {formatWorkspaceTime(room.createdAt, true)}
            </strong>
          </span>
        </div>

        {room.connectRequestId ? (
          <div className="flex items-start gap-2 text-muted-foreground">
            <Hash className="mt-0.5 size-4 shrink-0" />
            <span>
              Mã kết nối
              <br />
              <strong className="break-all font-mono text-[11px] font-medium text-foreground">
                {room.connectRequestId}
              </strong>
            </span>
          </div>
        ) : null}

        {room.status !== "ACTIVE" && room.closeReason ? (
          <div className="rounded-lg bg-muted/60 p-3 text-muted-foreground">
            <strong className="block text-xs font-semibold text-foreground">
              Lý do đóng
            </strong>
            {closeReasons.find(([value]) => value === room.closeReason)?.[1] ??
              room.closeReason}
            {room.closeNote ? (
              <p className="mt-1 text-xs">{room.closeNote}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {room.isMock ? (
        <p className="mt-5 rounded-lg bg-amber-500/10 p-2.5 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
          Dữ liệu minh họa chỉ tồn tại trong phiên xem thử. Chưa gửi hoặc nhận
          tin qua API.
        </p>
      ) : null}
    </aside>
  );
}

"use client";

import {
  BookOpenIcon,
  LifebuoyIcon as Headset,
} from "@heroicons/react/24/outline";
import type { ChatRoom, ChatParticipantRole } from "../types/messages.types";

interface ConsultantSupportBannerProps {
  room: ChatRoom;
  currentUserRole: ChatParticipantRole;
}

export function ConsultantSupportBanner({
  room,
}: ConsultantSupportBannerProps) {
  const consultantName = room.consultant?.name || "Tư vấn viên BeeWise";
  const isSupport = room.category === "SUPPORT";

  return (
    <div className="mx-auto my-4 max-w-lg rounded-2xl border border-border/80 bg-card p-4 text-center shadow-xs">
      <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
        <Headset width={22} height={22} className="text-secondary" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Kết nối thành công
      </div>

      <h2 className="mt-2 text-sm font-bold text-foreground">
        Tư vấn viên <span className="text-primary">{consultantName}</span> đang
        hỗ trợ
      </h2>

      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {isSupport
          ? `Tư vấn viên ${consultantName} sẽ trực tiếp hỗ trợ và giải đáp các thắc mắc của bạn.`
          : `Tư vấn viên ${consultantName} đang đồng hành hỗ trợ cuộc trò chuyện giữa ${room.learner?.name || "Học viên"} và ${room.tutor?.name || "Gia sư"}.`}
      </p>

      {room.hasLearningDetails !== false && room.subject && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 font-medium">
            <BookOpenIcon className="mr-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
            {room.subject} {room.gradeLevel ? `· ${room.gradeLevel}` : ""}
          </span>
          {room.teachingMode && (
            <span className="rounded-lg border border-border bg-muted/50 px-2.5 py-1 font-medium">
              {room.teachingMode === "ONLINE"
                ? "💻 Online"
                : room.teachingMode === "OFFLINE"
                  ? "🏠 Tại nhà"
                  : "🌐 Online & Tại nhà"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

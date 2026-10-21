"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  ChatBubbleLeftRightIcon as ChatsCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { useMessages } from "../hooks/useMessages";
import { getLastActiveChatRoomId } from "../constants/messages.utils";
import type { ChatParticipantRole } from "../types/messages.types";
import { ChatSidebar } from "./ChatSidebar";

const DUO_FLOWER =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_480/v1790241784/Bee_Robot_1.png";

export function MessagesScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { rooms, loading } = useMessages();
  const [hasRedirected, setHasRedirected] = useState(false);

  const currentUserRole = (user?.role?.toUpperCase() || "LEARNER") as ChatParticipantRole;
  const basePath =
    pathname?.startsWith("/learner/messages") || currentUserRole === "LEARNER"
      ? "/learner/messages"
      : "/tutor/messages";

  useEffect(() => {
    if (loading || hasRedirected) return;

    // Do not auto-redirect if explicitly viewing list (e.g. mobile back button)
    const isListView =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("list") === "true";

    if (isListView) return;

    if (rooms.length > 0) {
      const savedId = getLastActiveChatRoomId(currentUserRole);
      const savedRoom = savedId ? rooms.find((r) => r.id === savedId) : undefined;

      let targetRoomId: string;
      if (savedRoom) {
        targetRoomId = savedRoom.id;
      } else {
        // Find the newest room (by latest lastMessageAt or first in list)
        const newestRoom =
          [...rooms].sort((a, b) => {
            const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return timeB - timeA;
          })[0] ?? rooms[0];

        targetRoomId = newestRoom.id;
      }

      if (targetRoomId) {
        setHasRedirected(true);
        router.replace(`${basePath}/${targetRoomId}`);
      }
    }
  }, [loading, rooms, currentUserRole, basePath, hasRedirected, router]);

  return (
    <div className="flex h-full min-h-0 gap-4 overflow-hidden p-3 sm:p-4">
      <ChatSidebar />

      <div className="hidden min-w-0 flex-1 items-center justify-center rounded-2xl border border-border bg-card lg:flex">
        {loading || hasRedirected ? (
          <div className="max-w-sm px-8 text-center animate-pulse">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <ChatsCircleIcon width={30} height={30} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Đang mở cuộc trò chuyện...
            </p>
          </div>
        ) : (
          <div className="max-w-sm px-8 text-center">
            <Image
              src={DUO_FLOWER}
              alt="Ong BeeWise và robot trao nhau một bông hoa"
              width={240}
              height={180}
              className="mx-auto mb-4 h-auto w-60"
            />
            <h2 className="font-nunito text-xl font-black text-foreground">
              Chọn cuộc trò chuyện
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {rooms.length === 0
                ? "Chưa có cuộc trò chuyện nào."
                : "Xem lại trao đổi, lịch học thử và các bước xác nhận lớp ngay trong cuộc trò chuyện."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

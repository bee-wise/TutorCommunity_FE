"use client";

import { ChatsCircleIcon } from "@phosphor-icons/react";
import { ChatSidebar } from "./ChatSidebar";

export function MessagesScreen() {
  return (
    <div className="flex h-full min-h-0 gap-4 overflow-hidden p-3 sm:p-4">
      <ChatSidebar />

      <div className="hidden min-w-0 flex-1 items-center justify-center rounded-2xl border border-border bg-card lg:flex">
        <div className="max-w-sm px-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ChatsCircleIcon size={30} weight="duotone" aria-hidden="true" />
          </div>
          <h2 className="font-nunito text-xl font-black text-foreground">Chọn cuộc trò chuyện</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Xem lại trao đổi, lịch học thử và các bước xác nhận lớp ngay trong cuộc trò chuyện.
          </p>
        </div>
      </div>
    </div>
  );
}

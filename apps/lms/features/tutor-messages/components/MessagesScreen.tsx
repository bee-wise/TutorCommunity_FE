"use client";

import Image from "next/image";
import { ChatSidebar } from "./ChatSidebar";

const DUO_FLOWER =
  "https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/f_auto,q_auto,w_480/v1790241784/Bee_Robot_1.png";

export function MessagesScreen() {
  return (
    <div className="flex h-full min-h-0 gap-2 overflow-hidden p-2">
      <ChatSidebar />

      <div className="hidden min-w-0 flex-1 items-center justify-center rounded-2xl border border-border bg-card lg:flex">
        <div className="max-w-sm px-8 text-center">
          <Image
            src={DUO_FLOWER}
            alt="Ong BeeWise và robot trao nhau một bông hoa"
            width={240}
            height={180}
            className="mx-auto mb-4 h-auto w-60"
          />
          <h2 className="font-lms text-xl font-black text-foreground">Chọn cuộc trò chuyện</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Xem lại trao đổi, lịch học thử và các bước xác nhận lớp ngay trong cuộc trò chuyện.
          </p>
        </div>
      </div>
    </div>
  );
}

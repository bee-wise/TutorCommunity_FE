"use client";

import Image from "next/image";
import { ChatSidebar } from "./ChatSidebar";

export function MessagesScreen() {
  return (
    <div className="flex h-full gap-4 overflow-hidden p-4">
      <ChatSidebar />

      <div className="hidden flex-1 items-center justify-center rounded-2xl border border-dashed border-[#dce7f7] bg-white lg:flex">
        <div className="text-center">
          <div className="mx-auto mb-6 flex flex-col items-center justify-center gap-3">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f0f3f9] overflow-hidden">
              <Image
                src="/brand/beewise-logo-nobackground.PNG"
                alt="BeeWise Logo"
                fill
                sizes="80px"
                className="object-contain p-2"
              />
            </div>
            <span
              className="text-xl tracking-tight text-[#280f91]"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              CỘNG ĐỒNG GIA SƯ
            </span>
          </div>
          <h2 className="mb-2 text-lg font-extrabold text-[#0c0c0b]">
            Chọn cuộc trò chuyện
          </h2>
          <p className="max-w-xs text-sm text-[#667085]">
            Chọn một phòng chat từ danh sách bên trái để bắt đầu trao đổi với
            học viên và consultant.
          </p>
        </div>
      </div>
    </div>
  );
}

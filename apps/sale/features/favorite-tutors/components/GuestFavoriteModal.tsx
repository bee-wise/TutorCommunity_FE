"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/ui/dialog";
import { Heart, Sparkles } from "lucide-react";
import { useFavoriteAuthModalStore } from "../store/useFavoriteAuthModalStore";

export function GuestFavoriteModal() {
  const { isOpen, tutorName, closeModal } = useFavoriteAuthModalStore();
  const pathname = usePathname();

  const redirectParam = pathname
    ? `?redirect=${encodeURIComponent(pathname)}`
    : "";
  const loginHref = `/login${redirectParam}`;
  const registerHref = `/register${redirectParam}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md overflow-hidden rounded-3xl border border-[#cfe1fa] bg-white p-0 shadow-2xl">
        {/* Header decoration */}
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#280f91_0%,#3b18be_60%,#ffc500_150%)] px-6 pt-8 pb-7 text-white text-center">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[#ffc500]/20 blur-lg" />

          {/* Heart icon with badge */}
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg shadow-black/10">
            <Heart className="h-8 w-8 text-[#ffc500] fill-[#ffc500]" />
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ffc500] text-[#280f91]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          <DialogHeader className="space-y-2 text-center sm:text-center">
            <DialogTitle
              className="text-xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "var(--font-nunito-family)" }}
            >
              Lưu Gia Sư Yêu Thích
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-white/80 max-w-sm mx-auto">
              {tutorName ? (
                <>
                  Hãy đăng nhập hoặc đăng ký để lưu gia sư{" "}
                  <strong className="text-[#ffc500] font-bold">
                    {tutorName}
                  </strong>{" "}
                  vào danh sách yêu thích của bạn nhé!
                </>
              ) : (
                "Hãy đăng nhập hoặc đăng ký tài khoản BeeWise để lưu lại các gia sư bạn quan tâm và dễ dàng kết nối sau này."
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Modal Actions */}
        <div className="p-6 space-y-3 bg-white">
          {/* Action 1: Đăng nhập */}
          <Link
            href={loginHref}
            onClick={closeModal}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#280f91] px-5 py-3.5 text-sm font-extrabold text-white shadow-md shadow-[#280f91]/20 transition-all hover:bg-[#1f0b70] hover:shadow-lg hover:shadow-[#280f91]/30 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91]"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            <span>Đăng nhập</span>
          </Link>

          {/* Action 2: Đăng ký */}
          <Link
            href={registerHref}
            onClick={closeModal}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-[#ffc500] bg-[#fffdf0] px-5 py-3.5 text-sm font-extrabold text-[#8a5a00] transition-all hover:bg-[#ffc500] hover:text-[#0c0c0b] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffc500]"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            <span>Đăng ký tài khoản mới</span>
          </Link>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={closeModal}
            className="w-full pt-1 text-center text-xs font-semibold text-[#667085] hover:text-[#280f91] transition-colors"
          >
            Để sau
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

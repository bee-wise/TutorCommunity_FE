"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useAnimation, type PanInfo } from "motion/react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { toast } from "@workspace/ui/components/ui/bee-toast/useToastStore";
import Image from "next/image";

import { useMessages } from "../hooks/useMessages";

const SIZE = 64; // w-16 h-16 = 64px
const PADDING = 24; // bottom-6 right-6 = 24px
const HEADER_OFFSET = 88; // Chiều cao Header (64px) + khoảng đệm an toàn dưới Header (24px)
const STORAGE_KEY = "beewise_message_fab_corner";

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

/**
 * FAB kéo thả có nhớ vị trí góc từ localStorage.
 * Hỗ trợ chuyển hướng đến trang tin nhắn của LEARNER hoặc TUTOR.
 */
function DraggableFAB({
  href,
  unreadChatCount,
}: {
  href: string;
  unreadChatCount: number;
}) {
  const controls = useAnimation();
  const isDraggingRef = useRef(false);
  const [currentCorner, setCurrentCorner] = useState<Corner>("bottom-right");
  const [bounds, setBounds] = useState({ leftX: 0, topY: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Đọc góc đã lưu từ localStorage
    let savedCorner: Corner = "bottom-right";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Corner | null;
      if (
        stored === "bottom-left" ||
        stored === "top-left" ||
        stored === "top-right" ||
        stored === "bottom-right"
      ) {
        savedCorner = stored;
      }
    } catch {
      // Bỏ qua lỗi nếu môi trường không cho phép truy cập localStorage
    }
    setCurrentCorner(savedCorner);

    // 2. Tính toán bounds và đặt vị trí ngay lập tức vào đúng góc đã lưu
    const updatePosition = () => {
      const leftX = -(window.innerWidth - SIZE - PADDING * 2);
      const topY = -(window.innerHeight - SIZE - PADDING - HEADER_OFFSET);
      setBounds({ leftX, topY });

      const targetX = savedCorner.includes("left") ? leftX : 0;
      const targetY = savedCorner.includes("top") ? topY : 0;

      controls.set({ x: targetX, y: targetY });
      setIsReady(true);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [controls]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);

    const { leftX, topY } = bounds;
    const windowWidth =
      typeof window !== "undefined" ? window.innerWidth : 1000;
    const windowHeight =
      typeof window !== "undefined" ? window.innerHeight : 800;

    // Tự động hít về góc gần nhất (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
    const isLeft = info.point.x < windowWidth / 2;
    const isTop = info.point.y < windowHeight / 2;

    const targetX = isLeft ? leftX : 0;
    const targetY = isTop ? topY : 0;

    let newCorner: Corner = "bottom-right";
    if (isLeft && isTop) newCorner = "top-left";
    else if (!isLeft && isTop) newCorner = "top-right";
    else if (isLeft && !isTop) newCorner = "bottom-left";
    else newCorner = "bottom-right";

    setCurrentCorner(newCorner);

    // Lưu góc mới vào localStorage
    try {
      localStorage.setItem(STORAGE_KEY, newCorner);
    } catch {
      // Bỏ qua lỗi nếu storage đầy hoặc bị chặn
    }

    controls.start({
      x: targetX,
      y: targetY,
      transition: {
        type: "spring",
        stiffness: 450,
        damping: 32,
        mass: 0.8,
      },
    });
  };

  const isLeft = currentCorner.includes("left");

  return (
    <motion.div
      drag
      animate={controls}
      dragConstraints={{
        left: bounds.leftX,
        right: 0,
        top: bounds.topY,
        bottom: 0,
      }}
      dragElastic={0.15}
      dragMomentum={false}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      style={{ opacity: isReady ? 1 : 0 }}
      className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing select-none touch-none transition-opacity duration-150"
    >
      <Link
        href={href}
        aria-label="Tin nhắn"
        onClick={(e) => {
          if (isDraggingRef.current) {
            e.preventDefault();
          }
        }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl shadow-primary/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent"
        style={{
          background: "linear-gradient(135deg, #280f91 0%, #3d1fd4 100%)",
        }}
        draggable={false}
      >
        {/* Icon */}
        <Image
          src="/icons/beewise-message-icon.svg"
          alt="Tin nhắn"
          width={36}
          height={36}
          className="object-contain pointer-events-none"
          priority
          draggable={false}
        />

        {/* Unread badge & ping indicator */}
        {unreadChatCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center pointer-events-none">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span
              aria-label={`${unreadChatCount} tin nhắn chưa đọc`}
              className="relative flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-center text-[10px] font-bold leading-5 text-accent-foreground shadow-sm"
            >
              {unreadChatCount > 99 ? "99+" : unreadChatCount}
            </span>
          </span>
        )}

        {/* Unread message notification pill */}
        {unreadChatCount > 0 && (
          <div
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-card/95 px-3 py-1.5 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 animate-in fade-in ${
              isLeft ? "left-full ml-3" : "right-full mr-3"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold text-foreground">
                {unreadChatCount > 1
                  ? `${unreadChatCount} tin nhắn mới`
                  : "Tin nhắn mới"}
              </span>
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

/**
 * Component lắng nghe realtime chat rooms và tính toán số tin nhắn chưa đọc cho Learner và Tutor.
 */
function ActiveMessageFAB({ userRole }: { userRole: "LEARNER" | "TUTOR" }) {
  const user = useAuthStore((state) => state.user);
  const { rooms, loading } = useMessages();
  const isFirstRender = useRef(true);
  const prevUnreadRef = useRef<number | undefined>(undefined);

  const href = userRole === "TUTOR" ? "/tutor/messages" : "/learner/messages";

  const unreadFromRooms = rooms.reduce(
    (acc, room) => acc + (room.unreadCount || 0),
    0,
  );

  const unreadChatCount = loading
    ? Math.max(0, user?.unreadChatCount ?? 0)
    : Math.max(unreadFromRooms, user?.unreadChatCount ?? 0);

  // Hiển thị toast thông báo khi có tin nhắn mới phát sinh trong lúc đang duyệt web
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevUnreadRef.current = unreadChatCount;
      return;
    }

    if (
      prevUnreadRef.current !== undefined &&
      unreadChatCount > prevUnreadRef.current
    ) {
      toast.info("Bạn có tin nhắn mới!", {
        description: "Nhấn vào biểu tượng tin nhắn để mở cuộc trò chuyện.",
        duration: 4000,
      });
    }

    prevUnreadRef.current = unreadChatCount;
  }, [unreadChatCount]);

  return <DraggableFAB href={href} unreadChatCount={unreadChatCount} />;
}

/**
 * Floating message button shown on the screen.
 * Automatically snaps to the nearest corner (top-left, top-right, bottom-left, bottom-right)
 * when released, never staying in the middle of the screen.
 * Remembers the chosen corner in localStorage across page reloads.
 * Visible for authenticated LEARNER and TUTOR users in SALE.
 * Excluded on the messages pages and onboarding screen.
 */
export function MessageFAB() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const role = user?.role?.trim().toUpperCase();
  const isLearner = role === "LEARNER";
  const isTutor = role === "TUTOR";

  // Hide when: loading, unauthenticated, not learner or tutor, or already on messages page / onboarding
  const isOnMessagesPage =
    pathname?.startsWith("/learner/messages") ||
    pathname?.startsWith("/tutor/messages") ||
    pathname?.startsWith("/tutor/onboarding");

  if (isAuthLoading || !isAuthenticated || (!isLearner && !isTutor) || isOnMessagesPage) {
    return null;
  }

  return <ActiveMessageFAB userRole={isTutor ? "TUTOR" : "LEARNER"} />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { motion, useAnimation, type PanInfo } from "motion/react";
import { useAuthStore } from "@workspace/core/store/useAuthStore";

const SIZE = 64; // w-16 h-16 = 64px
const PADDING = 24; // bottom-6 right-6 = 24px
const HEADER_OFFSET = 88; // Chiều cao Header (64px) + khoảng đệm an toàn dưới Header (24px)
const STORAGE_KEY = "beewise_message_fab_corner";

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

/**
 * FAB kéo thả có nhớ vị trí góc từ localStorage.
 * Chỉ mount khi đã xác thực là LEARNER để đảm bảo DOM tồn tại khi khởi tạo vị trí.
 */
function DraggableFAB({ unreadChatCount }: { unreadChatCount: number }) {
  const controls = useAnimation();
  const isDraggingRef = useRef(false);
  const currentCornerRef = useRef<Corner>("bottom-right");
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
    currentCornerRef.current = savedCorner;

    // 2. Tính toán bounds và đặt vị trí ngay lập tức vào đúng góc đã lưu
    const updatePosition = () => {
      const leftX = -(window.innerWidth - SIZE - PADDING * 2);
      const topY = -(window.innerHeight - SIZE - PADDING - HEADER_OFFSET);
      setBounds({ leftX, topY });

      const targetX = currentCornerRef.current.includes("left") ? leftX : 0;
      const targetY = currentCornerRef.current.includes("top") ? topY : 0;

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

    currentCornerRef.current = newCorner;

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
        href="/learner/messages"
        aria-label="Tin nhắn"
        onClick={(e) => {
          if (isDraggingRef.current) {
            e.preventDefault();
          }
        }}
        className="flex h-16 w-16 items-center justify-center rounded-full shadow-2xl shadow-primary/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent"
        style={{
          background: "linear-gradient(135deg, #280f91 0%, #3d1fd4 100%)",
        }}
        draggable={false}
      >
        <ChatBubbleLeftRightIcon className="size-9 text-white pointer-events-none" aria-hidden="true" />

        {/* Unread badge */}
        {unreadChatCount > 0 && (
          <span
            aria-label={`${unreadChatCount} tin nhắn chưa đọc`}
            className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-center text-[10px] font-bold leading-5 text-accent-foreground pointer-events-none"
          >
            {unreadChatCount > 99 ? "99+" : unreadChatCount}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

/**
 * Floating message button shown on the screen.
 * Automatically snaps to the nearest corner (top-left, top-right, bottom-left, bottom-right)
 * when released, never staying in the middle of the screen.
 * Remembers the chosen corner in localStorage across page reloads.
 * Only visible for authenticated LEARNER users.
 * Excluded on the messages page itself.
 */
export function MessageFAB() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const unreadChatCount = Math.max(0, user?.unreadChatCount ?? 0);
  const isLearner = user?.role?.trim().toUpperCase() === "LEARNER";

  // Hide when: loading, unauthenticated, not learner, or already on messages page
  const isOnMessagesPage = pathname?.startsWith("/learner/messages") ?? false;

  if (isAuthLoading || !isAuthenticated || !isLearner || isOnMessagesPage) {
    return null;
  }

  return <DraggableFAB unreadChatCount={unreadChatCount} />;
}

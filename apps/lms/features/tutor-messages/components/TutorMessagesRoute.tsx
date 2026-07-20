"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@workspace/core/store/useAuthStore";

import { MessagesScreen } from "./MessagesScreen";
import { ChatRoomScreen } from "./ChatRoomScreen";

export function TutorMessagesRoute({
  screen,
  chatRoomId,
}: {
  screen: "messages" | "chat-room";
  chatRoomId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (loading) return;
    if (!authenticated || !user) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname || "")}`);
      return;
    }
    // Tutor Auth check
    const role = user?.role?.trim().toUpperCase();
    if (role !== "TUTOR") {
      router.replace("/");
    }
  }, [loading, authenticated, user, router, pathname]);

  if (
    loading ||
    !authenticated ||
    !user ||
    user.role?.trim().toUpperCase() !== "TUTOR"
  ) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden bg-[#f7f9fd] text-[#17142f]">
      <main className="flex-1 overflow-hidden">
        {screen === "messages" ? (
          <MessagesScreen />
        ) : (
          <ChatRoomScreen chatRoomId={chatRoomId} />
        )}
      </main>
    </div>
  );
}

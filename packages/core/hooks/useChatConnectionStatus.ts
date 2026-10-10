"use client";

import { useSyncExternalStore } from "react";
import {
  isChatRealtimeReady,
  subscribeToChatRealtimeStatus,
} from "../sys-libs/centrifugo";

export function useChatConnectionStatus(userId: string | undefined): boolean {
  return useSyncExternalStore(
    subscribeToChatRealtimeStatus,
    () => isChatRealtimeReady(userId),
    () => false,
  );
}

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { PublicationContext, Subscription } from "centrifuge";
import { UnauthorizedError } from "centrifuge";
import { getCentrifuge } from "../configs/centrifugo";
import { centrifugoService } from "../services/centrifugo.service";
import { handleApiError } from "../sys-libs/error-handler";
import { useAuthStore } from "../store/useAuthStore";
import { classChatService } from "./chat.service";

// Class token authorizes a personal notification channel, never a connection-chat room.
// Sharing that channel must not unsubscribe another notification consumer.
export function useClassChatRealtime(
  actorId: string,
  classId: string,
  enabled: boolean,
  key: readonly unknown[],
) {
  const client = useQueryClient();
  const keyHash = JSON.stringify(key);
  useEffect(() => {
    if (!enabled || !actorId) return;
    const controller = new AbortController();
    let disposed = false,
      owned = false,
      subscription: Subscription | undefined;
    const invalidate = () => {
      if (!disposed)
        void client.invalidateQueries({
          queryKey: JSON.parse(keyHash) as readonly unknown[],
        });
    };
    const denied = () => {
      if (!disposed)
        void client.resetQueries({
          queryKey: JSON.parse(keyHash) as readonly unknown[],
        });
    };
    const publication = (ctx: PublicationContext) => {
      // Event payload is only a hint, never render its content/identity as a message.
      // Unknown personal-notification envelopes conservatively refetch the authorized class.
      const data: unknown = ctx.data;
      if (
        data &&
        typeof data === "object" &&
        "classId" in data &&
        typeof data.classId === "string" &&
        data.classId !== classId
      )
        return;
      invalidate();
    };
    async function setup() {
      try {
        const grant = await classChatService.subscription(
          classId,
          controller.signal,
        );
        if (disposed || useAuthStore.getState().user?.id !== actorId) return;
        const socket = getCentrifuge();
        if (!socket) return;
        subscription = socket.getSubscription(grant.channel) ?? undefined;
        if (!subscription) {
          owned = true;
          const channel = grant.channel;
          subscription = socket.newSubscription(channel, {
            token: grant.token,
            getToken: async () => {
              try {
                const fresh = disposed
                  ? (await centrifugoService.getSubscriptionToken()).data
                  : await classChatService.subscription(classId);
                if (
                  useAuthStore.getState().user?.id !== actorId ||
                  !fresh ||
                  !fresh.token ||
                  fresh.channel !== channel
                )
                  throw new UnauthorizedError("Phiên đăng ký đã đổi.");
                return fresh.token;
              } catch (e) {
                if ([401, 403].includes(handleApiError(e).statusCode)) {
                  denied();
                  throw new UnauthorizedError("Không còn quyền chat lớp.");
                }
                throw new Error("Chưa làm mới được đăng ký chat lớp.");
              }
            },
          });
        }
        subscription.on("publication", publication);
        subscription.on("subscribed", invalidate);
        subscription.subscribe();
        socket.connect();
      } catch (e) {
        if (!disposed && [401, 403].includes(handleApiError(e).statusCode))
          denied();
      }
    }
    void setup();
    return () => {
      disposed = true;
      controller.abort();
      if (subscription) {
        subscription.removeListener("publication", publication);
        subscription.removeListener("subscribed", invalidate);
        if (owned && subscription.listeners("publication").length === 0) {
          subscription.unsubscribe();
          getCentrifuge()?.removeSubscription(subscription);
        }
      }
    };
  }, [actorId, classId, enabled, client, keyHash]);
}

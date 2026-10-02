"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  PublicationContext,
  SubscribedContext,
  SubscribingContext,
  Subscription,
  SubscriptionErrorContext,
} from "centrifuge";
import {
  connectCentrifugo,
  disconnectCentrifugo,
  getCentrifuge,
  setCentrifugoToken,
} from "../configs/centrifugo";
import { centrifugoService } from "../services/centrifugo.service";
import { useCentrifugoStore } from "../store/useCentrifugoStore";

export function useCentrifugo() {
  const status = useCentrifugoStore((state) => state.status);
  const error = useCentrifugoStore((state) => state.error);

  const connect = useCallback((token?: string) => {
    connectCentrifugo(token);
  }, []);

  const disconnect = useCallback(() => {
    disconnectCentrifugo();
  }, []);

  const setToken = useCallback((token: string) => {
    setCentrifugoToken(token);
  }, []);

  return {
    status,
    error,
    isConnected: status === "connected",
    isConnecting: status === "connecting",
    connect,
    disconnect,
    setToken,
    getCentrifuge,
  };
}

export interface UseCentrifugoSubscriptionOptions<T = unknown> {
  enabled?: boolean;
  chatRoomId?: string;
  token?: string;
  onPublication?: (data: T, ctx: PublicationContext) => void;
  onSubscribed?: (ctx: SubscribedContext) => void;
  onSubscribing?: (ctx: SubscribingContext) => void;
  onError?: (ctx: SubscriptionErrorContext) => void;
}

export function useCentrifugoSubscription<T = unknown>(
  channel: string | null | undefined,
  options: UseCentrifugoSubscriptionOptions<T> = {},
) {
  const { enabled = true, chatRoomId, token, onPublication, onSubscribed, onSubscribing, onError } = options;
  const status = useCentrifugoStore((state) => state.status);
  const subRef = useRef<Subscription | null>(null);
  const onPublicationRef = useRef(onPublication);
  const onSubscribedRef = useRef(onSubscribed);
  const onSubscribingRef = useRef(onSubscribing);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onPublicationRef.current = onPublication;
    onSubscribedRef.current = onSubscribed;
    onSubscribingRef.current = onSubscribing;
    onErrorRef.current = onError;
  }, [onPublication, onSubscribed, onSubscribing, onError]);

  useEffect(() => {
    if (!enabled || !channel || status === "disconnected" || typeof window === "undefined") {
      return;
    }

    const client = getCentrifuge();
    if (!client) return;

    let sub = client.getSubscription(channel);
    if (!sub) {
      sub = client.newSubscription(channel, {
        token: token || undefined,
        getToken: async () => {
          try {
            const res = await centrifugoService.getSubscriptionToken(chatRoomId);
            if (res.success && res.data?.token) {
              return res.data.token;
            }
          } catch {
            // Không có quyền đăng ký channel này
          }
          return "";
        },
      });
    }
    subRef.current = sub;

    const pubHandler = (ctx: PublicationContext) => {
      onPublicationRef.current?.(ctx.data as T, ctx);
    };

    const subHandler = (ctx: SubscribedContext) => {
      onSubscribedRef.current?.(ctx);
    };

    const subscribingHandler = (ctx: SubscribingContext) => {
      onSubscribingRef.current?.(ctx);
    };

    const errHandler = (ctx: SubscriptionErrorContext) => {
      onErrorRef.current?.(ctx);
    };

    sub.on("publication", pubHandler);
    sub.on("subscribed", subHandler);
    sub.on("subscribing", subscribingHandler);
    sub.on("error", errHandler);

    sub.subscribe();

    return () => {
      if (sub) {
        sub.removeListener("publication", pubHandler);
        sub.removeListener("subscribed", subHandler);
        sub.removeListener("subscribing", subscribingHandler);
        sub.removeListener("error", errHandler);
        sub.unsubscribe();
      }
    };
  }, [channel, enabled, status, chatRoomId, token]);

  return {
    subscriptionRef: subRef,
  };
}

"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import {
  PublicationContext,
  SubscribedContext,
  SubscribingContext,
  Subscription,
  SubscriptionErrorContext,
  SubscriptionState,
  UnauthorizedError,
} from "centrifuge";
import {
  connectCentrifugo,
  disconnectCentrifugo,
  getCentrifuge,
  setCentrifugoToken,
} from "../configs/centrifugo";
import { centrifugoService } from "../services/centrifugo.service";
import { useCentrifugoStore } from "../store/useCentrifugoStore";
import { ApiError } from "../sys-libs/error-handler";

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
  const hasConnection = status !== "disconnected";
  const subRef = useRef<Subscription | null>(null);
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>(SubscriptionState.Unsubscribed);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
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
    if (!enabled || !channel || !hasConnection || typeof window === "undefined") {
      return;
    }

    const client = getCentrifuge();
    if (!client) return;

    let active = true;
    let sub = client.getSubscription(channel);
    if (!sub) {
      sub = client.newSubscription(channel, {
        token: token || undefined,
        getToken: async () => {
          try {
            const res = await centrifugoService.getSubscriptionToken(chatRoomId);
            if (!res.success || !res.data?.token) {
              throw new Error("Máy chủ chưa cấp token đăng ký phòng chat.");
            }
            if (res.data.channel && res.data.channel !== channel) {
              throw new UnauthorizedError("Token không thuộc kênh đang mở.");
            }
            return res.data.token;
          } catch (error) {
            if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
              throw new UnauthorizedError("Không có quyền đăng ký kênh này.");
            }
            throw error;
          }
        },
      });
    }
    subRef.current = sub;
    queueMicrotask(() => {
      if (active) setSubscriptionState(sub.state);
    });

    const pubHandler = (ctx: PublicationContext) => {
      onPublicationRef.current?.(ctx.data as T, ctx);
    };

    const subHandler = (ctx: SubscribedContext) => {
      setSubscriptionState(SubscriptionState.Subscribed);
      setSubscriptionError(null);
      onSubscribedRef.current?.(ctx);
    };

    const subscribingHandler = (ctx: SubscribingContext) => {
      setSubscriptionState(SubscriptionState.Subscribing);
      onSubscribingRef.current?.(ctx);
    };

    const unsubscribedHandler = (ctx: { reason: string }) => {
      setSubscriptionState(SubscriptionState.Unsubscribed);
      setSubscriptionError(ctx.reason || "Đăng ký realtime đã dừng.");
    };

    const errHandler = (ctx: SubscriptionErrorContext) => {
      setSubscriptionError(ctx.error?.message || "Không thể đăng ký realtime.");
      onErrorRef.current?.(ctx);
    };

    sub.on("publication", pubHandler);
    sub.on("subscribed", subHandler);
    sub.on("subscribing", subscribingHandler);
    sub.on("unsubscribed", unsubscribedHandler);
    sub.on("error", errHandler);

    if (sub.state === SubscriptionState.Unsubscribed) sub.subscribe();

    return () => {
      active = false;
      if (sub) {
        sub.removeListener("publication", pubHandler);
        sub.removeListener("subscribed", subHandler);
        sub.removeListener("subscribing", subscribingHandler);
        sub.removeListener("unsubscribed", unsubscribedHandler);
        sub.removeListener("error", errHandler);
        sub.unsubscribe();
        client.removeSubscription(sub);
      }
      subRef.current = null;
    };
  }, [channel, enabled, hasConnection, chatRoomId, token]);

  return {
    subscriptionRef: subRef,
    state: hasConnection ? subscriptionState : SubscriptionState.Unsubscribed,
    error: subscriptionError,
  };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { connectRequestsApi } from "@workspace/core/api/connect-requests.api";
import { useConnectRequestEligibility, useCreateConnectRequest } from "@workspace/core/hooks/useConnectRequests";
import { ensureChatRoomSubscribed } from "@workspace/core/services/chat-room-subscription.service";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { ApiError, getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { queryKeys } from "@workspace/core/sys-libs/queryKeys";

export type ConnectPhase = "idle" | "creating" | "checkingStatus" | "findingRoom" | "subscribing" | "redirecting" | "roomError" | "subscriptionError" | "navigationError" | "requestError";

const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

async function findCreatedRoomId(tutorUserId: string, connectRequestId?: string): Promise<string> {
  for (const delay of [0, 800, 1500, 2500]) {
    if (delay) await wait(delay);
    try {
      const eligibility = await connectRequestsApi.getEligibility();
      if (eligibility.activeTutorId === tutorUserId && eligibility.activeChatRoomId) {
        return eligibility.activeChatRoomId;
      }
      const requests = await connectRequestsApi.listOutbound();
      const match = requests.find((request) =>
        request.chatRoomId &&
        (connectRequestId ? request.id === connectRequestId : request.tutorId === tutorUserId && request.status === "ACTIVE"),
      );
      if (match?.chatRoomId) return match.chatRoomId;
    } catch {
      // The next attempt may see the request after backend propagation.
    }
  }
  throw new Error("Kết nối đã được gửi, nhưng chưa tìm thấy phòng chat. Hãy kiểm tra lại, không gửi yêu cầu mới.");
}

export function useTutorConnectFlow(tutorUserId: string | undefined) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<ConnectPhase>("idle");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [connectRequestId, setConnectRequestId] = useState<string | undefined>();
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const submitInFlight = useRef(false);
  const roomOpenInFlight = useRef(false);
  const navigationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const eligibility = useConnectRequestEligibility(open);
  const createRequest = useCreateConnectRequest();
  const isProcessing = phase === "creating" || phase === "checkingStatus" || phase === "findingRoom" || phase === "subscribing" || phase === "redirecting";
  const isLearner = isAuthenticated && user?.role?.toUpperCase() === "LEARNER";

  useEffect(() => () => {
    if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
  }, []);

  const navigateToRoom = (id: string) => {
    setPhase("redirecting");
    void queryClient.invalidateQueries({ queryKey: queryKeys.saleChatRooms.list });
    router.push(`/learner/messages/${encodeURIComponent(id)}`);
    if (navigationTimeout.current) clearTimeout(navigationTimeout.current);
    navigationTimeout.current = setTimeout(() => {
      setPhase("navigationError");
      setError("Phòng chat đã sẵn sàng nhưng trang chuyển chậm. Bạn có thể mở lại cuộc trò chuyện.");
    }, 12_000);
  };

  const setDialogOpen = (nextOpen: boolean) => {
    if (!nextOpen && isProcessing) return;
    setOpen(nextOpen);
    if (nextOpen && !requestSubmitted) {
      setPhase("idle");
      setError(null);
    }
  };

  const openChat = async (id: string) => {
    if (roomOpenInFlight.current) return;
    roomOpenInFlight.current = true;
    setRoomId(id);
    setError(null);
    setPhase("subscribing");
    try {
      await ensureChatRoomSubscribed(id);
      navigateToRoom(id);
    } catch (subscriptionError) {
      setPhase("subscriptionError");
      setError(getApiErrorMessage(subscriptionError, "Không thể đăng ký phòng chat. Vui lòng thử lại."));
    } finally {
      roomOpenInFlight.current = false;
    }
  };

  const resolveRoom = async (targetTutorId: string, requestId?: string) => {
    setPhase("findingRoom");
    try {
      const id = await findCreatedRoomId(targetTutorId, requestId);
      await openChat(id);
    } catch (lookupError) {
      setPhase("roomError");
      setError(getApiErrorMessage(lookupError));
    }
  };

  const confirm = async () => {
    if (submitInFlight.current || isProcessing || !isLearner || !tutorUserId) return;
    if (requestSubmitted) {
      await resolveRoom(tutorUserId, connectRequestId);
      return;
    }
    if (eligibility.data?.canCreateConnection === false) return;
    submitInFlight.current = true;
    setPhase("creating");
    setError(null);
    try {
      const created = await createRequest.mutateAsync({ tutorId: tutorUserId });
      setRequestSubmitted(true);
      setConnectRequestId(created?.connectRequestId);
      if (created?.chatRoomId) {
        await openChat(created.chatRoomId);
      } else {
        await resolveRoom(tutorUserId, created?.connectRequestId);
      }
    } catch (requestError) {
      setPhase("checkingStatus");
      const current = await eligibility.refetch();
      if (current.data?.activeChatRoomId && current.data.activeTutorId === tutorUserId) {
        setRequestSubmitted(true);
        await openChat(current.data.activeChatRoomId);
        return;
      }
      if (current.data?.activeConnectRequestId && current.data.activeTutorId === tutorUserId) {
        setRequestSubmitted(true);
        setConnectRequestId(current.data.activeConnectRequestId);
        await resolveRoom(tutorUserId, current.data.activeConnectRequestId);
        return;
      }
      if (current.data?.activeChatRoomId) {
        setRoomId(current.data.activeChatRoomId);
        setPhase("requestError");
        setError("Bạn đang có một kết nối hoạt động. Có thể mở cuộc trò chuyện hiện tại.");
        return;
      }
      setPhase("requestError");
      setError(requestError instanceof ApiError && requestError.statusCode === 409
        ? "Bạn đã có kết nối hoạt động. Hãy kiểm tra lại trạng thái trước khi gửi yêu cầu khác."
        : getApiErrorMessage(requestError, "Không thể gửi yêu cầu kết nối. Vui lòng thử lại."));
    } finally {
      submitInFlight.current = false;
    }
  };

  const retryStatus = async () => {
    if (isProcessing) return;
    setPhase("checkingStatus");
    setError(null);
    const current = await eligibility.refetch();
    if (current.data?.activeChatRoomId && current.data.activeTutorId === tutorUserId) {
      setRequestSubmitted(true);
      await openChat(current.data.activeChatRoomId);
    } else if (current.data?.activeConnectRequestId && current.data.activeTutorId === tutorUserId && tutorUserId) {
      setRequestSubmitted(true);
      setConnectRequestId(current.data.activeConnectRequestId);
      await resolveRoom(tutorUserId, current.data.activeConnectRequestId);
    } else if (current.data?.activeChatRoomId) {
      setRoomId(current.data.activeChatRoomId);
      setPhase("requestError");
      setError("Bạn đang có một kết nối hoạt động. Có thể mở cuộc trò chuyện hiện tại.");
    } else if (current.data?.canCreateConnection) {
      setError(null);
      setPhase("idle");
    } else {
      setPhase("requestError");
      setError(current.error
        ? getApiErrorMessage(current.error, "Không kiểm tra được trạng thái kết nối. Vui lòng thử lại.")
        : "Yêu cầu đang được xử lý. Vui lòng kiểm tra lại sau ít phút.");
    }
  };

  return {
    open,
    setDialogOpen,
    phase,
    roomId,
    requestSubmitted,
    error,
    isProcessing,
    isAuthLoading,
    isAuthenticated,
    isLearner,
    eligibility,
    confirm,
    retryStatus,
    retryRoom: () => tutorUserId ? resolveRoom(tutorUserId, connectRequestId) : undefined,
    retrySubscription: () => roomId ? openChat(roomId) : undefined,
    openExistingChat: (id: string) => openChat(id),
    continueWithoutRealtime: () => {
      if (!roomId) return;
      navigateToRoom(roomId);
    },
    forceOpenChat: () => roomId ? window.location.assign(`/learner/messages/${encodeURIComponent(roomId)}`) : undefined,
  };
}

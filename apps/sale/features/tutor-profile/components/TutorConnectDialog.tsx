"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChatsCircleIcon,
  CircleNotchIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import type { ReturnTypeUseTutorConnectFlow } from "../types/connect-flow.type";

interface TutorConnectDialogProps {
  profileId: string;
  tutorName: string;
  tutorUserId?: string;
  flow: ReturnTypeUseTutorConnectFlow;
}

export function TutorConnectDialog({
  profileId,
  tutorName,
  tutorUserId,
  flow,
}: TutorConnectDialogProps) {
  const { eligibility, phase, isProcessing, error, roomId, requestSubmitted } =
    flow;
  const [waitSeconds, setWaitSeconds] = useState(0);
  useEffect(() => {
    if (!isProcessing) return;
    const startedAt = Date.now();
    const timer = window.setInterval(
      () => setWaitSeconds(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [isProcessing]);
  const hasCreatedRequest =
    requestSubmitted ||
    phase === "findingRoom" ||
    phase === "subscribing" ||
    phase === "redirecting" ||
    phase === "roomError" ||
    phase === "subscriptionError" ||
    phase === "navigationError";
  const connectingChat = phase === "subscribing" || phase === "redirecting";
  const activeChatRoomId = roomId || eligibility.data?.activeChatRoomId;
  const profileHref = `/tutors/${profileId}${tutorUserId ? `?tutorUserId=${encodeURIComponent(tutorUserId)}` : ""}`;
  const loginHref = `/login?returnUrl=${encodeURIComponent(profileHref)}`;

  return (
    <Dialog open={flow.open} onOpenChange={flow.setDialogOpen}>
      <DialogContent
        className={`w-[calc(100vw-2rem)] max-w-md gap-0 rounded-2xl border-border bg-card p-0 shadow-xl ${isProcessing ? "[&>button]:hidden" : ""}`}
        onEscapeKeyDown={(event) => {
          if (isProcessing) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (isProcessing) event.preventDefault();
        }}
      >
        <div className="border-b border-border px-5 pb-5 pt-6 sm:px-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ChatsCircleIcon size={24} weight="duotone" aria-hidden="true" />
          </div>
          <DialogHeader className="pr-6 text-left">
            <DialogTitle className="font-nunito text-xl font-extrabold leading-tight text-foreground">
              Kết nối với {tutorName}
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-6 text-muted-foreground">
              BeeWise sẽ tạo cuộc trò chuyện với gia sư và tư vấn viên để bạn
              trao đổi mục tiêu học tập.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6" aria-live="polite">
          <div className="grid grid-cols-[26px_1fr] gap-x-3 gap-y-4 text-sm">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${hasCreatedRequest ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}
            >
              {hasCreatedRequest ? (
                <CheckCircleIcon size={17} weight="fill" aria-hidden="true" />
              ) : (
                "1"
              )}
            </span>
            <div>
              <p className="font-semibold text-foreground">
                Gửi yêu cầu kết nối
              </p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {phase === "creating"
                  ? "Đang tạo phòng chat cho bạn..."
                  : phase === "checkingStatus"
                    ? "Đang kiểm tra kết quả từ máy chủ..."
                    : hasCreatedRequest
                      ? "Yêu cầu đã được tạo."
                      : "Bạn xác nhận trước khi gửi yêu cầu."}
              </p>
            </div>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${connectingChat ? "bg-accent text-accent-foreground" : "border border-border bg-muted text-muted-foreground"}`}
            >
              {phase === "redirecting" ? (
                <CheckCircleIcon size={17} weight="fill" aria-hidden="true" />
              ) : (
                "2"
              )}
            </span>
            <div>
              <p className="font-semibold text-foreground">
                Đăng ký trò chuyện
              </p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {phase === "findingRoom"
                  ? "Đang tìm phòng chat vừa tạo..."
                  : phase === "subscribing"
                    ? "Đang kết nối realtime..."
                    : phase === "redirecting"
                      ? "Đang mở cuộc trò chuyện..."
                      : "Bạn sẽ được chuyển vào chat ngay khi kết nối xong."}
              </p>
            </div>
          </div>

          {isProcessing && (
            <div
              role="status"
              className="flex items-center gap-2.5 rounded-xl border border-primary bg-card px-3 py-2.5 text-xs font-semibold text-primary"
            >
              <CircleNotchIcon
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
              {phase === "creating"
                ? "Đang gửi yêu cầu..."
                : phase === "checkingStatus"
                  ? "Đang xác minh yêu cầu..."
                  : phase === "findingRoom"
                    ? "Đang chờ phòng chat sẵn sàng..."
                    : phase === "subscribing"
                      ? "Đang đăng ký phòng chat..."
                      : "Đang chuyển trang..."}
            </div>
          )}
          {isProcessing && waitSeconds >= 6 && (
            <p className="text-xs leading-5 text-muted-foreground">
              Máy chủ đang phản hồi chậm hơn thường lệ. BeeWise vẫn đang xử lý,
              vui lòng giữ trang này mở.
            </p>
          )}

          {!isProcessing && error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-destructive bg-card px-3 py-3 text-xs leading-5 text-destructive"
            >
              <WarningCircleIcon
                size={17}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}

          {!isProcessing && flow.isAuthLoading && (
            <p
              role="status"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CircleNotchIcon
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
              Đang kiểm tra tài khoản...
            </p>
          )}
          {!isProcessing &&
            !flow.isAuthLoading &&
            flow.isLearner &&
            eligibility.isPending && (
              <p
                role="status"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CircleNotchIcon
                  size={17}
                  className="animate-spin"
                  aria-hidden="true"
                />
                Đang kiểm tra điều kiện kết nối...
              </p>
            )}
          {!isProcessing &&
            !requestSubmitted &&
            !flow.isAuthLoading &&
            flow.isLearner &&
            eligibility.error && (
              <p role="alert" className="text-sm text-destructive">
                {getApiErrorMessage(eligibility.error)}
              </p>
            )}
          {!isProcessing &&
            !requestSubmitted &&
            !flow.isAuthLoading &&
            flow.isLearner &&
            eligibility.data?.canCreateConnection === false &&
            !activeChatRoomId && (
              <p className="text-sm leading-6 text-muted-foreground">
                Bạn đang có một kết nối hoạt động. Hãy hoàn tất kết nối hiện tại
                trước khi gửi yêu cầu mới.
              </p>
            )}
          {!isProcessing &&
            !requestSubmitted &&
            !flow.isAuthLoading &&
            flow.isLearner &&
            eligibility.data?.canCreateConnection === false &&
            activeChatRoomId && (
              <p className="text-sm leading-6 text-muted-foreground">
                Bạn đã có một cuộc trò chuyện kết nối đang hoạt động.
              </p>
            )}
          {!isProcessing &&
            !flow.isAuthLoading &&
            flow.isLearner &&
            eligibility.data?.canCreateConnection &&
            !tutorUserId && (
              <p role="alert" className="text-sm leading-6 text-destructive">
                Thông tin tài khoản gia sư chưa sẵn sàng để kết nối. Vui lòng
                thử lại sau.
              </p>
            )}
        </div>

        <DialogFooter className="gap-2 border-t border-border px-5 py-4 sm:px-6 sm:space-x-0">
          {!isProcessing && (
            <button
              type="button"
              onClick={() => flow.setDialogOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Để sau
            </button>
          )}
          {!flow.isAuthLoading && !flow.isAuthenticated && (
            <Link
              href={loginHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:brightness-90"
            >
              Đăng nhập để kết nối{" "}
              <ArrowRightIcon size={16} aria-hidden="true" />
            </Link>
          )}
          {!flow.isAuthLoading && flow.isAuthenticated && !flow.isLearner && (
            <p className="text-sm text-muted-foreground">
              Chỉ tài khoản học viên có thể gửi yêu cầu kết nối.
            </p>
          )}
          {flow.isLearner &&
            !requestSubmitted &&
            eligibility.error &&
            !isProcessing && (
              <button
                type="button"
                onClick={() => void eligibility.refetch()}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
              >
                Thử lại
              </button>
            )}
          {flow.isLearner &&
            !isProcessing &&
            activeChatRoomId &&
            (eligibility.data?.canCreateConnection === false ||
              phase === "requestError") && (
              <button
                type="button"
                onClick={() => void flow.openExistingChat(activeChatRoomId)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
              >
                Mở cuộc trò chuyện{" "}
                <ArrowRightIcon size={16} aria-hidden="true" />
              </button>
            )}
          {flow.isLearner &&
            !isProcessing &&
            (phase === "roomError" ||
              (phase === "idle" && requestSubmitted && !roomId)) && (
              <button
                type="button"
                onClick={() => void flow.retryRoom()}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
              >
                Tìm lại phòng chat
              </button>
            )}
          {flow.isLearner && !isProcessing && phase === "subscriptionError" && (
            <>
              <button
                type="button"
                onClick={() => void flow.continueWithoutRealtime()}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-primary px-4 text-sm font-semibold text-primary"
              >
                Mở chat ngay
              </button>
              <button
                type="button"
                onClick={() => void flow.retrySubscription()}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
              >
                Kết nối lại
              </button>
            </>
          )}
          {flow.isLearner && !isProcessing && phase === "navigationError" && (
            <button
              type="button"
              onClick={() => flow.forceOpenChat()}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
            >
              Mở lại trang chat
            </button>
          )}
          {flow.isLearner &&
            !isProcessing &&
            phase === "requestError" &&
            !activeChatRoomId && (
              <button
                type="button"
                onClick={() => void flow.retryStatus()}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
              >
                Kiểm tra lại trạng thái
              </button>
            )}
          {flow.isLearner &&
            !isProcessing &&
            phase === "idle" &&
            !requestSubmitted &&
            eligibility.data?.canCreateConnection &&
            !tutorUserId && (
              <Link
                href="/tutors"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
              >
                Xem danh sách gia sư
              </Link>
            )}
          {flow.isLearner &&
            !isProcessing &&
            phase === "idle" &&
            !requestSubmitted &&
            eligibility.data?.canCreateConnection &&
            tutorUserId && (
              <button
                type="button"
                onClick={() => void flow.confirm()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:brightness-90"
              >
                Xác nhận kết nối <ArrowRightIcon size={16} aria-hidden="true" />
              </button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

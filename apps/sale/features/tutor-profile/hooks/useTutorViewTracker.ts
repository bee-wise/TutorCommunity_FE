import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { tutorProfileService } from "../services/tutor-profile.service";
import { tutorProfileQueryKeys } from "../queryKeys";
import { ApiError } from "@workspace/core/sys-libs/error-handler";

function generateViewId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useTutorViewTracker(tutorProfileId?: string | null) {
  const queryClient = useQueryClient();
  const sessionRef = useRef<{
    profileId: string;
    viewId: string;
    status: "idle" | "in_flight" | "success" | "failed";
    retryCount: number;
    timerId?: ReturnType<typeof setTimeout>;
  }>({
    profileId: "",
    viewId: "",
    status: "idle",
    retryCount: 0,
  });

  useEffect(() => {
    // Only run in browser environment and when valid tutorProfileId is available
    if (typeof window === "undefined" || !tutorProfileId) return;

    // If profile changed, reset the session and generate a fresh viewId for the new profile
    if (sessionRef.current.profileId !== tutorProfileId) {
      if (sessionRef.current.timerId) {
        clearTimeout(sessionRef.current.timerId);
      }
      sessionRef.current = {
        profileId: tutorProfileId,
        viewId: generateViewId(),
        status: "idle",
        retryCount: 0,
      };
    }

    const session = sessionRef.current;
    if (session.status === "success" || session.status === "in_flight") {
      return;
    }

    let isDisposed = false;

    const executeRecord = async () => {
      if (session.status === "success") return;
      session.status = "in_flight";

      try {
        const response = await tutorProfileService.recordTutorView(
          session.profileId,
          session.viewId,
        );

        session.status = "success";

        const recordStatus = response.data?.status;
        if (recordStatus === "COUNTED" || recordStatus === "DUPLICATE") {
          // Invalidate and refetch total views for this specific profile
          void queryClient.invalidateQueries({
            queryKey: tutorProfileQueryKeys.views(session.profileId),
          });
        }
      } catch (error) {
        session.status = "failed";

        // Check if error is non-retryable
        const statusCode =
          error instanceof ApiError
            ? error.statusCode
            : (error as { status?: number; response?: { status?: number } })
                ?.response?.status ??
              (error as { status?: number })?.status;

        // Stop retry on 400, 404, 409, 429
        if (
          statusCode === 400 ||
          statusCode === 404 ||
          statusCode === 409 ||
          statusCode === 429
        ) {
          return;
        }

        // If component unmounted, do not schedule retry
        if (isDisposed) return;

        // Maximum 1 retry on network timeout/error or 503, keeping the SAME viewId
        if (session.retryCount < 1) {
          session.retryCount += 1;
          session.timerId = setTimeout(() => {
            if (!isDisposed) {
              void executeRecord();
            }
          }, 2000);
        }
      }
    };

    void executeRecord();

    return () => {
      isDisposed = true;
      if (session.timerId) {
        clearTimeout(session.timerId);
        session.timerId = undefined;
      }
    };
  }, [tutorProfileId, queryClient]);
}

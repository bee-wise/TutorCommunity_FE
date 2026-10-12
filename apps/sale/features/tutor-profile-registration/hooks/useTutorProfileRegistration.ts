"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authService } from "@workspace/core/services/auth.service";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import {
  tutorProfileDefaultValues,
  tutorProfileFormSchema,
  type TutorProfileFormValues,
} from "../schemas/profile-registration.schema";
import { tutorProfileRegistrationService, tutorProfileReviewQueryKey } from "../services/profile-registration.service";
import type { PendingNavigation } from "../types/profile-registration.types";
import { buildTutorProfileDraftPayload } from "../utils/build-draft-payload";
import { buildTutorProfileReviewPatch } from "../utils/build-review-patch";
import { resolveLiveTutorOnboardingScenario } from "../../tutor-onboarding/schemas/live-tutor-onboarding";

const DRAFT_GUARD_STATE_KEY = "__tutorProfileDraftGuard";
const PROFILE_QUERY_KEY = ["tutor-profile", "registration"] as const;

export function useTutorProfileRegistration() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const isReviewCorrection = user ? resolveLiveTutorOnboardingScenario(user) === "rejected" : false;
  const profileExistsRef = useRef(false);
  const initialValuesRef = useRef<TutorProfileFormValues | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigation | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const allowNavigationRef = useRef(false);
  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileFormSchema),
    defaultValues: tutorProfileDefaultValues,
    mode: "onBlur",
  });

  const reviewQuery = useQuery({
    queryKey: tutorProfileReviewQueryKey,
    queryFn: tutorProfileRegistrationService.getReview,
    enabled: isReviewCorrection,
    retry: false,
  });
  const profileQuery = useQuery({
    queryKey: isReviewCorrection ? [...PROFILE_QUERY_KEY, "rejected"] : PROFILE_QUERY_KEY,
    queryFn: async () => isReviewCorrection
      ? tutorProfileRegistrationService.getRejectedProfile(
          await queryClient.fetchQuery({
            queryKey: tutorProfileReviewQueryKey,
            queryFn: tutorProfileRegistrationService.getReview,
            staleTime: 30_000,
          }),
        )
      : tutorProfileRegistrationService.getProfile(),
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.data) {
      profileExistsRef.current = true;
      if (!form.formState.isDirty) {
        initialValuesRef.current = profileQuery.data;
        form.reset(profileQuery.data);
      }
    }
  }, [form, form.formState.isDirty, isReviewCorrection, profileQuery.data]);

  const persistDraft = useCallback(async (values: TutorProfileFormValues) => {
    const result = await tutorProfileRegistrationService.saveDraft(values, profileExistsRef.current);
    profileExistsRef.current = true;
    initialValuesRef.current = values;
    queryClient.setQueryData(PROFILE_QUERY_KEY, values);
    void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY, refetchType: "none" });
    return result;
  }, [queryClient]);

  const saveMutation = useMutation({
    mutationFn: persistDraft,
    onSuccess: (_result, savedValues) => {
      const currentValues = form.getValues();
      form.reset(savedValues);
      if (JSON.stringify(currentValues) !== JSON.stringify(savedValues)) {
        form.reset(currentValues, { keepDefaultValues: true });
      }
      toast.success("Đã lưu bản nháp", { description: "Bạn có thể quay lại hoàn thiện hồ sơ bất kỳ lúc nào.", position: "top-right" });
    },
    onError: (error) => toast.error("Chưa thể lưu bản nháp", { description: getApiErrorMessage(error), position: "top-right" }),
  });

  const submitMutation = useMutation({
    mutationFn: (values: TutorProfileFormValues) => {
      if (isReviewCorrection) {
        const initialValues = initialValuesRef.current;
        if (!initialValues) throw new Error("Chưa tải xong hồ sơ cần chỉnh sửa.");
        return tutorProfileRegistrationService.submitReviewPatch(
          buildTutorProfileReviewPatch(values, initialValues),
        );
      }
      return tutorProfileRegistrationService.submit(values);
    },
    onSuccess: async (result) => {
      allowNavigationRef.current = true;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY, refetchType: "none" }),
        queryClient.invalidateQueries({ queryKey: tutorProfileReviewQueryKey, refetchType: "none" }),
      ]);
      try {
        const meResponse = await authService.getMe();
        if (meResponse.success && meResponse.data) {
          const refreshedUser = meResponse.data;
          login(refreshedUser.tutorProfileStatus?.trim().toUpperCase() === "REJECTED"
            ? { ...refreshedUser, tutorProfileStatus: result.tutorProfileStatus ?? "PENDING_REVIEW" }
            : refreshedUser);
        } else if (user) {
          login({ ...user, tutorProfileStatus: result.tutorProfileStatus ?? "PENDING_REVIEW" });
        }
      } catch {
        if (user) login({ ...user, tutorProfileStatus: result.tutorProfileStatus ?? "PENDING_REVIEW" });
      }
      toast.success("Đã gửi hồ sơ", { description: "BeeWise sẽ xét duyệt hồ sơ trước khi mở Phỏng vấn AI.", position: "top-right" });
      router.replace("/tutor/onboarding");
    },
    onError: (error) => toast.error("Chưa thể gửi hồ sơ", { description: getApiErrorMessage(error), position: "top-right" }),
  });

  const saveAndLeave = useCallback(async () => {
    if (!pendingNavigation || isLeaving) return;
    setIsLeaving(true);
    try {
      if (!isReviewCorrection) await persistDraft(form.getValues());
      allowNavigationRef.current = true;
      if (pendingNavigation.kind === "history") {
        window.history.go(-2);
      } else {
        window.location.assign(pendingNavigation.href);
      }
    } catch (error) {
      setIsLeaving(false);
      toast.error(isReviewCorrection ? "Chưa thể rời trang" : "Chưa thể lưu bản nháp", { description: getApiErrorMessage(error), position: "top-right" });
    }
  }, [form, isLeaving, isReviewCorrection, pendingNavigation, persistDraft]);

  useEffect(() => {
    const guardedUrl = window.location.href;
    if (
      form.formState.isDirty &&
      window.history.state?.[DRAFT_GUARD_STATE_KEY] !== guardedUrl
    ) {
      window.history.pushState(
        { ...window.history.state, [DRAFT_GUARD_STATE_KEY]: guardedUrl },
        "",
        guardedUrl,
      );
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!form.formState.isDirty || allowNavigationRef.current) return;
      if (isReviewCorrection) {
        event.preventDefault();
        return;
      }
      void fetch("/api/tutors/profile", {
        method: profileExistsRef.current ? "PUT" : "POST",
        credentials: "include",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildTutorProfileDraftPayload(form.getValues())),
      });
      event.preventDefault();
    };
    const handleLinkClick = (event: MouseEvent) => {
      if (
        !form.formState.isDirty || allowNavigationRef.current || event.defaultPrevented ||
        event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      ) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (
        !anchor || (anchor.target && anchor.target !== "_self") ||
        anchor.hasAttribute("download") || anchor.href === window.location.href
      ) return;
      event.preventDefault();
      setPendingNavigation({ kind: "link", href: anchor.href });
    };
    const handlePopState = (event: PopStateEvent) => {
      if (
        window.location.href !== guardedUrl ||
        event.state?.[DRAFT_GUARD_STATE_KEY] === guardedUrl
      ) return;

      // The first Back reaches this page's original entry. Restore the guard
      // synchronously so the confirmation can render before leaving the route.
      window.history.pushState(
        { ...window.history.state, [DRAFT_GUARD_STATE_KEY]: guardedUrl },
        "",
        guardedUrl,
      );
      if (form.formState.isDirty && !allowNavigationRef.current) {
        setPendingNavigation({ kind: "history" });
      } else {
        window.history.go(-2);
      }
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      allowNavigationRef.current = false;
      setIsLeaving(false);
      setPendingNavigation(null);
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("click", handleLinkClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("click", handleLinkClick, true);
      if (
        window.location.href !== guardedUrl &&
        window.history.state?.[DRAFT_GUARD_STATE_KEY] === guardedUrl
      ) {
        const nextState = { ...window.history.state };
        delete nextState[DRAFT_GUARD_STATE_KEY];
        window.history.replaceState(nextState, "", window.location.href);
      }
    };
  }, [form, form.formState.isDirty, isReviewCorrection, queryClient]);

  return {
    form,
    profileQuery,
    reviewQuery,
    isReviewCorrection,
    pendingNavigation,
    isSaving: saveMutation.isPending || isLeaving,
    isSubmitting: submitMutation.isPending,
    saveDraft: () => saveMutation.mutate(form.getValues()),
    submit: form.handleSubmit((values) => submitMutation.mutate(values)),
    cancelLeave: () => setPendingNavigation(null),
    saveAndLeave,
  };
}

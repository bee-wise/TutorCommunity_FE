"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { tutorProfileRegistrationService } from "../services/profile-registration.service";
import type { PendingNavigation } from "../types/profile-registration.types";

export function useTutorProfileRegistration() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const profileExistsRef = useRef(false);
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigation | null>(null);
  const allowNavigationRef = useRef(false);
  const form = useForm<TutorProfileFormValues>({
    resolver: zodResolver(tutorProfileFormSchema),
    defaultValues: tutorProfileDefaultValues,
    mode: "onBlur",
  });

  const profileQuery = useQuery({
    queryKey: ["tutor-profile", "registration"],
    queryFn: tutorProfileRegistrationService.getProfile,
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.data) {
      form.reset(profileQuery.data);
      profileExistsRef.current = true;
    }
  }, [form, profileQuery.data]);

  const saveMutation = useMutation({
    mutationFn: (values: TutorProfileFormValues) =>
      tutorProfileRegistrationService.saveDraft(values, profileExistsRef.current),
    onSuccess: () => {
      profileExistsRef.current = true;
      form.reset(form.getValues());
      toast.success("Đã lưu bản nháp", { description: "Bạn có thể quay lại hoàn thiện hồ sơ bất kỳ lúc nào.", position: "top-right" });
    },
    onError: (error) => toast.error("Chưa thể lưu bản nháp", { description: getApiErrorMessage(error), position: "top-right" }),
  });

  const submitMutation = useMutation({
    mutationFn: (values: TutorProfileFormValues) => tutorProfileRegistrationService.submit(values),
    onSuccess: async () => {
      allowNavigationRef.current = true;
      const meResponse = await authService.getMe();
      if (meResponse.success && meResponse.data) login(meResponse.data);
      const status = meResponse.data?.tutorProfileStatus?.trim().toUpperCase();
      toast.success("Đã gửi hồ sơ", { description: "Tiếp theo, hãy hoàn thành phỏng vấn năng lực cùng Trợ lý AI.", position: "top-right" });
      router.replace(status === "PENDING_REVIEW" ? "/tutor/onboarding?scenario=interview" : "/tutor/onboarding");
    },
    onError: (error) => toast.error("Chưa thể gửi hồ sơ", { description: getApiErrorMessage(error), position: "top-right" }),
  });

  const saveAndLeave = useCallback(async () => {
    const target = pendingNavigation?.href;
    if (!target) return;
    try {
      await tutorProfileRegistrationService.saveDraft(form.getValues(), profileExistsRef.current);
      allowNavigationRef.current = true;
      window.location.assign(target);
    } catch (error) {
      toast.error("Chưa thể lưu bản nháp", { description: getApiErrorMessage(error), position: "top-right" });
    }
  }, [form, pendingNavigation]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!form.formState.isDirty || allowNavigationRef.current) return;
      const values = form.getValues();
      void fetch("/api/tutors/profile", {
        method: profileExistsRef.current ? "PUT" : "POST",
        credentials: "include",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      event.preventDefault();
    };
    const handleLinkClick = (event: MouseEvent) => {
      if (!form.formState.isDirty || allowNavigationRef.current || event.defaultPrevented) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.href === window.location.href) return;
      event.preventDefault();
      setPendingNavigation({ href: anchor.href });
    };
    const handlePopState = () => {
      if (!form.formState.isDirty || allowNavigationRef.current) return;
      const destination = window.location.href;
      window.history.forward();
      setPendingNavigation({ href: destination });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleLinkClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [form, form.formState.isDirty]);

  return {
    form,
    profileQuery,
    pendingNavigation,
    isSaving: saveMutation.isPending,
    isSubmitting: submitMutation.isPending,
    saveDraft: () => saveMutation.mutate(form.getValues()),
    submit: form.handleSubmit((values) => submitMutation.mutate(values)),
    cancelLeave: () => setPendingNavigation(null),
    saveAndLeave,
  };
}

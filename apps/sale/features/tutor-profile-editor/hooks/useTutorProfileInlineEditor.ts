"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { getApiErrorMessage } from "@workspace/core/sys-libs/error-handler";
import { mockTutorProfile } from "../../tutor-profile/types/mockTutorProfile";
import { tutorProfileQueryKeys } from "../../tutor-profile/queryKeys";
import {
  tutorProfileDefaultValues,
  tutorProfileFormSchema,
  type TutorProfileFormValues,
} from "../../tutor-profile-registration/schemas/profile-registration.schema";
import { tutorProfileRegistrationService } from "../../tutor-profile-registration/services/profile-registration.service";
import { tutorProfileEditorService } from "../services/profile-editor.service";
import type {
  ProfileBlockId,
  ProfileSectionPatch,
} from "../types/profile-editor.types";
import {
  mapDraftToPreview,
  seedDraftFromTutor,
  type CatalogNames,
} from "../utils/profile-preview.mapper";

const devPreviewDraft = seedDraftFromTutor(mockTutorProfile);

export function useTutorProfileInlineEditor() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const isDevPreview = !user || user.id.startsWith("preview-");
  const tutorProfileId = user?.tutorProfileId || user?.id;

  const draftQuery = useQuery({
    queryKey: ["tutor-profile", "editor", "draft"],
    queryFn: tutorProfileEditorService.getDraft,
    enabled: !isDevPreview,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
  const publicQuery = useQuery({
    queryKey: ["tutor-profile", "editor", "public", tutorProfileId],
    queryFn: () => tutorProfileEditorService.getPublicProfile(tutorProfileId!),
    enabled: !isDevPreview && Boolean(tutorProfileId),
    retry: false,
    staleTime: 60_000,
  });

  const [draftOverride, setDraftOverride] =
    useState<TutorProfileFormValues | null>(null);
  const [catalogNames, setCatalogNames] = useState<CatalogNames>({});
  const [activeBlock, setActiveBlock] = useState<ProfileBlockId | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const serverDraft = isDevPreview ? devPreviewDraft : draftQuery.data;
  const draftExists = draftOverride !== null || Boolean(serverDraft);
  const profile =
    draftOverride ?? serverDraft ?? tutorProfileDefaultValues;

  const baseTutor = isDevPreview ? mockTutorProfile : publicQuery.data;
  const tutor = useMemo(
    () => mapDraftToPreview(profile, baseTutor, catalogNames),
    [profile, baseTutor, catalogNames],
  );

  const resolveCatalogNames = async (
    previous: TutorProfileFormValues,
    next: TutorProfileFormValues,
  ) => {
    const lookups: Array<[keyof CatalogNames, "universities" | "majors", string]> = [];
    if (next.universityId && next.universityId !== previous.universityId) {
      lookups.push(["university", "universities", next.universityId]);
    }
    if (next.majorId && next.majorId !== previous.majorId) {
      lookups.push(["major", "majors", next.majorId]);
    }
    if (!lookups.length) return;
    const entries = await Promise.all(
      lookups.map(async ([key, resource, id]) => {
        const item = await queryClient.fetchQuery({
          queryKey: ["catalog", resource, "item", id],
          queryFn: () => tutorProfileRegistrationService.getCatalogItem(resource, id),
          staleTime: 5 * 60 * 1000,
        });
        return [key, item.name] as const;
      }),
    );
    setCatalogNames((current) => ({ ...current, ...Object.fromEntries(entries) }));
  };

  const saveMutation = useMutation({
    mutationFn: async (patch: ProfileSectionPatch) => {
      const next: TutorProfileFormValues = { ...profile, ...patch };
      if (isDevPreview) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        await tutorProfileEditorService.saveDraft(next, draftExists);
      }
      return next;
    },
    onSuccess: async (next) => {
      const previous = profile;
      setDraftOverride(next);
      setActiveBlock(null);
      toast.success("Đã lưu thay đổi", {
        description: "Nhớ bấm “Gửi xét duyệt lại” để cập nhật hồ sơ công khai.",
        position: "top-right",
      });
      if (!isDevPreview) {
        queryClient.setQueryData(["tutor-profile", "editor", "draft"], next);
        await resolveCatalogNames(previous, next).catch(() => undefined);
      }
    },
    onError: (error) =>
      toast.error("Không thể lưu thay đổi", {
        description: getApiErrorMessage(error),
        position: "top-right",
      }),
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (isDevPreview) {
        await new Promise((resolve) => setTimeout(resolve, 650));
        return;
      }
      await tutorProfileEditorService.submitForReview(profile);
    },
    onSuccess: () => {
      setSubmittedAt(new Date().toISOString());
      if (tutorProfileId) {
        void queryClient.invalidateQueries({
          queryKey: tutorProfileQueryKeys.detail(tutorProfileId),
        });
      }
      void queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
      toast.success("Đã gửi hồ sơ xét duyệt", {
        description:
          "Hồ sơ công khai hiện tại vẫn được giữ cho đến khi nội dung mới được duyệt.",
        position: "top-right",
      });
    },
    onError: (error) =>
      toast.error("Chưa thể gửi hồ sơ", {
        description: getApiErrorMessage(error),
        position: "top-right",
      }),
  });

  const saveSection = async (patch: ProfileSectionPatch): Promise<boolean> => {
    try {
      await saveMutation.mutateAsync(patch);
      return true;
    } catch {
      return false;
    }
  };

  const submitForReview = () => {
    if (saveMutation.isPending || submitMutation.isPending) return;
    const validation = tutorProfileFormSchema.safeParse(profile);
    if (!validation.success) {
      toast.error("Hồ sơ chưa hợp lệ", {
        description:
          validation.error.issues[0]?.message ||
          "Vui lòng kiểm tra lại thông tin hồ sơ.",
        position: "top-right",
      });
      return;
    }
    submitMutation.mutate();
  };

  return {
    profile,
    tutor,
    activeBlock,
    submittedAt,
    isLoading: !isDevPreview && (isAuthLoading || draftQuery.isLoading),
    isError: !isDevPreview && draftQuery.isError,
    isDevPreview,
    isSaving: saveMutation.isPending,
    isSubmitting: submitMutation.isPending,
    refetch: draftQuery.refetch,
    openBlock: setActiveBlock,
    closeBlock: () => setActiveBlock(null),
    saveSection,
    submitForReview,
  };
}

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { useAuthStore } from "@workspace/core/store/useAuthStore";
import { mockTutorProfile } from "../../tutor-profile/types/mockTutorProfile";
import { tutorProfileQueryKeys } from "../../tutor-profile/queryKeys";
import { tutorProfileEditorDefaultValues } from "../constants/profile-editor.fixture";
import {
  tutorProfileEditorSchema,
  type TutorProfileEditorValues,
} from "../schemas/profile-editor.schema";
import { tutorProfileEditorService } from "../services/profile-editor.service";
import type {
  ProfileBlockId,
  ProfileMediaState,
} from "../types/profile-editor.types";
import {
  mapEditorValuesToTutorProfile,
  mapTutorProfileToEditorValues,
} from "../utils/profile-editor.mapper";

export function useTutorProfileInlineEditor() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  const isDevPreview = !user || user.id.startsWith("preview-");
  const tutorProfileId = user?.tutorProfileId || user?.id;

  const {
    data: fetchedTutor,
    isLoading: isQueryLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tutor-profile", "editor", tutorProfileId],
    queryFn: () => tutorProfileEditorService.getProfile(tutorProfileId),
    enabled: !isDevPreview && !!tutorProfileId,
    staleTime: 60_000,
  });

  const baseTutor = isDevPreview ? mockTutorProfile : fetchedTutor;

  const initialProfile = useMemo(() => {
    if (isDevPreview) return tutorProfileEditorDefaultValues;
    if (fetchedTutor) return mapTutorProfileToEditorValues(fetchedTutor);
    return null;
  }, [isDevPreview, fetchedTutor]);

  const [userProfileOverrides, setUserProfileOverrides] =
    useState<TutorProfileEditorValues | null>(null);
  const profile =
    userProfileOverrides ?? initialProfile ?? tutorProfileEditorDefaultValues;

  const initialMedia: ProfileMediaState = fetchedTutor?.videoUrl
    ? { videoUrl: fetchedTutor.videoUrl }
    : { videoUrl: "https://res.cloudinary.com/xcrm6ykz/video/upload/v1792508519/Beewise/Assets/Videos/tutor-intro-sample.mp4#t=0.1" };

  const [userMediaOverrides, setUserMediaOverrides] =
    useState<ProfileMediaState | null>(null);
  const media = userMediaOverrides ?? initialMedia;

  const [activeBlock, setActiveBlock] = useState<ProfileBlockId | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const tutor = useMemo(
    () =>
      mapEditorValuesToTutorProfile(profile, {
        ...baseTutor,
        videoUrl: media.videoUrl,
      }),
    [profile, baseTutor, media.videoUrl],
  );

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (isDevPreview) {
        await new Promise((r) => setTimeout(r, 650));
        return {
          status: "PENDING_REVIEW" as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return await tutorProfileEditorService.submitForReview(
        profile,
        media,
        baseTutor,
      );
    },
    onSuccess: (result) => {
      setSubmittedAt(result.updatedAt);
      if (tutorProfileId) {
        queryClient.invalidateQueries({
          queryKey: tutorProfileQueryKeys.detail(tutorProfileId),
        });
      }
      queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
      toast.success("Đã gửi hồ sơ xét duyệt", {
        description:
          "Hồ sơ công khai hiện tại vẫn được giữ cho đến khi nội dung mới được duyệt.",
        position: "top-right",
      });
    },
    onError: () => {
      toast.error("Chưa thể gửi hồ sơ", {
        description: "Vui lòng kiểm tra kết nối và thử lại.",
        position: "top-right",
      });
    },
  });

  const saveBlock = async (values: TutorProfileEditorValues): Promise<boolean> => {
    setUserProfileOverrides(values);
    setActiveBlock(null);
    if (!isDevPreview && tutorProfileId) {
      setIsSaving(true);
      try {
        await tutorProfileEditorService.saveDraft(values, media, baseTutor);
        toast.success("Đã cập nhật nội dung", {
          description: "Thay đổi đã được lưu vào bản chỉnh sửa hiện tại.",
          position: "top-right",
        });
        return true;
      } catch {
        toast.error("Không thể lưu thay đổi", {
          description: "Vui lòng kiểm tra kết nối và thử lại.",
          position: "top-right",
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    } else {
      toast.success("Đã cập nhật nội dung", {
        description: "Thay đổi đã được lưu vào bản chỉnh sửa hiện tại.",
        position: "top-right",
      });
      return true;
    }
  };

  const setVideoUrl = async (videoUrl: string): Promise<void> => {
    const nextMedia = { videoUrl };
    setUserMediaOverrides(nextMedia);
    if (!isDevPreview && tutorProfileId) {
      setIsSaving(true);
      try {
        await tutorProfileEditorService.saveDraft(profile, nextMedia, baseTutor);
        toast.success("Đã cập nhật video", {
          description: "Video giới thiệu đã được cập nhật.",
          position: "top-right",
        });
      } catch {
        toast.error("Không thể lưu video", {
          description: "Vui lòng thử lại sau.",
          position: "top-right",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const submitForReview = () => {
    if (isSaving || submitReviewMutation.isPending) return;

    // Whole-form validation before submission
    const validation = tutorProfileEditorSchema.safeParse(profile);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      const message =
        firstIssue?.message || "Vui lòng kiểm tra lại thông tin hồ sơ.";
      toast.error("Hồ sơ chưa hợp lệ", {
        description: message,
        position: "top-right",
      });
      return;
    }

    submitReviewMutation.mutate();
  };

  const isLoading =
    !isDevPreview && (isAuthLoading || (isQueryLoading && !initialProfile));

  return {
    profile,
    tutor,
    media,
    activeBlock,
    submittedAt,
    isLoading,
    isError,
    isDevPreview,
    isSaving,
    refetch,
    isSubmitting: submitReviewMutation.isPending || isSaving,
    openBlock: setActiveBlock,
    closeBlock: () => setActiveBlock(null),
    saveBlock,
    setVideoUrl,
    submitForReview,
  };
}

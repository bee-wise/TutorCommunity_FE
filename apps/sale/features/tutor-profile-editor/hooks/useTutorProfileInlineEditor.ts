"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/ui/bee-toast/index";
import { tutorProfileEditorDefaultValues } from "../constants/profile-editor.fixture";
import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import { tutorProfileEditorService } from "../services/profile-editor.service";
import type {
  ProfileBlockId,
  ProfileMediaState,
} from "../types/profile-editor.types";
import { mapEditorValuesToTutorProfile } from "../utils/profile-editor.mapper";

export function useTutorProfileInlineEditor() {
  const [profile, setProfile] = useState<TutorProfileEditorValues>(
    tutorProfileEditorDefaultValues,
  );
  const [activeBlock, setActiveBlock] = useState<ProfileBlockId | null>(null);
  const [media, setMedia] = useState<ProfileMediaState>({
    videoUrl: "/video/videoplayback.mp4#t=0.1",
  });
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const tutor = useMemo(() => mapEditorValuesToTutorProfile(profile), [profile]);

  const submitReviewMutation = useMutation({
    mutationFn: () => tutorProfileEditorService.submitForReview(profile, media),
    onSuccess: (result) => {
      setSubmittedAt(result.updatedAt);
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

  const saveBlock = (values: TutorProfileEditorValues): void => {
    setProfile(values);
    setActiveBlock(null);
    toast.success("Đã cập nhật nội dung", {
      description: "Thay đổi đã được lưu vào bản chỉnh sửa hiện tại.",
      position: "top-right",
    });
  };

  return {
    profile,
    tutor,
    media,
    activeBlock,
    submittedAt,
    isSubmitting: submitReviewMutation.isPending,
    openBlock: setActiveBlock,
    closeBlock: () => setActiveBlock(null),
    saveBlock,
    setVideoUrl: (videoUrl: string) =>
      setMedia((current) => ({ ...current, videoUrl })),
    submitForReview: () => submitReviewMutation.mutate(),
  };
}

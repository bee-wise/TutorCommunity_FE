"use client";

import type { TutorProfileEditorValues } from "../schemas/profile-editor.schema";
import type { ProfileBlockId } from "../types/profile-editor.types";
import { AcademicProfileEditDialog } from "./modals/AcademicProfileEditDialog";
import { BasicInfoEditDialog } from "./modals/BasicInfoEditDialog";
import { EvidenceEditDialog } from "./modals/EvidenceEditDialog";
import { ExperienceEditDialog } from "./modals/ExperienceEditDialog";
import { IntroductionEditDialog } from "./modals/IntroductionEditDialog";
import { TeachingMethodsEditDialog } from "./modals/TeachingMethodsEditDialog";
import { VideoEditDialog } from "./modals/VideoEditDialog";

interface ProfileEditModalRouterProps {
  activeBlock: ProfileBlockId | null;
  profile: TutorProfileEditorValues;
  videoUrl: string;
  onClose: () => void;
  onSaveProfile: (values: TutorProfileEditorValues) => void;
  onSaveVideo: (videoUrl: string) => void;
}

export function ProfileEditModalRouter({
  activeBlock,
  profile,
  videoUrl,
  onClose,
  onSaveProfile,
  onSaveVideo,
}: ProfileEditModalRouterProps) {
  if (activeBlock === "basic") {
    return <BasicInfoEditDialog profile={profile} onClose={onClose} onSave={onSaveProfile} />;
  }
  if (activeBlock === "introduction") {
    return <IntroductionEditDialog profile={profile} onClose={onClose} onSave={onSaveProfile} />;
  }
  if (activeBlock === "methods") {
    return <TeachingMethodsEditDialog profile={profile} onClose={onClose} onSave={onSaveProfile} />;
  }
  if (activeBlock === "academic") {
    return <AcademicProfileEditDialog profile={profile} onClose={onClose} onSave={onSaveProfile} />;
  }
  if (activeBlock === "experience") {
    return <ExperienceEditDialog profile={profile} onClose={onClose} onSave={onSaveProfile} />;
  }
  if (activeBlock === "evidence") {
    return <EvidenceEditDialog profile={profile} onClose={onClose} onSave={onSaveProfile} />;
  }
  if (activeBlock === "video") {
    return <VideoEditDialog videoUrl={videoUrl} onClose={onClose} onSave={onSaveVideo} />;
  }
  return null;
}

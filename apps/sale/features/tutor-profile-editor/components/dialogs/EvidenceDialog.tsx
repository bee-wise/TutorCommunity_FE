"use client";

import { AchievementsFields } from "../../../tutor-profile-registration/components/AchievementsFields";
import { ProfileSectionDialog } from "./ProfileSectionDialog";
import type { SectionDialogProps } from "./section-dialog.types";

const FIELDS = ["achievements"] as const;

export function EvidenceDialog(props: SectionDialogProps) {
  return (
    <ProfileSectionDialog
      {...props}
      fields={FIELDS}
      title="Chỉnh sửa thành tích và minh chứng"
      description="Chứng chỉ, giải thưởng hoặc thành tích học thuật kèm ảnh minh chứng."
    >
      <AchievementsFields />
    </ProfileSectionDialog>
  );
}

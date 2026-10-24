"use client";

import type { ReactElement } from "react";
import type { ProfileBlockId } from "../../types/profile-editor.types";
import { AcademicDialog } from "./AcademicDialog";
import { BasicInfoDialog } from "./BasicInfoDialog";
import { EvidenceDialog } from "./EvidenceDialog";
import { ExperienceDialog } from "./ExperienceDialog";
import { IntroductionDialog } from "./IntroductionDialog";
import { MethodsDialog } from "./MethodsDialog";
import { TeachingDialog } from "./TeachingDialog";
import { VideoDialog } from "./VideoDialog";
import type { SectionDialogProps } from "./section-dialog.types";

const DIALOGS: Record<ProfileBlockId, (props: SectionDialogProps) => ReactElement> = {
  basic: BasicInfoDialog,
  academic: AcademicDialog,
  introduction: IntroductionDialog,
  methods: MethodsDialog,
  experience: ExperienceDialog,
  evidence: EvidenceDialog,
  video: VideoDialog,
  teaching: TeachingDialog,
};

export function ProfileEditDialogs({
  activeBlock,
  ...props
}: SectionDialogProps & { activeBlock: ProfileBlockId | null }) {
  if (!activeBlock) return null;
  const Dialog = DIALOGS[activeBlock];
  return <Dialog key={activeBlock} {...props} />;
}

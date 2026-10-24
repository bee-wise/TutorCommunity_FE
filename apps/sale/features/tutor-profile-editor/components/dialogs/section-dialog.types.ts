import type { TutorProfileFormValues } from "../../../tutor-profile-registration/schemas/profile-registration.schema";
import type { ProfileSectionPatch } from "../../types/profile-editor.types";

export interface SectionDialogProps {
  profile: TutorProfileFormValues;
  isSaving: boolean;
  onClose: () => void;
  onSave: (patch: ProfileSectionPatch) => Promise<boolean>;
}

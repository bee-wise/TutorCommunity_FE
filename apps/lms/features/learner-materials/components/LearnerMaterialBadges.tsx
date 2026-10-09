import type {
  LearnerMaterialFileType,
  LearnerMaterialSource,
} from "../types/learner-materials.types";
import { libraryBadge } from "./learner-materials-ui";

const SOURCE_LABELS: Record<LearnerMaterialSource, string> = {
  ai: "Tạo bằng AI",
  upload: "Gia sư tải lên",
};

export function LearnerMaterialBadges({
  source,
  fileType,
  isNew,
}: {
  source: LearnerMaterialSource;
  fileType: LearnerMaterialFileType;
  isNew?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={`${libraryBadge} border-primary bg-card text-primary`}
      >
        {SOURCE_LABELS[source]}
      </span>
      <span className={`${libraryBadge} border-border bg-card text-muted-foreground`}>
        {fileType}
      </span>
      {isNew ? (
        <span className={`${libraryBadge} border-accent bg-accent text-accent-foreground`}>
          Mới
        </span>
      ) : null}
    </div>
  );
}

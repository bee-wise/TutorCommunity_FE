import type {
  LearnerMaterialFileType,
  LearnerMaterialSource,
} from "../types/learner-materials.types";

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
        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
          source === "ai"
            ? "bg-[#E8E2FF] text-[#4B2995]"
            : "bg-[#DDF5E8] text-[#17633D]"
        }`}
      >
        {SOURCE_LABELS[source]}
      </span>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
        {fileType}
      </span>
      {isNew ? (
        <span className="rounded-full bg-[#FFF1CD] px-2.5 py-1 text-xs font-bold text-[#805512]">
          Mới
        </span>
      ) : null}
    </div>
  );
}

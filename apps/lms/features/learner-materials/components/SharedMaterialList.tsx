import { EyeIcon } from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import type { LearnerSharedMaterial } from "../types/learner-materials.types";
import { formatLibraryDate } from "../utils/learner-materials.utils";
import { LearnerMaterialBadges } from "./LearnerMaterialBadges";
import { LibraryEmptyState } from "./LibraryStates";
import { libraryOutlineButton, libraryPanel } from "./learner-materials-ui";

export function SharedMaterialList({
  materials,
  onView,
  onReset,
}: {
  materials: readonly LearnerSharedMaterial[];
  onView: (material: LearnerSharedMaterial) => void;
  onReset?: () => void;
}) {
  if (materials.length === 0) {
    return (
      <LibraryEmptyState title="Không có tài liệu phù hợp" description="Tài liệu sẽ xuất hiện sau khi gia sư chia sẻ. Nếu đang lọc, hãy thử đổi từ khóa hoặc bộ lọc." onReset={onReset} />
    );
  }

  return (
    <div className="space-y-4">
      {materials.map((material) => (
        <article key={material.id} className={`${libraryPanel} grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center`}>
          <div className="min-w-0">
            <h3 className="font-nunito text-lg font-extrabold leading-[1.3] text-primary [overflow-wrap:anywhere]">{material.title}</h3>
            <div className="mt-3">
              <LearnerMaterialBadges source={material.source} fileType={material.fileType} isNew={material.isNew} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{material.description}</p>
            <p className="mt-2 text-xs font-medium leading-5 text-muted-foreground">
              Chia sẻ {formatLibraryDate(material.sharedAt)}{material.fileSize ? ` · ${material.fileSize}` : ""}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            aria-label={`Xem tài liệu: ${material.title}`}
            onClick={() => onView(material)}
            className={`${libraryOutlineButton} w-full md:w-auto`}
          >
            <EyeIcon className="size-4" aria-hidden="true" />
            Xem tài liệu
          </Button>
        </article>
      ))}
    </div>
  );
}

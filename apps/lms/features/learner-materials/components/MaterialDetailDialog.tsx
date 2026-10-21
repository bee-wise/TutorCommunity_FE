import { LmsMaterialViewer } from "../../../components/LmsMaterialViewer";
import type { LearnerSharedMaterial } from "../types/learner-materials.types";
import { formatLibraryDate } from "../utils/learner-materials.utils";
import { LearnerMaterialBadges } from "./LearnerMaterialBadges";

export function MaterialDetailDialog({
  material,
  onClose,
}: {
  material?: LearnerSharedMaterial;
  onClose: () => void;
}) {
  return (
    <LmsMaterialViewer
      open={Boolean(material)}
      onOpenChange={(open) => !open && onClose()}
      title={material?.title ?? ""}
      badges={material && <LearnerMaterialBadges source={material.source} fileType={material.fileType} isNew={material.isNew} />}
      meta={material && `Được chia sẻ lúc ${formatLibraryDate(material.sharedAt)}${material.fileSize ? ` · ${material.fileSize}` : ""}`}
    >
      {material && (
        <>
          <section>
            <h2 className="text-sm font-extrabold text-foreground">Mô tả tài liệu</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{material.description}</p>
          </section>
          <div className="space-y-2 rounded-2xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
            <p className="font-bold text-primary">Bản xem tài liệu chỉ đọc</p>
            <p>
              {material.source === "ai"
                ? "Tài liệu BeeWise sẽ hiển thị nội dung học tập trực tiếp tại đây khi kết nối dữ liệu thực tế."
                : "Bản mock hiển thị thông tin tệp đã chia sẻ. Tính năng mở hoặc tải tệp sẽ được nối với API tài liệu."}
            </p>
          </div>
        </>
      )}
    </LmsMaterialViewer>
  );
}

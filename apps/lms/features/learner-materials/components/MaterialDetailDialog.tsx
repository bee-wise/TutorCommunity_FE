import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/ui/dialog";
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
    <Dialog open={Boolean(material)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] max-w-2xl overflow-y-auto rounded-2xl p-0">
        {material ? (
          <>
            <DialogHeader className="border-b border-border px-5 py-5 pr-12 sm:px-6">
              <LearnerMaterialBadges
                source={material.source}
                fileType={material.fileType}
                isNew={material.isNew}
              />
              <DialogTitle className="pt-2 text-xl leading-snug">{material.title}</DialogTitle>
              <DialogDescription>
                Được chia sẻ lúc {formatLibraryDate(material.sharedAt)}
                {material.fileSize ? ` • ${material.fileSize}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 px-5 py-5 sm:px-6">
              <section>
                <h2 className="text-sm font-extrabold text-slate-900">Mô tả tài liệu</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{material.description}</p>
              </section>
              <div className="rounded-xl border border-[#CFE1FA] bg-[#F3F7FE] p-4 text-sm leading-6 text-slate-700">
                {material.source === "ai"
                  ? "Tài liệu BeeWise sẽ hiển thị nội dung học tập trực tiếp tại đây khi kết nối dữ liệu thực tế."
                  : "Bản mock hiển thị thông tin tệp đã chia sẻ. Tính năng mở hoặc tải tệp sẽ được nối với API tài liệu."}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

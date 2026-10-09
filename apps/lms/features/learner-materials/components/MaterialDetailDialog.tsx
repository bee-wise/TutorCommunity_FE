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
      <DialogContent className="max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto rounded-3xl border-border bg-card p-0 shadow-soft sm:rounded-3xl motion-reduce:animate-none [&>button]:size-11 [&>button]:rounded-full [&>button]:border [&>button]:border-border [&>button]:bg-card [&>button]:opacity-100 [&>button]:transition-all [&>button]:hover:bg-muted [&>button]:active:scale-[0.98]">
        {material ? (
          <>
            <DialogHeader className="border-b border-border px-5 py-5 pr-20 text-left sm:px-6 sm:pr-20">
              <DialogTitle className="font-nunito text-xl font-extrabold leading-snug tracking-normal text-primary [overflow-wrap:anywhere]">{material.title}</DialogTitle>
              <LearnerMaterialBadges
                source={material.source}
                fileType={material.fileType}
                isNew={material.isNew}
              />
              <DialogDescription>
                Được chia sẻ lúc {formatLibraryDate(material.sharedAt)}
                {material.fileSize ? ` · ${material.fileSize}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 px-5 py-5 sm:px-6">
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
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

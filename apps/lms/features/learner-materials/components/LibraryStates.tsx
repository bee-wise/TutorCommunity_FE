import Link from "next/link";
import { Button, buttonVariants } from "@workspace/ui/components/ui/button";
import { libraryOutlineButton, libraryPage, libraryPanel } from "./learner-materials-ui";

export function LibraryEmptyState({ title, description, onReset }: { title: string; description: string; onReset?: () => void }) {
  return (
    <div className={`${libraryPanel} space-y-3 py-10 text-center`}>
      <h3 className="font-nunito text-lg font-extrabold leading-snug text-primary">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      {onReset && <Button type="button" variant="outline" className={libraryOutlineButton} onClick={onReset}>Đặt lại bộ lọc</Button>}
    </div>
  );
}

export function LibraryMissingState({ title, href }: { title: string; href: string }) {
  return (
    <div className={libraryPage}>
      <div className={`${libraryPanel} space-y-4 py-12 text-center`}>
        <h1 className="font-nunito text-xl font-extrabold leading-snug text-primary">{title}</h1>
        <p className="text-sm text-muted-foreground">Nội dung không tồn tại trong Tài liệu lớp học của bạn.</p>
        <Link href={href} className={buttonVariants({ variant: "outline", className: libraryOutlineButton })}>Quay lại kho tài liệu</Link>
      </div>
    </div>
  );
}

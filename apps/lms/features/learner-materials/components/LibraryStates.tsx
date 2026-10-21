import { Button } from "@workspace/ui/components/ui/button";
import { EmptyState } from "@workspace/ui/components/ui/empty-state";
import { LmsMissingState } from "../../../components/LmsMissingState";
import { libraryOutlineButton } from "./learner-materials-ui";

export function LibraryEmptyState({ title, description, onReset }: { title: string; description: string; onReset?: () => void }) {
  return (
    <EmptyState
      imageAlt=""
      title={title}
      description={description}
      action={onReset && <Button type="button" variant="outline" className={libraryOutlineButton} onClick={onReset}>Đặt lại bộ lọc</Button>}
    />
  );
}

export function LibraryMissingState({ title, href }: { title: string; href: string }) {
  return <LmsMissingState title={title} description="Nội dung không tồn tại trong Tài liệu lớp học của bạn." href={href} backLabel="Quay lại kho tài liệu" />;
}

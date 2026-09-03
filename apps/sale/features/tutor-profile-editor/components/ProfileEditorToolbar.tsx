import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Button } from "@workspace/ui/components/ui/button";

export function ProfileEditorToolbar({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dce7f7] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-full" aria-label="Trở về hồ sơ">
            <Link href="/tutor/profile">
              <ArrowLeftIcon size={19} weight="bold" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-extrabold text-[#17142f] sm:text-base">Chỉnh sửa hồ sơ</h1>
            <p className="hidden text-xs text-[#716c83] sm:block">Chọn biểu tượng bút chì tại phần cần cập nhật.</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="h-10 shrink-0 rounded-full bg-[#280f91] px-4 text-xs font-bold text-white hover:bg-[#200c76] sm:px-5 sm:text-sm"
        >
          {isSubmitting ? "Đang gửi" : "Gửi xét duyệt lại"}
        </Button>
      </div>
    </header>
  );
}

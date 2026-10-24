import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { GroupDto } from "@workspace/core/lms-classes/group.schemas";
import {
  formatOpeningDate,
  getClassLevel,
  getClassSubject,
  getTeachingModeLabel,
} from "../utils/classes.utils";
import { priceFormatter } from "./ClassCard";

export function ClassDetailDialog({
  classItem,
  onClose,
}: {
  classItem: GroupDto | null;
  onClose: () => void;
}) {
  const level = classItem ? getClassLevel(classItem) : undefined;

  return (
    <Dialog.Root
      open={classItem !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-90 bg-foreground/55" />
        {classItem && (
          <Dialog.Content className="fixed left-1/2 top-1/2 z-91 max-h-[90dvh] w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-background p-6 shadow-pop focus:outline-none sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-primary">
                {getClassSubject(classItem)}
                {level ? ` · ${level}` : ""}
              </span>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Đóng chi tiết lớp"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <XMarkIcon className="size-5" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Title className="mt-4 font-nunito text-2xl font-black leading-[1.15] text-foreground">
              {classItem.title ?? getClassSubject(classItem)}
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {classItem.description ||
                "Lớp nhóm nhỏ do gia sư BeeWise tổ chức."}
            </Dialog.Description>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Khai giảng</dt>
                <dd className="mt-1 font-bold text-foreground">
                  {formatOpeningDate(classItem.openingAt) ?? "Chưa có lịch"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Hình thức</dt>
                <dd className="mt-1 font-bold text-foreground">
                  {getTeachingModeLabel(classItem.teachingMode)}
                </dd>
              </div>
              {classItem.teachingMode === "OFFLINE" && classItem.location && (
                <div>
                  <dt className="text-muted-foreground">Địa điểm</dt>
                  <dd className="mt-1 font-bold text-foreground">
                    {classItem.location}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Thời lượng</dt>
                <dd className="mt-1 font-bold text-foreground">
                  {classItem.numberOfSessions} buổi ·{" "}
                  {classItem.sessionDurationMinutes} phút/buổi
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sĩ số</dt>
                <dd className="mt-1 font-bold text-foreground">
                  Tối đa {classItem.capacity} học viên
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <div>
                <p className="text-xs text-muted-foreground">
                  Học phí mỗi buổi
                </p>
                <p className="font-nunito text-2xl font-black tabular-nums text-primary">
                  {priceFormatter.format(classItem.pricePerSession)}đ
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Đăng nhập để đăng ký học thử
              </Link>
            </div>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}

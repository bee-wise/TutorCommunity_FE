import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@workspace/ui/components/ui/button";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";

export function ClassListSkeleton() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="Đang tải lớp học">
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} className="h-[218px] rounded-3xl" />
      ))}
    </div>
  );
}

export function MessageCard({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-background px-6 py-14 text-center shadow-soft">
      <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        {icon}
      </span>
      <h2 className="mt-5 font-nunito text-xl font-extrabold leading-snug text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function NoRecruitingClasses() {
  return (
    <MessageCard
      icon={<UserGroupIcon className="size-6" />}
      title="Chưa có lớp nhóm đang tuyển sinh"
      description="Các lớp nhóm mới sẽ xuất hiện ở đây khi gia sư mở đăng ký. Trong lúc chờ, bạn có thể tìm gia sư kèm 1:1."
      action={
        <Button asChild size="lg" className="min-h-11 rounded-full px-6 font-bold">
          <Link href="/tutors">
            Tìm gia sư 1:1
            <ArrowRightIcon />
          </Link>
        </Button>
      }
    />
  );
}

export function ClassesLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <MessageCard
      icon={<ExclamationTriangleIcon className="size-6" />}
      title="Chưa tải được danh sách lớp"
      description="Kết nối đang gặp sự cố. Vui lòng thử lại sau ít phút."
      action={
        <Button
          size="lg"
          onClick={onRetry}
          className="min-h-11 rounded-full px-6 font-bold"
        >
          Thử lại
        </Button>
      }
    />
  );
}

export function NoMatchingClasses({ onReset }: { onReset: () => void }) {
  return (
    <MessageCard
      icon={<MagnifyingGlassIcon className="size-6" />}
      title="Chưa có lớp phù hợp"
      description="Thử đổi môn học, hình thức hoặc mức học phí để xem thêm lớp."
      action={
        <Button
          size="lg"
          onClick={onReset}
          className="min-h-11 rounded-full px-6 font-bold"
        >
          Xóa bộ lọc
        </Button>
      }
    />
  );
}

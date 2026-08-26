import { Skeleton } from "@workspace/ui/components/ui/skeleton";

export function ProfileEditorSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-[#fffaf0]" aria-label="Đang tải trang chỉnh sửa hồ sơ">
      <div className="sticky top-0 z-40 border-b border-[#dce7f7] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="grid gap-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="hidden h-3 w-64 rounded-md sm:block" />
            </div>
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-[430px] rounded-[2rem] sm:h-[350px]" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
          <div className="grid gap-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-72 rounded-3xl" />
            <Skeleton className="h-80 rounded-3xl" />
          </div>
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

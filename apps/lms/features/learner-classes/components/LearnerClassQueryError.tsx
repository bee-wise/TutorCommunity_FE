import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { handleApiError } from "@workspace/core/sys-libs/error-handler";
import { learnerAction } from "./LearnerApiClassCard";

export function LearnerClassQueryError({
  error,
  onRetry,
  detail = false,
}: {
  error: unknown;
  onRetry: () => void;
  detail?: boolean;
}) {
  const { statusCode } = handleApiError(error);
  return (
    <section
      role="alert"
      className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft"
    >
      <h2 className="font-nunito text-lg font-extrabold text-primary">
        {statusCode === 401
          ? "Bạn cần đăng nhập"
          : statusCode === 403
            ? "Không có quyền truy cập"
            : statusCode === 404
              ? "Không tìm thấy dữ liệu"
              : "Chưa tải được dữ liệu"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {statusCode === 401
          ? "Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục."
          : statusCode === 403
            ? "Bạn không có quyền xem dữ liệu này hoặc quyền truy cập đã thay đổi."
            : statusCode === 404
              ? "Dữ liệu không tồn tại hoặc không còn khả dụng."
              : "Thử tải lại dữ liệu. Nếu lỗi tiếp tục, liên hệ hỗ trợ."}
      </p>
      <div className="flex flex-wrap gap-2">
        {![401, 403, 404].includes(statusCode) && (
          <Button variant="outline" className={learnerAction} onClick={onRetry}>
            Thử lại
          </Button>
        )}
        {statusCode === 401 ? (
          <Button asChild className={learnerAction}>
            <Link href="/login">Đăng nhập</Link>
          </Button>
        ) : (
          detail && (
            <Button asChild variant="outline" className={learnerAction}>
              <Link href="/lms/learner/classes">Danh sách lớp</Link>
            </Button>
          )
        )}
      </div>
    </section>
  );
}

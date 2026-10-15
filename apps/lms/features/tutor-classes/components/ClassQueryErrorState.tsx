import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { handleApiError } from "@workspace/core/sys-libs/error-handler";
import { classOutlineButton, classPanel } from "./classes-ui";

export function ClassQueryErrorState({ error, onRetry, detail = false }: {
  error: unknown; onRetry: () => void; detail?: boolean;
}) {
  const { statusCode, code } = handleApiError(error);
  const title = statusCode === 401 ? "Bạn cần đăng nhập"
    : statusCode === 403 ? "Không có quyền xem lớp học"
      : statusCode === 404 ? "Không tìm thấy lớp học" : "Chưa tải được lớp học";
  const message = statusCode === 401 ? "Phiên đăng nhập chưa có hoặc đã hết hạn. Vui lòng đăng nhập lại."
    : statusCode === 403 ? "Tài khoản không được cấp quyền truy cập lớp học này."
      : statusCode === 404 ? "Lớp không tồn tại hoặc không còn khả dụng với tài khoản của bạn."
        : ["LMS_CLASS_CONTRACT_MISMATCH", "LMS_CONTRACT_MISMATCH"].includes(code ?? "") ? "Dữ liệu máy chủ chưa đúng định dạng. Vui lòng thử lại hoặc liên hệ hỗ trợ."
          : "Kiểm tra kết nối mạng và thử tải lại.";
  return (
    <section role="alert" className={`${classPanel} space-y-4`}>
      <h2 className="font-nunito text-lg font-extrabold text-primary">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
      <div className="flex flex-wrap gap-3">
        {![401, 403, 404].includes(statusCode) && <Button type="button" variant="outline" className={classOutlineButton} onClick={onRetry}>Thử lại</Button>}
        {statusCode === 401 ? <Button asChild className="rounded-full transition-all active:scale-[0.98]"><Link href="/login">Đăng nhập</Link></Button>
          : detail && [403, 404].includes(statusCode) ? <Button asChild variant="outline" className={classOutlineButton}><Link href="/lms/tutor/classes">Danh sách lớp</Link></Button> : null}
      </div>
    </section>
  );
}

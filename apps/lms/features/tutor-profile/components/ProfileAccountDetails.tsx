import type { MeType } from "@workspace/core/types/auth.type";
import { panelClass } from "@/components/lms-page-ui";

export function ProfileAccountDetails({ user }: { user: MeType }) {
  const fields = [
    ["Họ tên tài khoản", user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Chưa cập nhật"],
    ["Email", user.email || "Chưa cập nhật"],
    ["Số điện thoại", user.phoneNumber || "Chưa cập nhật"],
    ["Mã tài khoản", user.id],
  ];
  return (
    <section className={`${panelClass} space-y-5`} aria-labelledby="profile-account-title">
      <div><h2 id="profile-account-title" className="font-nunito text-lg font-extrabold text-primary">Thông tin tài khoản</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Thông tin riêng tư từ tài khoản đăng nhập, không nằm trong bản hồ sơ công khai ở màn hình này.</p></div>
      <dl className="grid gap-5 text-sm sm:grid-cols-2">{fields.map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-bold leading-relaxed">{value}</dd></div>)}</dl>
      <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">Nếu thông tin tài khoản chưa chính xác, liên hệ tư vấn viên trong mục Tin nhắn để được hỗ trợ.</p>
    </section>
  );
}

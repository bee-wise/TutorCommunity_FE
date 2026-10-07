import Link from "next/link";
import { Bell, Check, Desktop, EnvelopeSimple, ShieldCheck, DeviceMobile, Key } from "@phosphor-icons/react";
import { cn } from "@workspace/core/helpers/utils";
import { Button } from "@workspace/ui/components/ui/button";
import type { AccountProfileDemo } from "../hooks/useAccountProfileDemo";
import type { NotificationKey } from "../types/account-profile";

function PreferenceToggle({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div><p className="text-sm font-bold text-foreground">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>
      <button type="button" role="switch" aria-label={title} aria-checked={checked} onClick={onChange} className={cn("flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", checked ? "border-primary bg-primary" : "border-muted-foreground bg-muted")}><span aria-hidden="true" className={cn("h-4.5 w-4.5 rounded-full bg-white shadow-xs motion-safe:transition-transform", checked && "translate-x-5")} /></button>
    </div>
  );
}

export function ProfileSecurityPanel({ demo }: { demo: AccountProfileDemo }) {
  return (
    <div className="space-y-5">
      <section aria-labelledby="security-heading" className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck size={24} weight="bold" aria-hidden="true" /></span><div><h2 id="security-heading" className="font-nunito text-xl font-extrabold text-foreground">Bảo mật tài khoản</h2><p className="mt-1 text-sm text-muted-foreground">Thêm một lớp bảo vệ cho tài khoản của bạn.</p></div></div>
        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-primary"><Key size={21} weight="bold" aria-hidden="true" /></span>
            <div>
              <h3 className="font-nunito text-base font-extrabold text-foreground">Mật khẩu đăng nhập</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Đổi mật khẩu để bảo vệ tài khoản. Bạn sẽ đăng nhập lại sau khi đổi.</p>
            </div>
          </div>
          <Button asChild className="h-10 self-start rounded-xl px-4 font-bold transition-all active:scale-[0.98] sm:self-center">
            <Link href="/change-password">Đổi mật khẩu</Link>
          </Button>
        </div>
        <div className="mt-5 border-t border-border"><PreferenceToggle title="Xác thực hai bước" description="Mô phỏng bật/tắt xác thực hai bước trong bản demo." checked={demo.twoFactor} onChange={demo.toggleTwoFactor} /></div>
        <p className="rounded-lg bg-muted px-4 py-3 text-xs leading-5 text-muted-foreground">Xác thực hai bước đang ở chế độ demo; đổi mật khẩu ở trên là thao tác thật.</p>
      </section>

      <section aria-labelledby="sessions-heading" className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="sessions-heading" className="font-nunito text-xl font-extrabold text-foreground">Thiết bị đăng nhập</h2><span className="rounded-md border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground">DỮ LIỆU MẪU</span></div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">Danh sách minh họa cho tính năng quản lý phiên đăng nhập.</p>
        <div className="mt-5 flex items-center gap-4 rounded-xl border border-border p-4"><Desktop size={28} className="shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-sm font-bold text-foreground">Chrome trên Windows</p><p className="mt-1 text-xs text-muted-foreground">Phiên hiện tại · minh họa</p></div><span className="inline-flex items-center gap-1 text-xs font-bold text-secondary"><Check size={14} weight="bold" aria-hidden="true" />Hiện tại</span></div>
        {demo.otherSession ? <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl border border-border p-4"><DeviceMobile size={28} className="shrink-0 text-muted-foreground" aria-hidden="true" /><div className="min-w-0 flex-1"><p className="text-sm font-bold text-foreground">Safari trên iPhone</p><p className="mt-1 text-xs text-muted-foreground">Hoạt động 2 giờ trước · minh họa</p></div><button type="button" onClick={demo.endOtherSession} className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-destructive hover:border-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive">Kết thúc phiên</button></div> : <p className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground" role="status">Phiên đăng nhập mẫu trên iPhone đã được kết thúc.</p>}
      </section>
    </div>
  );
}

const notificationOptions = [
  { key: "messages", title: "Tin nhắn mới", description: "Nhận thông báo khi có tin nhắn gửi đến bạn." },
  { key: "reminders", title: "Nhắc lịch học", description: "Một lời nhắc trước buổi học để bạn luôn sẵn sàng." },
  { key: "email", title: "Thông báo qua email", description: "Nhận thông tin tài khoản và cập nhật học tập qua email." },
  { key: "updates", title: "Tin tức & ưu đãi", description: "Khám phá tính năng mới và các chương trình từ BeeWise." },
] satisfies { key: NotificationKey; title: string; description: string }[];

export function ProfileNotificationsPanel({ demo }: { demo: AccountProfileDemo }) {
  return (
    <section aria-labelledby="notifications-heading" className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bell size={24} weight="bold" aria-hidden="true" /></span><div><h2 id="notifications-heading" className="font-nunito text-xl font-extrabold text-foreground">Thông báo theo cách của bạn</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Chọn những thông tin bạn muốn nhận.</p></div></div>
      <div className="mt-5 divide-y divide-border">{notificationOptions.map((option) => <PreferenceToggle key={option.key} title={option.title} description={option.description} checked={demo.notifications[option.key]} onChange={() => demo.toggleNotification(option.key)} />)}</div>
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted p-4 text-xs leading-5 text-muted-foreground"><EnvelopeSimple size={17} className="mt-0.5 shrink-0" aria-hidden="true" /><p>Tùy chọn demo được cập nhật ngay trong phiên xem này. Bạn có thể bật lại bất kỳ lúc nào.</p></div>
    </section>
  );
}

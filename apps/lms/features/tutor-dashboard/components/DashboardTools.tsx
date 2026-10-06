import Link from "next/link";
import { ArrowUpRight, MagicWand, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import styles from "./dashboard.module.css";

const TOOLS = [
  { title: "Soạn tài liệu AI", description: "Chuẩn bị bài học và bài luyện tập", href: "/lms/tutor/materials", icon: MagicWand },
  { title: "Quản lý lịch dạy", description: "Xem buổi học và thông tin lớp", href: "/lms/tutor/schedule", icon: CalendarBlank },
] as const;

export function DashboardTools() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-soft md:p-6" aria-labelledby="dashboard-tools">
      <h2 id="dashboard-tools" className="text-xl leading-[1.25] text-primary">Thao tác nhanh</h2>
      <div className="mt-5 space-y-3">
        {TOOLS.map(({ title, description, href, icon: Icon }) => (
          <Link key={href} href={href} className={`${styles.interactive} ${styles.textLink} flex items-start gap-3 rounded-3xl border border-border bg-card p-4 shadow-soft`}>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Icon size={22} weight="bold" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-primary">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
            <ArrowUpRight size={18} weight="bold" className="mt-1 shrink-0 text-primary" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <Link href="/lms/tutor/earnings" className={`${styles.textLink} mt-5 inline-flex min-h-11 items-center text-sm font-bold text-primary underline-offset-4 hover:underline`}>
        Xem thu nhập & thanh toán
      </Link>
    </section>
  );
}

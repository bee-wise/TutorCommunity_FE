import {
  ArrowRight,
  LockKey as LockKeyhole,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const settingsFeatures = [
  {
    title: "Phân quyền hệ thống",
    description:
      "Quản lý quyền truy cập theo vai trò và các thao tác được phép trên từng module.",
    href: "/admin/settings/permissions",
    icon: ShieldCheck,
    category: "Truy cập & bảo mật",
    details: ["Vai trò", "Định nghĩa quyền", "Ma trận phân quyền"],
  },
] as const;

export function SettingsOverview() {
  return (
    <main className="min-h-[100dvh] bg-muted/40 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-9">
        <header className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Quản lý cấu hình
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Không gian quản trị các thiết lập vận hành của BeeWise.
            </p>
          </div>
        </header>

        <section aria-labelledby="settings-list-heading" className="space-y-4">
          <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Danh mục cấu hình
              </p>
              <h2
                id="settings-list-heading"
                className="mt-1 text-xl font-bold text-foreground"
              >
                Các chức năng quản trị
              </h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {settingsFeatures.length} mục
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {settingsFeatures.map(
              ({ title, description, href, icon: Icon, category, details }) => (
                <Link
                  key={href}
                  href={href}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-12 size-32 rounded-full bg-primary/5 transition-transform duration-300 group-hover:scale-110"
                  />
                  <Icon
                    aria-hidden="true"
                    weight="thin"
                    className="pointer-events-none absolute -bottom-8 right-4 hidden size-40 text-primary/5 sm:block"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/15">
                      <Icon className="size-5" weight="regular" />
                    </span>
                    <span className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                  <div className="relative mt-4 flex-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
                      <LockKeyhole className="size-3.5" />
                      {category}
                    </span>
                    <h3 className="mt-1.5 text-lg font-bold tracking-tight text-foreground">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <div className="relative mt-4 flex flex-wrap gap-1.5 border-t border-border pt-3">
                    {details.map((detail) => (
                      <span
                        key={detail}
                        className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </Link>
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

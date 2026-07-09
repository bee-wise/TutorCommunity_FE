import Image from "next/image";
import {
  CalendarCheckIcon,
  ChatCircleTextIcon,
  ArrowsCounterClockwiseIcon,
  BellIcon,
  LockIcon,
} from "@phosphor-icons/react/dist/ssr";

const TRUST_ITEMS = [
  {
    id: "schedule",
    icon: CalendarCheckIcon,
    label: "Theo dõi lịch học rõ ràng",
  },
  {
    id: "history",
    icon: ChatCircleTextIcon,
    label: "Quản lý lịch sử trao đổi",
  },
  {
    id: "reconcile",
    icon: ArrowsCounterClockwiseIcon,
    label: "Đối soát thông tin minh bạch",
  },
  { id: "notify", icon: BellIcon, label: "Nhắc lịch và thông báo tự động" },
  { id: "data", icon: LockIcon, label: "Lưu trữ dữ liệu an toàn" },
];

export function TutorGuideTrust() {
  return (
    <section
      className="py-20 sm:py-24 bg-gradient-to-b from-muted/50 to-background"
      aria-labelledby="trust-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content left */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2
                id="trust-heading"
                className="tracking-tight leading-tight text-foreground"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                }}
              >
                An tâm khi đồng hành{" "}
                <span className="text-accent">cùng BeeWise</span>
              </h2>
              <p className="text-foreground/60 leading-relaxed max-w-[48ch]">
                BeeWise xây dựng quy trình quản lý minh bạch để bảo vệ quyền lợi
                của cả gia sư và học viên.
              </p>
            </div>

            {/* 2-col tag grid — not a bullet list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRUST_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-secondary/25 hover:shadow-md transition-all duration-200"
                  >
                    <div
                      className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(255,197,0,0.15)" }}
                    >
                      <Icon
                        size={18}
                        className="text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-sm text-foreground/75 leading-snug font-medium">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Honey potion sticker */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <Image
                src="/images/Sticker/E3-1.PNG"
                alt="Bình mật ong BeeWise - An tâm với quy trình minh bạch"
                width={260}
                height={280}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

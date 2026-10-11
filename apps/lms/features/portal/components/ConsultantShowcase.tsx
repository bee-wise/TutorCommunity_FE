import { PortalReveal } from "./PortalReveal";
import { PortalTitle } from "./PortalTitle";

const steps = [
  { title: "Kết nối với gia sư", body: "Học viên tìm gia sư phù hợp trên BeeWise." },
  { title: "Thống nhất lớp học", body: "Trao đổi lịch học, học phí và mục tiêu của lớp." },
  { title: "Kích hoạt LMS", body: "Tư vấn viên xác nhận và mở quyền truy cập lớp học." },
  { title: "Bắt đầu học", body: "Xem lịch, nhận tài liệu và theo dõi tiến độ trên LMS." },
] as const;

export function ClassActivationShowcase() {
  return (
    <section id="how-it-works" className="scroll-mt-32 border-y border-border bg-muted/40 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <PortalReveal className="max-w-2xl">
          <PortalTitle primary="Bắt đầu từ lớp học " accent="trên BeeWise." className="text-[clamp(2rem,3.5vw,3rem)]" />
        </PortalReveal>
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title}>
              <PortalReveal delay={index * 0.1}>
                <span className="inline-flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-background font-mono text-sm font-medium text-primary">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{step.body}</p>
              </PortalReveal>
            </li>
          ))}
        </ol>
        <PortalReveal className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm leading-6 text-muted-foreground">Cần đổi lịch hoặc hỗ trợ về lớp học? Hãy liên hệ tư vấn viên BeeWise.</p>
          <a href="#faq" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]">Câu hỏi thường gặp</a>
        </PortalReveal>
      </div>
    </section>
  );
}

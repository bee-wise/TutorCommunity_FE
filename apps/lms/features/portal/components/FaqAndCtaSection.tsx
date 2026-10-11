import Link from "next/link";
import { Button } from "@workspace/ui/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@workspace/ui/components/ui/accordion";
import { PortalReveal } from "./PortalReveal";
import { PortalTitle } from "./PortalTitle";
import { SplitText } from "./react-bits/SplitText";

const FAQ_ITEMS = [
  { question: "BeeWise LMS dành cho ai?", answer: "Dành cho học viên và gia sư có lớp học đã được BeeWise kích hoạt. Mỗi người truy cập các tính năng phù hợp với vai trò của mình." },
  { question: "Làm thế nào để bắt đầu sử dụng?", answer: "Sau khi thống nhất lớp học, tư vấn viên xác nhận kết nối và kích hoạt LMS. Bạn đăng nhập bằng tài khoản BeeWise để vào lớp." },
  { question: "Tài liệu được lưu ở đâu?", answer: "Tài liệu và bài tập được lưu theo lớp và từng buổi học. Học viên xem các nội dung đã được gia sư xuất bản." },
  { question: "Ai có thể xem thông tin lớp học?", answer: "Quyền truy cập được giới hạn theo vai trò và lớp học. Chỉ những tài khoản được cấp quyền mới xem được nội dung của lớp." },
] as const;

export function FaqAndCtaSection() {
  return (
    <>
      <section id="faq" className="scroll-mt-32 bg-background py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <PortalReveal>
            <PortalTitle primary="Bạn còn " accent="thắc mắc?" className="text-[clamp(2rem,3vw,2.7rem)]" />
          </PortalReveal>
          <PortalReveal>
            <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`} className="rounded-2xl border border-border bg-background px-5 last:border-b sm:px-6">
                  <AccordionTrigger className="py-5 font-sans text-base font-semibold">{item.question}</AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </PortalReveal>
        </div>
      </section>
      <section className="bg-background px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-primary/15 bg-muted px-6 py-12 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-28 size-96 rounded-full border-[48px] border-primary/5" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <SplitText text="Vào lớp học " accentText="của bạn." className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.22] tracking-[-0.035em] text-primary" />
            <p className="mt-5 text-base leading-7 text-muted-foreground">Đăng nhập bằng tài khoản đã được BeeWise kích hoạt LMS.</p>
            <Button asChild className="mt-7 h-12 rounded-xl px-6 transition-all hover:-translate-y-0.5 active:scale-[0.98] motion-reduce:transform-none"><Link href="/login">Đăng nhập</Link></Button>
          </div>
        </div>
      </section>
      <footer className="border-t border-border bg-background py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} BeeWise Education</p>
          <div className="flex gap-5">
            <a href="https://beewise.vn/terms" className="rounded-md py-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Điều khoản</a>
            <a href="https://beewise.vn/privacy" className="rounded-md py-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Bảo mật</a>
          </div>
        </div>
      </footer>
    </>
  );
}

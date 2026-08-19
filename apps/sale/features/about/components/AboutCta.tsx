import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function AboutCta() {
  return (
    <section className="bg-background px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
      <div className="relative mx-auto max-w-7xl min-h-[360px] sm:min-h-[420px] overflow-hidden rounded-[2.5rem] bg-primary flex items-center">
        {/* Background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,197,0,0.5) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center gap-7 px-6 py-14 sm:px-12 sm:py-18 w-full">
          <h2 className="font-nunito text-3xl sm:text-4xl lg:text-[2.8rem] font-black uppercase leading-tight text-primary-foreground max-w-[22ch]">
            Bạn muốn trở thành một phần của{" "}
            <span className="text-accent">BeeWise</span>?
          </h2>
          <p className="text-primary-foreground/75 text-base sm:text-lg max-w-[48ch] leading-relaxed">
            Dù bạn là học viên đang tìm gia sư, hay một giáo viên muốn đưa chuyên
            môn đến đúng người — BeeWise đang chờ bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tutors"
              id="about-cta-find-tutor"
              className="inline-flex min-h-13 items-center gap-2.5 rounded-full bg-accent px-7 text-base font-bold text-accent-foreground shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Tìm gia sư ngay
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </Link>
            <Link
              href="/tutor-guide"
              id="about-cta-become-tutor"
              className="inline-flex min-h-13 items-center gap-2.5 rounded-full bg-white/15 border border-white/25 px-7 text-base font-bold text-primary-foreground hover:bg-white/25 transition-all duration-200"
            >
              Đăng ký làm gia sư
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

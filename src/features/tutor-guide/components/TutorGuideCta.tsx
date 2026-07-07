import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

export function TutorGuideCta() {
  return (
    <section
      className="py-20 sm:py-28 relative overflow-hidden h-screen flex items-center"
      style={{
        background:
          "linear-gradient(145deg, #280f91 0%, #1a0a60 60%, #0f0638 100%)",
      }}
      aria-labelledby="cta-final-heading"
    >
      <div
        className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-white/5"
        aria-hidden="true"
      />
      <div
        className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full border border-accent/10"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="absolute -top-16 -right-10 w-28 h-28 hidden lg:block pointer-events-none select-none"
          aria-hidden="true"
        >
          <Image
            src="/images/Sticker/E1-3.PNG"
            alt=""
            width={112}
            height={112}
            className="object-contain drop-shadow-xl"
          />
        </div>

        <div className="flex flex-col gap-6 items-center">
          <h2
            id="cta-final-heading"
            className="text-white tracking-tight leading-tight"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(1.875rem, 4.5vw, 3rem)",
            }}
          >
            Bắt đầu hành trình làm gia sư{" "}
            <span className="text-accent">cùng BeeWise</span> ngay hôm nay
          </h2>

          <p className="text-white/60 leading-relaxed max-w-[52ch] text-sm sm:text-base">
            Gia nhập nền tảng gia sư công nghệ giúp bạn tiếp cận nhiều học viên
            hơn, quản lý lớp học dễ dàng hơn và tập trung vào điều quan trọng
            nhất: giảng dạy hiệu quả.
          </p>

          <Link
            href="/register/tutor"
            id="cta-final-register"
            className="mt-2 inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-accent px-10 text-sm font-bold text-accent-foreground transition-all duration-200 hover:bg-highlight active:scale-[0.98] shadow-xl shadow-accent/30 whitespace-nowrap"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Đăng Ký Làm Gia Sư BeeWise Ngay
            <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
          </Link>

          <p className="text-white/35 text-xs">
            Miễn phí đăng ký · Không phí nhận lớp · Hỗ trợ trong suốt quá trình
          </p>
        </div>
      </div>
    </section>
  );
}

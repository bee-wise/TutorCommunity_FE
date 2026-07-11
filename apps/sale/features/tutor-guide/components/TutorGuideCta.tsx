import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

export function TutorGuideCta() {
  return (
    <section
      className="py-20 sm:py-28 relative overflow-hidden min-h-[80vh] md:min-h-[100dvh] flex items-center"
      style={{
        background:
          "linear-gradient(145deg, #280f91 0%, #1a0a60 60%, #0f0638 100%)",
      }}
      aria-labelledby="cta-final-heading"
    >
      <div
        className="absolute -right-24 -top-24 w-64 h-64 sm:w-96 sm:h-96 rounded-full border border-white/5"
        aria-hidden="true"
      />
      <div
        className="absolute -left-16 -bottom-16 w-48 h-48 sm:w-72 sm:h-72 rounded-full border border-accent/10"
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
          <h5
            id="cta-final-heading"
            className="text-white/90 tracking-widest leading-tight text-xs sm:text-sm uppercase"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
            }}
          >
            Lựa chọn hành trình kết nối dễ dàng - an toàn tại sao không?
          </h5>
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
            href="/register"
            id="cta-final-register"
            className="mt-2 inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-full bg-accent px-6 sm:px-10 py-3 sm:py-0 text-xs sm:text-sm font-bold text-accent-foreground transition-all duration-200 hover:bg-highlight active:scale-[0.98] shadow-xl shadow-accent/30 text-center whitespace-normal sm:whitespace-nowrap max-w-full"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ĐĂNG KÝ TRỞ THÀNH GIA SƯ BEEWISE NGAY
            <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
          </Link>

          <p className="text-white/35 text-xs">
            Miễn phí đăng ký · Hỗ trợ trong suốt quá trình
          </p>
        </div>
      </div>
    </section>
  );
}

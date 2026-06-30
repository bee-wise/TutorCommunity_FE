import Link from "next/link";
import { Footer } from "@/src/components/layout/Footer";
import { HeroMotion } from "@/src/features/landing/components/HeroMotion";
import { Compass } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <>
      <main className="flex-1 flex items-center justify-center min-h-dvh pt-20 pb-16 bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 20%, rgba(255,197,0,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(40,15,145,0.05) 0%, transparent 40%)",
          }}
        />

        <div className="relative max-w-2xl mx-auto px-4 text-center z-10">
          <HeroMotion delay={0}>
            <div className="w-20 h-20 bg-[#280F91]/8 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
              <Compass size={40} weight="fill" className="text-[#280F91]" />
            </div>
          </HeroMotion>

          <HeroMotion delay={0.1}>
            <h1
              className="text-7xl sm:text-9xl tracking-tighter text-[#280F91] mb-6 leading-none"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800 }}
            >
              404
            </h1>
          </HeroMotion>

          <HeroMotion delay={0.2}>
            <h2
              className="text-2xl sm:text-3xl text-[#0C0C0B] mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700 }}
            >
              Có vẻ bạn đã đi lạc?
            </h2>
            <p className="text-base sm:text-lg text-[#0C0C0B]/60 leading-relaxed max-w-[40ch] mx-auto mb-10">
              Trang bạn đang tìm kiếm không tồn tại, đã bị gỡ bỏ hoặc tạm thời
              không thể truy cập.
            </p>
          </HeroMotion>

          <HeroMotion delay={0.3}>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#280F91] px-8 text-sm font-bold text-white transition-all duration-200 hover:bg-[#1a0a6b] active:scale-[0.98] shadow-lg shadow-[#280F91]/20"
            >
              Về Trang Chủ
            </Link>
          </HeroMotion>
        </div>
      </main>
    </>
  );
}

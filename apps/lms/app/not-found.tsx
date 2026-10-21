import Image from "next/image";
import Link from "next/link";
import { HeroMotion } from '@workspace/ui/components/HeroMotion';
import { Button } from "@workspace/ui/components/ui/button";

export default function NotFound() {
  return (
    <>
      <main className="flex-1 flex items-center justify-center min-h-dvh pt-20 pb-16 bg-muted relative overflow-hidden">
        <div className="relative max-w-2xl mx-auto px-4 text-center z-10">
          <HeroMotion delay={0}>
            {/* bee-diving: error / not found (.agents/assets.md) */}
            <Image
              src="https://res.cloudinary.com/xcrm6ykz/image/upload/v1789966155/10.png"
              alt=""
              width={160}
              height={160}
              className="mx-auto mb-6 object-contain"
              priority
            />
          </HeroMotion>

          <HeroMotion delay={0.1}>
            <h1
              className="text-7xl sm:text-9xl tracking-tighter text-primary mb-6 leading-none"
              style={{ fontFamily: "var(--font-nunito-family)", fontWeight: 800 }}
            >
              404
            </h1>
          </HeroMotion>

          <HeroMotion delay={0.2}>
            <h2
              className="text-2xl sm:text-3xl text-foreground mb-4 tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-nunito-family)", fontWeight: 700 }}
            >
              Có vẻ bạn đã đi lạc?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[40ch] mx-auto mb-10">
              Trang bạn đang tìm kiếm không tồn tại, đã bị gỡ bỏ hoặc tạm thời
              không thể truy cập.
            </p>
          </HeroMotion>

          <HeroMotion delay={0.3}>
            <Button asChild className="min-h-12 rounded-xl px-8 font-bold shadow-soft active:scale-[0.98]">
              <Link href="/">Về trang chủ</Link>
            </Button>
          </HeroMotion>
        </div>
      </main>
    </>
  );
}


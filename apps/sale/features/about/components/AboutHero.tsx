import Image from "next/image";
import {
  Sparkle,
  Users,
  ShieldCheck,
  GraduationCap,
} from "@phosphor-icons/react/dist/ssr";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-primary pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <span className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-primary-foreground text-sm font-bold">
              <Sparkle size={15} weight="fill" className="text-accent" />
              Về BeeWise
            </span>

            <h1 className="font-nunito text-4xl sm:text-5xl lg:text-[3.2rem] font-black uppercase leading-tight text-primary-foreground">
              Kết nối đúng người,{" "}
              <br />
              <span className="text-accent">đúng thời điểm</span>
            </h1>

            <p className="text-base sm:text-lg text-primary-foreground/75 leading-relaxed max-w-[52ch]">
              BeeWise ra đời từ một câu hỏi đơn giản: tại sao tìm gia sư uy tín
              lại khó đến vậy? Chúng tôi xây dựng nền tảng để việc học thêm trở
              nên minh bạch, an toàn và hiệu quả hơn cho tất cả mọi người.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: Users, label: "500+ Gia sư xác thực" },
                { icon: GraduationCap, label: "2.000+ Học viên kết nối" },
                { icon: ShieldCheck, label: "100% Hồ sơ được kiểm duyệt" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15"
                  >
                    <Icon
                      size={18}
                      weight="fill"
                      className="text-accent shrink-0"
                    />
                    <span className="text-sm font-bold text-primary-foreground">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticker visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl" />
              <Image
                src="/images/Sticker/E3-1.PNG"
                alt="BeeWise mascot"
                fill
                className="object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

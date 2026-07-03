import Image from "next/image";
import Link from "next/link";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { TUTOR_BENEFITS } from "../data/landing.data";

export function TutorSection() {
  return (
    <section
      className="bg-glass py-20 sm:py-24"
      id="for-tutors"
      aria-labelledby="tutor-headline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 relative hidden lg:block">
            <div className="relative w-full aspect-3/4 max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/BeeWiseTeam.JPG"
                alt="Gia sư BeeWise tự tin với máy tính xách tay, sẵn sàng kết nối với học viên"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0px, 33vw"
                objectFit="cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(40,15,145,0.25) 0%, transparent 50%)",
                }}
              />
            </div>

            <div className="absolute -top-4 left-50 bg-secondary text-white rounded-2xl px-5 py-3 shadow-xl">
              <p
                className="text-sm leading-none"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                }}
              >
                Hồ sơ xác thực
              </p>
              <p className="text-white/70 text-xs mt-1">
                Tăng uy tín với học viên
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2
                id="tutor-headline"
                className="flex flex-col text-3xl sm:text-3xl tracking-tight mb-3 text-primary"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                }}
              >
                Bạn Là Gia Sư?{" "}
                <span className="text-secondary text-[1.15rem] sm:text-2xl">
                  BeeWise Kết Nối Bạn Với Đúng Học Viên
                </span>
              </h2>
              <p className="text-foreground/60 leading-relaxed max-w-[52ch]">
                Không cần tự tìm học viên mỗi ngày. BeeWise giúp bạn tiếp cận
                học viên đang có nhu cầu thực sự qua hệ thống AI kết nối thông
                minh.
              </p>
            </div>

            <ul className="flex flex-col gap-4" role="list">
              {TUTOR_BENEFITS.map((benefit) => (
                <li key={benefit.id} className="flex items-start gap-3">
                  <CheckCircleIcon
                    size={22}
                    weight="fill"
                    className="text-secondary shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/register/tutor"
              id="tutor-cta"
              className="self-start inline-flex h-12 items-center justify-center rounded-full bg-secondary px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-secondary/90 active:scale-[0.98] shadow-lg shadow-secondary/25"
            >
              Đăng Ký Trở Thành Gia Sư
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

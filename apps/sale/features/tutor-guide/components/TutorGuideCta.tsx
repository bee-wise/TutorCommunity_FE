import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";

const NOTES = [
  "Miễn phí tạo hồ sơ",
  "Biết rõ cơ chế thu nhập",
  "Có đội ngũ hỗ trợ",
];

export function TutorGuideCta() {
  return (
    <section
      className="bg-background px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8"
      aria-labelledby="cta-final-heading"
    >
      <div className="relative mx-auto grid max-w-7xl min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] overflow-hidden rounded-[2.5rem] bg-primary lg:grid-cols-[1fr_0.75fr]">
        <div className="relative flex flex-col justify-center items-start px-6 py-16 sm:px-12 sm:py-20 lg:px-16 xl:px-20">
          <h2
            id="cta-final-heading"
            className="max-w-[18ch] font-nunito text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-tight text-primary-foreground text-left"
          >
            Sẵn sàng kết nối cùng học viên phù hợp?
          </h2>
          <p className="mt-6 max-w-[54ch] text-base sm:text-lg leading-relaxed text-primary-foreground/75">
            Hoàn thiện hồ sơ gia sư BeeWise và bắt đầu gặp những học viên đang
            tìm đúng chuyên môn của bạn.
          </p>
          <Link
            href="/register"
            id="cta-final-register"
            className="mt-9 inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-accent px-8 text-base font-bold text-accent-foreground shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Bắt đầu tạo hồ sơ
            <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
          </Link>
          <ul
            className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:gap-x-6"
            role="list"
          >
            {NOTES.map((note) => (
              <li
                key={note}
                className="flex items-center gap-2 text-sm sm:text-base text-primary-foreground/80 font-medium"
              >
                <CheckIcon
                  size={16}
                  weight="bold"
                  className="text-accent"
                  aria-hidden="true"
                />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[360px] sm:min-h-[440px] bg-[#d7d8dc] lg:min-h-full">
          <Image
            src="/images/Tutor/2.png"
            alt="Thành viên cộng đồng gia sư BeeWise"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}

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
      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-primary lg:grid-cols-[1fr_0.72fr]">
        <div className="relative flex flex-col items-start px-6 py-14 sm:px-12 sm:py-18 lg:px-16">
          <h2
            id="cta-final-heading"
            className="max-w-[18ch] font-nunito text-3xl font-extrabold leading-tight text-primary-foreground text-justify"
          >
            Sẵn sàng kết nối cùng học viên phù hợp?
          </h2>
          <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-primary-foreground/68">
            Hoàn thiện hồ sơ gia sư BeeWise và bắt đầu gặp những học viên đang
            tìm đúng chuyên môn của bạn.
          </p>
          <Link
            href="/register"
            id="cta-final-register"
            className="mt-8 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-bold text-accent-foreground transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Bắt đầu tạo hồ sơ
            <ArrowRightIcon size={17} weight="bold" aria-hidden="true" />
          </Link>
          <ul
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6"
            role="list"
          >
            {NOTES.map((note) => (
              <li
                key={note}
                className="flex items-center gap-2 text-sm text-primary-foreground/70"
              >
                <CheckIcon
                  size={15}
                  weight="bold"
                  className="text-accent"
                  aria-hidden="true"
                />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-80 bg-[#d7d8dc] lg:min-h-full">
          <Image
            src="/images/Tutor/2.png"
            alt="Thành viên cộng đồng gia sư BeeWise"
            fill
            sizes="(max-width: 1024px) 100vw, 38vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}

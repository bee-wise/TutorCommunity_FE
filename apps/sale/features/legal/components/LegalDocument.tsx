import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  ChevronRight,
  FileText,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalDocumentProps = {
  kind: "privacy" | "terms";
  title: string;
  description: string;
  sections: LegalSection[];
};

export function LegalDocument({
  kind,
  title,
  description,
  sections,
}: LegalDocumentProps) {
  const isPrivacy = kind === "privacy";
  const Icon = isPrivacy ? ShieldCheck : FileText;
  const otherPage = isPrivacy
    ? { href: "/terms", label: "Điều khoản sử dụng", Icon: BookOpenText }
    : { href: "/privacy", label: "Chính sách bảo mật", Icon: ShieldCheck };

  return (
    <main
      id="main-content"
      className="flex-1 bg-[#f7f9ff] pt-16 text-[#17234c]"
    >
      <div className="relative overflow-hidden bg-[#102187] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 0%, #4165e8 0, transparent 36%), radial-gradient(circle at 15% 105%, #162eab 0, transparent 42%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -top-44 h-[34rem] w-[34rem] rounded-full border border-white/10 sm:right-0"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-8 -top-28 h-[27rem] w-[27rem] rounded-full border border-white/10 sm:right-20"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="max-w-3xl">
              <h1 className="font-nunito text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.6rem]">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#dce4ff] sm:text-lg sm:leading-8">
                {description}
              </p>
            </div>

            <div className="hidden justify-end lg:flex" aria-hidden="true">
              <div className="relative flex h-48 w-60 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm">
                <div className="absolute -left-6 top-7 h-14 w-14 rounded-2xl bg-[#ffc500] shadow-lg" />
                <div className="absolute -right-4 bottom-4 h-10 w-10 rounded-xl border border-white/20 bg-white/15" />
                <div className="flex h-28 w-28 items-center justify-center rounded-[1.75rem] border border-white/25 bg-white/15">
                  <Icon size={58} strokeWidth={1.5} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        {/* <div className="mb-9 flex flex-col gap-4 rounded-2xl border border-[#dbe3fc] bg-white p-5 shadow-[0_12px_35px_-28px_#102187] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9eeff] text-[#102187]">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-[#15277e]">Nội dung minh họa</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#64708e]">
                Bố cục và nội dung trên trang là bản mock UI. BeeWise sẽ cập nhật văn bản chính thức trước khi áp dụng.
              </p>
            </div>
          </div>
          <span className="w-fit shrink-0 rounded-full bg-[#fff3c6] px-3 py-1.5 text-xs font-bold text-[#77570b]">
            Bản dự thảo
          </span>
        </div> */}

        <div className="grid items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-24">
            <nav
              aria-label={`Mục lục ${title}`}
              className="rounded-2xl border border-[#e0e6f5] bg-white p-5 shadow-[0_15px_40px_-35px_#122578]"
            >
              <div className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#8390ac]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffc500]" />
                Trong tài liệu
              </div>
              <ol className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-start gap-3 rounded-lg px-2 py-2.5 text-sm leading-5 text-[#4d5a7e] transition-colors hover:bg-[#eef2ff] hover:text-[#102187] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102187]"
                    >
                      <span className="font-bold tabular-nums text-[#94a2c3] group-hover:text-[#102187]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <Link
              href={otherPage.href}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-[#dce4fb] bg-[#eef2ff] px-5 py-4 text-sm font-bold text-[#102187] transition-colors hover:bg-[#e1e9ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102187]"
            >
              <otherPage.Icon size={18} aria-hidden="true" />
              <span className="flex-1">{otherPage.label}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </aside>

          <div className="min-w-0 overflow-hidden rounded-[1.75rem] border border-[#e0e6f5] bg-white px-5 py-2 shadow-[0_20px_60px_-45px_#102187] sm:px-9 lg:px-12">
            {sections.map((section, index) => (
              <section
                id={section.id}
                key={section.id}
                className="scroll-mt-28 border-b border-[#e9edf6] py-9 last:border-b-0 sm:py-11"
              >
                <div className="mb-5 flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf1ff] font-nunito text-base font-black tabular-nums text-[#1734aa]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-nunito text-xl font-black leading-tight text-[#17234c] sm:text-2xl">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4 text-[15px] leading-7 text-[#53607e] sm:text-base sm:leading-8">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul className="space-y-2.5 pl-1">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span
                            className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#e7ac00]"
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-[1.75rem] bg-[#102187] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffd34e]">
              Cần trao đổi thêm?
            </p>
            <h2 className="font-nunito text-xl font-black sm:text-2xl">
              BeeWise luôn sẵn sàng lắng nghe.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#dce4ff]">
              Gửi câu hỏi hoặc góp ý về nội dung trang cho đội ngũ BeeWise.
            </p>
          </div>
          <a
            href="mailto:beewise.vn@gmail.com"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#ffc500] px-5 py-3 text-sm font-extrabold text-[#17234c] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Mail size={17} aria-hidden="true" />
            Liên hệ BeeWise
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </main>
  );
}

import { HeroBeeVisual } from "./HeroBeeVisual";

export function LmsHeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbfaf7] pt-[72px]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[37%] bg-[#e9efff] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[47%]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[72px] right-[44%] hidden h-[calc(100%-72px)] w-[9%] -skew-x-[12deg] bg-[#e9efff] lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[min(780px,calc(100dvh-72px))] max-w-7xl items-center gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-8 lg:px-8 lg:py-16">
        <div className="relative z-10 max-w-[640px]">
          <h1
            className="mt-5 text-[clamp(2.75rem,5.4vw,4.2rem)] font-extrabold leading-[1.06] tracking-[-0.055em] text-primary"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            Quản lý lớp học,
            <br />
            <span className="text-accent">cùng BeeWise LMS.</span>
          </h1>
          <p className="mt-6 max-w-[550px] text-base leading-7 text-[#37333d]/80 sm:text-lg sm:leading-8">
            Lịch học, tài liệu, bài tập và trao đổi cùng nằm trong một không
            gian dành cho học viên và gia sư.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#learner"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl bg-[#280f91] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1e0b70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91] focus-visible:ring-offset-2"
            >
              Khám phá cho học viên
            </a>
            <a
              href="#tutor"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl border border-[#280f91]/25 bg-[#fbfaf7] px-6 text-sm font-bold text-[#280f91] transition-colors hover:bg-[#eeeaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91] focus-visible:ring-offset-2"
            >
              Dành cho gia sư
            </a>
          </div>
        </div>

        <HeroBeeVisual />
      </div>
    </section>
  );
}

import { DashboardPreview } from "./PortalProductVisuals";

export function LmsHeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#fbfaf7] pb-16 pt-28 lg:pb-24 lg:pt-32">
      <div
        className="absolute inset-x-0 top-[48%] h-[52%] bg-[#eeeaf9]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center h-screen">
          <p className="text-sm font-extrabold text-[#280f91]">
            Nền tảng quản lý lớp học BeeWise
          </p>
          <h1
            className="mt-5 text-[42px] font-extrabold leading-[1.02] tracking-[-0.05em] text-[#17141b] sm:text-6xl lg:text-[72px]"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            <span className="block text-primary">Quản lý lớp học</span>
            <span className="mt-1 block text-accent sm:mt-2">
              cùng BeeWise LMS.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#37333d]/68 sm:text-lg">
            Lịch học, tài liệu, tin nhắn và tiến độ được đồng bộ trong một không
            gian dành cho cả gia sư và học viên.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#learner"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl bg-[#280f91] px-6 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91] focus-visible:ring-offset-2"
            >
              Trải nghiệm cho học viên
            </a>
            <a
              href="#tutor"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl border border-[#280f91]/22 bg-white px-6 text-sm font-bold text-[#280f91] transition-colors hover:bg-[#280f91]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91] focus-visible:ring-offset-2"
            >
              Công cụ dành cho gia sư
            </a>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl lg:mt-14">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

const steps = [
  { title: "Kết nối", body: "Học viên tìm gia sư phù hợp trên BeeWise." },
  {
    title: "Thống nhất lớp học",
    body: "Hai bên trao đổi lịch học, học phí và mục tiêu.",
  },
  {
    title: "BeeWise kích hoạt LMS",
    body: "Tư vấn viên xác nhận và hệ thống mở không gian lớp học.",
  },
  {
    title: "Cùng theo dõi tiến độ",
    body: "Lịch, tài liệu và trạng thái lớp luôn được cập nhật.",
  },
] as const;

export function ClassActivationShowcase() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-[#f1eef8] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold text-[#280f91]">
            BeeWise vận hành lớp học cùng bạn
          </p>
          <h2
            className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-primary sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-nunito-family)" }}
          >
            Kích hoạt <span className="text-[#ffc500]">SuperLMS</span> dễ dàng
            khi tham gia BeeWise
          </h2>
          <p className="mt-5 text-base leading-7 text-[#37333d]/65">
            Quy trình rõ ràng giúp gia sư và học viên bắt đầu nhanh.
          </p>
        </div>
        <ol className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl bg-white p-6 shadow-[0_12px_36px_rgba(40,15,145,0.06)]"
            >
              <span className="text-sm font-extrabold text-[#280f91]/45">
                0{index + 1}
              </span>
              <h3
                className="mt-8 text-lg font-extrabold text-[#17141b]"
                style={{ fontFamily: "var(--font-nunito-family)" }}
              >
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#37333d]/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col justify-between gap-5 rounded-2xl bg-[#280f91] px-6 py-6 text-white sm:flex-row sm:items-center sm:px-8">
          <p className="max-w-2xl text-sm font-semibold leading-6 text-white/82 sm:text-base">
            Mỗi khi gặp khó khăn, tư vấn viên BeeWise luôn đồng hành cùng bạn
          </p>
          <a
            href="#faq"
            className="whitespace-nowrap text-sm font-extrabold text-[#ffc500] underline decoration-[#ffc500]/35 underline-offset-4 hover:decoration-[#ffc500]"
          >
            Tìm hiểu thêm
          </a>
        </div>
      </div>
    </section>
  );
}

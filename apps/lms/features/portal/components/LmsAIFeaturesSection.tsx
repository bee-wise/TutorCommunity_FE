import Link from "next/link";

const AI_CAPABILITIES = [
  {
    title: "Tóm tắt nội dung bài học",
    description: "Chắt lọc khái niệm, công thức và kiến thức cần nhớ từ nội dung buổi học.",
  },
  {
    title: "Tạo quiz ôn tập tự động",
    description: "Sinh câu hỏi trắc nghiệm, đáp án và giải thích bám sát phần vừa học.",
  },
] as const;

function SummaryPreview() {
  return (
    <div className="rounded-2xl border border-white/12 bg-white p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-5">
      <div className="flex items-center justify-between border-b border-[#280f91]/8 pb-3">
        <p className="text-xs font-extrabold text-[#280f91] sm:text-sm">Tóm tắt lý thuyết</p>
        <span className="rounded-md bg-[#447353]/10 px-2 py-1 text-[8px] font-bold text-[#447353] sm:text-[10px]">Đã hoàn thành</span>
      </div>
      <div className="pt-4">
        <h3 className="text-sm font-extrabold text-[#17141b] sm:text-base">Hệ phương trình bậc nhất hai ẩn</h3>
        <p className="mt-2 text-[9px] leading-4 text-[#37333d]/62 sm:text-[11px] sm:leading-5">Bài học trình bày dạng tổng quát và hai phương pháp giải cơ bản.</p>
        <div className="mt-4 rounded-xl border border-[#cfe1fa] bg-[#cfe1fa]/25 p-3">
          <p className="text-[9px] font-extrabold text-[#280f91] sm:text-[11px]">Phương pháp thế</p>
          <p className="mt-1 text-[8px] leading-4 text-[#37333d]/60 sm:text-[10px]">Rút một ẩn từ phương trình đầu và thay vào phương trình còn lại.</p>
        </div>
        <div className="mt-2 rounded-xl border border-[#cfe1fa] bg-[#cfe1fa]/25 p-3">
          <p className="text-[9px] font-extrabold text-[#280f91] sm:text-[11px]">Phương pháp cộng đại số</p>
          <p className="mt-1 text-[8px] leading-4 text-[#37333d]/60 sm:text-[10px]">Biến đổi hệ số để loại một ẩn và tìm nghiệm của hệ.</p>
        </div>
      </div>
    </div>
  );
}

function QuizPreview() {
  const options = [
    { label: "A", value: "(1, 2)", state: "default" },
    { label: "B", value: "(2, 1)", state: "correct" },
    { label: "C", value: "(3, 0)", state: "default" },
    { label: "D", value: "(0, 3)", state: "default" },
  ] as const;

  return (
    <div className="rounded-2xl border border-white/12 bg-white p-4 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-5">
      <div className="flex items-center justify-between border-b border-[#280f91]/8 pb-3">
        <p className="text-xs font-extrabold text-[#280f91] sm:text-sm">Quiz ôn tập</p>
        <span className="rounded-md bg-[#280f91]/8 px-2 py-1 text-[8px] font-bold text-[#280f91] sm:text-[10px]">5 câu hỏi</span>
      </div>
      <div className="pt-4">
        <p className="text-[9px] font-bold leading-4 text-[#17141b] sm:text-[11px] sm:leading-5"><span className="text-[#280f91]">Câu 1.</span> Hệ phương trình x + y = 3 và 2x - y = 3 có nghiệm là:</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {options.map((option) => <div key={option.label} className={`flex items-center gap-2 rounded-lg border p-2 text-[8px] font-semibold sm:text-[10px] ${option.state === "correct" ? "border-[#447353] bg-[#447353]/10 text-[#447353]" : "border-[#280f91]/10 text-[#37333d]/65"}`}><span className="grid size-5 shrink-0 place-items-center rounded-full border border-current text-[7px] font-extrabold">{option.label}</span>{option.value}</div>)}
        </div>
        <div className="mt-4 rounded-xl border border-[#447353]/20 bg-[#447353]/8 p-3">
          <p className="text-[9px] font-extrabold text-[#447353] sm:text-[11px]">Đáp án chính xác</p>
          <p className="mt-1 text-[8px] leading-4 text-[#37333d]/62 sm:text-[10px]">Cộng hai phương trình được 3x = 6, suy ra x = 2 và y = 1.</p>
        </div>
      </div>
    </div>
  );
}

function AiProductVisual() {
  return (
    <div className="relative min-h-[430px] sm:min-h-[500px]">
      <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(40,15,145,0.08),rgba(207,225,250,0.7))]" />
      <div className="absolute left-0 top-0 w-[72%] sm:w-[68%]"><SummaryPreview /></div>
      <div className="absolute bottom-0 right-0 w-[74%] sm:w-[70%]"><QuizPreview /></div>
      <div className="absolute right-3 top-4 rounded-xl border border-[#280f91]/10 bg-[#280f91] px-3 py-2 shadow-sm sm:right-6">
        <p className="text-[9px] font-bold text-white sm:text-[11px]">Tạo từ nội dung buổi học</p>
      </div>
    </div>
  );
}

export function LmsAIFeaturesSection() {
  return (
    <section aria-labelledby="lms-ai-headline" className="bg-[#fbfaf7] px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-32">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#280f91]/10 bg-[#eaf2ff] p-6 shadow-[0_24px_70px_rgba(40,15,145,0.10)] sm:rounded-[36px] sm:p-10 lg:p-12 xl:p-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-sm font-extrabold text-[#280f91]">BeeWise AI trong LMS</p>
            <h2 id="lms-ai-headline" className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-[-0.035em] text-[#280f91] sm:text-4xl lg:text-[44px]" style={{ fontFamily: "var(--font-nunito-family)" }}>Biến mỗi buổi học thành tài liệu ôn tập.</h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#37333d]/68 sm:text-base sm:leading-7">Sau buổi học, BeeWise AI hỗ trợ gia sư tổng hợp nội dung và chuẩn bị bài luyện tập để học viên ôn lại ngay khi kiến thức còn mới.</p>
            <div className="mt-8 space-y-6">
              {AI_CAPABILITIES.map((item, index) => <div key={item.title} className="grid grid-cols-[28px_1fr] gap-3"><span className="pt-0.5 text-xs font-extrabold text-[#280f91]/55">0{index + 1}</span><div><h3 className="text-sm font-extrabold text-[#17141b] sm:text-base">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#37333d]/60">{item.description}</p></div></div>)}
            </div>
            <Link href="/login" className="mt-9 inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl bg-[#280f91] px-6 text-sm font-extrabold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#280f91] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eaf2ff]">Khám phá BeeWise AI</Link>
          </div>
          <div className="lg:col-span-7"><AiProductVisual /></div>
        </div>
      </div>
    </section>
  );
}

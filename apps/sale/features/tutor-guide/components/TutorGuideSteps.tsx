import Image from "next/image";

const STEPS = [
  {
    id: "register",
    number: "01",
    title: "Đăng ký tài khoản",
    body: "Tạo hồ sơ gia sư và bổ sung thông tin chuyên môn, môn dạy, khu vực, kinh nghiệm cùng các giấy tờ xác thực.",
  },
  {
    id: "verify",
    number: "02",
    title: "Xác minh hồ sơ",
    body: "Đội ngũ BeeWise kiểm tra thông tin và xác thực hồ sơ để tăng độ tin cậy trước khi hiển thị với học viên.",
  },
  {
    id: "teach",
    number: "03",
    title: "Kết nối và bắt đầu giảng dạy",
    body: "Khi có học viên phù hợp, bạn sẽ được mời tham gia kết nối, sắp xếp buổi học thử và bắt đầu lớp học sau khi hai bên thống nhất.",
  },
];

export function TutorGuideSteps() {
  return (
    <section
      id="how-to-register"
      className="py-20 sm:py-24 bg-background"
      aria-labelledby="steps-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Sticker left */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-72 h-72">
              <Image
                src="/images/Sticker/E2-1.PNG"
                alt="Bee đang học và dạy học với cây đũa phép"
                width={288}
                height={288}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

          {/* Steps content right */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h2
                id="steps-heading"
                className="tracking-tight leading-tight text-foreground"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                }}
              >
                Chỉ cần <span className="text-accent">3 bước</span> để bắt đầu
              </h2>
              <p className="text-foreground/60 leading-relaxed max-w-[44ch]">
                Quy trình đơn giản, rõ ràng. Chỉ cần phí xác minh hồ sơ, bạn có
                thể bắt đầu nhận học viên.
              </p>
            </div>

            {/* Step cards — vertical stack with connecting line */}
            <div className="relative flex flex-col gap-0">
              {/* Vertical connector line */}
              <div
                className="absolute left-[23px] top-12 bottom-12 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, #280f91 0%, #447353 50%, #ffc500 100%)",
                  opacity: 0.25,
                }}
                aria-hidden="true"
              />

              {STEPS.map((step, i) => (
                <div
                  key={step.id}
                  className="relative flex items-start gap-6 py-6"
                >
                  {/* Number badge */}
                  <div
                    className="relative z-10 shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 bg-background"
                    style={{
                      borderColor:
                        i === 0
                          ? "var(--primary)"
                          : i === 1
                            ? "var(--secondary)"
                            : "var(--accent)",
                    }}
                  >
                    <span
                      className="text-sm leading-none"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 800,
                        color:
                          i === 0
                            ? "var(--primary)"
                            : i === 1
                              ? "var(--secondary)"
                              : "var(--accent)",
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-2 pt-1">
                    <h3
                      className="text-base sm:text-lg text-foreground leading-snug"
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-foreground/60 leading-relaxed max-w-[42ch]">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

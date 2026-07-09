import Link from "next/link";
import Image from "next/image";

export function LmsFooter() {
  return (
    <footer className="bg-white border-t border-[#280f91]/8 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-9 h-9 rounded-xl bg-[#280f91] flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="https://res.cloudinary.com/dqevxj2k6/image/upload/v1783561272/beewise/beewise-logo-nobackground.png"
                  alt="BeeWise"
                  fill
                  sizes="36px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[#280f91] text-sm uppercase"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 800,
                  }}
                >
                  BeeWise
                </span>
                <span
                  className="text-[#0c0c0b]/40 text-xs font-mono"
                  style={{ letterSpacing: "0.08em" }}
                >
                  LMS
                </span>
              </div>
            </div>
            <p className="text-[#0c0c0b]/60 text-sm leading-relaxed max-w-[300px]">
              Nền tảng học tập kết nối gia sư và học viên thông minh tại Việt
              Nam.
            </p>
          </div>

          {/* Links */}
          <div>
            <p
              className="text-[#0c0c0b] text-sm font-bold mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Khám phá
            </p>
            <div className="flex flex-col gap-2.5">
              {["Tìm gia sư", "Tính năng", "Giá cả", "Blog học tập"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[#0c0c0b]/60 text-sm hover:text-[#280f91] transition-colors"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>

          <div>
            <p
              className="text-[#0c0c0b] text-sm font-bold mb-4"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Hỗ trợ
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Trung tâm trợ giúp",
                "Liên hệ",
                "Điều khoản sử dụng",
                "Chính sách bảo mật",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[#0c0c0b]/60 text-sm hover:text-[#280f91] transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#0c0c0b]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#0c0c0b]/40 text-xs">
            &copy; {new Date().getFullYear()} BeeWise Education. Bảo lưu mọi
            quyền.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ffc500]" />
            <p className="text-[#0c0c0b]/40 text-xs">
              Hệ thống hoạt động bình thường
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

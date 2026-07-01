import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
  { label: "Chính Sách Bảo Mật", href: "/privacy" },
  { label: "Điều Khoản Sử Dụng", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-[#280F91] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-12 h-12 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-sm border border-white/20">
                <Image
                  src="/brand/beewise-logo-nobackground.PNG"
                  alt="BeeWise Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span
                className="text-white text-lg leading-none"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800,
                }}
              >
                Cộng Đồng Gia Sư
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Nền tảng kết nối gia sư và học viên thông qua công nghệ AI. Nhanh
              hơn, minh bạch hơn, đáng tin cậy hơn.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-sm text-white/70 mb-1">Hỗ trợ</p>
            <a
              href="mailto:support@beewise.vn"
              className="text-[#FFC500] font-semibold hover:text-[#FADC76] transition-colors text-sm"
            >
              support@beewise.vn
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} BeeWise. Tất cả quyền được bảo
            lưu.
          </p>
          <nav className="flex items-center gap-6" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/50 text-xs hover:text-white/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

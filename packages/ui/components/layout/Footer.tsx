import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS = [
  { label: "Gia sư 1:1", href: "/tutors" },
  { label: "Tìm lớp", href: "/classes" },
  { label: "Trở thành gia sư", href: "/tutor-guide" },
  { label: "Về chúng tôi", href: "/about-us" },
];

const LEGAL_LINKS = [
  { label: "Chính Sách Bảo Mật", href: "/privacy" },
  { label: "Điều Khoản Sử Dụng", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-amber-300/80 bg-gradient-to-r from-[#FFE58F] via-[#FED766] to-[#FFCE38] text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
          {/* Cột 1: Brand Info */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="mb-3 inline-block rounded-lg transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="BeeWise Home"
            >
              <div className="relative h-8 w-40 sm:h-8.5 sm:w-44">
                <Image
                  src="https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/v1789964923/Logo_2.png"
                  alt="BeeWise Logo"
                  fill
                  sizes="(max-width: 640px) 160px, 176px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-primary/80">
              Nền tảng kết nối gia sư và học viên thông qua công nghệ AI. Nhanh
              hơn, minh bạch hơn, đáng tin cậy hơn.
            </p>
          </div>

          {/* Cột 2: Khám phá */}
          <div className="flex flex-col md:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-wider text-primary/70">
                Khám phá
              </p>
              <ul className="flex flex-col gap-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm font-bold text-primary/85 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cột 3: Hỗ trợ & Liên hệ */}
          <div className="flex flex-col md:items-end">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-primary/70">
              Hỗ trợ & Liên hệ
            </p>
            <a
              href="mailto:support@beewise.vn"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/75 px-4 py-2 text-sm font-extrabold text-primary shadow-xs ring-1 ring-amber-300/70 transition-all hover:bg-white hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              support@beewise.vn
            </a>
          </div>
        </div>

        {/* Dòng phân cách & Bản quyền */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-amber-300/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs font-semibold text-primary/70">
            &copy; {new Date().getFullYear()} BeeWise. Tất cả quyền được bảo
            lưu.
          </p>
          <nav className="flex items-center gap-6" aria-label="Chính sách">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm text-xs font-bold text-primary/75 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

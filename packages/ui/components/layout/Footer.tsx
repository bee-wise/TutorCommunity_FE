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
    <footer className="border-t border-white/10 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
          {/* Cột 1: Brand Info */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="mb-4 inline-flex items-center rounded-full transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="BeeWise Home"
            >
              <div className="flex items-center justify-center rounded-full bg-white px-3.5 py-1.5 shadow-sm ring-1 ring-white/20">
                <div className="relative h-7 w-32 sm:h-8 sm:w-36">
                  <Image
                    src="https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/v1789964923/Logo_2.png"
                    alt="BeeWise"
                    fill
                    sizes="(max-width: 640px) 128px, 144px"
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </Link>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-white/75">
              Nền tảng kết nối gia sư và học viên thông qua công nghệ AI. Nhanh
              hơn, minh bạch hơn, đáng tin cậy hơn.
            </p>
          </div>

          {/* Cột 2: Khám phá */}
          <div className="flex flex-col md:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-wider text-accent">
                Khám phá
              </p>
              <ul className="flex flex-col gap-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm font-bold text-white/80 transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-accent">
              Hỗ trợ & Liên hệ
            </p>
            <a
              href="mailto:support@beewise.vn"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-white border border-white/20 transition-all hover:bg-white/20 hover:text-accent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              support@beewise.vn
            </a>
          </div>
        </div>

        {/* Dòng phân cách & Bản quyền */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs font-semibold text-white/60">
            &copy; {new Date().getFullYear()} BeeWise. Tất cả quyền được bảo
            lưu.
          </p>
          <nav className="flex items-center gap-6" aria-label="Chính sách">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm text-xs font-bold text-white/60 transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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

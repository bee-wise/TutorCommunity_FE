import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTiktok, FaPhone, FaEnvelope } from "react-icons/fa6";

const ZaloIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 6.5 24 11"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61594613068998",
    icon: FaFacebookF,
    iconClassName: "h-4 w-4",
    ariaLabel: "Theo dõi BeeWise trên Facebook",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@beewise.vn",
    icon: FaTiktok,
    iconClassName: "h-4 w-4",
    ariaLabel: "Theo dõi BeeWise trên TikTok",
  },
  {
    name: "Zalo",
    href: "https://zalo.me/0799790814",
    icon: ZaloIcon,
    iconClassName: "w-5 h-auto",
    ariaLabel: "Liên hệ BeeWise qua Zalo",
  },
];

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

            {/* LMS Info Card */}
            <div className="mt-5 max-w-sm rounded-2xl border border-white/15 bg-white/5 p-3.5 backdrop-blur-xs transition-all duration-200 hover:border-white/25 hover:bg-white/8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <div className="flex items-center gap-1.5 rounded-full bg-white pl-2.5 pr-2 py-1 shadow-xs ring-1 ring-white/20">
                      <div className="relative h-4.5 w-20">
                        <Image
                          src="https://res.cloudinary.com/xcrm6ykz/image/upload/e_trim/v1789964923/Logo_2.png"
                          alt="BeeWise"
                          fill
                          sizes="80px"
                          className="object-contain object-center"
                        />
                      </div>
                      <span className="rounded-full bg-accent/40 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                        LMS
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/70">
                    Quản lý lịch dạy &amp; lớp học trực tuyến
                  </p>
                </div>
                <a
                  href="http://superlms.beewise.vn"
                  target="_blank"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-extrabold text-accent-foreground shadow-sm transition-all duration-200 hover:bg-accent/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>Vào LMS</span>
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
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
            <div className="flex flex-col gap-2.5 items-start md:items-end">
              <a
                href="tel:0799790814"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-white border border-white/20 transition-all hover:bg-white/20 hover:text-accent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FaPhone className="h-3.5 w-3.5 text-accent" />
                <span>0799 790 814</span>
              </a>

              <a
                href="mailto:beewise.vn@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-white border border-white/20 transition-all hover:bg-white/20 hover:text-accent active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FaEnvelope className="h-3.5 w-3.5 text-accent" />
                <span>beewise.vn@gmail.com</span>
              </a>
            </div>

            <div className="mt-5 flex flex-col items-start md:items-end">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-white/70">
                Mạng xã hội
              </p>
              <div className="flex items-center gap-2.5">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.ariaLabel}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition-all duration-200 hover:scale-110 hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Icon className={item.iconClassName ?? "h-4 w-4"} />
                    </a>
                  );
                })}
              </div>
            </div>
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

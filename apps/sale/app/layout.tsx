import { googleSans, nunito } from "@workspace/core/configs/fonts";
import { Providers } from "@workspace/ui/components/providers";
import "@workspace/ui/globals.css";
import { Metadata } from "next";
import { GuestFavoriteModal } from "@/features/favorite-tutors/components/GuestFavoriteModal";
import { NotificationDrawer } from "@/features/notifications/components/NotificationDrawer";
import { MessageFAB } from "@/features/messages";
import { saleSeoConfig } from "@/configs/seo";

export const metadata: Metadata = {
  metadataBase: new URL(saleSeoConfig.siteUrl),
  title: {
    default: "BeeWise - Nền tảng kết nối gia sư và quản lý học tập",
    template: "%s | BeeWise",
  },
  description:
    "Nền tảng kết nối trực tiếp học viên với những gia sư chất lượng thông qua trợ lý AI. Học tập và giảng dạy dễ dàng, minh bạch và hiệu quả.",
  openGraph: {
    siteName: "BeeWise",
    type: "website",
    locale: "vi_VN",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BeeWise",
  alternateName: ["BeeWise.vn", "Gia sư BeeWise", "Cộng đồng gia sư BeeWise"],
  url: saleSeoConfig.siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${googleSans.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          {children}
          <GuestFavoriteModal />
          <NotificationDrawer />
          <MessageFAB />
        </Providers>
      </body>
    </html>
  );
}

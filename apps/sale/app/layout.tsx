import { googleSans, nunito } from "@workspace/core/configs/fonts";
import { Providers } from "@workspace/ui/components/providers";
import "@workspace/ui/globals.css";
import { Metadata } from "next";
import { GuestFavoriteModal } from "@/features/favorite-tutors/components/GuestFavoriteModal";
import { NotificationDrawer } from "@/features/notifications/components/NotificationDrawer";
import { saleSeoConfig } from "@/configs/seo";

export const metadata: Metadata = {
  metadataBase: new URL(saleSeoConfig.siteUrl),
  title: "Cộng đồng gia sư",
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
        <Providers>
          {children}
          <GuestFavoriteModal />
          <NotificationDrawer />
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "@workspace/ui/components/providers";
import "@workspace/ui/globals.css";
import { Metadata } from "next";
import { googleSans, nunito } from "@workspace/core/configs/fonts";
import { TooltipProvider } from "@workspace/ui/components/ui/tooltip";

export const metadata: Metadata = {
  title: "BeeWise LMS | Hệ Thống Quản Lý Học Tập Thông Minh",
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
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}

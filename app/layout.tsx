import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/src/components/providers";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cộng đồng gia sư",
};

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const googleSans = localFont({
  src: [
    {
      path: "../public/fonts/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GoogleSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/GoogleSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-google-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${montserrat.variable} ${googleSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

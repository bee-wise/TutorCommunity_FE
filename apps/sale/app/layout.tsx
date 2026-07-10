import { Montserrat } from "next/font/google";
import { googleSans } from "@workspace/core/configs/fonts";
import { Providers } from '@workspace/ui/components/providers';
import "@workspace/ui/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cộng đồng gia sư",
};

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${montserrat.variable} ${googleSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


import localFont from "next/font/local";

export const googleSans = localFont({
  src: [
    {
      path: "../assets/fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../assets/fonts/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-google-sans",
});

export const nunito = localFont({
  src: [
    {
      path: "../assets/fonts/Nunito-VariableFont_wght.ttf",
      weight: "200 1000",
      style: "normal",
    },
    {
      path: "../assets/fonts/Nunito-Italic-VariableFont_wght.ttf",
      weight: "200 1000",
      style: "italic",
    },
  ],
  variable: "--font-nunito-family",
});

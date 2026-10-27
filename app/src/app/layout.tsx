import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import SiteHeaderLayout from "@/site/layout/site-header/SiteHeaderLayout/SiteHeaderLayout";
import "@/styles/main.scss";

const fontTitle = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Aegir", template: "%s · Aegir" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fontTitle.variable} ${fontMono.variable} ${fontBody.variable}`}
    >
      <body>
        <SiteHeaderLayout />
        {children}
      </body>
    </html>
  );
}

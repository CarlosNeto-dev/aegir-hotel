import type { Metadata, Viewport } from "next";
import {
  Atkinson_Hyperlegible,
  Cormorant_Garamond,
  DM_Sans,
  DM_Serif_Display,
  Inter,
  JetBrains_Mono,
  Karla,
  Playfair_Display,
} from "next/font/google";
import type { ReactNode } from "react";
import AuthProvider from "./_shared/auth/AuthProvider/AuthProvider";
import CustomCursor from "./_shared/overlays/CustomCursor/CustomCursor";
import SectionCurtain from "./_shared/overlays/SectionCurtain/SectionCurtain";
import { loaderNoScript } from "./_shared/overlays/SiteLoader/site-loader-script";
import TouchEffect from "./_shared/overlays/TouchEffect/TouchEffect";
import AccountPanel from "./_shared/panels/account-panel/AccountPanel/AccountPanel";
import PanelProvider from "./_shared/panels/PanelProvider/PanelProvider";
import SettingsPanel from "./_shared/panels/settings-panel/SettingsPanel/SettingsPanel";
import SettingsProvider from "./_shared/panels/settings-panel/SettingsProvider/SettingsProvider";
import { settingsScript } from "./_shared/panels/settings-panel/settings-utils/settings-script";
import SettingsCapsule from "./_shared/settings-capsule/SettingsCapsule/SettingsCapsule";
import SmoothScrollProvider from "./_shared/smooth-scroll/SmoothScrollProvider/SmoothScrollProvider";
import ActiveSectionProvider from "./_shared/site-header/header-hooks/ActiveSectionProvider";
import SiteHeaderLayout from "./_shared/site-header/SiteHeaderLayout/SiteHeaderLayout";
import "./_styles/main.scss";

const fontTitle = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-title-web",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body-web",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-web",
  display: "swap",
});

/* Fontes opcionais dos Ajustes: sem preload, o navegador só baixa a que for escolhida. */
const fontElegantTitle = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-elegant-title",
  display: "swap",
  preload: false,
});

const fontElegantBody = Karla({
  subsets: ["latin"],
  variable: "--font-elegant-body",
  display: "swap",
  preload: false,
});

const fontModernTitle = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-modern-title",
  display: "swap",
  preload: false,
});

const fontModernBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-modern-body",
  display: "swap",
  preload: false,
});

const fontEasy = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-easy",
  display: "swap",
  preload: false,
});

const FONT_VARIABLES = [
  fontTitle,
  fontBody,
  fontMono,
  fontElegantTitle,
  fontElegantBody,
  fontModernTitle,
  fontModernBody,
  fontEasy,
]
  .map((font) => font.variable)
  .join(" ");

export const metadata: Metadata = {
  title: { default: "Aegir", template: "%s · Aegir" },
  description:
    "Aegir, hotel no litoral norte da Bahia: um U aberto para o mar, com três suítes, o Restaurante Sal pé na areia, o Spa Água e piscina de borda infinita.",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t="light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={FONT_VARIABLES}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: settingsScript }} />
        <noscript>
          <style>{loaderNoScript}</style>
        </noscript>
      </head>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SettingsProvider>
          <AuthProvider>
            <PanelProvider>
              <SmoothScrollProvider>
                <ActiveSectionProvider>
                  <SiteHeaderLayout />
                  {children}
                  <SettingsCapsule />
                  <SettingsPanel />
                  <AccountPanel />
                  <SectionCurtain />
                  <CustomCursor />
                  <TouchEffect />
                </ActiveSectionProvider>
              </SmoothScrollProvider>
            </PanelProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

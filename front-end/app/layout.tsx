import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import AuthProvider from "./_shared/auth/AuthProvider/AuthProvider";
import CustomCursor from "./_shared/overlays/CustomCursor/CustomCursor";
import SectionCurtain from "./_shared/overlays/SectionCurtain/SectionCurtain";
import TouchEffect from "./_shared/overlays/TouchEffect/TouchEffect";
import AccountPanel from "./_shared/panels/account-panel/AccountPanel/AccountPanel";
import PanelProvider from "./_shared/panels/PanelProvider/PanelProvider";
import SettingsPanel from "./_shared/panels/settings-panel/SettingsPanel/SettingsPanel";
import SettingsProvider from "./_shared/panels/settings-panel/SettingsProvider/SettingsProvider";
import { settingsScript } from "./_shared/panels/settings-panel/settings-utils/settings-script";
import SettingsCapsule from "./_shared/settings-capsule/SettingsCapsule/SettingsCapsule";
import SmoothScrollProvider from "./_shared/smooth-scroll/SmoothScrollProvider/SmoothScrollProvider";
import ActiveSectionProvider from "./_shared/site-header/header-hooks/ActiveSectionProvider";
import { SiteHeaderLayout } from "./_shared/site-header/SiteHeaderLayout/SiteHeaderLayout";
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

export const metadata: Metadata = {
  title: { default: "Aegir", template: "%s · Aegir" },
  description:
    "Aegir, um hotel fictício no litoral da Bahia: seis lugares, três suítes e dezesseis vistas que abrem em 3D.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${fontTitle.variable} ${fontBody.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: settingsScript }} />
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

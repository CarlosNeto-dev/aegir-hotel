import type { Viewport } from "next";
import type { ReactNode } from "react";
import CustomCursor from "./_shared/overlays/CustomCursor/CustomCursor";
import TouchEffect from "./_shared/overlays/TouchEffect/TouchEffect";
import PanelProvider from "./_shared/panels/PanelProvider/PanelProvider";
import SettingsPanel from "./_shared/panels/settings-panel/SettingsPanel/SettingsPanel";
import SettingsProvider from "./_shared/panels/settings-panel/SettingsProvider/SettingsProvider";
import { settingsScript } from "./_shared/panels/settings-panel/settings-utils/settings-script";
import SettingsCapsule from "./_shared/settings-capsule/SettingsCapsule/SettingsCapsule";
import { SiteHeaderLayout } from "./_shared/site-header/SiteHeaderLayout/SiteHeaderLayout";
import "./_styles/main.scss";

export const viewport: Viewport = {
  colorScheme: "light dark",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: settingsScript }} />
      </head>
      <body>
        <SettingsProvider>
          <PanelProvider>
            <SiteHeaderLayout />
            {children}
            <SettingsCapsule />
            <SettingsPanel />
            <CustomCursor />
            <TouchEffect />
          </PanelProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

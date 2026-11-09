import type { Viewport } from "next";
import type { ReactNode } from "react";
import PanelProvider from "./_shared/panels/PanelProvider/PanelProvider";
import { SiteHeaderLayout } from "./_shared/site-header/SiteHeaderLayout/SiteHeaderLayout";
import ThemeToggle from "./_shared/theme-toggle/ThemeToggle/ThemeToggle";
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
      </head>
      <body>
        <PanelProvider>
          <SiteHeaderLayout />
          {children}
          <ThemeToggle />
        </PanelProvider>
      </body>
    </html>
  );
}

import type { ReactNode } from "react";
import { SiteHeaderLayout } from "./_shared/site-header/SiteHeaderLayout/SiteHeaderLayout";
import { ThemeToggle } from "./_shared/theme-toggle/ThemeToggle";
import "./_styles/main.scss";

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeaderLayout />
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}

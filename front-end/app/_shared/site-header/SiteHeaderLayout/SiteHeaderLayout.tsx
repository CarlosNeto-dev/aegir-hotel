import type { SectionId } from "../header-utils/header-items";
import SiteHeaderDesktop from "../SiteHeaderDesktop/SiteHeaderDesktop";
import SiteHeaderMobile from "../SiteHeaderMobile/SiteHeaderMobile";
import SiteHeaderTV from "../SiteHeaderTV/SiteHeaderTV";
import styles from "./SiteHeaderLayout.module.scss";

type SiteHeaderLayoutProps = { activeId?: SectionId };

export function SiteHeaderLayout({ activeId }: SiteHeaderLayoutProps) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <SiteHeaderDesktop />
        <SiteHeaderTV />
        <SiteHeaderMobile activeId={activeId} />
      </header>
    </div>
  );
}

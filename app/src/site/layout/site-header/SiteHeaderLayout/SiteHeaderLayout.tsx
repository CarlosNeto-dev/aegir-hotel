import SiteHeaderDesktop from "../SiteHeaderDesktop/SiteHeaderDesktop";
import SiteHeaderMobile from "../SiteHeaderMobile/SiteHeaderMobile";
import SiteHeaderTV from "../SiteHeaderTV/SiteHeaderTV";

import styles from "./SiteHeaderLayout.module.scss";

export default function SiteHeaderLayout() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <SiteHeaderTV />
        <SiteHeaderDesktop />
        <SiteHeaderMobile />
      </header>
    </div>
  );
}

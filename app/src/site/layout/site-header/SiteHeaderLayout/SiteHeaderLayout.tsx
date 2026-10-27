import SiteHeaderDesktop from "../SiteHeaderDesktop/SiteHeaderDesktop";
import SiteHeaderMobile from "../SiteHeaderMobile/SiteHeaderMobile";

import styles from "./SiteHeaderLayout.module.scss";

export default function SiteHeaderLayout() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <SiteHeaderDesktop />
        <SiteHeaderMobile />
      </header>
    </div>
  );
}

import HeaderBrand from "../header-utils/HeaderBrand/HeaderBrand";
import HeaderCta from "../header-utils/HeaderCta/HeaderCta";
import HeaderIcons from "../header-utils/HeaderIcons/HeaderIcons";
import HeaderNavList from "../header-utils/HeaderNavList/HeaderNavList";
import styles from "./SiteHeaderDesktop.module.scss";

export default function SiteHeaderDesktop() {
  return (
    <div className={styles.root}>
      <div className={styles.brand}>
        <HeaderBrand />
      </div>

      <div className={styles.nav}>
        <nav aria-label="Seções da página">
          <HeaderNavList variant="bar" />
        </nav>
      </div>

      <div className={styles.actions}>
        <HeaderIcons />
        <HeaderCta />
      </div>
    </div>
  );
}
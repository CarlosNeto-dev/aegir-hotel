import HeaderBrand from "../header-utils/HeaderBrand/HeaderBrand";
import HeaderCta from "../header-utils/HeaderCta/HeaderCta";
import HeaderIcons, {
  IconMenu,
  IconSettings,
} from "../header-utils/HeaderIcons/HeaderIcons";
import HeaderNavList from "../header-utils/HeaderNavList/HeaderNavList";
import { ACTIONS } from "../header-utils/header-items";
import styles from "./SiteHeaderMobile.module.scss";

export default function SiteHeaderMobile() {
  return (
    <div className={styles.root}>
      <div className={styles.brand}>
        <HeaderBrand />
      </div>

      <div className={styles.actions}>
        <HeaderIcons showSettings={false} />
        <button
          type="button"
          className={styles.menuButton}
          aria-label="Abrir menu"
          aria-expanded={false}
        >
          <IconMenu />
        </button>
      </div>

      <nav className={styles.drawer} aria-label="Seções da página" hidden>
        <HeaderNavList variant="drawer" />
        <div className={styles.drawerActions}>
          <button type="button" className={styles.settings}>
            <IconSettings />
            {ACTIONS.settings.label}
          </button>
          <HeaderCta block />
        </div>
      </nav>
    </div>
  );
}

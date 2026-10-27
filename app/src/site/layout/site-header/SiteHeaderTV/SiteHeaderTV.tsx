import HeaderBrand from "../header-utils/HeaderBrand/HeaderBrand";
import HeaderCta from "../header-utils/HeaderCta/HeaderCta";
import HeaderNavList from "../header-utils/HeaderNavList/HeaderNavList";
import { ACTIONS, NAV_LEFT, NAV_RIGHT } from "../header-utils/header-items";
import styles from "./SiteHeaderTV.module.scss";

export default function SiteHeaderTV() {
  return (
    <div className={styles.root}>
      <div className={styles.account}>
        <button type="button" className={styles.accountButton}>
          {ACTIONS.account.label}
        </button>
      </div>
      <div className={styles.face}>
        <div className={styles.navLeft}>
          <nav aria-label="Seções da página, início">
            <HeaderNavList variant="bar" items={NAV_LEFT} />
          </nav>
        </div>
        <div className={styles.brand}>
          <HeaderBrand />
        </div>
        <div className={styles.navRight}>
          <nav aria-label="Seções da página, fim">
            <HeaderNavList variant="bar" items={NAV_RIGHT} />
          </nav>
        </div>
      </div>
      <div className={styles.crown}>
        <HeaderCta />
      </div>
    </div>
  );
}

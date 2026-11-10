import { BRAND } from "../header-items";
import SectionLink from "../SectionLink/SectionLink";
import styles from "./HeaderBrand.module.scss";

export default function HeaderBrand() {
  return (
    <div className={styles.root}>
      <SectionLink
        href={BRAND.href}
        className={styles.link}
        aria-label={BRAND.label}
      >
        {BRAND.label}
      </SectionLink>
    </div>
  );
}

import { CTA } from "../header-items";
import SectionLink from "../SectionLink/SectionLink";
import styles from "./HeaderCta.module.scss";

export default function HeaderCta() {
  return (
    <div className={styles.root}>
      <SectionLink href={CTA.href} className={styles.link}>
        {CTA.label}
      </SectionLink>
    </div>
  );
}

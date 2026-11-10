import { CTA } from "../header-items";
import SectionLink from "../SectionLink/SectionLink";
import styles from "./HeaderCta.module.scss";

type HeaderCtaProps = {
  block?: boolean;
  onNavigate?: () => void;
};

export default function HeaderCta({
  block = false,
  onNavigate,
}: HeaderCtaProps) {
  return (
    <div className={`${styles.root} ${block ? styles.block : ""}`}>
      <SectionLink
        href={CTA.href}
        className={styles.link}
        onNavigate={onNavigate}
      >
        {CTA.label}
      </SectionLink>
    </div>
  );
}

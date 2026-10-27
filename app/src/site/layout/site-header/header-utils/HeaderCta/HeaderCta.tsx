import Link from "next/link";
import { CTA } from "../header-items";
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
      <Link href={CTA.href} className={styles.link} onClick={onNavigate}>
        {CTA.label}
      </Link>
    </div>
  );
}

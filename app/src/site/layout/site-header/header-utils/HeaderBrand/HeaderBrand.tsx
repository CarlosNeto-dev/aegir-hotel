import Link from "next/link";
import { BRAND } from "../header-items";
import styles from "./HeaderBrand.module.scss";

export default function HeaderBrand() {
  return (
    <div className={styles.root}>
      <Link
        href={BRAND.href}
        className={styles.link}
        aria-label={BRAND.ariaLabel}
      >
        {BRAND.label}
      </Link>
    </div>
  );
}

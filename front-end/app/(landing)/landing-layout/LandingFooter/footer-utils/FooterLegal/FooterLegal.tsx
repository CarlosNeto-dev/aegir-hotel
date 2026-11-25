import { ADDRESS } from "@/app/_shared/lib/data/hotel-info";
import styles from "./FooterLegal.module.scss";

export default function FooterLegal() {
  return (
    <div className={styles.root}>
      <span>© 2026 Aegir Hotel</span>
      <span>
        {ADDRESS.street} · {ADDRESS.region}
      </span>
    </div>
  );
}

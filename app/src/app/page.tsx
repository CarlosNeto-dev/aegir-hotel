import SiteMainLayout from "@/site/layout/site-main/SiteMainLayout/SiteMainLayout";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.root}>
      <SiteMainLayout />
    </div>
  );
}

import LandingMain from "@/app/(landing)/landing-layout/LandingMain/LandingMain";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.root}>
      <LandingMain />
    </div>
  );
}

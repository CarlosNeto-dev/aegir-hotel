import LandingMain from "@/app/(landing)/landing-layout/LandingMain/LandingMain";
import ProgressBar from "@/app/(landing)/landing-layout/overlays/ProgressBar/ProgressBar";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.root}>
      <ProgressBar />
      <LandingMain />
    </div>
  );
}

import LandingMain from "@/app/(landing)/landing-layout/LandingMain/LandingMain";
import ProgressBar from "@/app/(landing)/landing-layout/overlays/ProgressBar/ProgressBar";
import ScrollCue from "@/app/(landing)/landing-layout/overlays/ScrollCue/ScrollCue";
import SiteLoader from "@/app/_shared/overlays/SiteLoader/SiteLoader";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.root}>
      <SiteLoader />
      <ProgressBar />
      <LandingMain />
      <ScrollCue />
    </div>
  );
}

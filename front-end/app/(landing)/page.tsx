import LandingFooter from "@/app/(landing)/landing-layout/LandingFooter/LandingFooter";
import LandingMain from "@/app/(landing)/landing-layout/LandingMain/LandingMain";
import ProgressBar from "@/app/(landing)/landing-layout/overlays/ProgressBar/ProgressBar";
import ScrollCue from "@/app/(landing)/landing-layout/overlays/ScrollCue/ScrollCue";
import LandingScreen from "@/app/(landing)/landing-tv/LandingScreen/LandingScreen";
import TvLanding from "@/app/(landing)/landing-tv/TvLanding/TvLanding";
import SiteLoader from "@/app/_shared/overlays/SiteLoader/SiteLoader";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.root}>
      <SiteLoader />
      <LandingScreen tv={<TvLanding />}>
        <ProgressBar />
        <LandingMain />
        <LandingFooter />
        <ScrollCue />
      </LandingScreen>
    </div>
  );
}

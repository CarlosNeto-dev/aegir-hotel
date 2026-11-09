import LandingMain from "@/app/(landing)/landing-layout/LandingMain/LandingMain";
import SettingsButton from "@/app/_shared/panels/settings-panel/SettingsButton/SettingsButton";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.root}>
      <LandingMain />
      <SettingsButton />
    </div>
  );
}

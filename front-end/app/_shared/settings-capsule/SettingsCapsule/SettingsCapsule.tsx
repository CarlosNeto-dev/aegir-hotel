"use client";

import { usePanels } from "../../panels/PanelProvider/PanelProvider";
import SettingsButton from "../SettingsButton/SettingsButton";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import styles from "./SettingsCapsule.module.scss";

export default function SettingsCapsule() {
  const { layer } = usePanels();

  return (
    <div className={styles.root} data-layer={layer ?? undefined}>
      <ThemeToggle />
      <span className={styles.divider} aria-hidden="true" />
      <SettingsButton />
    </div>
  );
}

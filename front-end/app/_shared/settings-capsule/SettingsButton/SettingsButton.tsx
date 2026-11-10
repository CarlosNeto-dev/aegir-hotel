"use client";

import { usePanels } from "../../panels/PanelProvider/PanelProvider";
import { ACTIONS } from "../../site-header/header-utils/header-items";
import { IconSettings } from "../../site-header/header-utils/HeaderIcons/HeaderIcons";
import styles from "./SettingsButton.module.scss";

export default function SettingsButton() {
  const { layer, toggle } = usePanels();

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        aria-expanded={layer === "settings"}
        aria-controls={ACTIONS.settings.controls}
        onClick={() => toggle("settings")}
      >
        <IconSettings />
        <span className={styles.text}>{ACTIONS.settings.label}</span>
      </button>
    </div>
  );
}

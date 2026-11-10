"use client";

import SegmentedChoice from "../../settings-controls/SegmentedChoice/SegmentedChoice";
import { useSettings } from "../../SettingsProvider/SettingsProvider";
import { SPEED_OPTIONS } from "../../settings-utils/settings-options";
import styles from "./SpeedSection.module.scss";

export default function SpeedSection() {
  const { settings, update } = useSettings();

  return (
    <div className={styles.root}>
      <SegmentedChoice
        name="speed"
        legend="Ritmo da página"
        options={SPEED_OPTIONS}
        value={settings.speed}
        onChange={(id) => update("speed", id)}
      />
    </div>
  );
}

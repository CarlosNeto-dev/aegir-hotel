"use client";

import PresetPicker from "../../settings-controls/PresetPicker/PresetPicker";
import { useSettings } from "../../SettingsProvider/SettingsProvider";
import styles from "./PresetsSection.module.scss";

export default function PresetsSection() {
  const { preset, applyPreset } = useSettings();

  return (
    <div className={styles.root}>
      <PresetPicker value={preset} onChange={applyPreset} />
    </div>
  );
}

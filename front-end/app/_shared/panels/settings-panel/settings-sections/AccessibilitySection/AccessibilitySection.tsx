"use client";

import SettingSwitch from "../../settings-controls/SettingSwitch/SettingSwitch";
import TextSizePicker from "../../settings-controls/TextSizePicker/TextSizePicker";
import { useSettings } from "../../SettingsProvider/SettingsProvider";
import { ACCESSIBILITY_SWITCHES } from "../../settings-utils/settings-options";
import styles from "./AccessibilitySection.module.scss";

export default function AccessibilitySection() {
  const { settings, update } = useSettings();

  return (
    <div className={styles.root}>
      <TextSizePicker
        value={settings.textSize}
        onChange={(id) => update("textSize", id)}
      />

      <div className={styles.switches}>
        {ACCESSIBILITY_SWITCHES.map((item) => (
          <SettingSwitch
            key={item.id}
            label={item.label}
            summary={item.summary}
            checked={settings[item.id]}
            onChange={(checked) => update(item.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import DemoVideo from "../../settings-controls/DemoVideo/DemoVideo";
import SettingSwitch from "../../settings-controls/SettingSwitch/SettingSwitch";
import { useSettings } from "../../SettingsProvider/SettingsProvider";
import { demoVideo } from "../../settings-utils/settings-options";
import styles from "./LettersSection.module.scss";

export default function LettersSection({ showVideos }: { showVideos: boolean }) {
  const { settings, update } = useSettings();

  return (
    <div className={styles.root}>
      <div className={styles.preview}>
        {showVideos && <DemoVideo src={demoVideo("letters", "vanish")} />}
      </div>

      <SettingSwitch
        label="Sumiço das letras"
        summary="Desligado, o texto inteiro aparece e some de uma vez."
        checked={settings.letters}
        onChange={(checked) => update("letters", checked)}
      />
    </div>
  );
}

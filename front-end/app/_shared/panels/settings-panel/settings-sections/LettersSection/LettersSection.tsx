"use client";

import DemoVideo from "../../settings-controls/DemoVideo/DemoVideo";
import FontPicker from "../../settings-controls/FontPicker/FontPicker";
import SettingSwitch from "../../settings-controls/SettingSwitch/SettingSwitch";
import { useSettings } from "../../SettingsProvider/SettingsProvider";
import { demoVideo } from "../../settings-utils/settings-options";
import styles from "./LettersSection.module.scss";

export default function LettersSection({ showVideos, tv = false }: { showVideos: boolean; tv?: boolean }) {
  const { settings, update } = useSettings();

  // Na TV não existe o efeito das letras: fica só a escolha da fonte.
  if (tv) {
    return (
      <div className={styles.root}>
        <FontPicker value={settings.font} onChange={(id) => update("font", id)} />
      </div>
    );
  }

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

      <div className={styles.font}>
        <FontPicker value={settings.font} onChange={(id) => update("font", id)} />
      </div>
    </div>
  );
}

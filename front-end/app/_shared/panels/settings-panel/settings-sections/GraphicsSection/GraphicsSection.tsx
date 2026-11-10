"use client";

import SettingSwitch from "../../settings-controls/SettingSwitch/SettingSwitch";
import { useSettings } from "../../SettingsProvider/SettingsProvider";
import { GRAPHICS_SWITCHES } from "../../settings-utils/settings-options";
import type { PointerKind } from "../../settings-utils/settings-routes";
import styles from "./GraphicsSection.module.scss";

const MOUSE_ONLY = new Set<string>(["smoothScroll"]);

export default function GraphicsSection({ pointer }: { pointer: PointerKind }) {
  const { settings, update } = useSettings();
  const items = GRAPHICS_SWITCHES.filter(
    (item) => pointer === "mouse" || !MOUSE_ONLY.has(item.id),
  );

  return (
    <div className={styles.root}>
      {items.map((item) => (
        <SettingSwitch
          key={item.id}
          label={item.label}
          summary={item.summary}
          checked={settings[item.id]}
          onChange={(checked) => update(item.id, checked)}
        />
      ))}
    </div>
  );
}

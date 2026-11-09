"use client";

import ColorPicker from "../../settings-controls/ColorPicker/ColorPicker";
import ShapePicker from "../../settings-controls/ShapePicker/ShapePicker";
import { useSettings } from "../../SettingsProvider/SettingsProvider";
import {
  CURSOR_OPTIONS,
  FOCUS_OPTIONS,
  TOUCH_OPTIONS,
} from "../../settings-utils/settings-options";
import type { PointerKind } from "../../settings-utils/settings-routes";
import styles from "./PointerSection.module.scss";

type PointerSectionProps = {
  pointer: PointerKind;
  showVideos: boolean;
};

export default function PointerSection({
  pointer,
  showVideos,
}: PointerSectionProps) {
  const { settings, update } = useSettings();

  if (pointer === "touch") {
    return (
      <div className={styles.root}>
        <ShapePicker
          name="touch"
          legend="Efeito"
          group="touch"
          options={TOUCH_OPTIONS}
          value={settings.touch}
          onChange={(id) => update("touch", id)}
          showVideos={showVideos}
        />
        {settings.touch !== "none" && (
          <ColorPicker
            name="touch-color"
            value={settings.touchColor}
            onChange={(id) => update("touchColor", id)}
          />
        )}
      </div>
    );
  }

  if (pointer === "remote") {
    return (
      <div className={styles.root}>
        <ShapePicker
          name="focus"
          legend="Estilo"
          group="focus"
          options={FOCUS_OPTIONS}
          value={settings.focus}
          onChange={(id) => update("focus", id)}
          showVideos={showVideos}
        />
        <ColorPicker
          name="focus-color"
          value={settings.focusColor}
          onChange={(id) => update("focusColor", id)}
        />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <ShapePicker
        name="cursor"
        legend="Formato"
        group="cursor"
        options={CURSOR_OPTIONS}
        value={settings.cursor}
        onChange={(id) => update("cursor", id)}
        showVideos={showVideos}
      />
      {settings.cursor !== "system" && (
        <ColorPicker
          name="cursor-color"
          value={settings.cursorColor}
          onChange={(id) => update("cursorColor", id)}
        />
      )}
    </div>
  );
}

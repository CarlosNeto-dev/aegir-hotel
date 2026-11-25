"use client";

import PhotoShapePreview from "../../settings-controls/PhotoShapePreview/PhotoShapePreview";
import SettingSwitch from "../../settings-controls/SettingSwitch/SettingSwitch";
import ShapePicker from "../../settings-controls/ShapePicker/ShapePicker";
import { useSettings } from "../../SettingsProvider/SettingsProvider";
import {
  FOOTER_OPTIONS,
  GRAPHICS_SWITCHES,
  PHOTO_SHAPE_OPTIONS,
} from "../../settings-utils/settings-options";
import type { PointerKind } from "../../settings-utils/settings-routes";
import styles from "./GraphicsSection.module.scss";

const MOUSE_ONLY = new Set<string>(["smoothScroll"]);

export default function GraphicsSection({
  pointer,
  showVideos,
  tv = false,
}: {
  pointer: PointerKind;
  showVideos: boolean;
  tv?: boolean;
}) {
  const { settings, update } = useSettings();
  // Na TV não há barra de progresso, rolagem nem rodapé: fica o formato das fotos.
  const items = tv
    ? []
    : GRAPHICS_SWITCHES.filter((item) => pointer === "mouse" || !MOUSE_ONLY.has(item.id));

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

      <div className={styles.group}>
        <ShapePicker
          name="photoShape"
          legend="Formato das fotos"
          options={PHOTO_SHAPE_OPTIONS}
          value={settings.photoShape}
          onChange={(id) => update("photoShape", id)}
          showVideos={showVideos}
          preview={(id) => <PhotoShapePreview shape={id} />}
        />
      </div>

      {!tv && (
        <div className={styles.group}>
          <ShapePicker
            name="footer"
            legend="Rodapé"
            group="footer"
            options={FOOTER_OPTIONS}
            value={settings.footer}
            onChange={(id) => update("footer", id)}
            showVideos={showVideos}
          />
        </div>
      )}
    </div>
  );
}

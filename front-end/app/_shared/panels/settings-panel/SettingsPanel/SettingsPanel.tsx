"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { usePanels } from "../../PanelProvider/PanelProvider";
import SidePanel from "../../SidePanel/SidePanel";
import { ACTIONS } from "../../../site-header/header-utils/header-items";
import AccessibilitySection from "../settings-sections/AccessibilitySection/AccessibilitySection";
import GraphicsSection from "../settings-sections/GraphicsSection/GraphicsSection";
import LettersSection from "../settings-sections/LettersSection/LettersSection";
import PointerSection from "../settings-sections/PointerSection/PointerSection";
import PresetsSection from "../settings-sections/PresetsSection/PresetsSection";
import SpeedSection from "../settings-sections/SpeedSection/SpeedSection";
import {
  getRouteSettings,
  getSectionText,
} from "../settings-utils/settings-routes";
import { usePointerKind } from "../settings-utils/usePointerKind";
import styles from "./SettingsPanel.module.scss";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function SettingsPanel() {
  const baseId = useId();
  const { layer } = usePanels();
  const pathname = usePathname();
  const route = getRouteSettings(pathname);
  const pointer = usePointerKind();
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (layer === "settings") setHasOpened(true);
  }, [layer]);

  return (
    <SidePanel
      layer="settings"
      id={ACTIONS.settings.controls}
      eyebrow={route.label}
      title={ACTIONS.settings.label}
      foot={<p>As escolhas ficam salvas neste navegador.</p>}
    >
      <div className={styles.root}>
        {route.sections.map((id, index) => {
          const text = getSectionText(id, pointer);
          const headingId = `${baseId}-${id}`;

          return (
            <section
              key={id}
              className={styles.section}
              aria-labelledby={headingId}
            >
              <span className={styles.number}>{pad(index + 1)}</span>
              <div className={styles.text}>
                <h3 id={headingId}>{text.label}</h3>
                <p>{text.summary}</p>
              </div>
              <div className={styles.content}>
                {id === "presets" && <PresetsSection />}
                {id === "pointer" && (
                  <PointerSection pointer={pointer} showVideos={hasOpened} />
                )}
                {id === "letters" && <LettersSection showVideos={hasOpened} />}
                {id === "graphics" && <GraphicsSection pointer={pointer} />}
                {id === "speed" && <SpeedSection />}
                {id === "accessibility" && <AccessibilitySection />}
              </div>
            </section>
          );
        })}
      </div>
    </SidePanel>
  );
}

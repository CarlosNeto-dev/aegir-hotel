"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { usePanels } from "../../PanelProvider/PanelProvider";
import { ACTIONS } from "../../../site-header/header-utils/header-items";
import { IconClose } from "../../../site-header/header-utils/HeaderIcons/HeaderIcons";
import AccessibilitySection from "../settings-sections/AccessibilitySection/AccessibilitySection";
import PointerSection from "../settings-sections/PointerSection/PointerSection";
import {
  getRouteSettings,
  getSectionText,
} from "../settings-utils/settings-routes";
import { usePointerKind } from "../settings-utils/usePointerKind";
import styles from "./SettingsPanel.module.scss";

const TV_QUERY = "(min-width: 2560px)";
const BACK_KEYS = ["Escape", "GoBack", "BrowserBack"];
const BACK_CODES = [461, 10009];
const ARROW_LIMIT = 3;
const ARROW_WINDOW_MS = 900;
const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.matches("input, select, textarea") ||
      target.getAttribute("role") === "slider")
  );
}

export default function SettingsPanel() {
  const titleId = useId();
  const { layer, close } = usePanels();
  const isOpen = layer === "settings";
  const pathname = usePathname();
  const route = getRouteSettings(pathname);
  const pointer = usePointerKind();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const arrows = useRef({ count: 0, last: 0 });
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      requestAnimationFrame(() => previous?.focus());
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const tv = window.matchMedia(TV_QUERY);
    arrows.current = { count: 0, last: 0 };

    function trapFocus(event: KeyboardEvent) {
      const items = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function countArrows(event: KeyboardEvent) {
      if (event.key !== "ArrowRight" || isTyping(event.target)) {
        arrows.current.count = 0;
        return;
      }
      const recent = event.timeStamp - arrows.current.last < ARROW_WINDOW_MS;
      arrows.current.count = recent ? arrows.current.count + 1 : 1;
      arrows.current.last = event.timeStamp;
      if (arrows.current.count >= ARROW_LIMIT) close();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (BACK_KEYS.includes(event.key) || BACK_CODES.includes(event.keyCode)) {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab") trapFocus(event);
      if (tv.matches) countArrows(event);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <div className={styles.root} data-open={isOpen ? "" : undefined}>
      <div className={styles.backdrop} aria-hidden="true" onClick={close} />

      <aside
        ref={panelRef}
        id={ACTIONS.settings.controls}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.head}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>{route.label}</span>
            <h2 id={titleId} className={styles.title}>
              {ACTIONS.settings.label}
            </h2>
          </div>

          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={close}
          >
            <IconClose />
            <span>Fechar</span>
          </button>
        </div>

        <div className={styles.body}>
          {route.sections.map((id, index) => {
            const text = getSectionText(id, pointer);
            const headingId = `${titleId}-${id}`;

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
                  {id === "pointer" && (
                    <PointerSection pointer={pointer} showVideos={hasOpened} />
                  )}
                  {id === "accessibility" && <AccessibilitySection />}
                  {id !== "pointer" && id !== "accessibility" && (
                    <div className={styles.slot}>Em construção</div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <div className={styles.foot}>
          <p>As escolhas ficam salvas neste navegador.</p>
        </div>
      </aside>
    </div>
  );
}

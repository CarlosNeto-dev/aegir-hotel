"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { usePanels, type Layer } from "../PanelProvider/PanelProvider";
import { IconClose } from "../../site-header/header-utils/HeaderIcons/HeaderIcons";
import styles from "./SidePanel.module.scss";

const TV_QUERY = "(min-width: 2560px)";
const BACK_KEYS = ["Escape", "GoBack", "BrowserBack"];
const BACK_CODES = [461, 10009];
const ARROW_LIMIT = 3;
const ARROW_WINDOW_MS = 900;
const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SidePanelProps = {
  layer: Layer;
  id: string;
  eyebrow: string;
  title: string;
  foot?: ReactNode;
  children: ReactNode;
};

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.matches("input, select, textarea") ||
      target.getAttribute("role") === "slider")
  );
}

export default function SidePanel({
  layer,
  id,
  eyebrow,
  title,
  foot,
  children,
}: SidePanelProps) {
  const titleId = useId();
  const { layer: openLayer, close } = usePanels();
  const isOpen = openLayer === layer;
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const arrows = useRef({ count: 0, last: 0 });

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

    const trapFocus = (event: KeyboardEvent) => {
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
    };

    const countArrows = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" || isTyping(event.target)) {
        arrows.current.count = 0;
        return;
      }
      const recent = event.timeStamp - arrows.current.last < ARROW_WINDOW_MS;
      arrows.current.count = recent ? arrows.current.count + 1 : 1;
      arrows.current.last = event.timeStamp;
      if (arrows.current.count >= ARROW_LIMIT) close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (BACK_KEYS.includes(event.key) || BACK_CODES.includes(event.keyCode)) {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab") trapFocus(event);
      if (tv.matches) countArrows(event);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <div className={styles.root} data-open={isOpen ? "" : undefined}>
      <div className={styles.backdrop} aria-hidden="true" onClick={close} />

      <aside
        ref={panelRef}
        id={id}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.head}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 id={titleId} className={styles.title}>
              {title}
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

        <div className={styles.body}>{children}</div>

        {foot && <div className={styles.foot}>{foot}</div>}
      </aside>
    </div>
  );
}

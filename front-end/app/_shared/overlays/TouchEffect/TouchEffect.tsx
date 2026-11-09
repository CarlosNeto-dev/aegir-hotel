"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "../../panels/settings-panel/SettingsProvider/SettingsProvider";
import styles from "./TouchEffect.module.scss";

const LIFETIME_MS = 900;

export default function TouchEffect() {
  const { settings } = useSettings();
  const shape = settings.touch;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (shape === "none" || !root) return;

    const handleDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      const mark = document.createElement("span");
      mark.className = styles.mark;
      mark.style.left = `${event.clientX}px`;
      mark.style.top = `${event.clientY}px`;
      root.appendChild(mark);
      window.setTimeout(() => mark.remove(), LIFETIME_MS);
    };

    window.addEventListener("pointerdown", handleDown, { passive: true });
    return () => window.removeEventListener("pointerdown", handleDown);
  }, [shape]);

  if (shape === "none") return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-shape={shape}
      aria-hidden="true"
    />
  );
}

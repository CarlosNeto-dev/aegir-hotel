"use client";

import { useEffect, useRef, useState } from "react";
import { usePointerKind } from "@/app/_shared/lib/pointer-kind";
import { scrollToY } from "@/app/_shared/lib/section-nav";
import { LOADER_DONE } from "@/app/_shared/overlays/SiteLoader/site-loader-script";
import { usePanels } from "@/app/_shared/panels/PanelProvider/PanelProvider";
import styles from "./ScrollCue.module.scss";

const IDLE_MS = 4000;
const END_GAP = 8;
const WAKE_EVENTS = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"] as const;

function atPageEnd() {
  const page = document.documentElement;
  return window.scrollY + window.innerHeight >= page.scrollHeight - END_GAP;
}

function loaderFinished() {
  return (
    document.documentElement.dataset.siteLoader === LOADER_DONE ||
    !document.querySelector("[data-loader-screen]")
  );
}

/*
 * O botão "Role para baixo" da landing inteira. Aparece em duas ocasiões:
 * logo que a tela de carregamento sai e quando a pessoa fica 4 segundos sem
 * mexer. Qualquer atividade esconde e reinicia o relógio.
 */
export default function ScrollCue() {
  const { layer } = usePanels();
  const kind = usePointerKind();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const shown = visible && !layer;

  useEffect(() => {
    let timer = 0;
    let started = false;

    const show = () => {
      if (!atPageEnd()) setVisible(true);
    };

    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(show, IDLE_MS);
    };

    const wake = (event: Event) => {
      // Apertar o próprio botão não conta como "a pessoa mexeu".
      if (buttonRef.current?.contains(event.target as Node)) return;
      setVisible(false);
      arm();
    };

    const start = () => {
      if (started) return;
      started = true;
      show();
      arm();
      WAKE_EVENTS.forEach((name) => window.addEventListener(name, wake, { passive: true }));
      window.addEventListener("pointermove", arm, { passive: true });
    };

    const watcher = new MutationObserver(() => {
      if (!loaderFinished()) return;
      watcher.disconnect();
      start();
    });

    if (loaderFinished()) start();
    else watcher.observe(document.documentElement, { attributes: true, attributeFilter: ["data-site-loader"] });

    return () => {
      watcher.disconnect();
      window.clearTimeout(timer);
      WAKE_EVENTS.forEach((name) => window.removeEventListener(name, wake));
      window.removeEventListener("pointermove", arm);
    };
  }, []);

  const go = () => {
    setVisible(false);
    scrollToY(window.scrollY + window.innerHeight * 0.85);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={styles.root}
      data-shown={shown ? "" : undefined}
      data-kind={kind}
      inert={!shown}
      onClick={go}
      aria-label="Role para baixo"
    >
      {/* Celular e tablet (toque): uma linha fina com um brilho escorrendo. */}
      <span className={styles.touch} aria-hidden="true">
        <span className={styles.label}>Role</span>
        <span className={styles.line} />
      </span>

      {/* Computador (mouse): o mouse com a rodinha descendo. */}
      <span className={styles.mouse} aria-hidden="true">
        <span className={styles.mouseBody} />
        <span className={styles.label}>Role para baixo</span>
      </span>

      {/* TV (controle remoto): o controle apertando a seta de baixo. */}
      <span className={styles.remote} aria-hidden="true">
        <svg className={styles.remoteIcon} viewBox="0 0 24 68" fill="none" stroke="currentColor">
          <rect x="1" y="1" width="22" height="66" rx="2.6" strokeWidth="1.3" />
          <g strokeWidth="0.8">
            <rect x="15" y="4" width="5" height="4" rx="0.6" />
            <path d="M17.5 5v1.1M16.5 5.6a1.3 1.3 0 1 0 2 0" strokeLinecap="round" />
            <circle cx="6" cy="12" r="1.35" />
            <circle cx="12" cy="12" r="1.35" />
            <circle cx="18" cy="12" r="1.35" />
            <circle cx="6" cy="16" r="1.35" />
            <circle cx="12" cy="16" r="1.35" />
            <circle cx="18" cy="16" r="1.35" />
            <circle cx="6" cy="20" r="1.35" />
            <circle cx="12" cy="20" r="1.35" />
            <circle cx="18" cy="20" r="1.35" />
            <circle cx="6" cy="24" r="1.35" />
            <circle cx="12" cy="24" r="1.35" />
            <circle cx="18" cy="24" r="1.35" />
            <circle cx="12" cy="33" r="6.4" />
            <circle cx="12" cy="33" r="2.5" />
            <path d="M13.8 31.2l2.9-2.9M10.2 31.2l-2.9-2.9M10.2 34.8l-2.9 2.9M13.8 34.8l2.9 2.9" />
            <path
              d="m11 29.1 1-0.9 1 0.9M7.9 32l-0.9 1 0.9 1M16.1 32l0.9 1-0.9 1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="4" y="42" width="3" height="6.4" rx="1.5" />
            <rect x="17" y="42" width="3" height="6.4" rx="1.5" />
            <circle cx="12" cy="43.4" r="1.2" />
            <circle cx="12" cy="47.2" r="1.2" />
            <rect x="4.2" y="53" width="2.6" height="1.6" rx="0.4" />
            <rect x="8.6" y="53" width="2.6" height="1.6" rx="0.4" />
            <rect x="13" y="53" width="2.6" height="1.6" rx="0.4" />
            <rect x="17.4" y="53" width="2.6" height="1.6" rx="0.4" />
            <rect x="4.2" y="56.5" width="2.6" height="1.6" rx="0.4" />
            <rect x="8.6" y="56.5" width="2.6" height="1.6" rx="0.4" />
            <rect x="13" y="56.5" width="2.6" height="1.6" rx="0.4" />
            <rect x="17.4" y="56.5" width="2.6" height="1.6" rx="0.4" />
            <rect x="4.2" y="60" width="2.6" height="1.6" rx="0.4" />
            <rect x="8.6" y="60" width="2.6" height="1.6" rx="0.4" />
            <rect x="13" y="60" width="2.6" height="1.6" rx="0.4" />
            <rect x="17.4" y="60" width="2.6" height="1.6" rx="0.4" />
          </g>
          <g className={styles.press}>
            <path
              className={styles.pressFill}
              d="M16.24 37.24A6 6 0 0 1 7.76 37.24L10.09 34.91A2.7 2.7 0 0 0 13.91 34.91Z"
              fill="currentColor"
              stroke="none"
            />
            <path d="m11 36.9 1 0.9 1-0.9" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <span className={styles.label}>Role para baixo</span>
      </span>
    </button>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { usePanels } from "@/app/_shared/panels/PanelProvider/PanelProvider";
import TvArc from "../TvArc/TvArc";
import TvSection from "../TvSection/TvSection";
import { TV_CHAPTERS } from "../tv-chapters";
import styles from "./TvLanding.module.scss";

// O "Voltar" do controle chega de jeitos diferentes: Escape/Backspace no
// navegador, 10009 nas TVs Samsung e 461 nas LG.
const BACK_KEYS = new Set(["Escape", "Backspace", "BrowserBack", "GoBack"]);
const BACK_CODES = new Set([10009, 461]);

// chapter = null: o coverflow das seções. chapter = n: a página da seção n.
// bar = true: o foco subiu para a cápsula Tema/Ajustes (canto de baixo).
type View = { chapter: number | null; index: number; item: number; bar: boolean };

const CAPSULE_BUTTONS = "[data-settings-capsule] button";

function capsuleButtons() {
  return Array.from(document.querySelectorAll<HTMLButtonElement>(CAPSULE_BUTTONS));
}

/*
 * A landing na TV.
 * - Início: as seis seções num arco curvo. ◀ ▶ escolhe, OK (ou ▼) abre.
 * - Seção: a página do lugar escolhido, com as informações da seção comum.
 *   ◀ ▶ troca o lugar, Voltar (ou ▲) volta para o arco.
 */
export default function TvLanding() {
  const { layer } = usePanels();
  const [view, setView] = useState<View>({ chapter: null, index: 0, item: 0, bar: false });

  const chapter = view.chapter === null ? null : TV_CHAPTERS[view.chapter];
  const current = TV_CHAPTERS[view.index];

  const move = useCallback(
    (step: number) =>
      setView((now) => {
        if (now.chapter === null) {
          return { ...now, index: Math.min(TV_CHAPTERS.length - 1, Math.max(0, now.index + step)) };
        }
        const size = TV_CHAPTERS[now.chapter].items.length;
        return { ...now, item: Math.min(size - 1, Math.max(0, now.item + step)) };
      }),
    [],
  );

  const open = useCallback(
    () => setView((now) => (now.chapter === null ? { ...now, chapter: now.index, item: 0 } : now)),
    [],
  );

  const close = useCallback(() => setView((now) => ({ ...now, chapter: null })), []);

  // Fase de captura + preventDefault: a rolagem pelo teclado não reage.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (layer || event.altKey || event.ctrlKey || event.metaKey) return;
      const back = BACK_KEYS.has(event.key) || BACK_CODES.has(event.keyCode);
      let handled = true;

      if (view.bar) {
        // Na cápsula: ◀ ▶ troca o botão, OK usa (o clique normal do botão),
        // ▼ ou Voltar desce de novo para o arco.
        const buttons = capsuleButtons();
        const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (event.key === "ArrowRight") buttons[Math.min(buttons.length - 1, at + 1)]?.focus();
        else if (event.key === "ArrowLeft") buttons[Math.max(0, at - 1)]?.focus();
        else if (event.key === "ArrowDown" || back) setView((now) => ({ ...now, bar: false }));
        else handled = false;
      } else if (event.key === "ArrowRight") move(1);
      else if (event.key === "ArrowLeft") move(-1);
      else if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") open();
      else if (event.key === "ArrowUp" && view.chapter === null) {
        setView((now) => ({ ...now, bar: true }));
        capsuleButtons()[0]?.focus();
      } else if (back || event.key === "ArrowUp") {
        // No início, o Voltar fica livre para a TV sair do navegador.
        if (view.chapter === null) handled = false;
        else close();
      } else handled = false;

      if (handled) event.preventDefault();
    };

    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [layer, view.chapter, view.bar, move, open, close]);

  const chooseChapter = (index: number) => {
    if (index === view.index) open();
    else setView((now) => ({ ...now, index }));
  };

  return (
    <div className={styles.root} data-inside={chapter ? "" : undefined} data-bar={view.bar ? "" : undefined}>
      <div className={styles.frame}>
        <p className={styles.brand}>Aegir</p>

        {chapter ? (
          <TvSection
            chapter={chapter}
            number={(view.chapter ?? 0) + 1}
            index={view.item}
            onChoose={(item) => setView((now) => ({ ...now, item }))}
          />
        ) : (
          <section className={styles.home} aria-label="Aegir">
            <div className={styles.copy} aria-live="polite">
              <p className={styles.kicker}>{current.kicker}</p>
              <h1 className={styles.title}>
                {current.title} <em>{current.accent}</em>
              </h1>
              <p className={styles.text}>{current.text}</p>
            </div>

            <TvArc
              items={TV_CHAPTERS}
              index={view.index}
              onChoose={chooseChapter}
              active={!view.bar}
              labelFor={(item) => `${item.label}: abrir a seção`}
            />
          </section>
        )}

        <p className={styles.hint} aria-hidden="true">
          {chapter ? (
            <>
              <span>◀ ▶ lugares</span>
              <span>Voltar · início</span>
            </>
          ) : (
            <>
              <span>◀ ▶ escolher</span>
              <span>OK abrir</span>
              <span>▲ Tema e Ajustes</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

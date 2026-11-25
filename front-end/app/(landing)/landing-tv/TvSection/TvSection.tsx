"use client";

import { photoSrc } from "@/app/_shared/lib/data/places";
import TvArc from "../TvArc/TvArc";
import type { TvChapter } from "../tv-chapters";
import styles from "./TvSection.module.scss";

type TvSectionProps = {
  chapter: TvChapter;
  number: number;
  index: number;
  onChoose: (index: number) => void;
};

/*
 * A página de uma seção na TV: o "fragmento" escolhido com as mesmas
 * informações da seção comum (foto grande, descrição, destaques, números e a
 * linha prática). Embaixo, a faixa curva com os outros lugares da seção:
 * ◀ ▶ troca o lugar, Voltar volta para o coverflow.
 */
export default function TvSection({ chapter, number, index, onChoose }: TvSectionProps) {
  const item = chapter.items[index];

  return (
    <section className={styles.root} aria-label={chapter.label}>
      <div className={styles.page} key={item.id}>
        <div className={styles.info} aria-live="polite">
          <p className={styles.kicker}>{item.kicker}</p>
          <h2 className={styles.title}>{item.label}</h2>
          {item.text && <p className={styles.text}>{item.text}</p>}

          {item.highlights && item.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {item.highlights.slice(0, 4).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          )}

          {item.facts && item.facts.length > 0 && (
            <dl className={styles.facts}>
              {item.facts.slice(0, 3).map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {item.note && <p className={styles.note}>{item.note}</p>}
        </div>

        <div
          className={styles.photo}
          role="img"
          aria-label={item.label}
          style={{ backgroundImage: `url(${photoSrc(item.photo)})` }}
        />
      </div>

      <p className={styles.counter} aria-hidden="true">
        {String(number).padStart(2, "0")} · {chapter.label} · {index + 1} de {chapter.items.length}
      </p>

      <div className={styles.strip}>
        <TvArc
          items={chapter.items}
          index={index}
          onChoose={onChoose}
          size="small"
          active
          labelFor={(entry) => entry.label}
        />
      </div>
    </section>
  );
}

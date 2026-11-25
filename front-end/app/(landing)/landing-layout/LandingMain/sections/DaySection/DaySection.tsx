"use client";

import { useEffect, useRef, useState } from "react";
import {
  DAY_END,
  DAY_MOMENTS,
  DAY_START,
  formatHour,
} from "@/app/_shared/lib/data/day-moments";
import { getPlace } from "@/app/_shared/lib/data/places";
import { clamp, lerp, onScrollFrame, range } from "@/app/_shared/lib/scroll-frame";
import PhotoFragment from "../../main-utils/PhotoFragment/PhotoFragment";
import { PLACE_NOTES } from "@/app/_shared/lib/data/hotel-info";
import styles from "./DaySection.module.scss";

const READING_LINE = 0.55;
const SUNSET_HOUR = 18;
const DUSK_RANGE = [15.5, 19.5] as const;
const NIGHT_RANGE = [18.5, 20] as const;

function dayFraction(hour: number) {
  return clamp((hour - DAY_START) / (DAY_END - DAY_START));
}

export default function DaySection() {
  const rootRef = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [current, setCurrent] = useState(0);


  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    return onScrollFrame(() => {
      const line = window.innerHeight * READING_LINE;
      const centers = cards.current.map((card) => {
        const box = card?.getBoundingClientRect();
        return box ? box.top + box.height / 2 : 0;
      });

      const first = Math.max(
        0,
        centers.findLastIndex((center) => center <= line),
      );
      const next = Math.min(centers.length - 1, first + 1);
      const gap = centers[next] - centers[first];
      const amount = gap > 0 ? clamp((line - centers[first]) / gap) : 0;
      const hour = lerp(DAY_MOMENTS[first].hour, DAY_MOMENTS[next].hour, amount);

      root.style.setProperty("--sun", dayFraction(hour).toFixed(4));
      root.style.setProperty("--dusk", range(hour, ...DUSK_RANGE).toFixed(3));
      root.style.setProperty("--night", range(hour, ...NIGHT_RANGE).toFixed(3));
      setCurrent(amount > 0.5 ? next : first);
    });
  }, []);

  return (
    <section
      ref={rootRef}
      id="dia"
      className={styles.root}
      aria-labelledby="day-title"
    >
      <div className={styles.heading}>
        <span className={styles.kicker}>Um dia no Aegir</span>
        <h2 id="day-title" className={styles.headline}>
          Do café ao jantar, <em>em sete momentos.</em>
        </h2>
        <p className={styles.note}>
          Role para o dia passar: do café no lobby ao jantar no Restaurante Sal,
          com o que abre em cada hora.
        </p>
      </div>

      <div className={styles.grid}>
        <aside className={styles.clock} aria-hidden="true">
          {/*
           * Todas as leituras ficam empilhadas no mesmo lugar e só a atual aparece.
           * Assim a caixa já tem a largura da maior ("20h · Restaurante Sal") e o
           * arco do lado não encolhe nem estica quando a hora muda.
           */}
          <div className={styles.reading}>
            <span className={styles.label}>Agora</span>
            <div className={styles.readings}>
              {DAY_MOMENTS.map((item, index) => (
                <div
                  key={item.hour}
                  className={styles.now}
                  data-current={index === current ? "" : undefined}
                >
                  <b className={styles.hour}>{formatHour(item.hour)}</b>
                  <span className={styles.where}>{item.where}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sky}>
            <span className={styles.arc} />
            {/*
             * Um astro só, que anda pelo arco. Dentro dele, o sol e a lua ficam
             * um em cima do outro e trocam aos poucos com --night, do mesmo jeito
             * do ícone do botão de tema: um gira e encolhe enquanto o outro cresce.
             */}
            <span className={styles.body}>
              <svg className={styles.sun} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="currentColor" />
                <path
                  d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <svg className={styles.moon} viewBox="0 0 24 24">
                <path d="M20 14.5A8 8 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="currentColor" />
              </svg>
            </span>
            <div className={styles.scale}>
              <span>{formatHour(DAY_START)}</span>
              <span>{formatHour((DAY_START + DAY_END) / 2)}</span>
              <span>{formatHour(DAY_END)}</span>
            </div>
          </div>
        </aside>

        <ol className={styles.list}>
          {DAY_MOMENTS.map((item, index) => (
            <li
              key={item.hour}
              ref={(element) => {
                cards.current[index] = element;
              }}
              className={styles.card}
              aria-current={index === current ? "true" : undefined}
            >
              <div className={styles.media}>
                <PhotoFragment
                  className={styles.photo}
                  photo={item.photo}
                  shard={getPlace(item.placeId).shard}
                  alt={item.where}
                  sizes="(min-width: 768px) 24vw, 40vw"
                />
              </div>
              <div className={styles.text}>
                <span className={styles.meta}>
                  {formatHour(item.hour)} · {item.where}
                  {item.hour >= SUNSET_HOUR && (
                    <span className={styles.sunset}>Pôr do sol</span>
                  )}
                </span>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.copy}>{item.text}</p>
                <p className={styles.hours}>{PLACE_NOTES[item.placeId]}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

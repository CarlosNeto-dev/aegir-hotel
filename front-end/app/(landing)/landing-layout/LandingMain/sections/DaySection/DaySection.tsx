"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  DAY_END,
  DAY_MOMENTS,
  DAY_START,
  formatHour,
} from "@/app/_shared/lib/data/day-moments";
import { getPlace } from "@/app/_shared/lib/data/places";
import { clamp, lerp, onScrollFrame, range } from "@/app/_shared/lib/scroll-frame";
import PhotoFragment from "../../main-utils/PhotoFragment/PhotoFragment";
import PlaceLink from "../../main-utils/PlaceLink/PlaceLink";
import styles from "./DaySection.module.scss";

const READING_LINE = 0.55;
const SUNSET_HOUR = 18;
const DUSK_RANGE = [15.5, 19.5] as const;

function dayFraction(hour: number) {
  return clamp((hour - DAY_START) / (DAY_END - DAY_START));
}

export default function DaySection() {
  const rootRef = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [visitorHour, setVisitorHour] = useState<number | null>(null);

  useEffect(() => {
    setVisitorHour(new Date().getHours());
  }, []);

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
      setCurrent(amount > 0.5 ? next : first);
    });
  }, []);

  const moment = DAY_MOMENTS[current];
  const showVisitor =
    visitorHour !== null && visitorHour >= DAY_START && visitorHour <= DAY_END;

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
          Role para o dia passar. Cada momento abre em 3D na hora certa: de dia
          ou com a luz do pôr do sol.
        </p>
      </div>

      <div className={styles.grid}>
        <aside className={styles.clock} aria-hidden="true">
          <div className={styles.reading}>
            <span className={styles.label}>Agora</span>
            <b className={styles.hour}>{formatHour(moment.hour)}</b>
            <span className={styles.where}>{moment.where}</span>
          </div>

          <div className={styles.sky}>
            <span className={styles.arc} />
            <span className={styles.sun} />
            {showVisitor && (
              <span
                className={styles.visitor}
                style={{ "--at": dayFraction(visitorHour) } as CSSProperties}
              >
                você, {formatHour(visitorHour)}
              </span>
            )}
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
                <PlaceLink
                  place={getPlace(item.placeId)}
                  label={`Ver às ${formatHour(item.hour)} em 3D`}
                  variant="text"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

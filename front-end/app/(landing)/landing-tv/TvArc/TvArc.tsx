"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { photoSrc } from "@/app/_shared/lib/data/places";
import type { TvItem } from "../tv-chapters";
import styles from "./TvArc.module.scss";

type TvArcProps = {
  items: readonly TvItem[];
  index: number;
  onChoose: (index: number) => void;
  size?: "large" | "small";
  // Só o arco da vista ativa recebe o foco de verdade (para o leitor de tela).
  active: boolean;
  labelFor: (item: TvItem) => string;
};

// Quantos cartões aparecem de cada lado do escolhido.
const SIDE = { large: 5, small: 4 } as const;

function pad(value: number) {
  return String(value + 1).padStart(2, "0");
}

/*
 * O arco curvo: uma faixa de cartões encostados uns nos outros num arco
 * côncavo, como uma tela de cinema curva. Cada cartão gira em volta de um
 * ponto à frente dele (o raio --r); --d é quantos cartões ele está do
 * escolhido. Mudar o escolhido só muda os --d: o CSS anima a volta inteira.
 */
export default function TvArc({ items, index, onChoose, size = "large", active, labelFor }: TvArcProps) {
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (active) cardsRef.current[index]?.focus({ preventScroll: true });
  }, [active, index]);

  return (
    <div className={styles.stage} data-size={size}>
      <ul className={styles.arc}>
        {items.map((item, position) => {
          const offset = position - index;
          return (
            <li
              key={item.id}
              className={styles.slot}
              style={{ "--d": offset } as CSSProperties}
              data-far={Math.abs(offset) > SIDE[size] ? "" : undefined}
            >
              <button
                ref={(node) => {
                  cardsRef.current[position] = node;
                }}
                type="button"
                className={styles.card}
                data-focus={offset === 0 ? "" : undefined}
                tabIndex={active && offset === 0 ? 0 : -1}
                onClick={() => onChoose(position)}
                aria-label={labelFor(item)}
                style={{ backgroundImage: `url(${photoSrc(item.photo)})` }}
              >
                <span className={styles.cardText}>
                  <small>{pad(position)}</small>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

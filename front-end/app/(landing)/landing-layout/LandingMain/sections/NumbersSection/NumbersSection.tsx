"use client";

import { useEffect, useState } from "react";
import { prefersLessMotion } from "@/app/_shared/lib/motion";
import { useInView } from "../../main-hooks/useInView";
import styles from "./NumbersSection.module.scss";

const NUMBERS = [
  { value: 8, label: "andares no bloco dos fundos" },
  { value: 16, label: "vistas em 3D, uma por foto" },
  { value: 82, label: "metros de frente para a praia" },
  { value: 24, suffix: " m", label: "de piscina de borda infinita" },
  { value: 3, label: "tipos de suíte" },
] as const;

const DURATION_MS = 1400;

function useCountUp(running: boolean) {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (prefersLessMotion()) {
      setAmount(1);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const linear = Math.min(1, (now - start) / DURATION_MS);
      setAmount(1 - Math.pow(1 - linear, 3));
      if (linear < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  return amount;
}

export default function NumbersSection() {
  const { ref, inView } = useInView<HTMLElement>(0.4);
  const amount = useCountUp(inView);

  return (
    <section ref={ref} className={styles.root} aria-label="O hotel em números">
      <ul className={styles.list}>
        {NUMBERS.map((item) => (
          <li key={item.label} className={styles.item}>
            <b className={styles.value} aria-label={`${item.value}${"suffix" in item ? item.suffix : ""}`}>
              {Math.round(item.value * amount)}
              {"suffix" in item ? item.suffix : ""}
            </b>
            <span className={styles.label}>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

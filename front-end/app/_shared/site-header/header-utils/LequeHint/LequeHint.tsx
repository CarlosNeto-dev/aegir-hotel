import type { AnimationEvent } from "react";
import styles from "./LequeHint.module.scss";

type LequeHintProps = { onDone: () => void };

export default function LequeHint({ onDone }: LequeHintProps) {
  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onDone();
  }

  return (
    <div
      className={styles.root}
      aria-hidden="true"
      onAnimationEnd={handleAnimationEnd}
    >
      <svg className={styles.trail} viewBox="0 0 190 80" fill="none">
        <path d="M18 62 Q95 8 172 62" strokeDasharray="1 7" />
        <path d="M18 62l9-2M18 62l3-9M172 62l-9-2M172 62l-3-9" />
      </svg>

      <div className={styles.pointer}>
        <span className={styles.tap} />
        <svg className={styles.hand} viewBox="0 0 24 24">
          <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15V4a2 2 0 0 1 4 0v5.5V9a2 2 0 0 1 4 0v1a2 2 0 0 1 3 1z" />
          <path className={styles.knuckles} d="M11 9.5V10M15 10v1M18 11v1" />
        </svg>
      </div>
    </div>
  );
}

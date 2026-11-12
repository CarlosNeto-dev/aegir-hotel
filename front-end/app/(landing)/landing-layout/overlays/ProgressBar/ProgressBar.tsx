"use client";

import { useEffect, useRef } from "react";
import { clamp, onScrollFrame } from "@/app/_shared/lib/scroll-frame";
import styles from "./ProgressBar.module.scss";

export default function ProgressBar() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    return onScrollFrame(() => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? clamp(window.scrollY / distance) : 0;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    });
  }, []);

  return (
    <div className={styles.root} aria-hidden="true">
      <span ref={barRef} className={styles.bar} />
    </div>
  );
}

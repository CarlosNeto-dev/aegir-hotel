"use client";

import { useEffect, useState } from "react";
import {
  DAY_END,
  DAY_START,
  formatHour,
  momentAt,
} from "@/app/_shared/lib/data/day-moments";
import SectionLink from "@/app/_shared/site-header/header-utils/SectionLink/SectionLink";
import styles from "./NowChip.module.scss";

function describe(hour: number) {
  if (hour < DAY_START) return "o hotel ainda dorme, o café é às 08h";
  if (hour > DAY_END) return "as luminárias de palhinha seguem acesas";
  return momentAt(hour).title.toLowerCase();
}

export default function NowChip() {
  const [hour, setHour] = useState<number | null>(null);

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  if (hour === null) return <span className={styles.placeholder} />;

  return (
    <SectionLink href="#dia" className={styles.root}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>Agora no Aegir</span>
      <span className={styles.text}>
        {formatHour(hour)} · {describe(hour)}
      </span>
    </SectionLink>
  );
}

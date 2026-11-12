"use client";

import { useCallback, useState } from "react";
import { SUITES } from "@/app/_shared/lib/data/places";
import MainAside from "./aside/MainAside/MainAside";
import { useHashScroll } from "./main-hooks/useHashScroll";
import BookingSection from "./sections/BookingSection/BookingSection";
import CompareSection from "./sections/CompareSection/CompareSection";
import DaySection from "./sections/DaySection/DaySection";
import ModelsSection from "./sections/ModelsSection/ModelsSection";
import NumbersSection from "./sections/NumbersSection/NumbersSection";
import OpeningSection from "./sections/OpeningSection/OpeningSection";
import SuitesSection from "./sections/SuitesSection/SuitesSection";
import styles from "./LandingMain.module.scss";

export default function LandingMain() {
  const [suiteId, setSuiteId] = useState<string>(SUITES[0].id);
  const chooseSuite = useCallback(
    (suite: { id: string }) => setSuiteId(suite.id),
    [],
  );

  useHashScroll();

  return (
    <main id="conteudo" className={styles.root}>
      <div className={styles.sections}>
        <OpeningSection />
        <SuitesSection onChoose={chooseSuite} />
        <CompareSection onChoose={chooseSuite} />
        <DaySection />
        <ModelsSection />
        <NumbersSection />
        <BookingSection suiteId={suiteId} onSuiteChange={setSuiteId} />
      </div>
      <MainAside />
    </main>
  );
}

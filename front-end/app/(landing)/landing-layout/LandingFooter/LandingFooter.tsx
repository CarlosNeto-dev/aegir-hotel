"use client";

import { useEffect, useState } from "react";
import { prefersLessMotion } from "@/app/_shared/lib/motion";
import { useSettings } from "@/app/_shared/panels/settings-panel/SettingsProvider/SettingsProvider";
import FooterContent from "./footer-utils/FooterContent/FooterContent";
import FooterFragments from "./FooterFragments/FooterFragments";
import styles from "./LandingFooter.module.scss";

export default function LandingFooter() {
  const { settings, ready } = useSettings();
  const [lessMotion, setLessMotion] = useState(false);

  useEffect(() => {
    setLessMotion(prefersLessMotion());
  }, [settings.reduceMotion]);

  const animated = ready && settings.footer === "fragments" && !lessMotion;

  return (
    <footer id="rodape" className={styles.root} aria-label="Rodapé">
      {animated ? <FooterFragments /> : <FooterContent />}
    </footer>
  );
}

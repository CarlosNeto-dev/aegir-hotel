"use client";

import { useRef } from "react";
import { usePanels } from "../../panels/PanelProvider/PanelProvider";
import { useHeaderHidden } from "../header-hooks/useHeaderHidden";
import SiteHeaderDesktop from "../SiteHeaderDesktop/SiteHeaderDesktop";
import SiteHeaderMobile from "../SiteHeaderMobile/SiteHeaderMobile";
import SiteHeaderTV from "../SiteHeaderTV/SiteHeaderTV";
import styles from "./SiteHeaderLayout.module.scss";

export function SiteHeaderLayout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { layer } = usePanels();
  const hidden = useHeaderHidden(rootRef, layer !== null);

  return (
    <div ref={rootRef} className={styles.root} data-hidden={hidden || undefined}>
      <header className={styles.header}>
        <SiteHeaderDesktop />
        <SiteHeaderTV />
        <SiteHeaderMobile />
      </header>
    </div>
  );
}

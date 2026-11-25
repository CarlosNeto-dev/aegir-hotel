"use client";

import { useActiveId } from "@/app/_shared/site-header/header-hooks/ActiveSectionProvider";
import { NAV_ITEMS } from "@/app/_shared/site-header/header-utils/header-items";
import SectionLink from "@/app/_shared/site-header/header-utils/SectionLink/SectionLink";
import styles from "./MainAside.module.scss";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function MainAside() {
  const activeId = useActiveId();

  return (
    <aside className={styles.root} aria-label="Onde você está na página">
      <ol className={styles.list}>
        {NAV_ITEMS.map((item, index) => (
          <li key={item.id}>
            <SectionLink
              href={item.href}
              className={styles.link}
              aria-current={item.id === activeId ? "location" : undefined}
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.label}>
                <b>{pad(index + 1)}</b>
                {item.label}
              </span>
            </SectionLink>
          </li>
        ))}
      </ol>
    </aside>
  );
}

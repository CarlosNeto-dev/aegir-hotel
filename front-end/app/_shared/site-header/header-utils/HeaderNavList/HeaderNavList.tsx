"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useActiveId } from "../../header-hooks/ActiveSectionProvider";
import { NAV_ITEMS, type NavItem } from "../header-items";
import SectionLink from "../SectionLink/SectionLink";
import styles from "./HeaderNavList.module.scss";

type HeaderNavListProps = {
  variant: "bar" | "drawer";
  items?: readonly NavItem[];
  onNavigate?: () => void;
};

export default function HeaderNavList({
  variant,
  items = NAV_ITEMS,
  onNavigate,
}: HeaderNavListProps) {
  const activeId = useActiveId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || variant !== "bar") return;

    const placeIndicator = () => {
      const link = root.querySelector<HTMLElement>('[aria-current="location"]');
      root.style.setProperty("--ind-x", `${link?.offsetLeft ?? 0}px`);
      root.style.setProperty("--ind-w", `${link?.offsetWidth ?? 0}px`);
      root.style.setProperty("--ind-o", link ? "1" : "0");
    };

    placeIndicator();
    window.addEventListener("resize", placeIndicator);
    return () => window.removeEventListener("resize", placeIndicator);
  }, [activeId, variant]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${styles[variant]}`}
      style={{ "--ind-o": 0 } as CSSProperties}
    >
      {variant === "bar" && (
        <span className={styles.indicator} aria-hidden="true" />
      )}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <SectionLink
              href={item.href}
              className={styles.link}
              aria-current={item.id === activeId ? "location" : undefined}
              onNavigate={onNavigate}
            >
              {item.label}
            </SectionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

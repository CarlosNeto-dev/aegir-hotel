"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useActiveId } from "../../header-hooks/ActiveSectionProvider";
import { NAV_ITEMS, type NavItem } from "../header-items";
import SectionLink from "../SectionLink/SectionLink";
import styles from "./HeaderNavList.module.scss";

type HeaderNavListProps = {
  items?: readonly NavItem[];
};

export default function HeaderNavList({ items = NAV_ITEMS }: HeaderNavListProps) {
  const activeId = useActiveId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const placeIndicator = () => {
      const link = root.querySelector<HTMLElement>('[aria-current="location"]');
      root.style.setProperty("--ind-x", `${link?.offsetLeft ?? 0}px`);
      root.style.setProperty("--ind-w", `${link?.offsetWidth ?? 0}px`);
      root.style.setProperty("--ind-o", link ? "1" : "0");
    };

    /*
     * ResizeObserver avisa sempre que a lista muda de tamanho: janela, fonte
     * que terminou de carregar, tamanho do texto nos Ajustes. Só "resize"
     * da janela deixaria a pílula fora do lugar nesses casos.
     */
    placeIndicator();
    const observer = new ResizeObserver(placeIndicator);
    observer.observe(root);
    return () => observer.disconnect();
  }, [activeId]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ "--ind-o": 0 } as CSSProperties}
    >
      <span className={styles.indicator} aria-hidden="true" />
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <SectionLink
              href={item.href}
              className={styles.link}
              aria-current={item.id === activeId ? "location" : undefined}
            >
              {item.label}
            </SectionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

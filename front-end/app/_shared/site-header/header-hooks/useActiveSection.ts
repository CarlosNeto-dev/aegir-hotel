"use client";

import { useEffect, useState } from "react";
import { anchorTop } from "../../lib/section-nav";
import { onScrollFrame } from "../../lib/scroll-frame";
import { NAV_ITEMS, type SectionId } from "../header-utils/header-items";

const READING_LINE = 0.45;

export function useActiveSection(enabled: boolean) {
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveId(null);
      return;
    }

    return onScrollFrame(() => {
      const line = window.scrollY + window.innerHeight * READING_LINE;
      let current: SectionId = NAV_ITEMS[0].id;

      NAV_ITEMS.forEach((item) => {
        const top = anchorTop(item.id);
        if (top !== null && top <= line) current = item.id;
      });

      setActiveId(current);
    });
  }, [enabled]);

  return activeId;
}

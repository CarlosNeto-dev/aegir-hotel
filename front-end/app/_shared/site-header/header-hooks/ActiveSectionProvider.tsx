"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { setHash } from "../../lib/section-nav";
import type { SectionId } from "../header-utils/header-items";
import { useActiveSection } from "./useActiveSection";

const ActiveSectionContext = createContext<SectionId | null>(null);

export default function ActiveSectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const activeId = useActiveSection(pathname === "/");

  useEffect(() => {
    if (!activeId || pathname !== "/") return;
    if (document.getElementById(activeId)) setHash(activeId);
  }, [activeId, pathname]);

  return (
    <ActiveSectionContext.Provider value={activeId}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveId() {
  return useContext(ActiveSectionContext);
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Layer = "menu" | "settings" | "account";

type PanelContextValue = {
  layer: Layer | null;
  open: (layer: Layer) => void;
  close: () => void;
  toggle: (layer: Layer) => void;
};

const PanelContext = createContext<PanelContextValue | null>(null);

export default function PanelProvider({ children }: { children: ReactNode }) {
  const [layer, setLayer] = useState<Layer | null>(null);

  useEffect(() => {
    if (!layer) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [layer]);

  const open = useCallback((next: Layer) => setLayer(next), []);

  const close = useCallback(() => setLayer(null), []);

  const toggle = useCallback(
    (next: Layer) =>
      setLayer((current) => (current === next ? null : next)),
    [],
  );

  const value = useMemo(
    () => ({ layer, open, close, toggle }),
    [layer, open, close, toggle],
  );

  return (
    <PanelContext.Provider value={value}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanels() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("usePanels precisa estar dentro do PanelProvider");
  }
  return context;
}

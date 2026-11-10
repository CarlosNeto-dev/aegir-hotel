"use client";

import Lenis from "lenis";
import { useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { setLenis } from "../../lib/section-nav";
import { usePanels } from "../../panels/PanelProvider/PanelProvider";
import { useSettings } from "../../panels/settings-panel/SettingsProvider/SettingsProvider";

const NO_SMOOTH_QUERY = "(prefers-reduced-motion: reduce), (hover: none)";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { settings, ready } = useSettings();
  const { layer } = usePanels();
  const [lenis, setInstance] = useState<Lenis | null>(null);
  const enabled = ready && settings.smoothScroll && !settings.reduceMotion;

  useEffect(() => {
    if (!enabled || window.matchMedia(NO_SMOOTH_QUERY).matches) return;

    const instance = new Lenis({ lerp: 0.1, allowNestedScroll: true });
    const tick = (time: number) => instance.raf(time * 1000);

    instance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    setInstance(instance);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      setLenis(null);
      setInstance(null);
    };
  }, [enabled]);

  useEffect(() => {
    if (!lenis) return;
    if (layer) lenis.stop();
    else lenis.start();
  }, [lenis, layer]);

  return children;
}

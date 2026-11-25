import { useEffect } from "react";
import { ScrollTrigger } from "@/app/_shared/lib/gsap";
import { anchorTop, jumpTo, lockHash } from "@/app/_shared/lib/section-nav";

const SETTLE_MS = 400;

export function useHashScroll() {
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    lockHash(true);
    let timer = 0;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const y = anchorTop(id);
        if (y !== null) jumpTo(y);
        timer = window.setTimeout(() => lockHash(false), SETTLE_MS);
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      lockHash(false);
    };
  }, []);
}

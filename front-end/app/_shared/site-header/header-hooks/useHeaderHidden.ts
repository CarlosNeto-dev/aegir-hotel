"use client";

import { useEffect, useState, type RefObject } from "react";
import { JUMP_EVENT } from "../../lib/section-nav";
import { onScrollFrame } from "../../lib/scroll-frame";

const MIN_STEP = 6;
const START_HIDING = 0.5;
const REVEAL_EDGE = 96;

export function useHeaderHidden(ref: RefObject<HTMLElement | null>, locked: boolean) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (locked) {
      setHidden(false);
      return;
    }

    let last = window.scrollY;

    const stopScroll = onScrollFrame(() => {
      const y = window.scrollY;
      const step = y - last;
      if (Math.abs(step) < MIN_STEP) return;
      last = y;

      const focused = Boolean(ref.current?.querySelector(":focus-visible"));
      setHidden(step > 0 && y > window.innerHeight * START_HIDING && !focused);
    });

    const reveal = () => {
      last = window.scrollY;
      setHidden(false);
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.clientY < REVEAL_EDGE) reveal();
    };

    window.addEventListener(JUMP_EVENT, reveal);
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      stopScroll();
      window.removeEventListener(JUMP_EVENT, reveal);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [locked, ref]);

  return hidden;
}

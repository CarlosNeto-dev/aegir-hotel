"use client";

import { useEffect, useRef } from "react";
import { clamp, onScrollFrame } from "@/app/_shared/lib/scroll-frame";

type ProgressHandler<Target> = (progress: number, element: Target) => void;

export function useScrollProgress<Target extends HTMLElement>(
  onProgress: ProgressHandler<Target>,
) {
  const ref = useRef<Target>(null);
  const handler = useRef(onProgress);

  useEffect(() => {
    handler.current = onProgress;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return onScrollFrame(() => {
      const rect = element.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress =
        distance > 0 ? clamp(-rect.top / distance) : rect.top <= 0 ? 1 : 0;
      handler.current(progress, element);
    });
  }, []);

  return ref;
}

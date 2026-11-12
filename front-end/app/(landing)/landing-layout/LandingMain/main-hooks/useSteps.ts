"use client";

import { useCallback, useRef, useState } from "react";
import { prefersLessMotion } from "@/app/_shared/lib/motion";
import { clamp, range } from "@/app/_shared/lib/scroll-frame";
import { useScrollProgress } from "./useScrollProgress";

const ENTER_END = 0.22;
const EXIT_START = 0.82;

type StepHandler = (position: number, element: HTMLElement) => void;

export function useSteps<Target extends HTMLElement>(
  count: number,
  onPosition?: StepHandler,
) {
  const [active, setActive] = useState(0);
  const steps = useRef<HTMLElement[]>([]);

  const ref = useScrollProgress<Target>((progress, element) => {
    if (steps.current.length !== count) {
      steps.current = Array.from(
        element.querySelectorAll<HTMLElement>("[data-step]"),
      );
    }

    const position = progress * count;
    const index = Math.min(count - 1, Math.floor(position));

    steps.current.forEach((step, stepIndex) => {
      const enter = stepIndex === 0 ? 1 : range(position, stepIndex, stepIndex + ENTER_END);
      const exit =
        stepIndex === count - 1
          ? 0
          : range(position, stepIndex + EXIT_START, stepIndex + 1);
      step.style.setProperty("--in", enter.toFixed(3));
      step.style.setProperty("--out", exit.toFixed(3));
      step.inert = stepIndex !== index;
    });

    element.style.setProperty("--progress", progress.toFixed(4));
    onPosition?.(position, element);
    setActive(index);
  });

  const goTo = useCallback(
    (index: number) => {
      const element = ref.current;
      if (!element) return;
      const distance = element.offsetHeight - window.innerHeight;
      const top = element.getBoundingClientRect().top + window.scrollY;
      const target = clamp((index + 0.5) / count);
      window.scrollTo({
        top: top + distance * target,
        behavior: prefersLessMotion() ? "auto" : "smooth",
      });
    },
    [count, ref],
  );

  return { ref, active, goTo };
}

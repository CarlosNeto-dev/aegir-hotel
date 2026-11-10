export function prefersLessMotion() {
  return (
    document.documentElement.hasAttribute("data-reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const PACE = { slow: 1.4, normal: 1, fast: 0.65 } as const;

export function scrollPace(speed: keyof typeof PACE) {
  return PACE[speed];
}

export function savedPace(fallback: number) {
  const speed = document.documentElement.dataset.speed;
  return speed && speed in PACE ? PACE[speed as keyof typeof PACE] : fallback;
}

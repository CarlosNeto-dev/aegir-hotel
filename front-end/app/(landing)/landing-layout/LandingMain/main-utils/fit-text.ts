const LEVELS = ["long", "short", "tight", "tiny"] as const;

export type FitLevel = (typeof LEVELS)[number];

export function fitText(box: HTMLElement, content: HTMLElement, maxHeight: number) {
  for (const level of LEVELS) {
    box.dataset.fit = level;
    if (content.offsetHeight <= maxHeight) return level;
  }
  return LEVELS[LEVELS.length - 1];
}

type FrameListener = () => void;

const listeners = new Set<FrameListener>();
let frame = 0;

function flush() {
  frame = 0;
  listeners.forEach((listener) => listener());
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(flush);
}

export function onScrollFrame(listener: FrameListener) {
  if (listeners.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }

  listeners.add(listener);
  schedule();

  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function range(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start));
}

export function ease(value: number) {
  return value * value * (3 - 2 * value);
}

export function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

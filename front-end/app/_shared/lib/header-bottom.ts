const FALLBACK = 64;

export function headerBottom() {
  const header = document.querySelector("header");
  if (!header) return FALLBACK;

  const holder = header.offsetParent instanceof HTMLElement ? header.offsetParent.offsetTop : 0;
  return Math.max(FALLBACK, holder + header.offsetTop + header.offsetHeight);
}

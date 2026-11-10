import type Lenis from "lenis";
import { ScrollTrigger } from "./gsap";
import { prefersLessMotion } from "./motion";

type Anchor = () => number;
type Curtain = (label: string, jump: () => void, done: () => void) => void;

export const JUMP_EVENT = "aegir:jump";

const FAR_SCREENS = 1.5;

const anchors = new Map<string, Anchor>();
let lenis: Lenis | null = null;
let curtain: Curtain | null = null;
let moving = false;
let hashLocked = false;

export function lockHash(locked: boolean) {
  hashLocked = locked;
}

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function setCurtain(next: Curtain) {
  curtain = next;
  return () => {
    if (curtain === next) curtain = null;
  };
}

export function setAnchor(id: string, anchor: Anchor) {
  anchors.set(id, anchor);
  return () => {
    if (anchors.get(id) === anchor) anchors.delete(id);
  };
}

export function setHash(id: string) {
  if (hashLocked || window.location.hash === `#${id}`) return;
  window.history.replaceState(window.history.state, "", `#${id}`);
}

export function anchorTop(id: string) {
  const anchor = anchors.get(id);
  if (anchor) return anchor();

  const element = document.getElementById(id);
  if (!element) return null;

  const box = (element.closest(".pin-spacer") ?? element).getBoundingClientRect();
  return box.top + window.scrollY;
}

export function scrollToY(y: number) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { duration: 1.1, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: prefersLessMotion() ? "auto" : "smooth" });
}

export function jumpTo(y: number) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(y, { immediate: true, force: true });
  } else window.scrollTo({ top: y, behavior: "instant" });

  ScrollTrigger.update();
  ScrollTrigger.getAll().forEach((trigger) => trigger.getTween()?.progress(1));
  window.dispatchEvent(new Event(JUMP_EVENT));
}

export function goToSection(id: string, label: string) {
  const y = anchorTop(id);
  if (y === null) return false;

  setHash(id);

  const far = Math.abs(y - window.scrollY) > window.innerHeight * FAR_SCREENS;

  if (prefersLessMotion()) {
    jumpTo(y);
    return true;
  }

  if (!far || !curtain) {
    scrollToY(y);
    return true;
  }

  if (moving) return true;
  moving = true;
  curtain(label, () => jumpTo(y), () => {
    moving = false;
  });
  return true;
}

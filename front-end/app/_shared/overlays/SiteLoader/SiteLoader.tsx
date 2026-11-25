"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { getPlace, HOTEL, photoSrc, type PlaceId } from "@/app/_shared/lib/data/places";
import { gsap } from "@/app/_shared/lib/gsap";
import { prefersLessMotion } from "@/app/_shared/lib/motion";
import { LOADER_DONE } from "./site-loader-script";
import styles from "./SiteLoader.module.scss";

const SLICE_PLACES: readonly PlaceId[] = [
  "lobby",
  "pool",
  "restaurant",
  "spa",
  "lookout",
  "dune",
  "tide",
  "terrace",
];

const SLICES = SLICE_PLACES.map((id) => getPlace(id));

const MIN_SECONDS = 1.8;
const MAX_SECONDS = 4;
const ENTER_STEP = 0.06;
const TURN = 0.55;
const TURN_SPAN = 0.3;
const TURN_STEP = 0.03;

const WEIGHTS = { fonts: 0.25, hero: 0.35, opening: 0.25, page: 0.15 } as const;
type Signal = keyof typeof WEIGHTS;

const COUNT_SLICES = [SLICES.length / 2 - 1, SLICES.length / 2];
const CAPTION_SLICE = SLICES.length - 1;

const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
const BLOCK: AddEventListenerOptions = { capture: true, passive: false };

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function percent(progress: number) {
  return String(Math.round(progress * 100)).padStart(3, "0");
}

function heroPhoto() {
  const images = document.querySelectorAll<HTMLImageElement>(
    `#abertura img[src*="${HOTEL.photo}"]`,
  );
  for (const image of images) {
    const box = image.getBoundingClientRect();
    if (box.width > 40 && box.bottom > 0 && box.top < window.innerHeight) return image;
  }
  return null;
}

function cornerOf(element: HTMLElement) {
  let node: HTMLElement | null = element;
  for (let depth = 0; node && depth < 4; depth += 1, node = node.parentElement) {
    const radius = getComputedStyle(node).borderRadius;
    if (radius && radius !== "0px") return radius;
  }
  return "0px";
}

/*
 * O recorte das fotos (Ajustes) fica salvo no localStorage e o script do
 * <head> o aplica no <html> antes da primeira pintura. A foto do hero herda
 * dele um clip-path; a foto que voa copia esse recorte para pousar igual a ela.
 */
function clipOf(element: HTMLElement) {
  let node: HTMLElement | null = element;
  for (let depth = 0; node && depth < 4; depth += 1, node = node.parentElement) {
    const clip = getComputedStyle(node).clipPath;
    if (clip && clip !== "none") return clip;
  }
  return null;
}

function polygonPoints(clip: string) {
  const match = /^polygon\((.*)\)$/.exec(clip.trim());
  if (!match) return null;
  const points = match[1].split(",").map((pair) => pair.trim().split(/\s+/).map(parseFloat));
  return points.every((point) => point.length === 2 && point.every(Number.isFinite)) ? points : null;
}

function spreadPolygon(points: number[][], spread: number) {
  const coords = points.map(
    ([x, y]) => `${(50 + (x - 50) * spread).toFixed(2)}% ${(50 + (y - 50) * spread).toFixed(2)}%`,
  );
  return `polygon(${coords.join(", ")})`;
}

function stopScroll(event: Event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function stopScrollKeys(event: KeyboardEvent) {
  if (SCROLL_KEYS.has(event.key)) stopScroll(event);
}

function lockScroll(on: boolean) {
  if (on) {
    window.addEventListener("wheel", stopScroll, BLOCK);
    window.addEventListener("touchmove", stopScroll, BLOCK);
    window.addEventListener("keydown", stopScrollKeys, BLOCK);
  } else {
    window.removeEventListener("wheel", stopScroll, BLOCK);
    window.removeEventListener("touchmove", stopScroll, BLOCK);
    window.removeEventListener("keydown", stopScrollKeys, BLOCK);
  }
  document.documentElement.style.overflow = on ? "hidden" : "";
}

export default function SiteLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const strip = slicesRef.current;
    const fly = flyRef.current;
    const count = countRef.current;
    const caption = captionRef.current;
    if (!root || !strip || !fly || !count || !caption) return;

    const html = document.documentElement;
    if (html.dataset.siteLoader === LOADER_DONE) {
      setGone(true);
      return;
    }

    root.style.animation = "none";
    const calm = prefersLessMotion();
    const slices = gsap.utils.toArray<HTMLElement>("[data-slice]", strip);
    const hotels = gsap.utils.toArray<HTMLElement>("[data-slice-hotel]", strip);
    const got = new Set<Signal>();
    const entered = new Set<number>();
    const start = performance.now();
    let shown = 0;
    let heroAsked = false;
    let leaving = false;
    let alive = true;

    const finish = () => {
      if (!alive) return;
      lockScroll(false);
      html.dataset.siteLoader = LOADER_DONE;
      setGone(true);
    };

    const fadeAway = () => {
      gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: finish });
    };

    const flyToHero = () => {
      const target = heroPhoto();
      if (!target) return fadeAway();
      const box = target.getBoundingClientRect();
      const clip = clipOf(target);
      const points = clip ? polygonPoints(clip) : null;
      gsap.set(fly, { autoAlpha: 1 });
      gsap.set(strip, { autoAlpha: 0 });
      gsap.to(root, { backgroundColor: "rgba(0,0,0,0)", duration: 0.45 });
      gsap.fromTo(
        fly,
        { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight, borderRadius: 0 },
        {
          top: box.top,
          left: box.left,
          width: box.width,
          height: box.height,
          borderRadius: clip ? 0 : cornerOf(target),
          duration: 0.95,
          ease: "power3.inOut",
          onUpdate() {
            if (points) fly.style.clipPath = spreadPolygon(points, 1 + 2 * (1 - this.ratio));
          },
          onComplete: () => {
            if (clip) fly.style.clipPath = clip;
            gsap.to(fly, { autoAlpha: 0, duration: 0.25, onComplete: finish });
          },
        },
      );
    };

    const leave = () => {
      if (calm) return fadeAway();
      gsap.to(slices, { x: 0, xPercent: 0, duration: 0.5, ease: "power2.out" });
      gsap.to(hotels, { opacity: 1, duration: 0.5 });
      gsap.to([count, caption], { autoAlpha: 0, duration: 0.35, delay: 0.55 });
      gsap.delayedCall(0.9, flyToHero);
    };

    const paint = (progress: number) => {
      count.textContent = percent(progress);
      caption.textContent = progress < TURN ? "Oito lugares" : "Um hotel";
      slices.forEach((slice, index) => {
        if (calm || entered.has(index) || progress < index * ENTER_STEP) return;
        entered.add(index);
        gsap.to(slice, { x: 0, xPercent: 0, duration: 1.1, ease: "expo.out" });
      });
      count.toggleAttribute("data-on-photo", calm || COUNT_SLICES.every((index) => entered.has(index)));
      caption.toggleAttribute("data-on-photo", calm || entered.has(CAPTION_SLICE));
      hotels.forEach((layer, index) => {
        layer.style.opacity = String(clamp01((progress - TURN - index * TURN_STEP) / TURN_SPAN));
      });
    };

    const askHero = () => {
      const image = heroPhoto();
      if (!image) {
        if (got.has("opening")) got.add("hero");
        return;
      }
      heroAsked = true;
      const loaded = image.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
          });
      loaded
        .then(() => image.decode())
        .catch(() => undefined)
        .finally(() => got.add("hero"));
    };

    const tick = () => {
      if (leaving) return;
      const seconds = (performance.now() - start) / 1000;
      // Na TV não existe a Abertura: o coverflow já está pronto quando aparece.
      const tvReady = html.hasAttribute("data-tv-landing");
      if (!got.has("opening") && (tvReady || document.querySelector("#abertura [data-ready]"))) got.add("opening");
      if (!heroAsked && !got.has("hero")) askHero();

      let real = 0;
      got.forEach((signal) => {
        real += WEIGHTS[signal];
      });
      if (seconds >= MAX_SECONDS) real = 1;
      real = Math.min(real, seconds / MIN_SECONDS);

      shown += (real - shown) * (calm ? 1 : 0.07);
      if (real >= 0.999 && shown > 0.996) shown = 1;
      paint(shown);

      if (shown === 1 && seconds >= MIN_SECONDS) {
        leaving = true;
        leave();
      }
    };

    const onLoad = () => got.add("page");

    gsap.set(slices, { x: 0, xPercent: (index: number) => (calm ? 0 : index % 2 ? 105 : -105) });
    lockScroll(true);
    if (!window.location.hash) window.scrollTo(0, 0);
    document.fonts.ready.then(() => got.add("fonts"));
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    gsap.ticker.add(tick);

    return () => {
      alive = false;
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      gsap.killTweensOf([root, fly, strip, count, caption, ...slices, ...hotels]);
      lockScroll(false);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-loader-screen=""
      style={{ "--slices": SLICES.length } as CSSProperties}
    >
      <p className={styles.status} role="status">
        Carregando o Aegir
      </p>

      <div ref={slicesRef} className={styles.slices} aria-hidden="true">
        {SLICES.map((place, index) => (
          <div
            key={place.id}
            className={styles.slice}
            data-slice=""
            style={{ "--slice": index } as CSSProperties}
          >
            <Image className={styles.photo} src={photoSrc(place.photo)} alt="" fill sizes="100vw" loading="eager" />
            <div className={styles.hotel} data-slice-hotel="">
              <Image className={styles.photo} src={photoSrc(HOTEL.photo)} alt="" fill sizes="100vw" loading="eager" />
            </div>
          </div>
        ))}
      </div>

      <div ref={flyRef} className={styles.fly} aria-hidden="true">
        <Image className={styles.photo} src={photoSrc(HOTEL.photo)} alt="" fill sizes="100vw" priority />
      </div>

      <span ref={countRef} className={styles.count} aria-hidden="true">
        000
      </span>
      <p ref={captionRef} className={styles.caption} aria-hidden="true">
        Oito lugares
      </p>
    </div>
  );
}

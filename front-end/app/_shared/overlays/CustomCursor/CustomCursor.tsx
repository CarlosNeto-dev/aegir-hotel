"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useSettings } from "../../panels/settings-panel/SettingsProvider/SettingsProvider";
import styles from "./CustomCursor.module.scss";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const TRAIL_LENGTH = 10;
const EASE = 0.22;
const INTERACTIVE =
  "a, button, label, input, select, textarea, summary, [role='button']";

type Point = { x: number; y: number };

function place(element: HTMLElement | null, point: Point) {
  if (element) {
    element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
  }
}

export default function CustomCursor() {
  const { settings } = useSettings();
  const shape = settings.cursor;
  const [finePointer, setFinePointer] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLSpanElement>(null);
  const pointerRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const active = finePointer && shape !== "system";

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER);
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!active || !root) return;

    const target: Point = { x: -100, y: -100 };
    const follow: Point = { ...target };
    const history: Point[] = Array.from({ length: TRAIL_LENGTH }, () => ({
      ...target,
    }));
    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!root.hasAttribute("data-visible")) {
        follow.x = target.x;
        follow.y = target.y;
        history.forEach((point) => Object.assign(point, target));
        root.setAttribute("data-visible", "");
      }
      const element = event.target instanceof Element ? event.target : null;
      root.toggleAttribute("data-hover", !!element?.closest(INTERACTIVE));
    };

    const hide = () => {
      root.removeAttribute("data-visible");
    };

    const press = () => {
      root.setAttribute("data-pressed", "");
    };

    const release = () => {
      root.removeAttribute("data-pressed");
    };

    const tick = () => {
      const still = document.documentElement.hasAttribute("data-reduce-motion");
      const ease = still ? 1 : EASE;
      follow.x += (target.x - follow.x) * ease;
      follow.y += (target.y - follow.y) * ease;
      history.pop();
      history.unshift({ ...target });

      place(followerRef.current, follow);
      place(pointerRef.current, target);
      trailRefs.current.forEach((element, index) =>
        place(element, history[index]),
      );

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, [active, shape]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-shape={shape}
      aria-hidden="true"
    >
      {shape === "trail" &&
        Array.from({ length: TRAIL_LENGTH }, (_, index) => (
          <span
            key={index}
            ref={(element) => {
              trailRefs.current[index] = element;
            }}
            className={styles.trail}
            style={{ "--step": index } as CSSProperties}
          >
            <span className={styles.trailDot} />
          </span>
        ))}

      <span ref={followerRef} className={styles.follower}>
        <span className={styles.ring} />
      </span>

      <span ref={pointerRef} className={styles.pointer}>
        <span className={styles.mark} />
      </span>
    </div>
  );
}

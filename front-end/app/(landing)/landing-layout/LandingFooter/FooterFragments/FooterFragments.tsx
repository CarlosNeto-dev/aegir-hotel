"use client";

import { useEffect, useRef } from "react";
import { PLACES } from "@/app/_shared/lib/data/places";
import { gsap, ScrollTrigger, useGSAP } from "@/app/_shared/lib/gsap";
import { savedPace, scrollPace } from "@/app/_shared/lib/motion";
import { clamp, ease, onScrollFrame } from "@/app/_shared/lib/scroll-frame";
import { useSettings } from "@/app/_shared/panels/settings-panel/SettingsProvider/SettingsProvider";
import PhotoFragment from "../../LandingMain/main-utils/PhotoFragment/PhotoFragment";
import VanishText from "../../LandingMain/main-utils/VanishText/VanishText";
import { CLOSING_MESSAGE } from "../footer-utils/credits";
import FooterContent from "../footer-utils/FooterContent/FooterContent";
import {
  COMPACT_WIDTH,
  applyPose,
  blend,
  createClosingState,
  helixPaths,
  helixPose,
  measureClosing,
  slotPose,
  type ClosingFrame,
} from "./closing-layout";
import styles from "./FooterFragments.module.scss";

/* Quando cada fragmento pousa: um atrás do outro, na ordem da faixa. */
function landingDelay(order: number) {
  return order * 0.015;
}

export default function FooterFragments() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const helixRef = useRef<SVGSVGElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fragments = useRef<(HTMLSpanElement | null)[]>([]);
  const { settings, ready } = useSettings();
  const pace = scrollPace(settings.speed);
  const paceRef = useRef<number>(pace);

  useEffect(() => {
    if (!ready || paceRef.current === pace) return;
    paceRef.current = pace;
    ScrollTrigger.refresh();
  }, [ready, pace]);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      const center = centerRef.current;
      const message = messageRef.current;
      const content = contentRef.current;
      const helix = helixRef.current;
      if (!scene || !center || !message || !content || !helix) return;
      const [strandA, strandB, rungs] = Array.from(helix.querySelectorAll("path"));
      paceRef.current = savedPace(paceRef.current);

      const slots = PLACES.map((_, order) =>
        content.querySelector<HTMLElement>(`[data-slot="${order}"]`),
      );
      const state = createClosingState();
      let frame: ClosingFrame = measureClosing(message.offsetHeight);

      const render = () => {
        /* A cena está fixa durante o pin; antes e depois ela rola junto com a página. */
        const shift = scene.getBoundingClientRect().top;
        const contentTop = content.getBoundingClientRect().top;
        const travel = clamp((frame.height - contentTop) / (frame.height * 0.85));
        const fade = 1 - clamp(travel * 4);
        message.style.opacity = String(fade);

        const paths = helixPaths(frame, state);
        strandA?.setAttribute("d", paths.strandA);
        strandB?.setAttribute("d", paths.strandB);
        rungs?.setAttribute("d", paths.rungs);
        helix.style.opacity = String(fade);
        helix.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;

        fragments.current.forEach((element, order) => {
          const slot = slots[order];
          if (!element || !slot) return;
          const from = helixPose(order, frame, state);
          from.y += shift;
          const amount = ease(clamp(travel * 1.35 - landingDelay(order)));
          const landed = amount >= 0.999;

          if (landed) slot.dataset.landed = "";
          else delete slot.dataset.landed;

          const pose =
            amount > 0 ? blend(from, slotPose(slot.getBoundingClientRect()), amount) : from;
          if (amount > 0) pose.opacity = Math.max(pose.opacity, amount);
          applyPose(element, pose, !landed);
        });
      };

      const remeasure = () => {
        center.style.paddingTop = "0px";
        frame = measureClosing(message.offsetHeight);
        center.style.paddingTop = `${frame.messageTop.toFixed(1)}px`;
        render();
      };

      const text = message.querySelector("[data-vanish]");
      const kicker = message.querySelector("[data-kicker]");

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        paused: true,
        onUpdate: render,
      });

      // Os fragmentos se juntam numa dupla hélice, que gira enquanto a pessoa rola.
      timeline
        .fromTo(state, { build: 0 }, { build: 1, duration: 1.4, ease: "power2.out" }, 0)
        .fromTo(
          state,
          { twist: 0 },
          { twist: Math.PI * 1.6, duration: 2.8, ease: "power1.inOut" },
          0,
        );
      if (kicker) {
        timeline.fromTo(
          kicker,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.4 },
          0.3,
        );
      }
      if (text) {
        timeline.fromTo(
          text,
          { "--in": 0 },
          { "--in": 1, duration: 0.6, ease: "power2.out" },
          0.35,
        );
      }
      timeline.to({}, { duration: 0.4 }, 2.8);

      const length = () => {
        const compact = window.innerWidth < COMPACT_WIDTH;
        return window.innerHeight * 2 * (compact ? 0.8 : 1) * paceRef.current;
      };

      ScrollTrigger.create({
        trigger: scene,
        start: "top top",
        end: () => `+=${length()}`,
        pin: true,
        pinSpacing: true,
        scrub: window.innerWidth < COMPACT_WIDTH ? 0.35 : 0.6,
        animation: timeline,
        onRefresh: remeasure,
      });

      remeasure();
      const stop = onScrollFrame(render);
      return () => {
        stop();
        slots.forEach((slot) => {
          if (slot) delete slot.dataset.landed;
        });
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={sceneRef} className={styles.scene}>
        <div ref={centerRef} className={styles.center} aria-hidden="true">
          <div ref={messageRef} className={styles.message}>
            <span className={styles.messageKicker} data-kicker>
              {CLOSING_MESSAGE.kicker}
            </span>
            <VanishText className={styles.messageText} parts={CLOSING_MESSAGE.parts} />
          </div>
        </div>
      </div>

      <div className={styles.layer} aria-hidden="true">
        <svg ref={helixRef} className={styles.helix}>
          <path className={styles.strand} />
          <path className={styles.strand} />
          <path className={styles.rung} />
        </svg>
        {PLACES.map((place, order) => (
          <span
            key={place.id}
            ref={(element) => {
              fragments.current[order] = element;
            }}
            className={styles.fragment}
          >
            <PhotoFragment
              className={styles.photo}
              photo={place.photo}
              shard={place.shard}
              alt=""
              sizes="14rem"
            />
          </span>
        ))}
      </div>

      <FooterContent awaiting contentRef={contentRef} />
    </div>
  );
}

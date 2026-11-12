"use client";

import { useEffect, useRef } from "react";
import { HOTEL, RING_PLACES } from "@/app/_shared/lib/data/places";
import { gsap, ScrollTrigger, useGSAP } from "@/app/_shared/lib/gsap";
import { savedPace, scrollPace } from "@/app/_shared/lib/motion";
import { setAnchor } from "@/app/_shared/lib/section-nav";
import { useSettings } from "@/app/_shared/panels/settings-panel/SettingsProvider/SettingsProvider";
import SectionLink from "@/app/_shared/site-header/header-utils/SectionLink/SectionLink";
import { fitText } from "../../main-utils/fit-text";
import PhotoFragment from "../../main-utils/PhotoFragment/PhotoFragment";
import PlaceLink from "../../main-utils/PlaceLink/PlaceLink";
import VanishText from "../../main-utils/VanishText/VanishText";
import JourneySection from "../JourneySection/JourneySection";
import {
  CLOSING_MESSAGE,
  HERO_TEXT,
  MESSAGES,
  PLACES_LABEL,
  PLACE_START,
  PLACE_STEP,
} from "./opening-timeline";
import {
  COMPACT_WIDTH,
  applyPose,
  createState,
  fragmentPose,
  measureStory,
  photoOnLeft,
  type StoryFrame,
} from "./story-layout";
import styles from "./OpeningSection.module.scss";

type Timeline = gsap.core.Timeline;

const MIN_BAND = 70;

function px(value: number) {
  return `${value.toFixed(1)}px`;
}

function showText(timeline: Timeline, target: Element | null, at: number, duration = 0.55) {
  if (!target) return;
  timeline.fromTo(target, { "--in": 0 }, { "--in": 1, duration, ease: "power2.out" }, at);
}

function hideText(timeline: Timeline, target: Element | null, at: number, duration = 0.55) {
  if (!target) return;
  timeline.fromTo(
    target,
    { "--out": 0 },
    { "--out": 1, duration, ease: "power2.in", immediateRender: false },
    at,
  );
}

function showRest(timeline: Timeline, targets: Element[], at: number) {
  timeline.fromTo(
    targets,
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
    at,
  );
}

function hideRest(timeline: Timeline, targets: Element[], at: number) {
  timeline.fromTo(
    targets,
    { autoAlpha: 1, y: 0 },
    { autoAlpha: 0, y: -14, duration: 0.3, stagger: 0.03, immediateRender: false },
    at,
  );
}

export default function OpeningSection() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
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
      const root = rootRef.current;
      const stage = stageRef.current;
      const heroText = heroRef.current;
      const messages = messagesRef.current;
      if (!root || !stage || !heroText || !messages) return;
      paceRef.current = savedPace(paceRef.current);

      const count = RING_PLACES.length;
      const state = createState(count);
      const order: number[] = [];
      const places = gsap.utils.toArray<HTMLElement>("[data-place]", stage);
      let frame: StoryFrame = measureStory({ stage, heroText, messages, count });

      const render = () => {
        fragments.current.forEach((element, index) => {
          if (element) applyPose(element, fragmentPose(index, frame, state, order.indexOf(index)));
        });
      };

      const remeasure = () => {
        frame = measureStory({ stage, heroText, messages, count });
        stage.style.setProperty("--text-bottom", px(frame.text.bottom));
        stage.style.setProperty("--text-width", px(frame.text.width));
        stage.style.setProperty("--text-near", px(frame.text.near));
        stage.style.setProperty("--text-far", px(frame.text.far));

        const fitAll = () => {
          stage.style.setProperty("--text-top", px(frame.text.top));
          const room = frame.height - frame.text.top - frame.text.bottom;
          return places.reduce((worst, place) => {
            const content = place.firstElementChild;
            if (!(content instanceof HTMLElement)) return worst;
            fitText(place, content, room);
            return Math.max(worst, content.offsetHeight - room);
          }, 0);
        };

        const missing = fitAll();
        if (missing > 0 && frame.stacked) {
          const band = frame.place[0];
          const cut = Math.min(missing + 8, band.h - MIN_BAND);
          const shrunk = { ...band, y: band.y - cut / 2, h: band.h - cut, w: band.w };
          frame.place = frame.place.map(() => shrunk);
          frame.text.top -= cut;
          fitAll();
        }

        render();
      };

      remeasure();
      stage.dataset.ready = "";

      const timeline = gsap.timeline({ defaults: { ease: "none" }, paused: true, onUpdate: render });
      const heroTitle = heroText.querySelector("[data-vanish]");
      const heroRest = gsap.utils.toArray<HTMLElement>("[data-hero-rest]", heroText);
      const hint = stage.querySelector("[data-hint]");

      hideText(timeline, heroTitle, 0.25, 0.8);
      hideRest(timeline, heroRest, 0.3);
      if (hint) timeline.fromTo(hint, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 0);
      timeline
        .to(state, { hero: 0, duration: 1.1, ease: "power3.inOut" }, 0.4)
        .to(state, { ring: 1, duration: 1.1, ease: "power2.out" }, 0.6)
        .to(state, { angle: -30, duration: 1.2, ease: "power1.inOut" }, 0.45)
        .to(state, { angle: 90, duration: 1.2, ease: "power1.inOut" }, 1.7)
        .to(state, { tilt: 1, duration: 1.1, ease: "power2.inOut" }, 3.0)
        .to(state, { angle: 210, duration: 1.6, ease: "power1.inOut" }, 3.0)
        .to(state, { angle: 260, duration: 0.6 }, 4.6);

      const messageBoxes = gsap.utils.toArray<HTMLElement>("[data-message]", messages);

      MESSAGES.forEach((message, index) => {
        const box = messageBoxes[index];
        if (!box) return;
        const text = box.querySelector("[data-vanish]");
        const kicker = box.querySelector("[data-kicker]");
        timeline.set(box, { autoAlpha: 1 }, message.at);
        showText(timeline, text, message.at + 0.05);
        if (kicker) showRest(timeline, [kicker], message.at);
        hideText(timeline, text, message.leave);
        if (kicker) hideRest(timeline, [kicker], message.leave + 0.05);
        timeline.set(box, { autoAlpha: 0 }, message.leave + 0.6);
      });

      timeline.addLabel(PLACES_LABEL, PLACE_START + 0.9);
      timeline.to(state, { mini: 1, duration: 1, ease: "power2.inOut" }, PLACE_START);

      places.forEach((place) => {
        const index = Number(place.dataset.place);
        const at = PLACE_START + (index - 1) * PLACE_STEP;
        const title = place.querySelector("[data-vanish]");
        const rest = gsap.utils.toArray<HTMLElement>("[data-reveal]", place);

        timeline.to(
          state.open,
          {
            [index]: 1,
            duration: 1,
            ease: "power3.inOut",
            onStart: () => {
              if (!order.includes(index)) order.push(index);
            },
          },
          at,
        );
        timeline.to(state, { side: photoOnLeft(index) ? 1 : 0, duration: 0.9, ease: "power2.inOut" }, at);
        timeline.to(state, { angle: "+=80", duration: 1.6 }, at + 0.2);
        timeline.set(place, { autoAlpha: 1 }, at + 0.6);
        showText(timeline, title, at + 0.65);
        showRest(timeline, rest, at + 0.7);
        hideText(timeline, title, at + 2.05);
        hideRest(timeline, rest, at + 2.1);
        timeline.to(state.open, { [index]: 0, duration: 0.6, ease: "power2.in" }, at + 2.1);
        timeline.set(place, { autoAlpha: 0 }, at + 2.5);
      });

      const closingAt = PLACE_START + places.length * PLACE_STEP;
      const closing = messageBoxes[MESSAGES.length];
      timeline
        .to(state, { mini: 0, duration: 1, ease: "power2.inOut" }, closingAt)
        .to(state, { angle: "+=120", duration: 1.8, ease: "power1.inOut" }, closingAt);

      if (closing) {
        const text = closing.querySelector("[data-vanish]");
        const kicker = closing.querySelector("[data-kicker]");
        timeline.set(closing, { autoAlpha: 1 }, closingAt + 0.5);
        showText(timeline, text, closingAt + 0.55);
        if (kicker) showRest(timeline, [kicker], closingAt + 0.5);
        hideText(timeline, text, closingAt + 1.6);
        if (kicker) hideRest(timeline, [kicker], closingAt + 1.65);
      }

      timeline.to(state, { gone: 1, duration: 0.5 }, closingAt + 1.7);
      timeline.to({}, { duration: 0.1 }, closingAt + 2.2);

      const length = () => {
        const compact = window.innerWidth < COMPACT_WIDTH;
        return window.innerHeight * timeline.duration() * (compact ? 0.75 : 1) * paceRef.current;
      };

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${length()}`,
        pin: true,
        pinSpacing: true,
        scrub: window.innerWidth < COMPACT_WIDTH ? 0.35 : 0.6,
        animation: timeline,
        onRefresh: remeasure,
        onUpdate: () => {
          heroText.inert = timeline.time() > 0.6;
        },
      });

      const toTime = (time: number) =>
        trigger.start + (time / timeline.duration()) * (trigger.end - trigger.start);

      const dropOpening = setAnchor("abertura", () => trigger.start);
      const dropJourney = setAnchor("percurso", () => toTime(timeline.labels[PLACES_LABEL] + 0.3));

      return () => {
        dropOpening();
        dropJourney();
      };
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="abertura" className={styles.root} aria-label="Abertura e percurso">
      <div ref={stageRef} className={styles.stage}>
        <div ref={heroRef} className={styles.hero}>
          <span className={styles.heroSlot} data-hero-slot aria-hidden="true" />
          <span className={styles.kicker} data-hero-rest>
            {HERO_TEXT.kicker}
          </span>
          <VanishText
            as="h1"
            className={styles.title}
            parts={[HOTEL.headline[0], { accent: HOTEL.headline[1] }]}
          />
          <p className={styles.lead} data-hero-rest>
            {HERO_TEXT.lead}
          </p>
          <div className={styles.actions} data-hero-rest>
            <PlaceLink place={HOTEL} label="Ver o hotel em 3D" />
            <SectionLink href="#percurso" className={styles.discover}>
              Descobrir
            </SectionLink>
          </div>
          <p className={styles.facts} data-hero-rest>
            {HERO_TEXT.facts}
          </p>
        </div>

        <div className={styles.ring} aria-hidden="true">
          {RING_PLACES.map((place, index) => (
            <span
              key={place.id}
              ref={(element) => {
                fragments.current[index] = element;
              }}
              className={styles.fragment}
            >
              <PhotoFragment
                className={styles.photo}
                photo={place.photo}
                shard={place.shard}
                alt=""
                sizes="(min-width: 900px) 48vw, 92vw"
                priority={index === 0}
              />
            </span>
          ))}
        </div>

        <div ref={messagesRef} className={styles.messages}>
          {[...MESSAGES, CLOSING_MESSAGE].map((message) => (
            <div key={message.kicker} className={styles.message} data-message>
              <span className={styles.messageKicker} data-kicker>
                {message.kicker}
              </span>
              <VanishText className={styles.messageText} parts={message.parts} />
            </div>
          ))}
        </div>

        <JourneySection />

        <span className={styles.hint} data-hint aria-hidden="true">
          Role para descobrir
        </span>
      </div>
    </section>
  );
}

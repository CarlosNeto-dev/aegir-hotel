"use client";

import { useEffect, useRef, useState } from "react";
import {
  SUITES,
  formatPrice,
  type Place,
} from "@/app/_shared/lib/data/places";
import { gsap, ScrollTrigger, useGSAP } from "@/app/_shared/lib/gsap";
import { headerBottom as measureHeader } from "@/app/_shared/lib/header-bottom";
import { savedPace, scrollPace } from "@/app/_shared/lib/motion";
import { scrollToY } from "@/app/_shared/lib/section-nav";
import { clamp } from "@/app/_shared/lib/scroll-frame";
import { useSettings } from "@/app/_shared/panels/settings-panel/SettingsProvider/SettingsProvider";
import SectionLink from "@/app/_shared/site-header/header-utils/SectionLink/SectionLink";
import { fitText } from "../../main-utils/fit-text";
import FactList from "../../main-utils/FactList/FactList";
import PhotoFragment from "../../main-utils/PhotoFragment/PhotoFragment";
import PlaceLink from "../../main-utils/PlaceLink/PlaceLink";
import VanishText from "../../main-utils/VanishText/VanishText";
import styles from "./SuitesSection.module.scss";

const COMPACT_WIDTH = 900;
const DESIGN_WIDTH = 1440;
const MAX_UNIT = 1.78;
const PHOTO_RATIO = 0.72;
const ASIDE_ROOM = 40;
const CAPSULE_ROOM = 96;
const STEP = 1.6;
const MIN_SCENE = 70;
const GOOD_SCENE = 160;

type SuitesSectionProps = {
  onChoose: (suite: Place) => void;
};

function px(value: number) {
  return `${value.toFixed(1)}px`;
}

function layout(
  root: HTMLElement,
  heading: HTMLElement,
  articles: HTMLElement[],
  tight = false,
  pass = 0,
): { compact: boolean; radius: number } {
  if (tight) root.dataset.tight = "";
  else delete root.dataset.tight;

  const width = root.clientWidth;
  const height = root.clientHeight;
  const compact = width < COMPACT_WIDTH;
  const unit = compact ? 1 : clamp(width / DESIGN_WIDTH, 1, MAX_UNIT);
  const gutter = parseFloat(getComputedStyle(root).paddingLeft) || 20;
  const headerBottom = measureHeader();
  const set = (name: string, value: number) => root.style.setProperty(name, px(value));

  set("--head-top", headerBottom + (compact ? 16 : 24 * unit));
  const headBottom = tight
    ? headerBottom
    : heading.getBoundingClientRect().bottom - root.getBoundingClientRect().top;

  let sceneLeft: number;
  let sceneTop: number;
  let sceneW: number;
  let sceneH: number;
  let textTop: number;
  let textBottom: number;

  if (compact) {
    sceneLeft = gutter;
    sceneTop = headBottom + 16;
    sceneW = width - gutter * 2;
    sceneH = Math.min(sceneW * PHOTO_RATIO, height * 0.38);
    sceneW = sceneH / PHOTO_RATIO;
    sceneLeft = (width - sceneW) / 2;
    textTop = sceneTop + sceneH + 44;
    textBottom = CAPSULE_ROOM;
    set("--text-left", gutter);
    set("--text-right", gutter);
    set("--head-left", gutter);
    set("--head-right", gutter);
  } else {
    const virtualW = width / unit;
    const textWidth = clamp(virtualW * 0.34, 360, 600) * unit;
    const gap = clamp(virtualW * 0.045, 44, 96) * unit;
    const free = width - gutter * 2 - ASIDE_ROOM * unit - textWidth - gap;
    const room = height - headBottom - 24 * unit - 72 * unit;
    sceneH = Math.min(room, free * PHOTO_RATIO);
    sceneW = Math.min(free, sceneH / PHOTO_RATIO);
    const spare = (free - sceneW) / 2;
    sceneLeft = gutter + ASIDE_ROOM * unit + spare;
    sceneTop = headBottom + 24 * unit + (room - sceneH) / 2;
    textTop = headerBottom + 24 * unit;
    textBottom = 64 * unit;
    set("--text-left", width - gutter - spare - textWidth);
    set("--text-right", gutter + spare);
    set("--head-left", sceneLeft);
    set("--head-right", gutter + spare + textWidth + gap);

    const settled = heading.getBoundingClientRect().bottom - root.getBoundingClientRect().top;
    if (!tight && pass < 2 && Math.abs(settled - headBottom) > 1) {
      return layout(root, heading, articles, tight, pass + 1);
    }
  }

  set("--text-bottom", textBottom);

  const fitAll = () => {
    const room = height - textTop - textBottom;
    return articles.reduce((worst, article) => {
      const content = article.firstElementChild;
      if (!(content instanceof HTMLElement)) return worst;
      set("--text-top", textTop);
      fitText(article, content, room);
      return Math.max(worst, content.offsetHeight - room);
    }, 0);
  };

  const missing = fitAll();
  if (compact && !tight && missing > 0 && sceneH - missing < GOOD_SCENE) {
    return layout(root, heading, articles, true);
  }
  if (missing > 0 && compact) {
    const cut = Math.min(missing + 8, sceneH - MIN_SCENE);
    sceneH -= cut;
    sceneW = sceneH / PHOTO_RATIO;
    sceneLeft = (width - sceneW) / 2;
    textTop -= cut;
    if (fitAll() > 0 && !tight) return layout(root, heading, articles, true);
  }

  set("--scene-left", sceneLeft);
  set("--scene-top", sceneTop);
  set("--scene-w", sceneW);
  set("--scene-h", sceneH);
  set("--dash-top", sceneTop + sceneH + (compact ? 12 : 20 * unit));
  set("--text-top", textTop);
  root.style.setProperty("--depth", px(1800 * unit));

  return { compact, radius: sceneW / (2 * Math.tan(Math.PI / SUITES.length)) };
}

export default function SuitesSection({ onChoose }: SuitesSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const prismRef = useRef<HTMLDivElement>(null);
  const faces = useRef<(HTMLSpanElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const goToRef = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);
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
      const heading = headingRef.current;
      const prism = prismRef.current;
      if (!root || !heading || !prism) return;
      paceRef.current = savedPace(paceRef.current);

      const articles = gsap.utils.toArray<HTMLElement>("[data-suite]", root);
      const turn = { p: 0 };
      const angle = 360 / SUITES.length;
      let geometry = layout(root, heading, articles);
      let shown = 0;

      const render = () => {
        const { radius } = geometry;
        prism.style.transform = `translateZ(${-radius}px) rotateY(${-turn.p * angle}deg)`;
        faces.current.forEach((face, index) => {
          if (!face) return;
          face.style.transform = `rotateY(${index * angle}deg) translateZ(${radius}px)`;
        });
        bars.current.forEach((bar, index) => {
          if (bar) bar.style.transform = `scaleX(${clamp(turn.p - index + 1).toFixed(3)})`;
        });
        const current = Math.round(turn.p);
        if (current !== shown) {
          shown = current;
          setActive(current);
        }
      };

      const remeasure = () => {
        geometry = layout(root, heading, articles);
        render();
      };

      gsap.set(articles[0], { autoAlpha: 1 });

      const timeline = gsap.timeline({ defaults: { ease: "none" }, paused: true, onUpdate: render });

      articles.forEach((article, index) => {
        const at = index * STEP;
        const title = article.querySelector("[data-vanish]");
        const rest = gsap.utils.toArray<HTMLElement>("[data-reveal]", article);

        if (index > 0) {
          timeline.set(article, { autoAlpha: 1 }, at);
          if (title) timeline.fromTo(title, { "--in": 0 }, { "--in": 1, duration: 0.5, ease: "power2.out" }, at + 0.02);
          timeline.fromTo(
            rest,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" },
            at + 0.1,
          );
        }

        if (index < articles.length - 1) {
          if (title) {
            timeline.fromTo(
              title,
              { "--out": 0 },
              { "--out": 1, duration: 0.45, ease: "power2.in", immediateRender: false },
              at + 1.1,
            );
          }
          timeline.fromTo(
            rest,
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: -14, duration: 0.25, stagger: 0.03, immediateRender: false },
            at + 1.12,
          );
          timeline.set(article, { autoAlpha: 0 }, at + 1.5);
          timeline.to(turn, { p: index + 1, duration: 1, ease: "power2.inOut" }, at + 1);
        }
      });

      timeline.to({}, { duration: 0.4 });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (window.innerWidth < COMPACT_WIDTH ? 3.2 : 4) * paceRef.current}`,
        pin: true,
        pinSpacing: true,
        scrub: window.innerWidth < COMPACT_WIDTH ? 0.35 : 0.6,
        animation: timeline,
        onRefresh: remeasure,
      });

      goToRef.current = (index: number) => {
        const time = index * STEP + 0.5;
        scrollToY(trigger.start + (time / timeline.duration()) * (trigger.end - trigger.start));
      };

      remeasure();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="suites" className={styles.root} aria-labelledby="suites-title">
      <div ref={headingRef} className={styles.heading}>
        <span className={styles.kicker}>Suítes</span>
        <h2 id="suites-title" className={styles.headline}>
          Três jeitos de dormir <em>de frente para o mar.</em>
        </h2>
      </div>

      <div className={styles.scene} aria-hidden="true">
        <div ref={prismRef} className={styles.prism}>
          {SUITES.map((suite, index) => (
            <span
              key={suite.id}
              ref={(element) => {
                faces.current[index] = element;
              }}
              className={styles.face}
            >
              <PhotoFragment
                className={styles.photo}
                photo={suite.photo}
                shard={suite.shard}
                alt=""
                sizes="(min-width: 900px) 46vw, 92vw"
              />
            </span>
          ))}
        </div>
      </div>

      <ol className={styles.dashes}>
        {SUITES.map((suite, index) => (
          <li key={suite.id}>
            <button
              type="button"
              className={styles.dash}
              aria-label={suite.title}
              aria-current={index === active ? "step" : undefined}
              onClick={() => goToRef.current(index)}
            >
              <span
                ref={(element) => {
                  bars.current[index] = element;
                }}
              />
            </button>
          </li>
        ))}
      </ol>

      {SUITES.map((suite) => (
        <article key={suite.id} className={styles.suite} data-suite aria-label={suite.title}>
          <div className={styles.content}>
            <span className={styles.kicker} data-reveal>
              {suite.kicker}
            </span>
            <VanishText as="h3" className={styles.title} parts={[suite.title]} />
            {suite.price && (
              <p className={styles.price} data-reveal>
                <span>desde</span>
                <b>{formatPrice(suite.price)}</b>
                <span>por noite</span>
              </p>
            )}
            <p className={styles.summary} data-reveal>
              {suite.summary}
            </p>
            <p className={styles.description} data-reveal>
              {suite.description}
            </p>
            <div className={styles.facts} data-reveal>
              <FactList facts={suite.facts} />
            </div>
            <div className={styles.actions} data-reveal>
              <PlaceLink place={suite} label="Ver em 3D" />
              <SectionLink
                href="#reserva"
                className={styles.book}
                onNavigate={() => onChoose(suite)}
              >
                Reservar
              </SectionLink>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ACTIONS, CTA, NAV_ITEMS } from "../header-utils/header-items";
import type { SectionId } from "../header-utils/header-items";
import HeaderBrand from "../header-utils/HeaderBrand/HeaderBrand";
import {
  IconClose,
  IconMenu,
  IconSettings,
  IconUser,
} from "../header-utils/HeaderIcons/HeaderIcons";
import styles from "./SiteHeaderMobile.module.scss";

type SiteHeaderMobileProps = { activeId?: SectionId };

const TABLET_MIN = 700;
const CARD_STEP = 74;
const CARD_ANGLE = 12;
const total = NAV_ITEMS.length;

function nearest(value: number) {
  return (((value % total) + total * 1.5) % total) - total / 2;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function SiteHeaderMobile({ activeId }: SiteHeaderMobileProps) {
  const menuId = useId();
  const currentIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) => item.id === activeId),
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentIndex);
  const [dragShift, setDragShift] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const dragStart = useRef<number | null>(null);
  const didDrag = useRef(false);

  const position = selected + dragShift;
  const shownIndex = ((Math.round(position) % total) + total) % total;
  const shown = NAV_ITEMS[shownIndex];

  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${TABLET_MIN}px)`);
    function closeOnTablet(event: MediaQueryListEvent) {
      if (event.matches) setIsOpen(false);
    }
    query.addEventListener("change", closeOnTablet);
    return () => query.removeEventListener("change", closeOnTablet);
  }, []);

  function toggleMenu() {
    if (!isOpen) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
      setSelected(currentIndex);
    }
    setIsOpen(!isOpen);
  }

  function goTo(id: string) {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function handleCardClick(index: number) {
    if (didDrag.current) return;
    if (index === selected) {
      goTo(NAV_ITEMS[index].id);
      return;
    }
    setSelected(index);
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    dragStart.current = event.clientX;
    didDrag.current = false;
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (dragStart.current === null) return;
    const delta = event.clientX - dragStart.current;
    if (!didDrag.current && Math.abs(delta) < 7) return;
    if (!didDrag.current) {
      didDrag.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setDragShift(-delta / CARD_STEP);
  }

  function handlePointerEnd() {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (!didDrag.current) return;
    setSelected(shownIndex);
    setDragShift(0);
    setIsDragging(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") setSelected((selected + 1) % total);
    if (event.key === "ArrowLeft") setSelected((selected - 1 + total) % total);
  }

  return (
    <div className={styles.root}>
      <div className={styles.brand}>
        <HeaderBrand />
      </div>

      <div className={styles.toggle}>
        <button
          type="button"
          className={styles.button}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={toggleMenu}
        >
          {isOpen ? <IconClose /> : <IconMenu />}
        </button>

        <div
          id={menuId}
          className={`${styles.menu} ${isOpen ? styles.open : ""}`}
        >
          <div className={styles.info}>
            <span className={styles.counter}>
              {pad(shownIndex + 1)} / {pad(total)}
              {shownIndex === currentIndex ? " · Você está aqui" : ""}
            </span>
            <h2 className={styles.title}>{shown.label}</h2>
            <p className={styles.summary}>{shown.summary}</p>
          </div>

          <nav
            className={`${styles.stage} ${isDragging ? styles.dragging : ""}`}
            aria-label="Seções da página"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onKeyDown={handleKeyDown}
          >
            {NAV_ITEMS.map((item, index) => {
              const offset = nearest(index - position);
              const distance = Math.abs(offset);
              const lift = Math.max(0, 1 - distance);

              return (
                <button
                  key={item.id}
                  type="button"
                  className={styles.card}
                  aria-label={item.label}
                  aria-current={index === shownIndex}
                  tabIndex={distance < 2.5 ? 0 : -1}
                  style={{
                    backgroundImage: `url(${item.photo})`,
                    transform: `rotate(${offset * CARD_ANGLE}deg) translateY(calc(var(--card-h) * ${-0.26 * lift})) scale(${1 + 0.06 * lift})`,
                    opacity: Math.max(0, Math.min(1, (2.95 - distance) / 0.55)),
                    zIndex: 100 - Math.round(distance * 10),
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  {index === currentIndex && (
                    <span className={styles.cardHere}>Aqui</span>
                  )}
                  <span className={styles.cardText}>
                    <small>{pad(index + 1)}</small>
                    <b>{item.label}</b>
                  </span>
                </button>
              );
            })}
          </nav>

          <p className={styles.progress}>
            Você já viu <b>{progress}%</b> da página
          </p>

          <div className={styles.foot}>
            <a
              className={styles.cta}
              href={CTA.href}
              onClick={() => setIsOpen(false)}
            >
              {CTA.label}
            </a>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          aria-label={ACTIONS.settings.label}
          aria-controls={ACTIONS.settings.controls}
          aria-expanded={false}
        >
          <IconSettings />
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label={ACTIONS.account.label}
          aria-controls={ACTIONS.account.controls}
          aria-expanded={false}
        >
          <IconUser />
        </button>
      </div>
    </div>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { CTA, NAV_ITEMS } from "../header-utils/header-items";
import HeaderBrand from "../header-utils/HeaderBrand/HeaderBrand";
import HeaderAccount from "../header-utils/HeaderAccount/HeaderAccount";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconMenu,
} from "../header-utils/HeaderIcons/HeaderIcons";
import LequeHint from "../header-utils/LequeHint/LequeHint";
import SectionLink from "../header-utils/SectionLink/SectionLink";
import { useActiveId } from "../header-hooks/ActiveSectionProvider";
import { scrollToSection } from "../header-hooks/scroll-to-section";
import { usePanels } from "../../panels/PanelProvider/PanelProvider";
import styles from "./SiteHeaderMobile.module.scss";

const TABLET_MIN = 768;
const CARD_STEP = 74;
const CARD_ANGLE = 12;
const HINT_IDLE_MS = 3000;
const total = NAV_ITEMS.length;

function nearest(value: number) {
  return (((value % total) + total * 1.5) % total) - total / 2;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function SiteHeaderMobile() {
  const menuId = useId();
  const pathname = usePathname();
  const router = useRouter();
  const activeId = useActiveId();
  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeId);
  const currentIndex = Math.max(0, activeIndex);

  const { layer, open, close } = usePanels();
  const isOpen = layer === "menu";
  const [selected, setSelected] = useState(currentIndex);
  const [dragShift, setDragShift] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintRun, setHintRun] = useState(0);
  const hintTimer = useRef<number | null>(null);
  const dragStart = useRef<number | null>(null);
  const didDrag = useRef(false);

  const position = selected + dragShift;
  const shownIndex = ((Math.round(position) % total) + total) % total;
  const shown = NAV_ITEMS[shownIndex];

  const scheduleHint = useCallback(() => {
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => {
      setHintRun((run) => run + 1);
      setShowHint(true);
    }, HINT_IDLE_MS);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setShowHint(false);
      return;
    }
    scheduleHint();
    return () => {
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    };
  }, [isOpen, scheduleHint]);

  useEffect(() => {
    if (!isOpen) return;
    const query = window.matchMedia(`(min-width: ${TABLET_MIN}px)`);
    function closeOnTablet(event: MediaQueryListEvent) {
      if (event.matches) close();
    }
    query.addEventListener("change", closeOnTablet);
    return () => query.removeEventListener("change", closeOnTablet);
  }, [isOpen, close]);

  function toggleMenu() {
    if (isOpen) {
      close();
      return;
    }
    setSelected(currentIndex);
    open("menu");
  }

  function registerActivity() {
    setShowHint(false);
    scheduleHint();
  }

  function goBy(step: number) {
    registerActivity();
    setSelected((selected + step + total) % total);
  }

  function goTo(id: string) {
    close();
    if (pathname === "/") {
      scrollToSection(id);
      return;
    }
    router.push(`/#${id}`);
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
    registerActivity();
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
    if (event.key === "ArrowRight") goBy(1);
    if (event.key === "ArrowLeft") goBy(-1);
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
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={toggleMenu}
        >
          {isOpen ? <IconClose /> : <IconMenu />}
          <span>{isOpen ? "Fechar" : "Menu"}</span>
        </button>

        <div
          id={menuId}
          className={`${styles.menu} ${isOpen ? styles.open : ""}`}
        >
          <div className={styles.info}>
            <span className={styles.counter}>
              {pad(shownIndex + 1)} / {pad(total)}
              {shownIndex === activeIndex ? " · Você está aqui" : ""}
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
                  {index === activeIndex && (
                    <span className={styles.cardHere}>Aqui</span>
                  )}
                  <span className={styles.cardText}>
                    <small>{pad(index + 1)}</small>
                    <b>{item.label}</b>
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              className={`${styles.arrow} ${styles.prev}`}
              aria-label="Seção anterior"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => goBy(-1)}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              aria-label="Próxima seção"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => goBy(1)}
            >
              <IconChevronRight />
            </button>

            {isOpen && showHint && (
              <LequeHint key={hintRun} onDone={registerActivity} />
            )}
          </nav>

          <div className={styles.foot}>
            <SectionLink
              href={CTA.href}
              className={styles.cta}
              onNavigate={close}
            >
              {CTA.label}
            </SectionLink>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <HeaderAccount />
      </div>
    </div>
  );
}

import type Lenis from "lenis";
import { gsap } from "../lib/gsap";

/*
 * Rolagem contínua pelas setas do teclado (e pelo controle remoto da TV, que
 * manda as mesmas teclas).
 *
 * O problema: sem isso, segurar a seta para baixo rola um passo, PARA por uns
 * 0,5 s (o atraso de repetição de tecla do sistema) e só então continua. Nas
 * cenas presas da landing isso aparecia como um "engasgo" na animação.
 *
 * A solução: a seta não rola "passos". Enquanto ela está apertada, a página
 * ganha uma velocidade que sobe suave até o máximo; ao soltar, a velocidade
 * cai suave até zero. As repetições da tecla são ignoradas, então não há
 * pausa. Um toque rápido (como no controle) vira um passo macio.
 */
const MAX_SPEED = 1300; // pixels por segundo com a tecla segurada
const SPEED_UP = 7; // quão rápido chega na velocidade máxima
const SLOW_DOWN = 8; // quão rápido para ao soltar
// O empurrão de cada nova apertada: mesmo um toque rapidíssimo (como o do
// controle remoto) desliza uns 90px, macio, em vez de quase nada.
const TAP_SPEED = 720;
const KEYS: Record<string, 1 | -1> = { ArrowDown: 1, ArrowUp: -1 };

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.matches("input, textarea, select, [role='slider'], [role='listbox'], [role='radiogroup']")
  );
}

export function startKeyboardScroll(getLenis: () => Lenis | null, blocked: () => boolean) {
  let direction = 0; // -1, 0 ou 1: qual seta está apertada agora
  let speed = 0;
  let position = 0;
  let running = false;

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  const step = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 50) / 1000;
    const target = direction * MAX_SPEED;
    const rate = direction ? SPEED_UP : SLOW_DOWN;
    speed += (target - speed) * (1 - Math.exp(-rate * dt));

    position = Math.min(maxScroll(), Math.max(0, position + speed * dt));
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(position, { immediate: true, force: true });
    else window.scrollTo(0, position);

    const atEdge = position <= 0 || position >= maxScroll();
    if (!direction && (Math.abs(speed) < 4 || atEdge)) {
      speed = 0;
      running = false;
      gsap.ticker.remove(step);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const dir = KEYS[event.key];
    if (!dir || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (blocked() || isTyping(event.target)) return;
    event.preventDefault();
    if (event.repeat && direction === dir) return;
    direction = dir;
    if (Math.sign(speed) !== dir || Math.abs(speed) < TAP_SPEED) speed = dir * TAP_SPEED;
    if (!running) {
      running = true;
      position = getLenis()?.scroll ?? window.scrollY;
      gsap.ticker.add(step);
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (KEYS[event.key] === direction) direction = 0;
  };

  const release = () => {
    direction = 0;
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", release);
  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", release);
    gsap.ticker.remove(step);
  };
}

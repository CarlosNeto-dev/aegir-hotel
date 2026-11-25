import { PLACES } from "@/app/_shared/lib/data/places";
import { headerBottom } from "@/app/_shared/lib/header-bottom";
import { clamp, ease, lerp } from "@/app/_shared/lib/scroll-frame";

/*
 * A conta do fechamento: uma dupla hélice (o "DNA" do hotel) feita com os
 * 14 fragmentos. Duas fitas em onda, uma espelho da outra; os fragmentos se
 * alternam entre as fitas ao longo de um eixo. A rolagem gira a hélice.
 *
 * Profundidade sem transparência: a foto "da frente" fica um pouco maior e
 * por cima; nenhuma foto fica translúcida. A frase fica no alto e a hélice
 * ocupa o espaço que sobra até a borda de baixo, sem encostar em nada.
 *
 * Em tela deitada o eixo é horizontal; em tela em pé (celular, tablet), vertical.
 * Tudo em coordenadas da tela, porque os fragmentos ficam numa camada fixa
 * e depois pousam nas fotos do rodapé.
 */

export const COMPACT_WIDTH = 760;
const FRAGMENT_RATIO = 0.78;
const COUNT = PLACES.length;
const RUNGS_PER_GAP = 2;

export type ClosingState = {
  build: number; // 0 → 1: os fragmentos chegam e a hélice se monta
  twist: number; // radianos: quanto a hélice já girou
};

export type ClosingFrame = {
  vertical: boolean;
  width: number;
  height: number;
  fragW: number;
  fragH: number;
  messageTop: number;
  axisStart: number;
  axisEnd: number;
  center: number; // centro no eixo cruzado (y no computador, x no celular)
  amplitude: number;
  wave: number; // radianos por pixel ao longo do eixo
};

export type Pose = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  opacity: number;
  z: number;
};

export function createClosingState(): ClosingState {
  return { build: 0, twist: 0 };
}

export function measureClosing(messageHeight: number): ClosingFrame {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const compact = width < COMPACT_WIDTH;
  /* Tela em pé (celular ou tablet na vertical): a hélice fica de pé também. */
  const vertical = compact || height > width * 1.1;
  const gutter = compact ? 14 : Math.max(28, width * 0.03);

  const messageTop = Math.max(headerBottom(), 0) + (compact ? 20 : 36);
  const bandTop = messageTop + messageHeight + (compact ? 28 : 40);
  const bandBottom = height - (compact ? 92 : 96);
  const band = Math.max(120, bandBottom - bandTop);

  if (vertical) {
    /* Em pé: eixo de cima para baixo, onda para os lados. */
    const fragW = clamp(band * 0.13, 40, compact ? 70 : 110);
    const fragH = fragW * FRAGMENT_RATIO;
    const axisStart = bandTop + fragH / 2;
    const axisEnd = bandTop + band - fragH / 2;
    return {
      vertical,
      width,
      height,
      fragW,
      fragH,
      messageTop,
      axisStart,
      axisEnd,
      center: width / 2,
      amplitude: Math.min(width / 2 - gutter - fragW / 2, Math.max(150, width * 0.28)),
      wave: (Math.PI * 2 * 1.4) / Math.max(1, axisEnd - axisStart),
    };
  }

  /* Deitada: eixo da esquerda para a direita, onda para cima e para baixo. */
  const spacing = (width - gutter * 2) / COUNT;
  const fragW = clamp(Math.min(spacing * 1.3, (band * 0.42) / FRAGMENT_RATIO), 70, 180);
  const fragH = fragW * FRAGMENT_RATIO;
  const axisStart = gutter + fragW / 2;
  const axisEnd = width - gutter - fragW / 2;
  return {
    vertical,
    width,
    height,
    fragW,
    fragH,
    messageTop,
    axisStart,
    axisEnd,
    center: bandTop + band / 2,
    amplitude: Math.max(24, band / 2 - fragH / 2),
    wave: (Math.PI * 2 * 1.25) / Math.max(1, axisEnd - axisStart),
  };
}

/* Converte (posição no eixo, deslocamento na onda) em coordenadas da tela. */
function toScreen(frame: ClosingFrame, along: number, across: number) {
  return frame.vertical
    ? { x: frame.center + across, y: along }
    : { x: along, y: frame.center + across };
}

/* Onde a fita (+1 ou -1) passa num ponto do eixo, e o quanto está "na frente". */
function strandAt(frame: ClosingFrame, state: ClosingState, along: number, side: 1 | -1) {
  const angle = state.twist + frame.wave * (along - frame.axisStart);
  return {
    across: side * Math.sin(angle) * frame.amplitude,
    depth: side * Math.cos(angle), // 1 = frente, -1 = fundo
  };
}

function alongOf(frame: ClosingFrame, order: number) {
  return lerp(frame.axisStart, frame.axisEnd, order / (COUNT - 1));
}

/* Quanto da hélice já se montou num ponto do eixo (0 → 1), da ponta inicial à final. */
function builtAt(frame: ClosingFrame, state: ClosingState, along: number) {
  const t = (along - frame.axisStart) / Math.max(1, frame.axisEnd - frame.axisStart);
  return ease(clamp(state.build * 1.6 - t * 0.6));
}

export function helixPose(order: number, frame: ClosingFrame, state: ClosingState): Pose {
  const side: 1 | -1 = order % 2 === 0 ? 1 : -1;
  const along = alongOf(frame, order);
  const { across, depth } = strandAt(frame, state, along, side);
  const enter = builtAt(frame, state, along);

  /* Cada fita chega de um lado da tela: uma por baixo, a outra por cima. */
  const far = (frame.vertical ? frame.width : frame.height) * 0.75 * side;
  const point = toScreen(frame, along, lerp(far, across, enter));
  const scale = 0.8 + 0.2 * ((depth + 1) / 2);

  return {
    x: point.x,
    y: point.y,
    w: frame.fragW * scale,
    h: frame.fragH * scale,
    rot: lerp(side * 18, depth * side * 4, enter),
    opacity: clamp(enter * 3),
    z: 10 + Math.round((depth + 1) * 5),
  };
}

/*
 * As linhas finas da hélice: as duas fitas e os "degraus" entre elas.
 * Só a parte já montada é desenhada.
 */
export function helixPaths(frame: ClosingFrame, state: ClosingState) {
  const length = frame.axisEnd - frame.axisStart;
  const line = (along: number) => {
    const a = toScreen(frame, along, strandAt(frame, state, along, 1).across);
    const b = toScreen(frame, along, strandAt(frame, state, along, -1).across);
    return { a, b };
  };

  const steps = 96;
  let strandA = "";
  let strandB = "";
  for (let i = 0; i <= steps; i += 1) {
    const along = frame.axisStart + (length * i) / steps;
    if (builtAt(frame, state, along) < 0.98) break;
    const { a, b } = line(along);
    const command = i === 0 ? "M" : "L";
    strandA += `${command}${a.x.toFixed(1)} ${a.y.toFixed(1)}`;
    strandB += `${command}${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }

  let rungs = "";
  const rungCount = (COUNT - 1) * RUNGS_PER_GAP;
  for (let i = 0; i <= rungCount; i += 1) {
    const along = frame.axisStart + (length * i) / rungCount;
    if (builtAt(frame, state, along) < 0.98) break;
    const { a, b } = line(along);
    rungs += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }

  return { strandA, strandB, rungs };
}

/* O alvo final: a foto do rodapé onde o fragmento pousa. */
export function slotPose(rect: DOMRect): Pose {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    w: rect.width,
    h: rect.height,
    rot: 0,
    opacity: 1,
    z: 30,
  };
}

export function blend(from: Pose, to: Pose, amount: number): Pose {
  return {
    x: lerp(from.x, to.x, amount),
    y: lerp(from.y, to.y, amount),
    w: lerp(from.w, to.w, amount),
    h: lerp(from.h, to.h, amount),
    rot: lerp(from.rot, to.rot, amount),
    opacity: lerp(from.opacity, to.opacity, amount),
    z: amount > 0.02 ? to.z : from.z,
  };
}

export function applyPose(element: HTMLElement, pose: Pose, visible: boolean) {
  if (!visible || pose.opacity < 0.01) {
    element.style.visibility = "hidden";
    return;
  }

  element.style.visibility = "visible";
  element.style.width = `${pose.w.toFixed(1)}px`;
  element.style.height = `${pose.h.toFixed(1)}px`;
  element.style.transform = `translate3d(${(pose.x - pose.w / 2).toFixed(1)}px, ${(pose.y - pose.h / 2).toFixed(1)}px, 0) rotate(${pose.rot.toFixed(2)}deg)`;
  element.style.zIndex = String(pose.z);
  element.style.opacity = pose.opacity.toFixed(3);
}

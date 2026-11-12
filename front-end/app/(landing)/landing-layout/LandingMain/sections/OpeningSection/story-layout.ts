import { headerBottom as measureHeader } from "@/app/_shared/lib/header-bottom";
import { clamp, lerp } from "@/app/_shared/lib/scroll-frame";

export const COMPACT_WIDTH = 700;
export const STACKED_WIDTH = 900;

const DESIGN_WIDTH = 1440;
const MAX_UNIT = 1.78;
const HERO_RATIO = 0.7;
const FRAGMENT_RATIO = 0.78;
const PLACE_RATIO = 0.72;
const ASIDE_ROOM = 40;
const CAPSULE_ROOM = 96;
const MINI_ROW_COMPACT = 64;
const MINI_ROW = 84;
const DEG = Math.PI / 180;

export type StoryState = {
  hero: number;
  ring: number;
  angle: number;
  tilt: number;
  mini: number;
  gone: number;
  side: number;
  open: number[];
};

export type Box = { x: number; y: number; w: number; h: number };

export type StoryFrame = {
  compact: boolean;
  stacked: boolean;
  width: number;
  height: number;
  unit: number;
  count: number;
  fragW: number;
  fragH: number;
  cx: number;
  cy: number;
  radius: number;
  radiusX: number;
  orbit: number;
  miniLeft: number;
  miniRight: number;
  miniY: number;
  hero: Box;
  place: Box[];
  text: { top: number; bottom: number; width: number; near: number; far: number };
};

type Pose = Box & {
  rot: number;
  ry: number;
  perspective: number;
  opacity: number;
  z: number;
};

export function createState(count: number): StoryState {
  return {
    hero: 1,
    ring: 0,
    angle: -90,
    tilt: 0,
    mini: 0,
    gone: 0,
    side: 0,
    open: Array.from({ length: count }, () => 0),
  };
}

export function photoOnLeft(index: number) {
  return index % 2 === 1;
}

type MeasureInput = {
  stage: HTMLElement;
  heroText: HTMLElement;
  messages: HTMLElement;
  count: number;
};

const HERO_GAP = 16;
const HERO_MIN = 140;

function placeCompactHero(heroText: HTMLElement, stageTop: number, maxWidth: number, height: number) {
  const slot = heroText.querySelector<HTMLElement>("[data-hero-slot]");
  if (!slot) return { top: 0, height: 0 };

  const fit = () => {
    slot.style.height = "0px";
    const slotTop = slot.getBoundingClientRect().top - stageTop;
    const rest = heroText.getBoundingClientRect().bottom - stageTop - slotTop;
    return height - CAPSULE_ROOM - slotTop - rest - HERO_GAP * 2;
  };

  delete heroText.dataset.tight;
  let room = fit();
  for (const level of ["facts", "lead", "discover"]) {
    if (room >= HERO_MIN) break;
    heroText.dataset.tight = level;
    room = fit();
  }

  const imageH = clamp(room, 70, maxWidth * HERO_RATIO);
  slot.style.height = `${imageH + HERO_GAP * 2}px`;
  const top = slot.getBoundingClientRect().top - stageTop + HERO_GAP;
  return { top, height: imageH };
}

function clearCompactHero(heroText: HTMLElement) {
  const slot = heroText.querySelector<HTMLElement>("[data-hero-slot]");
  if (slot) slot.style.height = "";
  delete heroText.dataset.tight;
}

const STACKED_MINI = 0.3;

function stackedPlaces(
  width: number,
  height: number,
  gutter: number,
  headerBottom: number,
  count: number,
  orbit: number,
  fragH: number,
) {
  const reach = (orbit * 0.25 + fragH * 0.75) * STACKED_MINI;
  const row = Math.max(MINI_ROW_COMPACT, reach * 2 + 24);
  const miniY = headerBottom + 12 + row / 2;
  const bandTop = headerBottom + 12 + row;
  const band = clamp(height * 0.3, 130, 280);
  const box: Box = { x: width / 2, y: bandTop + band / 2, w: width - gutter * 2, h: band };

  return {
    miniLeft: width / 2,
    miniRight: width / 2,
    miniY,
    place: Array.from({ length: count }, () => box),
    text: {
      top: bandTop + band + 20,
      bottom: CAPSULE_ROOM,
      width: width - gutter * 2,
      near: gutter,
      far: gutter,
    },
  };
}

export function measureStory({
  stage,
  heroText,
  messages,
  count,
}: MeasureInput): StoryFrame {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const compact = width < COMPACT_WIDTH;
  const unit = compact ? 1 : clamp(width / DESIGN_WIDTH, 1, MAX_UNIT);
  const gutter = parseFloat(getComputedStyle(stage).paddingLeft) || 20;
  const headerBottom = measureHeader();
  const stageTop = stage.getBoundingClientRect().top;

  if (compact) {
    const messagesBottom = messages.getBoundingClientRect().bottom - stageTop;
    const top = messagesBottom + 12;
    const avail = Math.max(160, height - top - CAPSULE_ROOM);
    const radius = Math.max(44, Math.min(width * 0.34, avail / 2 - 40));
    const fragW = Math.min(112, width * 0.25, avail * 0.3, ((2 * Math.PI * radius) / count) * 0.78);

    const { top: heroTop, height: heroH } = placeCompactHero(heroText, stageTop, width - gutter * 2, height);


    return {
      compact,
      stacked: true,
      width,
      height,
      unit,
      count,
      fragW,
      fragH: fragW * FRAGMENT_RATIO,
      cx: width / 2,
      cy: top + avail / 2,
      radius,
      radiusX: radius,
      orbit: Math.min(width * 0.36, radius * 1.25),
      hero: { x: width / 2, y: heroTop + heroH / 2, w: heroH / HERO_RATIO, h: heroH },
      ...stackedPlaces(
        width,
        height,
        gutter,
        headerBottom,
        count,
        Math.min(width * 0.36, radius * 1.25),
        fragW * FRAGMENT_RATIO,
      ),
    };
  }

  clearCompactHero(heroText);

  const virtualW = width / unit;
  const virtualH = height / unit;
  const ringTop = headerBottom / unit + 24;
  const ringBottom = virtualH - 40;
  const ringMiddle = (ringTop + ringBottom) / 2;
  const fullRadius = Math.min(virtualW, virtualH) * 0.34;
  const fragW = Math.max(
    110,
    Math.min(220, virtualW * 0.15, virtualH * 0.22, ((2 * Math.PI * fullRadius) / count) * 0.8),
  );
  const radius = Math.min(fullRadius, (ringBottom - ringTop) / 2 - (fragW * FRAGMENT_RATIO) / 2 - 8);
  const radiusX = Math.max(radius, Math.min(virtualW * 0.33, radius * 1.7, 600));
  const innerWidth = Math.max(240, 2 * radiusX - fragW * 1.3 - 96) * unit;
  messages.style.setProperty("--message-width", `${innerWidth.toFixed(0)}px`);

  const textWidth = clamp(virtualW * 0.34, 360, 600);
  const gap = clamp(virtualW * 0.045, 44, 96);
  const free = virtualW - (gutter / unit) * 2 - ASIDE_ROOM - textWidth - gap;
  const textTop = headerBottom / unit + 32;
  const textBottom = 48;
  const photoTop = headerBottom / unit + 16 + MINI_ROW;
  const photoBottom = virtualH - textBottom;
  const placeH = Math.min(photoBottom - photoTop, free * PLACE_RATIO);
  const placeW = Math.min(free, placeH / PLACE_RATIO);
  const spare = (free - placeW) / 2;
  const leftEdge = gutter / unit + ASIDE_ROOM + spare;
  const rightEdge = virtualW - gutter / unit - spare;
  const placeY = (photoTop + photoBottom) / 2;

  const place = Array.from({ length: count }, (_, index): Box => ({
    x: (photoOnLeft(index) ? leftEdge + placeW / 2 : rightEdge - placeW / 2) * unit,
    y: placeY * unit,
    w: placeW * unit,
    h: placeH * unit,
  }));

  const heroW = Math.min(width * 0.46, (height - headerBottom - 120) / HERO_RATIO);

  const stacked = width < STACKED_WIDTH;

  return {
    compact,
    stacked,
    width,
    height,
    unit,
    count,
    fragW: fragW * unit,
    fragH: fragW * FRAGMENT_RATIO * unit,
    cx: width / 2,
    cy: ringMiddle * unit,
    radius: radius * unit,
    radiusX: radiusX * unit,
    orbit: Math.min(virtualW * 0.32, 480) * unit,
    miniLeft: (leftEdge + 100) * unit,
    miniRight: (rightEdge - 100) * unit,
    miniY: (headerBottom / unit + 16 + MINI_ROW / 2) * unit,
    hero: {
      x: width - gutter - heroW / 2,
      y: Math.max(headerBottom + (heroW * HERO_RATIO) / 2 + 16, height * 0.52),
      w: heroW,
      h: heroW * HERO_RATIO,
    },
    place,
    text: {
      top: textTop * unit,
      bottom: textBottom * unit,
      width: textWidth * unit,
      near: (gutter / unit + ASIDE_ROOM + spare) * unit,
      far: (gutter / unit + spare) * unit,
    },
    ...(stacked
      ? stackedPlaces(
          width,
          height,
          gutter,
          headerBottom,
          count,
          Math.min(virtualW * 0.32, 480) * unit,
          fragW * FRAGMENT_RATIO * unit,
        )
      : {}),
  };
}

function ringPose(index: number, frame: StoryFrame, state: StoryState): Pose {
  const step = 360 / frame.count;
  const angle = (state.angle + index * step) * DEG;
  const tilt = state.tilt;
  const radius = lerp(frame.radius, frame.orbit, tilt);
  const x = lerp(frame.radiusX, frame.orbit, tilt) * Math.cos(angle);
  const z = -radius * Math.sin(angle) * tilt;
  const y = lerp(frame.radius * Math.sin(angle), 0, tilt) - tilt * 0.2 * radius * Math.sin(angle);
  const depth = (frame.compact ? 900 : 1900) * frame.unit;
  const near = depth / (depth - z);
  const miniScale = lerp(1, frame.stacked ? STACKED_MINI : 0.15, state.mini);
  const miniX = lerp(frame.miniRight, frame.miniLeft, state.side);
  const cx = lerp(frame.cx, miniX, state.mini);
  const cy = lerp(frame.cy, frame.miniY, state.mini);
  const enter = index === 0 ? 1 : clamp(state.ring * 1.25 - (index - 1) * 0.045);
  const spread = lerp(2.4, 1, enter);
  const ry = (state.angle + index * step + 90) * tilt;
  const front = Math.cos(ry * DEG);
  const scale = near * lerp(1, 1.05, tilt) * miniScale;

  return {
    x: cx + x * near * spread * miniScale,
    y: cy + y * near * spread * miniScale,
    w: frame.fragW * scale,
    h: frame.fragH * scale,
    rot: lerp(index % 2 ? 7 : -7, 0, tilt) + (1 - enter) * 40,
    ry,
    perspective: depth * miniScale,
    opacity: enter * (front < 0 ? lerp(1, 0.45, tilt) : 1) * (1 - state.gone),
    z: (state.mini > 0.5 ? 61 : 10) + Math.round((z / Math.max(1, frame.orbit) + 1) * 4),
  };
}

function blend(from: Pose, to: Pose, amount: number): Pose {
  return {
    x: lerp(from.x, to.x, amount),
    y: lerp(from.y, to.y, amount),
    w: lerp(from.w, to.w, amount),
    h: lerp(from.h, to.h, amount),
    rot: lerp(from.rot, to.rot, amount),
    ry: lerp(from.ry, to.ry, amount),
    perspective: lerp(from.perspective, to.perspective, amount),
    opacity: lerp(from.opacity, to.opacity, amount),
    z: amount > 0.02 ? to.z : from.z,
  };
}

export function fragmentPose(
  index: number,
  frame: StoryFrame,
  state: StoryState,
  order: number,
): Pose {
  let pose = ringPose(index, frame, state);

  const grow = (amount: number, box: Box, z: number) => {
    const ry = Math.round(pose.ry / 360) * 360;
    pose = blend(pose, { ...box, rot: 0, ry, perspective: 1300 * frame.unit, opacity: 1, z }, amount);
  };

  if (index === 0 && state.hero > 0) grow(state.hero, frame.hero, 5);
  if (state.open[index] > 0) {
    grow(state.open[index], frame.place[index], 40 + order);
    pose.opacity = 1;
  }

  return pose;
}

export function applyPose(element: HTMLElement, pose: Pose) {
  if (pose.opacity < 0.01) {
    element.style.visibility = "hidden";
    return;
  }

  element.style.visibility = "visible";
  element.style.width = `${pose.w.toFixed(1)}px`;
  element.style.height = `${pose.h.toFixed(1)}px`;
  element.style.transform = `translate3d(${(pose.x - pose.w / 2).toFixed(1)}px, ${(pose.y - pose.h / 2).toFixed(1)}px, 0) perspective(${pose.perspective.toFixed(0)}px) rotateY(${pose.ry.toFixed(2)}deg) rotate(${pose.rot.toFixed(2)}deg)`;
  element.style.zIndex = String(pose.z);
  element.style.opacity = pose.opacity.toFixed(3);
}

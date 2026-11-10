export const COLOR_OPTIONS = [
  { id: "ink", label: "Tinta" },
  { id: "wood", label: "Madeira" },
  { id: "moss", label: "Musgo" },
  { id: "sea", label: "Mar" },
  { id: "sand", label: "Areia" },
  { id: "clay", label: "Terracota" },
] as const;

export const CURSOR_OPTIONS = [
  { id: "system", label: "Sistema" },
  { id: "circle", label: "Círculo" },
  { id: "ring", label: "Anel" },
  { id: "dot", label: "Ponto" },
  { id: "ring-dot", label: "Anel com ponto" },
  { id: "crosshair", label: "Mira" },
  { id: "diamond", label: "Diamante" },
  { id: "trail", label: "Rastro" },
] as const;

export const TOUCH_OPTIONS = [
  { id: "none", label: "Nenhum" },
  { id: "wave", label: "Onda" },
  { id: "ring", label: "Anel" },
  { id: "dot", label: "Ponto" },
  { id: "spark", label: "Brilho" },
] as const;

export const FOCUS_OPTIONS = [
  { id: "frame", label: "Moldura" },
  { id: "thick", label: "Moldura grossa" },
  { id: "glow", label: "Brilho" },
  { id: "fill", label: "Preenchido" },
] as const;

export const TEXT_SIZE_OPTIONS = [
  { id: "normal", label: "Normal" },
  { id: "large", label: "Grande" },
  { id: "larger", label: "Maior" },
] as const;

export const ACCESSIBILITY_SWITCHES = [
  {
    id: "reduceMotion",
    label: "Reduzir movimento",
    summary: "Corta as animações e as transições da página.",
  },
  {
    id: "highContrast",
    label: "Alto contraste",
    summary: "Textos secundários e bordas mais fortes.",
  },
  {
    id: "strongFocus",
    label: "Foco reforçado",
    summary: "A moldura de quem navega pelo teclado fica mais grossa.",
  },
] as const;

export const PRESET_OPTIONS = [
  {
    id: "light",
    label: "Leve",
    summary: "Para aparelhos mais simples: sem efeitos e com a página mais rápida.",
  },
  {
    id: "medium",
    label: "Médio",
    summary: "Barra de progresso e rolagem suave, sem o efeito das letras.",
  },
  {
    id: "heavy",
    label: "Pesado",
    summary: "Barra de progresso, rolagem suave e o efeito das letras.",
  },
] as const;

export const SPEED_OPTIONS = [
  { id: "slow", label: "Calma" },
  { id: "normal", label: "Normal" },
  { id: "fast", label: "Rápida" },
] as const;

export const GRAPHICS_SWITCHES = [
  {
    id: "progressBar",
    label: "Barra de progresso",
    summary: "A linha no topo da página. Sem ela, fica só o índice lateral.",
  },
  {
    id: "photoCut",
    label: "Recorte das fotos",
    summary: "As fotos em fragmentos. Sem ele, elas ficam retangulares.",
  },
  {
    id: "smoothScroll",
    label: "Rolagem suave",
    summary: "A roda do mouse desliza e para devagar, em vez de pular.",
  },
] as const;

export type ColorId = (typeof COLOR_OPTIONS)[number]["id"];
export type CursorId = (typeof CURSOR_OPTIONS)[number]["id"];
export type TouchId = (typeof TOUCH_OPTIONS)[number]["id"];
export type FocusId = (typeof FOCUS_OPTIONS)[number]["id"];
export type TextSizeId = (typeof TEXT_SIZE_OPTIONS)[number]["id"];
export type SwitchId = (typeof ACCESSIBILITY_SWITCHES)[number]["id"];
export type GraphicsId = (typeof GRAPHICS_SWITCHES)[number]["id"];
export type SpeedId = (typeof SPEED_OPTIONS)[number]["id"];
export type PresetId = (typeof PRESET_OPTIONS)[number]["id"];

export type Settings = {
  cursor: CursorId;
  cursorColor: ColorId;
  touch: TouchId;
  touchColor: ColorId;
  focus: FocusId;
  focusColor: ColorId;
  letters: boolean;
  speed: SpeedId;
  textSize: TextSizeId;
} & Record<GraphicsId, boolean> &
  Record<SwitchId, boolean>;

export type PresetValues = Pick<
  Settings,
  "cursor" | "letters" | "photoCut" | "progressBar" | "smoothScroll" | "speed"
>;

export const PRESETS: Record<PresetId, PresetValues> = {
  light: {
    cursor: "system",
    letters: false,
    photoCut: false,
    progressBar: false,
    smoothScroll: false,
    speed: "fast",
  },
  medium: {
    cursor: "system",
    letters: false,
    photoCut: false,
    progressBar: true,
    smoothScroll: true,
    speed: "normal",
  },
  heavy: {
    cursor: "system",
    letters: true,
    photoCut: false,
    progressBar: true,
    smoothScroll: true,
    speed: "normal",
  },
};

export const DEFAULT_SETTINGS: Settings = {
  ...PRESETS.medium,
  cursorColor: "ink",
  touch: "none",
  touchColor: "ink",
  focus: "frame",
  focusColor: "ink",
  textSize: "normal",
  reduceMotion: false,
  highContrast: false,
  strongFocus: false,
};

export const SETTINGS_KEY = "settings";

export function matchPreset(settings: Settings): PresetId | null {
  const match = PRESET_OPTIONS.find(({ id }) =>
    Object.entries(PRESETS[id]).every(
      ([key, value]) => settings[key as keyof PresetValues] === value,
    ),
  );

  return match?.id ?? null;
}

export function demoVideo(
  group: "cursor" | "touch" | "focus" | "letters",
  id: string,
) {
  return `/videos/settings/${group}-${id}`;
}

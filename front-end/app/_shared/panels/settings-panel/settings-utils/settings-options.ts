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

export type ColorId = (typeof COLOR_OPTIONS)[number]["id"];
export type CursorId = (typeof CURSOR_OPTIONS)[number]["id"];
export type TouchId = (typeof TOUCH_OPTIONS)[number]["id"];
export type FocusId = (typeof FOCUS_OPTIONS)[number]["id"];
export type TextSizeId = (typeof TEXT_SIZE_OPTIONS)[number]["id"];
export type SwitchId = (typeof ACCESSIBILITY_SWITCHES)[number]["id"];

export type Settings = {
  cursor: CursorId;
  cursorColor: ColorId;
  touch: TouchId;
  touchColor: ColorId;
  focus: FocusId;
  focusColor: ColorId;
  textSize: TextSizeId;
} & Record<SwitchId, boolean>;

export const DEFAULT_SETTINGS: Settings = {
  cursor: "system",
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

export function demoVideo(group: "cursor" | "touch" | "focus", id: string) {
  return `/videos/settings/${group}-${id}`;
}

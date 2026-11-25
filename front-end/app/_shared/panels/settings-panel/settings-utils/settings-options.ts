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

/* As fontes extras só são baixadas quando escolhidas (veja layout.tsx e _settings.scss). */
export const FONT_OPTIONS = [
  {
    id: "classic",
    label: "Clássica",
    hint: "Serifa de revista com texto limpo",
    title: "var(--font-title-web), Georgia, serif",
    body: "var(--font-body-web), system-ui, sans-serif",
  },
  {
    id: "elegant",
    label: "Elegante",
    hint: "Serifa fina e delicada",
    title: "var(--font-elegant-title), Georgia, serif",
    body: "var(--font-elegant-body), system-ui, sans-serif",
  },
  {
    id: "modern",
    label: "Moderna",
    hint: "Serifa forte e texto redondo",
    title: "var(--font-modern-title), Georgia, serif",
    body: "var(--font-modern-body), system-ui, sans-serif",
  },
  {
    id: "easy",
    label: "Leitura fácil",
    hint: "Letras bem diferentes entre si",
    title: "var(--font-easy), system-ui, sans-serif",
    body: "var(--font-easy), system-ui, sans-serif",
  },
] as const;


/* O formato das fotos do site inteiro (PhotoFragment), escolhido nos Ajustes. */
export const PHOTO_SHAPE_OPTIONS = [
  { id: "rounded", label: "Cantos redondos" },
  { id: "square", label: "Retas" },
  { id: "arch", label: "Arco" },
  { id: "fragment", label: "Fragmentos" },
] as const;

export const GRAPHICS_SWITCHES = [
  {
    id: "progressBar",
    label: "Barra de progresso",
    summary: "A linha no topo da página. Sem ela, fica só o índice lateral.",
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
export type FontId = (typeof FONT_OPTIONS)[number]["id"];
export type PhotoShapeId = (typeof PHOTO_SHAPE_OPTIONS)[number]["id"];
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
  font: FontId;
  photoShape: PhotoShapeId;
} & Record<GraphicsId, boolean> &
  Record<SwitchId, boolean>;

export type PresetValues = Pick<
  Settings,
  "cursor" | "letters" | "photoShape" | "progressBar" | "smoothScroll" | "speed"
>;

export const PRESETS: Record<PresetId, PresetValues> = {
  light: {
    cursor: "system",
    letters: false,
    photoShape: "rounded",
    progressBar: false,
    smoothScroll: false,
    speed: "fast",
  },
  medium: {
    cursor: "system",
    letters: false,
    photoShape: "rounded",
    progressBar: true,
    smoothScroll: true,
    speed: "normal",
  },
  heavy: {
    cursor: "system",
    letters: true,
    photoShape: "rounded",
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
  font: "classic",
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

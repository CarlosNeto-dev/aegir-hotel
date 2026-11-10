import {
  DEFAULT_SETTINGS,
  PRESETS,
  SETTINGS_KEY,
  type PresetValues,
  type Settings,
} from "./settings-options";

type DevicePresets = { weak: PresetValues; strong: PresetValues };

const DEVICE_PRESETS: DevicePresets = {
  weak: PRESETS.medium,
  strong: PRESETS.heavy,
};

export function readSettings(
  key: string,
  defaults: Settings,
  presets: DevicePresets,
): Settings {
  let saved = null;

  try {
    saved = JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {}

  if (saved) return Object.assign({}, defaults, saved);

  const device = navigator as Navigator & { deviceMemory?: number };
  const cores = device.hardwareConcurrency || 8;
  const memory = device.deviceMemory || 8;
  const weak = cores <= 4 || memory <= 4;

  return Object.assign({}, defaults, weak ? presets.weak : presets.strong);
}

export function applySettings(settings: Settings) {
  const root = document.documentElement;
  const flags = [
    ["letters", settings.letters],
    ["reduce-motion", settings.reduceMotion],
    ["high-contrast", settings.highContrast],
    ["strong-focus", settings.strongFocus],
  ] as const;

  root.dataset.cursor = settings.cursor;
  root.dataset.touch = settings.touch;
  root.dataset.focus = settings.focus;
  root.dataset.textSize = settings.textSize;
  root.dataset.speed = settings.speed;
  root.dataset.progressBar = settings.progressBar ? "on" : "off";
  root.dataset.photoCut = settings.photoCut ? "on" : "off";

  flags.forEach(([name, on]) => root.toggleAttribute(`data-${name}`, on));

  root.style.setProperty("--cursor-color", `var(--color-${settings.cursorColor})`);
  root.style.setProperty("--touch-color", `var(--color-${settings.touchColor})`);

  if (settings.focusColor === "ink") {
    root.style.removeProperty("--color-focus");
  } else {
    root.style.setProperty("--color-focus", `var(--color-${settings.focusColor})`);
  }
}

export function loadSettings() {
  return readSettings(SETTINGS_KEY, DEFAULT_SETTINGS, DEVICE_PRESETS);
}

export const settingsScript = `(function(read,apply){try{apply(read(${JSON.stringify(SETTINGS_KEY)},${JSON.stringify(DEFAULT_SETTINGS)},${JSON.stringify(DEVICE_PRESETS)}))}catch(e){}})(${readSettings.toString()},${applySettings.toString()})`;

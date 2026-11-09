import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  type Settings,
} from "./settings-options";

export function applySettings(settings: Settings) {
  const root = document.documentElement;
  const flags = [
    ["reduce-motion", settings.reduceMotion],
    ["high-contrast", settings.highContrast],
    ["strong-focus", settings.strongFocus],
  ] as const;

  root.dataset.cursor = settings.cursor;
  root.dataset.touch = settings.touch;
  root.dataset.focus = settings.focus;
  root.dataset.textSize = settings.textSize;

  flags.forEach(([name, on]) => root.toggleAttribute(`data-${name}`, on));

  root.style.setProperty("--cursor-color", `var(--color-${settings.cursorColor})`);
  root.style.setProperty("--touch-color", `var(--color-${settings.touchColor})`);

  if (settings.focusColor === "ink") {
    root.style.removeProperty("--color-focus");
  } else {
    root.style.setProperty("--color-focus", `var(--color-${settings.focusColor})`);
  }
}

export const settingsScript = `(function(apply){try{var saved=JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)})||"null");if(saved)apply(Object.assign(${JSON.stringify(DEFAULT_SETTINGS)},saved))}catch(e){}})(${applySettings.toString()})`;

"use client";

import { useEffect, useState } from "react";
import styles from "./SettingsDock.module.scss";

type Theme = "light" | "dark";

const SETTINGS_PANEL_ID = "painel-ajustes";

function IconMoon() {
  return (
    <svg
      className={styles.moon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg
      className={styles.sun}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}

export default function SettingsDock() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  const themeLabel = theme === "dark" ? "Tema claro" : "Tema escuro";

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        aria-label={themeLabel}
        onClick={toggleTheme}
      >
        <span className={styles.icon}>
          <IconMoon />
          <IconSun />
        </span>
        <span className={styles.text}>Tema</span>
      </button>

      <span className={styles.divider} aria-hidden="true" />

      <button
        type="button"
        className={`${styles.button} ${styles.settings}`}
        aria-label="Ajustes"
        aria-expanded={isSettingsOpen}
        aria-controls={SETTINGS_PANEL_ID}
        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
      >
        <IconSettings />
        <span className={styles.text}>Ajustes</span>
      </button>
    </div>
  );
}

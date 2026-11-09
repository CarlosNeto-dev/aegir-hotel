"use client";

import { useEffect, useState } from "react";
import { usePanels } from "../../panels/PanelProvider/PanelProvider";
import styles from "./ThemeToggle.module.scss";

type Theme = "light" | "dark";

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

export default function ThemeToggle() {
  const { layer } = usePanels();
  const [theme, setTheme] = useState<Theme>("light");

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

  const label = theme === "dark" ? "Tema claro" : "Tema escuro";

  return (
    <div className={styles.root} data-layer={layer ?? undefined}>
      <button
        type="button"
        className={styles.button}
        aria-label={label}
        onClick={toggleTheme}
      >
        <span className={styles.icon}>
          <IconMoon />
          <IconSun />
        </span>
        <span className={styles.text}>Tema</span>
      </button>
    </div>
  );
}

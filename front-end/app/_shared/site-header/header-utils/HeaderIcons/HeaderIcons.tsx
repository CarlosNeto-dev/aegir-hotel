import { ACTIONS } from "../header-items";
import styles from "./HeaderIcons.module.scss";

const svgBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  "aria-hidden": true,
} as const;

export function IconUser() {
  return (
    <svg {...svgBase}>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.8 19.5c1.4-3.3 4-5 7.2-5s5.8 1.7 7.2 5" />
    </svg>
  );
}

export function IconSettings() {
  return (
    <svg {...svgBase}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}

export function IconMenu() {
  return (
    <svg {...svgBase}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function IconClose() {
  return (
    <svg {...svgBase}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

type HeaderIconsProps = {
  showSettings?: boolean;
};

export default function HeaderIcons({ showSettings = true }: HeaderIconsProps) {
  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        aria-label={ACTIONS.account.label}
      >
        <IconUser />
      </button>
      {showSettings && (
        <button
          type="button"
          className={styles.button}
          aria-label={ACTIONS.settings.label}
        >
          <IconSettings />
        </button>
      )}
    </div>
  );
}

"use client";

import styles from "./SettingSwitch.module.scss";

type SettingSwitchProps = {
  label: string;
  summary: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function SettingSwitch({
  label,
  summary,
  checked,
  onChange,
}: SettingSwitchProps) {
  return (
    <label className={styles.root} data-keep-motion>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.summary}>{summary}</span>
      </span>

      <input
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </label>
  );
}

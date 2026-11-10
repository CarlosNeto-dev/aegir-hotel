"use client";

import {
  PRESET_OPTIONS,
  type PresetId,
} from "../../settings-utils/settings-options";
import styles from "./PresetPicker.module.scss";

type PresetPickerProps = {
  value: PresetId | null;
  onChange: (id: PresetId) => void;
};

export default function PresetPicker({ value, onChange }: PresetPickerProps) {
  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>Predefinições de desempenho</legend>

      <div className={styles.list}>
        {PRESET_OPTIONS.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              type="radio"
              className={styles.input}
              name="preset"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className={styles.card}>
              <span className={styles.mark} aria-hidden="true" />
              <span className={styles.text}>
                <span className={styles.label}>{option.label}</span>
                <span className={styles.summary}>{option.summary}</span>
              </span>
            </span>
          </label>
        ))}
      </div>

      <p className={styles.custom} data-visible={value === null ? "" : undefined}>
        Personalizado: algum ajuste foi mudado à mão.
      </p>
    </fieldset>
  );
}

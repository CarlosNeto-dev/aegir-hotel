"use client";

import {
  TEXT_SIZE_OPTIONS,
  type TextSizeId,
} from "../../settings-utils/settings-options";
import styles from "./TextSizePicker.module.scss";

type TextSizePickerProps = {
  value: TextSizeId;
  onChange: (id: TextSizeId) => void;
};

export default function TextSizePicker({ value, onChange }: TextSizePickerProps) {
  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>Tamanho do texto</legend>

      <div className={styles.row}>
        {TEXT_SIZE_OPTIONS.map((option) => (
          <label key={option.id} className={styles.option} data-id={option.id}>
            <input
              type="radio"
              className={styles.input}
              name="text-size"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className={styles.pill}>
              <span className={styles.sample} aria-hidden="true">
                Aa
              </span>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

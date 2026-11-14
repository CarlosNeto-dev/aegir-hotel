"use client";

import type { CSSProperties } from "react";
import {
  COLOR_OPTIONS,
  type ColorId,
} from "../../settings-utils/settings-options";
import styles from "./ColorPicker.module.scss";

type ColorPickerProps = {
  name: string;
  value: ColorId;
  onChange: (id: ColorId) => void;
};

export default function ColorPicker({ name, value, onChange }: ColorPickerProps) {
  const current = COLOR_OPTIONS.find((color) => color.id === value);

  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>
        Cor <span className={styles.current}>· {current?.label}</span>
      </legend>

      <div className={styles.row}>
        {COLOR_OPTIONS.map((color) => (
          <label key={color.id} className={styles.swatch} title={color.label}>
            <input
              type="radio"
              className={styles.input}
              name={name}
              value={color.id}
              checked={value === color.id}
              onChange={() => onChange(color.id)}
            />
            <span
              className={styles.dot}
              style={{ "--swatch": `var(--color-${color.id})` } as CSSProperties}
            />
            <span className={styles.name}>{color.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

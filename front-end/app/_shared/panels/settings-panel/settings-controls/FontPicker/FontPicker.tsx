"use client";

import type { CSSProperties } from "react";
import { FONT_OPTIONS, type FontId } from "../../settings-utils/settings-options";
import styles from "./FontPicker.module.scss";

type FontPickerProps = {
  value: FontId;
  onChange: (id: FontId) => void;
};

/* Cada opção já aparece escrita na própria fonte, para a pessoa ver antes de escolher. */
export default function FontPicker({ value, onChange }: FontPickerProps) {
  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>Fonte do site</legend>

      <div className={styles.grid}>
        {FONT_OPTIONS.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              type="radio"
              className={styles.input}
              name="font"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span
              className={styles.card}
              style={
                {
                  "--sample-title": option.title,
                  "--sample-body": option.body,
                } as CSSProperties
              }
            >
              <span className={styles.sample} aria-hidden="true">
                Aa
              </span>
              <span className={styles.name}>{option.label}</span>
              <span className={styles.hint}>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

"use client";

import type { ReactNode } from "react";
import { demoVideo } from "../../settings-utils/settings-options";
import DemoVideo from "../DemoVideo/DemoVideo";
import styles from "./ShapePicker.module.scss";

type ShapeOption<Id extends string> = { id: Id; label: string };

type ShapePickerProps<Id extends string> = {
  name: string;
  legend: string;
  group?: "cursor" | "touch" | "focus";
  options: readonly ShapeOption<Id>[];
  value: Id;
  onChange: (id: Id) => void;
  showVideos: boolean;
  // Uma prévia própria (ex.: os formatos de foto), no lugar do vídeo.
  preview?: (id: Id) => ReactNode;
};

export default function ShapePicker<Id extends string>({
  name,
  legend,
  group,
  options,
  value,
  onChange,
  showVideos,
  preview,
}: ShapePickerProps<Id>) {
  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>{legend}</legend>

      <div className={styles.grid}>
        {options.map((option) => (
          <label key={option.id} className={styles.option}>
            <input
              type="radio"
              className={styles.input}
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span className={styles.preview}>
              {preview
                ? preview(option.id)
                : showVideos && group && <DemoVideo src={demoVideo(group, option.id)} />}
            </span>
            <span className={styles.label}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

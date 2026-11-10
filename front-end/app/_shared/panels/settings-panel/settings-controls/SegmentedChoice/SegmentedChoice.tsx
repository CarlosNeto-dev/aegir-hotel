"use client";

import styles from "./SegmentedChoice.module.scss";

type ChoiceOption<Id extends string> = { id: Id; label: string };

type SegmentedChoiceProps<Id extends string> = {
  name: string;
  legend: string;
  options: readonly ChoiceOption<Id>[];
  value: Id;
  onChange: (id: Id) => void;
};

export default function SegmentedChoice<Id extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: SegmentedChoiceProps<Id>) {
  return (
    <fieldset className={styles.root}>
      <legend className={styles.legend}>{legend}</legend>

      <div className={styles.row}>
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
            <span className={styles.pill}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

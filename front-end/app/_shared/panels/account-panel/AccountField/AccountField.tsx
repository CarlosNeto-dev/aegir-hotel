"use client";

import { useId, useState } from "react";
import type { AccountFieldConfig } from "../account-utils/account-fields";
import styles from "./AccountField.module.scss";

export default function AccountField({
  name,
  label,
  type,
  autoComplete,
  inputMode,
  placeholder,
  help,
}: AccountFieldConfig) {
  const inputId = useId();
  const helpId = `${inputId}-help`;
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>

      <div className={styles.control}>
        <input
          id={inputId}
          className={styles.input}
          name={name}
          type={isPassword && visible ? "text" : type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          aria-describedby={help ? helpId : undefined}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.reveal}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>

      {help && (
        <p id={helpId} className={styles.help}>
          {help}
        </p>
      )}
    </div>
  );
}

"use client";

import type { FormEvent } from "react";
import AccountField from "../../AccountField/AccountField";
import { SIGN_UP_FIELDS } from "../../account-utils/account-fields";
import type { AccountView } from "../../account-utils/account-views";
import styles from "./SignUp.module.scss";

type ViewProps = { onNavigate: (view: AccountView) => void };

export default function SignUp({ onNavigate }: ViewProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNavigate("signedIn");
  }

  return (
    <div className={styles.root}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <p className={styles.intro}>
          Os dados servem para a sua reserva e para o check-in.
        </p>

        {SIGN_UP_FIELDS.map((field) => (
          <AccountField key={field.name} {...field} />
        ))}

        <button type="submit" className={styles.submit}>
          Criar conta
        </button>
      </form>

      <div className={styles.switch}>
        <p>Já tem conta?</p>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => onNavigate("signIn")}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

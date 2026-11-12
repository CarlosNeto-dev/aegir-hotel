"use client";

import type { FormEvent } from "react";
import AccountField from "../../AccountField/AccountField";
import AccountShowcase from "../../AccountShowcase/AccountShowcase";
import { SIGN_IN_FIELDS } from "../../account-utils/account-fields";
import type { AccountView } from "../../account-utils/account-views";
import styles from "./SignIn.module.scss";

type ViewProps = { onNavigate: (view: AccountView) => void };

export default function SignIn({ onNavigate }: ViewProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNavigate("signedIn");
  }

  return (
    <div className={styles.root}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        {SIGN_IN_FIELDS.map((field) => (
          <AccountField key={field.name} {...field} />
        ))}

        <div className={styles.forgot}>
          <button
            type="button"
            className={styles.link}
            onClick={() => onNavigate("forgotPassword")}
          >
            Esqueci a senha
          </button>
        </div>

        <button type="submit" className={styles.submit}>
          Entrar
        </button>
      </form>

      <div className={styles.switch}>
        <p>Ainda não tem conta?</p>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => onNavigate("signUp")}
        >
          Criar conta
        </button>
      </div>

      <AccountShowcase
        photo="/photos/pergola-lookout.webp"
        eyebrow="Litoral da Bahia"
        title="Sua estadia começa aqui."
      >
        <ul className={styles.details}>
          <li>Acompanhe reservas e pagamentos</li>
          <li>Check-in mais rápido na chegada</li>
          <li>Seus dados prontos para a próxima vez</li>
        </ul>
      </AccountShowcase>
    </div>
  );
}

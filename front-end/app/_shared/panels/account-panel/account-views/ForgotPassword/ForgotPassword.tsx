"use client";

import type { FormEvent } from "react";
import AccountField from "../../AccountField/AccountField";
import AccountShowcase from "../../AccountShowcase/AccountShowcase";
import { FORGOT_PASSWORD_FIELDS } from "../../account-utils/account-fields";
import type { AccountView } from "../../account-utils/account-views";
import styles from "./ForgotPassword.module.scss";

type ViewProps = { onNavigate: (view: AccountView) => void };

export default function ForgotPassword({ onNavigate }: ViewProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNavigate("emailSent");
  }

  return (
    <div className={styles.root}>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <p className={styles.intro}>
          Digite o e-mail da sua conta. Vamos mandar um link para você criar
          uma senha nova.
        </p>

        {FORGOT_PASSWORD_FIELDS.map((field) => (
          <AccountField key={field.name} {...field} />
        ))}

        <button type="submit" className={styles.submit}>
          Enviar link
        </button>
      </form>

      <div className={styles.back}>
        <button
          type="button"
          className={styles.link}
          onClick={() => onNavigate("signIn")}
        >
          Voltar para entrar
        </button>
      </div>

      <AccountShowcase
        photo="/photos/garden-spa.webp"
        eyebrow="Recuperar acesso"
        title="Suas reservas continuam guardadas."
      />
    </div>
  );
}

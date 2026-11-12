"use client";

import type { AccountView } from "../../account-utils/account-views";
import AccountShowcase from "../../AccountShowcase/AccountShowcase";
import styles from "./EmailSent.module.scss";

type ViewProps = { onNavigate: (view: AccountView) => void };

function IconMail() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 7 8.2 6 8.2-6" />
    </svg>
  );
}

export default function EmailSent({ onNavigate }: ViewProps) {
  return (
    <div className={styles.root}>
      <div className={styles.message}>
        <span className={styles.icon}>
          <IconMail />
        </span>
        <p className={styles.intro}>
          Se existir uma conta com esse e-mail, o link chega em alguns minutos.
          Ele abre a página para criar uma senha nova.
        </p>
        <p className={styles.note}>Não achou? Olhe também a caixa de spam.</p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.submit}
          onClick={() => onNavigate("signIn")}
        >
          Voltar para entrar
        </button>
        <button
          type="button"
          className={styles.link}
          onClick={() => onNavigate("forgotPassword")}
        >
          Enviar de novo
        </button>
      </div>

      <AccountShowcase
        photo="/photos/pool-courtyard.webp"
        eyebrow="Quase lá"
        title="Com a senha nova, é só entrar."
      />
    </div>
  );
}

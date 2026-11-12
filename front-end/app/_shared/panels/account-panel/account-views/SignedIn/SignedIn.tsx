"use client";

import type { AccountView } from "../../account-utils/account-views";
import { useAuth } from "@/app/_shared/auth/AuthProvider/AuthProvider";
import { initials } from "@/app/_shared/auth/auth-utils";
import AccountShowcase from "../../AccountShowcase/AccountShowcase";
import styles from "./SignedIn.module.scss";

type ViewProps = { onNavigate: (view: AccountView) => void };

const NEXT_STAY = {
  photo: "/photos/suite-dune.webp",
  suite: "Suíte Duna",
  dates: "12 a 15 de dezembro",
  guests: "2 hóspedes",
  status: "Pagamento confirmado",
};

const ITEMS = [
  { label: "Minhas reservas", summary: "Datas, suíte e pagamento de cada estadia." },
  { label: "Dados da conta", summary: "Nome, CPF, e-mail, telefone e senha." },
] as const;

function IconArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function SignedIn({ onNavigate }: ViewProps) {
  const { guest } = useAuth();

  if (!guest) return null;

  return (
    <div className={styles.root}>
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(guest.name)}
        </span>
        <div className={styles.who}>
          <span className={styles.name}>{guest.name}</span>
          <span className={styles.email}>{guest.email}</span>
        </div>
      </div>

      <AccountShowcase
        photo={NEXT_STAY.photo}
        eyebrow="Próxima estadia"
        title={NEXT_STAY.suite}
      >
        <ul className={styles.details}>
          <li>{NEXT_STAY.dates}</li>
          <li>{NEXT_STAY.guests}</li>
        </ul>
        <span className={styles.status}>{NEXT_STAY.status}</span>
      </AccountShowcase>

      <ul className={styles.list}>
        {ITEMS.map((item) => (
          <li key={item.label}>
            <button type="button" className={styles.item}>
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemSummary}>{item.summary}</span>
              </span>
              <IconArrow />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.secondary}
        onClick={() => onNavigate("signIn")}
      >
        Sair
      </button>
    </div>
  );
}

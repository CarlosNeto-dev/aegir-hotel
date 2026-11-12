"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { useAuth } from "@/app/_shared/auth/AuthProvider/AuthProvider";
import { SUITES, formatPrice } from "@/app/_shared/lib/data/places";
import { usePanels } from "@/app/_shared/panels/PanelProvider/PanelProvider";
import PlaceLink from "../../main-utils/PlaceLink/PlaceLink";
import styles from "./BookingSection.module.scss";

type BookingSectionProps = {
  suiteId: string;
  onSuiteChange: (suiteId: string) => void;
};

const GUEST_OPTIONS = [
  "1 adulto",
  "2 adultos",
  "2 adultos + 1 criança",
  "Família (4)",
  "Família (5)",
] as const;

const STAY_INFO = [
  ["Endereço", "Orla norte, litoral da Bahia"],
  ["Check-in", "a partir das 14h"],
  ["Contato", "reservas@aegir.exemplo"],
  ["Check-out", "até as 12h"],
] as const;

const DAY_MS = 86_400_000;
const DAYS_AHEAD = 14;
const DEFAULT_NIGHTS = 4;

function toInputDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

function countNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  return Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / DAY_MS);
}

export default function BookingSection({
  suiteId,
  onSuiteChange,
}: BookingSectionProps) {
  const formId = useId();
  const { guest } = useAuth();
  const { open } = usePanels();
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const now = new Date();
    setToday(toInputDate(now));
    setCheckIn(toInputDate(addDays(now, DAYS_AHEAD)));
    setCheckOut(toInputDate(addDays(now, DAYS_AHEAD + DEFAULT_NIGHTS)));
  }, []);

  const suite = SUITES.find((item) => item.id === suiteId) ?? SUITES[0];
  const nights = countNights(checkIn, checkOut);
  const price = suite.price ?? 0;
  const hasEstimate = nights > 0;

  function handleCheckIn(value: string) {
    setCheckIn(value);
    if (countNights(value, checkOut) < 1 && value) {
      setCheckOut(toInputDate(addDays(new Date(`${value}T12:00`), 1)));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasEstimate) {
      setStatus("Escolha um check-out depois do check-in.");
      return;
    }

    if (!guest) {
      setStatus("Entre na sua conta para continuar. As datas ficam guardadas aqui.");
      open("account");
      return;
    }

    setStatus(
      `Protótipo acadêmico: nada foi enviado. ${nights} ${nights === 1 ? "noite" : "noites"} na ${suite.title}, total estimado de ${formatPrice(nights * price)}.`,
    );
  }

  return (
    <section
      id="reserva"
      className={styles.root}
      aria-labelledby="booking-title"
    >
      <div className={styles.intro}>
        <span className={styles.kicker}>Reserva</span>
        <h2 id="booking-title" className={styles.headline}>
          Sua estadia <em>começa aqui.</em>
        </h2>
        <p className={styles.lead}>
          Escolha as datas e a suíte. Este é um protótipo acadêmico: nada é
          enviado e os valores são fictícios.
        </p>
        <dl className={styles.info}>
          {STAY_INFO.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-in`}>Check-in</label>
          <input
            id={`${formId}-in`}
            type="date"
            name="checkIn"
            min={today}
            value={checkIn}
            onChange={(event) => handleCheckIn(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-out`}>Check-out</label>
          <input
            id={`${formId}-out`}
            type="date"
            name="checkOut"
            min={checkIn || today}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-guests`}>Hóspedes</label>
          <select id={`${formId}-guests`} name="guests" defaultValue={GUEST_OPTIONS[1]}>
            {GUEST_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-suite`}>Suíte</label>
          <select
            id={`${formId}-suite`}
            name="suite"
            value={suite.id}
            onChange={(event) => onSuiteChange(event.target.value)}
          >
            {SUITES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} · {formatPrice(item.price ?? 0)}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor={`${formId}-name`}>Nome</label>
          <input
            key={guest?.name ?? "guest"}
            id={`${formId}-name`}
            type="text"
            name="name"
            autoComplete="name"
            defaultValue={guest?.name ?? ""}
          />
        </div>

        <div className={styles.estimate} aria-live="polite">
          <div className={styles.estimateText}>
            <span>Estimativa</span>
            <small>
              {hasEstimate
                ? `${nights} ${nights === 1 ? "noite" : "noites"} na ${suite.title} · ${formatPrice(price)} por noite`
                : "Escolha as datas"}
            </small>
          </div>
          <b className={styles.total}>
            {hasEstimate ? formatPrice(nights * price) : "—"}
          </b>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submit}>
            Ver disponibilidade
          </button>
          <PlaceLink place={suite} label="Ver a suíte em 3D" variant="outline" />
        </div>

        <p className={styles.status} role="status">
          {status}
        </p>
      </form>
    </section>
  );
}

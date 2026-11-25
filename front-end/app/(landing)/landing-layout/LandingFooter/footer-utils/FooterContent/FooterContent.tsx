import type { Ref } from "react";
import {
  ADDRESS,
  ARRIVAL,
  CONTACT,
  HOURS,
  POLICIES,
  STAY,
  type InfoRow,
} from "@/app/_shared/lib/data/hotel-info";
import { PLACES } from "@/app/_shared/lib/data/places";
import { NAV_ITEMS } from "@/app/_shared/site-header/header-utils/header-items";
import SectionLink from "@/app/_shared/site-header/header-utils/SectionLink/SectionLink";
import PhotoFragment from "../../../LandingMain/main-utils/PhotoFragment/PhotoFragment";
import { TEAM } from "../credits";
import FooterLegal from "../FooterLegal/FooterLegal";
import styles from "./FooterContent.module.scss";

type FooterContentProps = {
  /* No modo Fragmentos as fotos só aparecem quando o fragmento pousa nelas. */
  awaiting?: boolean;
  contentRef?: Ref<HTMLDivElement>;
};

const INFO: readonly { title: string; rows: readonly InfoRow[] }[] = [
  { title: "Sua estadia", rows: STAY },
  { title: "Como chegar", rows: ARRIVAL },
  { title: "Horários", rows: HOURS },
  { title: "Bom saber", rows: POLICIES },
];

export default function FooterContent({ awaiting = false, contentRef }: FooterContentProps) {
  return (
    <div ref={contentRef} className={styles.root} data-awaiting={awaiting ? "" : undefined}>
      <div className={styles.places}>
        <span className={styles.kicker}>Os lugares do Aegir</span>
        <ul className={styles.strip}>
          {PLACES.map((place, index) => (
            <li key={place.id} className={styles.thumb} data-slot={index} title={place.title}>
              <PhotoFragment
                className={styles.slotPhoto}
                photo={place.photo}
                shard={place.shard}
                alt={place.title}
                sizes="7rem"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.closing}>
        <div className={styles.intro}>
          <span className={styles.kicker}>Até breve</span>
          <h2 className={styles.title}>
            Até o próximo <em>pôr do sol.</em>
          </h2>
          <p className={styles.lead}>
            Reserve direto com o hotel: café da manhã incluído, cancelamento sem custo até 72 horas
            antes e a recepção aberta 24 horas para o que precisar.
          </p>
          <div className={styles.actions}>
            <SectionLink href="#reserva" className={styles.book}>
              Reservar
            </SectionLink>
            <a className={styles.mail} href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
          </div>
          <dl className={styles.contact}>
            <div>
              <dt>Endereço</dt>
              <dd>
                {ADDRESS.street}, {ADDRESS.area}
                <br />
                {ADDRESS.region}
              </dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>{CONTACT.phone}</dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>{CONTACT.instagram}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={styles.info}>
        {INFO.map((block) => (
          <section key={block.title} className={styles.block} aria-label={block.title}>
            <h3 className={styles.blockTitle}>{block.title}</h3>
            <dl className={styles.rows}>
              {block.rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className={styles.team}>
        <span className={styles.kicker}>Quem fez o Aegir</span>
        <ul className={styles.members}>
          {TEAM.map((member) => (
            <li key={member.name}>
              <span className={styles.name}>{member.name}</span>
              <span className={styles.role}>{member.role}</span>
              {member.github ? (
                <a
                  className={styles.link}
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
              ) : (
                <span className={styles.missing}>GitHub a confirmar</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/*
       * As seções em cartões, como o menu do celular: foto, número e nome.
       * São os mesmos links do header (cortina "Indo para" e # na URL).
       */}
      <nav className={styles.nav} aria-label="Seções da página">
        <span className={styles.kicker}>Volte a qualquer parte</span>
        <ul className={styles.cards}>
          {NAV_ITEMS.map((item, index) => (
            <li key={item.id}>
              <SectionLink href={item.href} className={styles.card}>
                <span
                  className={styles.cardPhoto}
                  style={{ backgroundImage: `url(${item.photo})` }}
                  aria-hidden="true"
                />
                <span className={styles.cardText}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <b>{item.label}</b>
                  <span>{item.summary}</span>
                </span>
              </SectionLink>
            </li>
          ))}
        </ul>
      </nav>

      <FooterLegal />
    </div>
  );
}

"use client";

import {
  SUITES,
  formatPrice,
  type Fact,
  type Place,
} from "@/app/_shared/lib/data/places";
import SectionLink from "@/app/_shared/site-header/header-utils/SectionLink/SectionLink";
import { useInView } from "../../main-hooks/useInView";
import PhotoFragment from "../../main-utils/PhotoFragment/PhotoFragment";
import SectionHeading from "../../main-utils/SectionHeading/SectionHeading";
import styles from "./CompareSection.module.scss";

type CompareSectionProps = {
  onChoose: (suite: Place) => void;
};

const EXTRAS: Record<string, { bath: string; outside: string }> = {
  dune: { bath: "Chuveiro", outside: "Varanda com 2 cadeiras" },
  tide: { bath: "Sim, de imersão", outside: "Varanda com cama de dossel" },
  terrace: {
    bath: "Sim, e piscina no terraço",
    outside: "Terraço com piscina e pérgola",
  },
};

function compareRows(suite: Place): readonly Fact[] {
  return [
    ...suite.facts.slice(0, 3),
    ["Banheira", EXTRAS[suite.id].bath],
    ["Lá fora", EXTRAS[suite.id].outside],
    ["Onde fica", suite.kicker.toLowerCase()],
    ["Diária desde", formatPrice(suite.price ?? 0)],
  ];
}

const LABELS = compareRows(SUITES[0]).map(([label]) => label);

export default function CompareSection({ onChoose }: CompareSectionProps) {
  const { ref, inView } = useInView<HTMLElement>(0.15);

  return (
    <section
      ref={ref}
      className={styles.root}
      data-in-view={inView ? "" : undefined}
      aria-labelledby="compare-title"
    >
      <SectionHeading
        id="compare-title"
        kicker="Lado a lado"
        title={["Compare as ", "suítes."]}
        note="Valores fictícios, por noite, para duas pessoas. Toque na foto para abrir a suíte em 3D."
      />

      <div className={styles.wide}>
        <table className={styles.table}>
          <thead>
            <tr>
              <td />
              {SUITES.map((suite) => (
                <th key={suite.id} scope="col">
                  <span className={styles.thumb}>
                    <PhotoFragment
                      className={styles.photo}
                      photo={suite.photo}
                      shard={suite.shard}
                      alt=""
                      sizes="24vw"
                    />
                  </span>
                  <span className={styles.name}>{suite.title}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LABELS.map((label, rowIndex) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {SUITES.map((suite) => (
                  <td key={suite.id}>{compareRows(suite)[rowIndex][1]}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              {SUITES.map((suite) => (
                <td key={suite.id}>
                  <SectionLink
                    href="#reserva"
                    className={styles.book}
                    onNavigate={() => onChoose(suite)}
                  >
                    Reservar
                  </SectionLink>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <ul className={styles.cards}>
        {SUITES.map((suite) => (
          <li key={suite.id} className={styles.card}>
            <span className={styles.thumb}>
              <PhotoFragment
                className={styles.photo}
                photo={suite.photo}
                shard={suite.shard}
                alt=""
                sizes="80vw"
              />
            </span>
            <h3 className={styles.name}>{suite.title}</h3>
            <dl className={styles.list}>
              {compareRows(suite).map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <SectionLink
              href="#reserva"
              className={styles.book}
              onNavigate={() => onChoose(suite)}
            >
              Reservar
            </SectionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

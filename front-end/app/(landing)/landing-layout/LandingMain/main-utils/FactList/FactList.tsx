import type { Fact } from "@/app/_shared/lib/data/places";
import styles from "./FactList.module.scss";

export default function FactList({ facts }: { facts: readonly Fact[] }) {
  return (
    <dl className={styles.root}>
      {facts.map(([label, value]) => (
        <div key={label} className={styles.row}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

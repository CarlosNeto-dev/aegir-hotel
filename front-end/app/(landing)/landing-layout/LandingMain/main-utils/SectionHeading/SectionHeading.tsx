import styles from "./SectionHeading.module.scss";

type SectionHeadingProps = {
  id?: string;
  kicker: string;
  title: readonly [plain: string, accent: string];
  note?: string;
};

export default function SectionHeading({
  id,
  kicker,
  title,
  note,
}: SectionHeadingProps) {
  return (
    <div className={styles.root}>
      <div className={styles.text}>
        <span className={styles.kicker}>{kicker}</span>
        <h2 id={id} className={styles.title}>
          {title[0]}
          <em>{title[1]}</em>
        </h2>
      </div>
      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}

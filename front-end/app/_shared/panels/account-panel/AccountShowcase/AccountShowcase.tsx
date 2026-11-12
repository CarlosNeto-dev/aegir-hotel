import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./AccountShowcase.module.scss";

type AccountShowcaseProps = {
  photo: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

export default function AccountShowcase({
  photo,
  eyebrow,
  title,
  children,
}: AccountShowcaseProps) {
  return (
    <figure className={styles.root}>
      <Image
        className={styles.photo}
        src={photo}
        alt=""
        fill
        sizes="(min-width: 768px) 44rem, 100vw"
      />
      <figcaption className={styles.caption}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <span className={styles.title}>{title}</span>
        {children}
      </figcaption>
    </figure>
  );
}

import Image from "next/image";
import type { CSSProperties } from "react";
import {
  photoSrc,
  shardPath,
  type Shard,
} from "@/app/_shared/lib/data/places";
import styles from "./PhotoFragment.module.scss";

type PhotoFragmentProps = {
  photo: string;
  shard: Shard;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export default function PhotoFragment({
  photo,
  shard,
  alt,
  sizes,
  priority = false,
  className = "",
}: PhotoFragmentProps) {
  return (
    <span
      className={`${styles.root} ${className}`}
      style={{ "--shard": shardPath(shard) } as CSSProperties}
    >
      <Image
        className={styles.image}
        src={photoSrc(photo)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
      />
    </span>
  );
}

import type { Place } from "@/app/_shared/lib/data/places";
import styles from "./PlaceLink.module.scss";

type PlaceLinkProps = {
  place: Pick<Place, "slug" | "title">;
  label: string;
  variant?: "solid" | "outline" | "text";
};

function IconCube() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" />
      <path d="M4.2 7.5 12 12l7.8-4.5M12 12v9" />
    </svg>
  );
}

export default function PlaceLink({ place, label, variant = "solid" }: PlaceLinkProps) {
  return (
    <span
      className={`${styles.root} ${styles[variant]}`}
      aria-label={`${label}: o 3D de ${place.title} chega em breve`}
      role="note"
    >
      <IconCube />
      <span aria-hidden="true">{label}</span>
      <span className={styles.soon} aria-hidden="true">
        Em breve
      </span>
    </span>
  );
}

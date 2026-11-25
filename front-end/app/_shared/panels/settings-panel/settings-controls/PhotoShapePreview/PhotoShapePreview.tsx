import { thumbSrc } from "@/app/_shared/lib/data/places";
import type { PhotoShapeId } from "../../settings-utils/settings-options";
import styles from "./PhotoShapePreview.module.scss";

// A prévia de um formato de foto: a mesma foto do hotel, já com o formato.
export default function PhotoShapePreview({ shape }: { shape: PhotoShapeId }) {
  return (
    <span className={styles.root}>
      <span
        className={styles.photo}
        data-shape={shape}
        style={{ backgroundImage: `url(${thumbSrc("aerial-sunset")})` }}
      />
    </span>
  );
}

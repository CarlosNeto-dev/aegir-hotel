"use client";

import { useState, type CSSProperties } from "react";
import { PHOTO_FILTERS, PHOTOS, type PhotoFilterId } from "@/app/_shared/lib/data/photos";
import { PLACE_NOTES } from "@/app/_shared/lib/data/hotel-info";
import { getPlace } from "@/app/_shared/lib/data/places";
import PhotoFragment from "../../main-utils/PhotoFragment/PhotoFragment";
import SectionHeading from "../../main-utils/SectionHeading/SectionHeading";
import styles from "./GallerySection.module.scss";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function countFor(filter: PhotoFilterId) {
  return filter === "all"
    ? PHOTOS.length
    : PHOTOS.filter((photo) => photo.category === filter).length;
}

export default function GallerySection() {
  const [filter, setFilter] = useState<PhotoFilterId>("all");
  const photos = PHOTOS.filter((photo) => filter === "all" || photo.category === filter);

  return (
    <section id="galeria" className={styles.root} aria-labelledby="gallery-title">
      <SectionHeading
        id="gallery-title"
        kicker="Galeria"
        title={["Dezesseis fotos, ", "um hotel inteiro."]}
        note="Do pátio às suítes: o que cada lugar é, onde fica e quando abre."
      />

      <div className={styles.filters} role="group" aria-label="Filtrar fotos">
        {PHOTO_FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.filter}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
            <span>{countFor(item.id)}</span>
          </button>
        ))}
      </div>

      <ul key={filter} className={styles.grid}>
        {photos.map((photo, index) => {
          const place = getPlace(photo.placeId);

          return (
            <li key={photo.file} style={{ "--i": index } as CSSProperties}>
              <div className={styles.card}>
                <span className={styles.media}>
                  <PhotoFragment
                    className={styles.photo}
                    photo={photo.file}
                    shard={place.shard}
                    alt={photo.title}
                    sizes="(min-width: 1100px) 24vw, (min-width: 768px) 32vw, 46vw"
                  />
                  {photo.sunset && (
                    <span className={styles.badges}>
                      <span className={`${styles.badge} ${styles.sunset}`}>Pôr do sol</span>
                    </span>
                  )}
                </span>
                <span className={styles.meta}>
                  {pad(PHOTOS.indexOf(photo) + 1)} · {photo.kicker}
                </span>
                <span className={styles.title}>{photo.title}</span>
                <span className={styles.caption}>{photo.caption}</span>
                <span className={styles.note}>{PLACE_NOTES[photo.placeId]}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

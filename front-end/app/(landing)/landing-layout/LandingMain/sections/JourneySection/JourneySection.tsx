import { JOURNEY_PLACES } from "@/app/_shared/lib/data/places";
import FactList from "../../main-utils/FactList/FactList";
import PlaceLink from "../../main-utils/PlaceLink/PlaceLink";
import VanishText from "../../main-utils/VanishText/VanishText";
import { photoOnLeft } from "../OpeningSection/story-layout";
import styles from "./JourneySection.module.scss";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function JourneySection() {
  return (
    <div id="percurso" className={styles.root}>
      {JOURNEY_PLACES.map((place, index) => {
        const ringIndex = index + 1;

        return (
          <article
            key={place.id}
            className={styles.place}
            data-place={ringIndex}
            data-photo={photoOnLeft(ringIndex) ? "left" : "right"}
            aria-label={place.title}
          >
            <div className={styles.content}>
              <span className={styles.kicker} data-reveal>
                {pad(index + 1)} · {place.kicker}
              </span>
              {place.headline && (
                <VanishText
                  as="h2"
                  className={styles.title}
                  parts={[place.headline[0], { accent: place.headline[1] }]}
                />
              )}
              <p className={styles.summary} data-reveal>
                {place.summary}
              </p>
              <p className={styles.description} data-reveal>
                {place.description}
              </p>
              <div className={styles.facts} data-reveal>
                <FactList facts={place.facts} />
              </div>
              <div className={styles.actions} data-reveal>
                <PlaceLink place={place} label={place.cta} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

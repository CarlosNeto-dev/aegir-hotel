import type { CSSProperties } from "react";
import type { Place } from "@/app/_shared/lib/data/places";
import {
  PLAN_POOL,
  PLAN_SHAPE,
  PLAN_STOPS,
  PLAN_VIEW,
  ROUTE_PATH,
} from "./hotel-plan";
import styles from "./HotelPlan.module.scss";

type HotelPlanProps = {
  places: readonly Place[];
  active: number;
  onSelect: (index: number) => void;
};

export default function HotelPlan({ places, active, onSelect }: HotelPlanProps) {
  return (
    <div className={styles.root}>
      <svg
        className={styles.drawing}
        viewBox={`0 0 ${PLAN_VIEW.width} ${PLAN_VIEW.height}`}
        aria-hidden="true"
      >
        <path className={styles.sea} d="M4 99q7-3 14 0t14 0 14 0 14 0 14 0 14 0 14 0 14 0" />
        <path className={styles.building} d={PLAN_SHAPE} />
        <rect className={styles.pool} {...PLAN_POOL} rx="2" />
        <path className={styles.track} d={ROUTE_PATH} />
        <path className={styles.route} d={ROUTE_PATH} pathLength={1} />
        {PLAN_STOPS.map(({ point }, index) => (
          <circle
            key={index}
            className={styles.stop}
            cx={point[0]}
            cy={point[1]}
            r="2.2"
            data-done={index <= active ? "" : undefined}
          />
        ))}
        <g className={styles.marker}>
          <circle className={styles.pulse} r="5" />
          <circle className={styles.dot} r="2.8" />
        </g>
      </svg>

      <ol className={styles.stops}>
        {places.map((place, index) => (
          <li
            key={place.id}
            style={
              {
                "--x": PLAN_STOPS[index].point[0] / PLAN_VIEW.width,
                "--y": PLAN_STOPS[index].point[1] / PLAN_VIEW.height,
              } as CSSProperties
            }
          >
            <button
              type="button"
              className={styles.button}
              aria-current={index === active ? "step" : undefined}
              onClick={() => onSelect(index)}
            >
              <span className={styles.name}>{place.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

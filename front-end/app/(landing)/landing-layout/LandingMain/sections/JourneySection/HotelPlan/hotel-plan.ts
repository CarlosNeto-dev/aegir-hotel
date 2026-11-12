import { lerp } from "@/app/_shared/lib/scroll-frame";

type Point = readonly [x: number, y: number];

export const PLAN_VIEW = { width: 120, height: 104 } as const;

export const PLAN_SHAPE = "M12 14H108V84H92V34H28V84H12Z";

export const PLAN_POOL = { x: 48, y: 48, width: 24, height: 30 } as const;

const ROUTE: readonly { point: Point; stop?: true }[] = [
  { point: [60, 6], stop: true },
  { point: [60, 24], stop: true },
  { point: [60, 42], stop: true },
  { point: [100, 42] },
  { point: [100, 70], stop: true },
  { point: [100, 91] },
  { point: [20, 91] },
  { point: [20, 58], stop: true },
  { point: [20, 24] },
  { point: [88, 24], stop: true },
];

const lengths = ROUTE.map(({ point }, index) => {
  if (index === 0) return 0;
  const [fromX, fromY] = ROUTE[index - 1].point;
  return Math.hypot(point[0] - fromX, point[1] - fromY);
});

const total = lengths.reduce((sum, length) => sum + length, 0);

const fractions = lengths.reduce<number[]>((list, length) => {
  list.push((list.at(-1) ?? 0) + length / total);
  return list;
}, []);

export const ROUTE_PATH = ROUTE.map(
  ({ point }, index) => `${index === 0 ? "M" : "L"}${point[0]} ${point[1]}`,
).join("");

export const PLAN_STOPS = ROUTE.flatMap(({ point, stop }, index) =>
  stop ? [{ point, fraction: fractions[index] }] : [],
);

export function routeAt(stop: number) {
  const index = Math.min(PLAN_STOPS.length - 2, Math.floor(stop));
  const amount = Math.min(1, stop - index);
  const fraction = lerp(
    PLAN_STOPS[index].fraction,
    PLAN_STOPS[index + 1].fraction,
    amount,
  );

  const segment = Math.max(
    1,
    fractions.findIndex((value) => value >= fraction),
  );
  const span = fractions[segment] - fractions[segment - 1];
  const local = span > 0 ? (fraction - fractions[segment - 1]) / span : 0;
  const [fromX, fromY] = ROUTE[segment - 1].point;
  const [toX, toY] = ROUTE[segment].point;

  return {
    fraction,
    x: lerp(fromX, toX, local),
    y: lerp(fromY, toY, local),
  };
}

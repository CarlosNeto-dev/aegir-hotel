import type { PlaceId } from "./places";

export type DayMoment = {
  hour: number;
  placeId: PlaceId;
  photo: string;
  where: string;
  title: string;
  text: string;
};

export const DAY_START = 8;

export const DAY_END = 20;

export const DAY_MOMENTS: readonly DayMoment[] = [
  {
    hour: 8,
    placeId: "lobby",
    photo: "lobby",
    where: "Lobby",
    title: "Bom dia debaixo da palhinha",
    text: "O sol entra pelo cobogó e desenha bolinhas de luz no travertino.",
  },
  {
    hour: 10,
    placeId: "pool",
    photo: "pool-courtyard",
    where: "Pátio e piscina",
    title: "A água que parece cair no mar",
    text: "Uma espreguiçadeira debaixo do guarda-sol, um mergulho na borda infinita.",
  },
  {
    hour: 14,
    placeId: "spa",
    photo: "garden-spa",
    where: "Spa: o jardim",
    title: "Massagem na cabana de voal",
    text: "Os pisantes de pedra atravessam o espelho d’água até a cabana.",
  },
  {
    hour: 16,
    placeId: "spa",
    photo: "spa-room",
    where: "Spa: a sala",
    title: "Duas macas e uma parede de cobogó",
    text: "Velas, uma bacia de pedra com flores e o jardim do outro lado dos furos.",
  },
  {
    hour: 18,
    placeId: "terrace",
    photo: "suite-terrace",
    where: "Suíte Terraço",
    title: "O céu fica laranja",
    text: "A piscina privativa do terraço reflete o pôr do sol, degrau por degrau.",
  },
  {
    hour: 19,
    placeId: "lookout",
    photo: "pergola-lookout",
    where: "Mirante",
    title: "Um drink na cobertura",
    text: "O bar de travertino debaixo da pérgola, com o mar inteiro na frente.",
  },
  {
    hour: 20,
    placeId: "restaurant",
    photo: "beach-restaurant",
    where: "Restaurante Sal",
    title: "Jantar com o pé na areia",
    text: "Toalhas brancas, luminárias de palhinha acesas e o barulho do mar.",
  },
];

export function momentAt(hour: number) {
  const index = DAY_MOMENTS.findLastIndex((moment) => moment.hour <= hour);
  return DAY_MOMENTS[Math.max(0, index)];
}

export function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}h`;
}

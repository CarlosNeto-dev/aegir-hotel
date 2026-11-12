import type { TextPart } from "../../main-utils/VanishText/VanishText";

export const HERO_TEXT = {
  kicker: "Hotel · Litoral da Bahia",
  lead: "O Aegir é um hotel fictício. Cada fragmento desta página é uma foto; toque nele e o lugar abre em 3D, montado peça por peça.",
  facts: "8 andares · alas em degraus até a praia · pátio de 54 × 32 m com piscina de borda infinita",
} as const;

export type OpeningMessage = {
  kicker: string;
  parts: readonly TextPart[];
  at: number;
  leave: number;
};

export const PLACE_START = 4.9;
export const PLACE_STEP = 2.7;
export const PLACES_LABEL = "places";

export const MESSAGES: readonly OpeningMessage[] = [
  {
    kicker: "Um hotel em fragmentos",
    parts: ["Cada pedaço guarda ", { accent: "um jeito diferente" }, " de chegar ao mar."],
    at: 1.2,
    leave: 2.0,
  },
  {
    kicker: "Toque em qualquer fragmento",
    parts: ["Ele abre ", { accent: "em 3D" }, ": gire, aproxime, explore."],
    at: 2.35,
    leave: 3.0,
  },
  {
    kicker: "Seis lugares, seis cenas",
    parts: ["Montadas uma a uma, ", { accent: "com o mesmo cuidado." }],
    at: 3.65,
    leave: 4.7,
  },
];

export const CLOSING_MESSAGE = {
  kicker: "Depois do percurso",
  parts: ["Agora, ", { accent: "onde dormir." }],
} as const satisfies Pick<OpeningMessage, "kicker" | "parts">;

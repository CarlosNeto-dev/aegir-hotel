import type { TextPart } from "../../main-utils/VanishText/VanishText";

export const HERO_TEXT = {
  kicker: "Hotel · Litoral Norte da Bahia",
  lead: "No litoral norte da Bahia, a 50 minutos do aeroporto de Salvador. Três suítes de frente para o mar, o Restaurante Sal pé na areia, o Spa Água e uma piscina de borda infinita entre as alas.",
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
    kicker: "Do lobby à areia",
    parts: ["Tudo a ", { accent: "poucos passos" }, " do mar."],
    at: 2.35,
    leave: 3.0,
  },
  {
    kicker: "Seis lugares",
    parts: ["Um percurso ", { accent: "do portão à praia." }],
    at: 3.65,
    leave: 4.7,
  },
];

export const CLOSING_MESSAGE = {
  kicker: "Depois do percurso",
  parts: ["Agora, ", { accent: "onde dormir." }],
} as const satisfies Pick<OpeningMessage, "kicker" | "parts">;

import type { TextPart } from "../../LandingMain/main-utils/VanishText/VanishText";

export type Member = {
  name: string;
  role: string;
  github: string | null;
};

export const TEAM: readonly Member[] = [
  { name: "Carlos Neto", role: "Líder · front-end e 3D", github: "CarlosNeto-dev" },
  { name: "Vinícius Gonçalves", role: "Back-end", github: "vinicius507" },
  { name: "Pedro Brunet", role: "Back-end", github: null },
  { name: "Jacques Nethow", role: "Back-end", github: "JacquesNethow" },
  { name: "Ian Fontanive", role: "Back-end", github: "IanFontanive" },
];

export type ClosingMessage = { kicker: string; parts: readonly TextPart[] };

export const CLOSING_MESSAGE: ClosingMessage = {
  kicker: "Fim do percurso",
  parts: ["O mar está ", { accent: "no nosso DNA." }],
};

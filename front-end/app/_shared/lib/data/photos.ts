import type { PlaceId } from "./places";

export type PhotoCategory = "outside" | "common" | "suites";

export type Photo = {
  file: string;
  placeId: PlaceId;
  title: string;
  kicker: string;
  caption: string;
  category: PhotoCategory;
  sunset?: boolean;
};

export const PHOTO_FILTERS = [
  { id: "all", label: "Todas" },
  { id: "outside", label: "Exterior" },
  { id: "common", label: "Áreas comuns" },
  { id: "suites", label: "Suítes" },
] as const;

export type PhotoFilterId = (typeof PHOTO_FILTERS)[number]["id"];

export const PHOTOS: readonly Photo[] = [
  {
    file: "aerial-sunset",
    placeId: "hotel",
    title: "O hotel ao pôr do sol",
    kicker: "O hotel",
    caption:
      "O hotel inteiro visto do alto, do lado da praia, com a luz do fim de tarde batendo nas alas e o bloco dos fundos já na sombra.",
    category: "outside",
    sunset: true,
  },
  {
    file: "front-facade",
    placeId: "facade",
    title: "Fachada para o mar",
    kicker: "Fachada e praia",
    caption:
      "A fachada vista de dentro do mar, bem no eixo: a areia com os guarda-sóis, o calçadão, as duas alas descendo em degraus e, no fundo, o bloco de oito andares.",
    category: "outside",
  },
  {
    file: "aerial-view",
    placeId: "plan",
    title: "Vista de cima",
    kicker: "A planta do térreo",
    caption:
      "O hotel visto de cima, sem telhado: cortado a 2,9 metros do chão, ele mostra o térreo inteiro, do lobby no fundo ao restaurante de frente para a praia.",
    category: "outside",
  },
  {
    file: "white-model",
    placeId: "model",
    title: "A maquete",
    kicker: "Ateliê",
    caption:
      "A maquete de papel e balsa vista de perto, na mesa do ateliê: os degraus das alas, os terraços de balsa e a piscina azul no meio do U.",
    category: "outside",
  },
  {
    file: "side-steps",
    placeId: "wing",
    title: "As alas em degraus",
    kicker: "Lateral",
    caption:
      "A ala vista da praia, de lado: os quatro degraus descendo de cinco andares até um, e no telhado de cada degrau o terraço de uma suíte.",
    category: "outside",
  },
  {
    file: "street-entrance",
    placeId: "entrance",
    title: "A entrada",
    kicker: "Rua",
    caption:
      "A chegada pela rua ao entardecer: a marquise de madeira sobre o desembarque, o canteiro de coqueiros e o lobby aceso atrás do vidro.",
    category: "outside",
    sunset: true,
  },
  {
    file: "lobby",
    placeId: "lobby",
    title: "Lobby",
    kicker: "Térreo",
    caption:
      "O lobby visto de quem entra pelo pátio: o balcão de travertino sobre madeira ripada, as luminárias de palhinha e as salas de estar à direita.",
    category: "common",
  },
  {
    file: "pool-courtyard",
    placeId: "pool",
    title: "Pátio e piscina",
    kicker: "Pátio",
    caption:
      "Do canto do pátio, junto do lobby: a piscina de borda infinita apontando para o mar, as espreguiçadeiras, os coqueiros e a ala de cobogó.",
    category: "common",
  },
  {
    file: "beach-restaurant",
    placeId: "restaurant",
    title: "Restaurante Sal",
    kicker: "Pé na areia",
    caption:
      "A varanda do restaurante ao anoitecer: as mesas de toalha branca debaixo da marquise e as luminárias de palhinha acesas.",
    category: "common",
    sunset: true,
  },
  {
    file: "garden-spa",
    placeId: "spa",
    title: "Spa: o jardim",
    kicker: "Spa Água",
    caption:
      "Da beira do espelho d’água: os pisantes de travertino atravessando a água até a cabana de voal, com o jardim tropical em volta.",
    category: "common",
  },
  {
    file: "spa-room",
    placeId: "spa",
    title: "Spa: a sala de massagem",
    kicker: "Spa Água",
    caption:
      "A sala de massagem de 9 por 7 metros: duas macas, uma bacia de pedra com água, velas e a parede de cobogó que deixa o jardim aparecer.",
    category: "common",
  },
  {
    file: "pergola-lookout",
    placeId: "lookout",
    title: "Mirante",
    kicker: "Cobertura",
    caption:
      "Ao longo da pérgola, no fim da tarde: as salas ao ar livre debaixo das ripas de madeira e o mar inteiro do lado direito.",
    category: "common",
    sunset: true,
  },
  {
    file: "suite-dune",
    placeId: "dune",
    title: "Suíte Duna",
    kicker: "Bloco central",
    caption:
      "De dentro da Suíte Duna: a cama de linho, o banco aos pés dela e a porta de vidro abrindo para a varanda de cobogó.",
    category: "suites",
  },
  {
    file: "suite-tide",
    placeId: "tide",
    title: "Suíte Maré",
    kicker: "Alas",
    caption:
      "A cama da Suíte Maré, com a luz em bolinhas da tela de cobogó entrando pelo lado da varanda.",
    category: "suites",
  },
  {
    file: "bathroom",
    placeId: "tide",
    title: "Banheiro da Maré",
    kicker: "Suíte Maré",
    caption:
      "A banheira de imersão junto da tela de cobogó, e atrás da cabeceira o banheiro com bancada dupla e dois espelhos redondos.",
    category: "suites",
  },
  {
    file: "suite-terrace",
    placeId: "terrace",
    title: "Suíte Terraço",
    kicker: "Degraus das alas",
    caption:
      "Do canto do terraço ao pôr do sol: a piscina privativa de pedra escura, as espreguiçadeiras debaixo da pérgola e o quarto ao fundo.",
    category: "suites",
    sunset: true,
  },
];

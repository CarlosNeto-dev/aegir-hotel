export type NavItem = {
  id: string;
  label: string;
  summary: string;
  photo: string;
  href: `#${string}`;
};

export const NAV_ITEMS = [
  {
    id: "abertura",
    label: "Abertura",
    summary: "O hotel inteiro, de cima",
    photo: "/photos/thumbs/aerial-sunset.webp",
    href: "#abertura",
  },
  {
    id: "percurso",
    label: "Percurso",
    summary: "Seis lugares, um de cada vez",
    photo: "/photos/thumbs/pool-courtyard.webp",
    href: "#percurso",
  },
  {
    id: "suites",
    label: "Onde dormir",
    summary: "Três suítes de frente para o mar",
    photo: "/photos/thumbs/suite-dune.webp",
    href: "#suites",
  },
  {
    id: "dia",
    label: "Sol a sol",
    summary: "Um dia no hotel, das 8h às 20h",
    photo: "/photos/thumbs/beach-restaurant.webp",
    href: "#dia",
  },
  {
    id: "maquetes",
    label: "Maquetes",
    summary: "Dezesseis fotos que abrem em 3D",
    photo: "/photos/thumbs/white-model.webp",
    href: "#maquetes",
  },
  {
    id: "reserva",
    label: "Sua estadia",
    summary: "Datas, suíte e o valor",
    photo: "/photos/thumbs/suite-terrace.webp",
    href: "#reserva",
  },
] as const satisfies readonly NavItem[];

export type SectionId = (typeof NAV_ITEMS)[number]["id"];

export const BRAND = { label: "Aegir", href: "#abertura" } as const;

export const CTA = { label: "Reservar", href: "#reserva" } as const;

export const ACTIONS = {
  account: { label: "Entrar", controls: "painel-conta" },
  settings: { label: "Ajustes", controls: "painel-ajustes" },
} as const;

export const NAV_LEFT = NAV_ITEMS.slice(0, 3);

export const NAV_RIGHT = NAV_ITEMS.slice(3);

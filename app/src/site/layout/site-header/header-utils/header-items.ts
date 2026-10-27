export type NavItem = {
  id: string;
  label: string;
  href: `/#${string}`;
};

export const NAV_ITEMS = [
  { id: "abertura", label: "Abertura", href: "/#abertura" },
  { id: "percurso", label: "Percurso", href: "/#percurso" },
  { id: "suites", label: "Onde dormir", href: "/#suites" },
  { id: "dia", label: "Sol a sol", href: "/#dia" },
  { id: "maquetes", label: "Maquetes", href: "/#maquetes" },
  { id: "reserva", label: "Sua estadia", href: "/#reserva" },
] as const satisfies readonly NavItem[];

export const BRAND = {
  label: "Aegir",
  href: "/",
  ariaLabel: "Aegir, voltar ao início",
} as const;
export const CTA = { label: "Reservar", href: "/#reserva" } as const;
export const ACTIONS = {
  account: { label: "Entrar" },
  settings: { label: "Ajustes do site" },
} as const;

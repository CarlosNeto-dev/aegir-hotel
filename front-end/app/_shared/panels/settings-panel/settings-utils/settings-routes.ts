export type PointerKind = "mouse" | "touch" | "remote";

export type SettingsSectionId =
  | "presets"
  | "pointer"
  | "letters"
  | "graphics"
  | "speed"
  | "accessibility";

type SectionText = { label: string; summary: string };

const SECTIONS: Record<Exclude<SettingsSectionId, "pointer">, SectionText> = {
  presets: {
    label: "Predefinições",
    summary: "Leve, Médio ou Pesado: uma escolha ajusta tudo de uma vez.",
  },
  letters: {
    label: "Efeito das letras",
    summary: "As letras dos títulos entram e somem uma a uma durante a rolagem.",
  },
  graphics: {
    label: "Gráficos",
    summary: "O que aparece desenhado na página.",
  },
  speed: {
    label: "Velocidade",
    summary: "O tempo das animações e o quanto você rola em cada parte.",
  },
  accessibility: {
    label: "Acessibilidade",
    summary: "Tamanho do texto, contraste, movimento e foco.",
  },
};

const POINTER_SECTION: Record<PointerKind, SectionText> = {
  mouse: {
    label: "Cursor",
    summary: "O formato e a cor do ponteiro do mouse.",
  },
  touch: {
    label: "Toque",
    summary: "O efeito que aparece onde o dedo toca a tela.",
  },
  remote: {
    label: "Destaque",
    summary: "A moldura que anda entre os botões com as setas do controle.",
  },
};

const ROUTES = [
  {
    match: (pathname: string) => pathname === "/",
    label: "Página inicial",
    sections: ["presets", "pointer", "letters", "graphics", "speed", "accessibility"],
  },
  {
    match: (pathname: string) => pathname.startsWith("/pagamentos"),
    label: "Pagamento",
    sections: ["pointer"],
  },
  {
    match: (pathname: string) => pathname.startsWith("/redefinir-senha"),
    label: "Redefinir senha",
    sections: ["pointer"],
  },
] as const satisfies readonly {
  match: (pathname: string) => boolean;
  label: string;
  sections: readonly SettingsSectionId[];
}[];

export function getRouteSettings(pathname: string) {
  return ROUTES.find((route) => route.match(pathname)) ?? ROUTES[0];
}

export function getSectionText(
  id: SettingsSectionId,
  pointer: PointerKind,
): SectionText {
  return id === "pointer" ? POINTER_SECTION[pointer] : SECTIONS[id];
}

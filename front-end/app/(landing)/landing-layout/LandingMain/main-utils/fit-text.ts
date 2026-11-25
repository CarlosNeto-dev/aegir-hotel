const LEVELS = ["long", "short", "tight", "tiny"] as const;

export type FitLevel = (typeof LEVELS)[number];

/*
 * Tenta cada nível, do texto mais completo ao mais curto, até caber.
 * `floor` é o nível mais curto permitido: quem chama pode preferir abrir
 * espaço de outro jeito (diminuir a foto) antes de cortar mais texto.
 */
export function fitText(
  box: HTMLElement,
  content: HTMLElement,
  maxHeight: number,
  floor: FitLevel = "tiny",
) {
  const last = LEVELS.indexOf(floor);
  for (const level of LEVELS.slice(0, last + 1)) {
    box.dataset.fit = level;
    if (content.offsetHeight <= maxHeight) return level;
  }
  return floor;
}

import type { PlaceId } from "./places";

/*
 * As informações práticas do hotel, num lugar só.
 * Reserva, galeria e rodapé leem daqui.
 */

export type InfoRow = readonly [label: string, value: string];

export const ADDRESS = {
  street: "Avenida da Orla, 1200",
  area: "Orla Norte",
  region: "Litoral Norte da Bahia",
} as const;

export const CONTACT = {
  email: "reservas@aegir.hotel",
  phone: "+55 71 3000-1200",
  instagram: "@aegirhotel",
} as const;

export const STAY: readonly InfoRow[] = [
  ["Check-in", "a partir das 14h"],
  ["Check-out", "até as 12h"],
  ["Antes ou depois", "sob consulta, conforme a ocupação"],
  ["Café da manhã", "incluído em todas as suítes"],
];

export const ARRIVAL: readonly InfoRow[] = [
  ["Aeroporto de Salvador", "48 km, cerca de 50 min de carro"],
  ["Transfer", "sob reserva, a qualquer hora"],
  ["Estacionamento", "coberto, com manobrista"],
  ["Pela praia", "três passarelas de deck até o calçadão"],
];

export const HOURS: readonly InfoRow[] = [
  ["Recepção", "24 horas"],
  ["Café da manhã", "6h30 às 10h30"],
  ["Restaurante Sal", "12h às 15h30 e 19h às 23h"],
  ["Piscina", "7h às 20h"],
  ["Spa Água", "9h às 21h, com hora marcada"],
  ["Mirante", "17h às 20h"],
];

export const POLICIES: readonly InfoRow[] = [
  ["Cancelamento", "sem custo até 72h antes da chegada"],
  ["Crianças", "até 5 anos não pagam no quarto dos pais"],
  ["Pets", "até 10 kg, avisando na reserva"],
  ["Wi-Fi", "em todo o hotel, sem custo"],
];

/* Uma linha útil por lugar: o que a pessoa precisa saber para usar. */
export const PLACE_NOTES: Record<PlaceId, string> = {
  hotel: "Recepção 24 horas · check-in a partir das 14h",
  entrance: "Pela rua · estacionamento com manobrista",
  lobby: "Recepção 24 horas · bar do lobby até a meia-noite",
  pool: "Aberta das 7h às 20h · toalhas no deck",
  restaurant: "Café 6h30 às 10h30 · jantar 19h às 23h",
  spa: "9h às 21h · massagens com hora marcada",
  lookout: "Aberto das 17h às 20h, para o pôr do sol",
  dune: "Para 2 pessoas · café da manhã incluído",
  tide: "Para 2 pessoas + 1 criança · banheiro com vista",
  terrace: "Para 2 pessoas · terraço privativo",
  facade: "Acesso à praia a qualquer hora",
  wing: "Onde ficam as suítes Maré e Terraço",
  plan: "Tudo no térreo, sem degraus entre as áreas",
  model: "A maquete fica exposta no lobby",
};

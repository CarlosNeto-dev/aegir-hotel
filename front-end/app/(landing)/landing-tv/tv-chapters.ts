import { DAY_MOMENTS, formatHour } from "@/app/_shared/lib/data/day-moments";
import {
  ARRIVAL,
  CONTACT,
  HOURS,
  PLACE_NOTES,
  POLICIES,
  STAY,
  type InfoRow,
} from "@/app/_shared/lib/data/hotel-info";
import { PHOTOS } from "@/app/_shared/lib/data/photos";
import {
  formatPrice,
  getPlace,
  JOURNEY_PLACES,
  SUITES,
  type Place,
  type PlaceId,
} from "@/app/_shared/lib/data/places";

/*
 * O conteúdo da landing na TV, em dois níveis:
 * 1. as seis seções, num coverflow curvo;
 * 2. a página de uma seção: cada "fragmento" (lugar, suíte, hora do dia,
 *    foto) com as mesmas informações da seção comum — descrição, destaques,
 *    números e a linha prática.
 * Tudo vem dos mesmos dados das seções normais.
 */
export type TvItem = {
  id: string;
  label: string;
  kicker: string;
  text: string;
  photo: string;
  highlights?: readonly string[];
  facts?: readonly InfoRow[];
  note?: string;
};

export type TvChapter = TvItem & {
  title: string;
  accent: string;
  items: readonly TvItem[];
};

function fromPlace(place: Place, kicker = place.kicker): TvItem {
  return {
    id: place.id,
    label: place.title,
    kicker,
    text: place.description,
    photo: place.photo,
    highlights: place.highlights,
    facts: place.facts,
    note: PLACE_NOTES[place.id as PlaceId],
  };
}

const placeItems = (ids: readonly PlaceId[]) => ids.map((id) => fromPlace(getPlace(id)));

const suiteItems = SUITES.map((suite) =>
  fromPlace(suite, suite.price ? `${suite.kicker} · ${formatPrice(suite.price)} a noite` : suite.kicker),
);

const stayItems: readonly TvItem[] = [
  { id: "estadia", label: "Check-in e café", kicker: "Sua estadia", photo: "suite-terrace", facts: STAY },
  { id: "chegada", label: "Como chegar", kicker: "Chegada", photo: "street-entrance", facts: ARRIVAL },
  { id: "horarios", label: "Horários", kicker: "O dia no hotel", photo: "lobby", facts: HOURS },
  { id: "regras", label: "Combinados", kicker: "Políticas", photo: "pool-courtyard", facts: POLICIES },
].map((item) => ({
  ...item,
  text: "Para reservar, abra o Aegir no celular ou no computador, no mesmo endereço, ou fale com a recepção.",
  note: `${CONTACT.email} · ${CONTACT.phone}`,
}));

export const TV_CHAPTERS: readonly TvChapter[] = [
  {
    id: "abertura",
    label: "Abertura",
    kicker: "Hotel · litoral norte da Bahia",
    title: "Um U aberto",
    accent: "para o mar.",
    text: "A 50 minutos do aeroporto de Salvador: três suítes de frente para o mar, o Restaurante Sal pé na areia e o Spa Água.",
    photo: "aerial-sunset",
    items: placeItems(["hotel", "entrance", "facade", "wing", "plan"]),
  },
  {
    id: "percurso",
    label: "Percurso",
    kicker: "Seis lugares",
    title: "Um lugar",
    accent: "de cada vez.",
    text: "Do lobby ao mirante, o caminho que um hóspede faz no primeiro dia.",
    photo: "pool-courtyard",
    items: JOURNEY_PLACES.map((place) => fromPlace(place)),
  },
  {
    id: "suites",
    label: "Onde dormir",
    kicker: "Três suítes",
    title: "De frente",
    accent: "para o mar.",
    text: "Duna, Maré e Terraço: do bloco central aos degraus das alas.",
    photo: "suite-dune",
    items: suiteItems,
  },
  {
    id: "dia",
    label: "Sol a sol",
    kicker: "Das 8h às 20h",
    title: "Um dia",
    accent: "no hotel.",
    text: "Café debaixo da palhinha, mergulho na borda infinita, massagem e o jantar pé na areia.",
    photo: "beach-restaurant",
    items: DAY_MOMENTS.map((moment) => {
      const place = getPlace(moment.placeId);
      return {
        id: `dia-${moment.hour}`,
        label: moment.title,
        kicker: `${formatHour(moment.hour)} · ${moment.where}`,
        text: moment.text,
        photo: moment.photo,
        highlights: place.highlights.slice(0, 3),
        facts: place.facts,
        note: PLACE_NOTES[moment.placeId],
      };
    }),
  },
  {
    id: "galeria",
    label: "Galeria",
    kicker: "Dezesseis fotos",
    title: "Um hotel",
    accent: "inteiro.",
    text: "Do pátio às suítes: o que cada lugar é, onde fica e quando abre.",
    photo: "white-model",
    items: PHOTOS.map((photo) => ({
      id: `foto-${photo.file}`,
      label: photo.title,
      kicker: photo.kicker,
      text: photo.caption,
      photo: photo.file,
      facts: getPlace(photo.placeId).facts,
      note: PLACE_NOTES[photo.placeId],
    })),
  },
  {
    id: "reserva",
    label: "Sua estadia",
    kicker: "Fim do percurso",
    title: "Sua estadia",
    accent: "começa aqui.",
    text: "Check-in, como chegar, horários e combinados. A reserva se faz pelo celular ou pelo computador.",
    photo: "suite-terrace",
    items: [...stayItems, ...suiteItems],
  },
];

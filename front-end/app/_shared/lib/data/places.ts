export type Fact = readonly [label: string, value: string];

export type Shard = readonly (readonly [x: number, y: number])[];

export type PlaceGroup = "journey" | "suite" | "extra";

export type Place = {
  id: string;
  slug: string;
  photo: string;
  group: PlaceGroup;
  title: string;
  kicker: string;
  cta: string;
  headline?: readonly [plain: string, accent: string];
  summary: string;
  description: string;
  highlights: readonly string[];
  facts: readonly Fact[];
  shard: Shard;
  price?: number;
};

export const PLACES = [
  {
    id: "hotel",
    slug: "hotel",
    photo: "aerial-sunset",
    group: "journey",
    title: "O hotel",
    kicker: "Exterior",
    cta: "Ver o hotel em 3D",
    headline: ["Um U aberto ", "para o mar."],
    summary:
      "Um U aberto para o mar: o bloco de oito andares nos fundos e duas alas que descem em degraus até a praia, com a piscina no meio.",
    description:
      "O Aegir tem a forma de um U aberto para o mar. Nos fundos, virado para a rua, fica o bloco de oito andares: o lobby de pé-direito duplo no térreo, os quartos com varanda de cobogó em cima e o mirante na cobertura. Dele saem duas alas que descem em degraus (cinco, três, dois e um andar) até a praia, e o telhado de cada degrau vira o terraço de uma suíte. No meio do U fica o pátio com a piscina de borda infinita; na frente, o calçadão de ondas pretas e brancas.",
    highlights: [
      "Bloco dos fundos com lobby, quartos e mirante",
      "Duas alas em degraus com as suítes Maré e Terraço",
      "Pátio com piscina de borda infinita",
      "Restaurante no térreo da ala, de frente para a praia",
      "Entrada pela rua, debaixo de uma marquise de madeira",
    ],
    facts: [
      ["Frente", "82 m para a praia"],
      ["Bloco", "54 × 14 m, 8 andares"],
      ["Alas", "14 × 46 m, de 5 a 1 andar"],
      ["Altura", "27 m até o mirante"],
    ],
    shard: [[6, 4], [62, 0], [100, 14], [92, 72], [70, 100], [16, 93], [0, 56]],
  },
  {
    id: "entrance",
    slug: "entrada",
    photo: "street-entrance",
    group: "journey",
    title: "A entrada",
    kicker: "Rua",
    cta: "Ver a entrada em 3D",
    headline: ["A chegada é ", "debaixo da madeira."],
    summary:
      "Uma marquise de madeira de 18 metros, um retorno de pedra com um canteiro de coqueiros e o lobby de vidro logo atrás.",
    description:
      "Quem chega de carro entra num retorno de paralelepípedo claro e para debaixo de uma marquise de madeira de 18 metros, apoiada em apenas dois pilares escuros. No meio do retorno, um canteiro redondo com coqueiros e plantas de restinga faz a rotatória. A fachada da rua é de concreto, com rasgos verticais de vidro e ripas de madeira; no térreo, o vidro do lobby já deixa ver os sofás lá dentro, e uma porta de vidro leva direto para a recepção.",
    highlights: [
      "Retorno para carros e táxis",
      "Marquise de madeira sobre o desembarque",
      "Canteiro redondo com coqueiros",
      "Banco de madeira no jardim da calçada",
      "Porta de vidro direto para o lobby",
    ],
    facts: [
      ["Marquise", "18 × 8 m, de madeira"],
      ["Canteiro", "9,2 m de diâmetro"],
      ["Retorno", "94 × 16 m de paralelepípedo"],
      ["Fachada", "54 m de concreto e ripas"],
    ],
    shard: [[0, 18], [42, 0], [100, 8], [93, 60], [100, 100], [34, 91], [8, 100]],
  },
  {
    id: "lobby",
    slug: "lobby",
    photo: "lobby",
    group: "journey",
    title: "Lobby",
    kicker: "Térreo",
    cta: "Ver o lobby em 3D",
    headline: ["Pé-direito de ", "7,7 metros."],
    summary:
      "Uma parede de cobogó de furo redondo, um balcão de travertino com luminárias de palhinha e o vidro inteiro abrindo para o pátio e o mar.",
    description:
      "Um salão de 20 por 14 metros com pé-direito duplo de 7,7 m e piso de travertino. Do lado esquerdo, uma parede inteira de cobogó de furo redondo filtra o sol em bolinhas de luz, com uma floreira baixa de plantas ao pé. No fundo ficam o balcão de recepção de travertino sobre madeira ripada, com três luminárias de palhinha, os dois elevadores de bronze e a porta para a rua. Na frente, um pano de vidro de 20 metros abre para o pátio e a piscina.",
    highlights: [
      "Balcão de travertino com 3 luminárias de palhinha",
      "Duas salas de estar com sofás de linho e poltronas",
      "Quatro colunas redondas de 7,7 m",
      "Dois elevadores para as suítes e o mirante",
      "Parede de ripas de madeira com a porta da rua",
    ],
    facts: [
      ["Salão", "20 × 14 m"],
      ["Pé-direito", "7,7 m"],
      ["Cobogó", "13,6 × 7,6 m"],
      ["Vidro", "20 m, do chão ao teto"],
    ],
    shard: [[14, 0], [100, 6], [88, 44], [100, 92], [50, 100], [0, 84], [7, 36]],
  },
  {
    id: "pool",
    slug: "piscina",
    photo: "pool-courtyard",
    group: "journey",
    title: "Pátio e piscina",
    kicker: "Pátio",
    cta: "Ver o pátio em 3D",
    headline: ["A água termina ", "onde começa o mar."],
    summary:
      "Entre as duas alas de cobogó, uma piscina de borda infinita aponta para a praia, com espreguiçadeiras, guarda-sóis e coqueiros dos dois lados.",
    description:
      "O pátio fica no meio do U: 54 por 32 metros entre as duas alas, que descem em degraus até a praia. A piscina de 16 por 24 metros corre no sentido do mar e termina numa borda infinita, então a água parece continuar na areia. Em volta, um deck de travertino com espreguiçadeiras de almofada branca, cabanas de sombra e coqueiros dos dois lados. As fachadas das alas são de cobogó, com varandas e floreiras. Depois da borda vem o calçadão de ondas pretas e brancas.",
    highlights: [
      "Borda infinita virada para o mar",
      "Espreguiçadeiras e cabanas de sombra",
      "Coqueiros dos dois lados da piscina",
      "Fachadas de cobogó com varandas",
      "Acesso ao lobby, ao restaurante e ao spa",
    ],
    facts: [
      ["Pátio", "54 × 32 m"],
      ["Piscina", "16 × 24 m"],
      ["Profundidade", "1,2 m"],
      ["Borda", "infinita, virada para a praia"],
    ],
    shard: [[0, 8], [70, 0], [100, 30], [95, 100], [30, 93], [0, 100], [5, 50]],
  },
  {
    id: "restaurant",
    slug: "restaurante",
    photo: "beach-restaurant",
    group: "journey",
    title: "Restaurante Sal",
    kicker: "Pé na areia",
    cta: "Ver o restaurante em 3D",
    headline: ["Jantar ", "com o mar do lado."],
    summary:
      "No térreo da ala, de frente para a praia: mesas com toalha branca, poltronas de vime e luminárias de palhinha debaixo da marquise.",
    description:
      "No térreo da ala, de frente para a praia. O salão de 14 por 9 metros tem piso de travertino e, no fundo, um bar de madeira escura com tampo de travertino e três prateleiras de garrafas. A laje de cima avança 4,2 metros sobre a varanda de deck, com forro de madeira e quatro colunas redondas, e faz a sombra das mesas de fora. São 13 mesas redondas com toalha branca, cada uma com duas poltronas de vime, e luminárias de palhinha penduradas. Uma floreira de restinga separa a varanda da areia.",
    highlights: [
      "Bar de madeira com adega aberta",
      "Mesas no salão e na varanda coberta",
      "Luminárias de palhinha acesas à noite",
      "Floreira de restinga entre o deck e a praia",
      "Porta para o pátio e a piscina",
    ],
    facts: [
      ["Salão", "14 × 9 m"],
      ["Varanda", "14 × 5,6 m de deck"],
      ["Lugares", "26, em 13 mesas"],
      ["Bar", "8 m, com adega"],
    ],
    shard: [[10, 0], [86, 10], [100, 58], [80, 100], [20, 95], [0, 66], [5, 20]],
  },
  {
    id: "spa",
    slug: "spa",
    photo: "garden-spa",
    group: "journey",
    title: "Spa Água",
    kicker: "Bem-estar",
    cta: "Ver o spa em 3D",
    headline: ["Água parada, ", "jardim em volta."],
    summary:
      "Um espelho d’água escuro com pisantes de pedra, uma cabana de voal para massagem ao ar livre e a sala de cobogó com duas macas.",
    description:
      "Um jardim fechado com um espelho d’água escuro de 12 por 6,5 metros. Seis pisantes de travertino atravessam a água até uma cabana de madeira com cortinas de voal, onde fica uma maca para massagem ao ar livre. Na borda, duas espreguiçadeiras e uma mesinha de tronco; em volta, jardim tropical denso e três coqueiros. No fundo, a sala de massagem tem duas macas, uma bacia de pedra com água, velas e uma parede inteira de cobogó que deixa o jardim aparecer pelos furos.",
    highlights: [
      "Cabana de voal sobre um deck dentro d’água",
      "Pisantes de travertino sobre o espelho d’água",
      "Sala com duas macas e parede de cobogó",
      "Bacia de pedra com água e velas",
      "Jardim tropical com três coqueiros",
    ],
    facts: [
      ["Espelho d’água", "12 × 6,5 m"],
      ["Cabana", "3,2 × 3,2 m"],
      ["Sala", "9 × 7 m, pé-direito 3,2 m"],
      ["Macas", "3 (2 na sala, 1 na cabana)"],
    ],
    shard: [[0, 12], [30, 0], [100, 4], [100, 70], [74, 100], [8, 92], [2, 46]],
  },
  {
    id: "lookout",
    slug: "mirante",
    photo: "pergola-lookout",
    group: "journey",
    title: "Mirante",
    kicker: "Cobertura",
    cta: "Ver o mirante em 3D",
    headline: ["A cobertura ", "inteira é sua."],
    summary:
      "Uma pérgola de madeira de 37 metros, bar de travertino, três salas ao ar livre e o pôr do sol do lado do mar.",
    description:
      "A cobertura inteira do bloco dos fundos, a 27 metros de altura. Uma pérgola de madeira de 37 por 9,4 metros cobre o deck e faz sombra em ripas. Debaixo dela ficam o bar de travertino com seis banquetas e uma prateleira de garrafas, e três salas ao ar livre, cada uma com sofá em L, mesa de pedra, pufe e uma luminária de palhinha. Nas pontas, espreguiçadeiras viradas para o mar; na frente, uma floreira com plantas pendentes e um guarda-corpo de vidro. O elevador chega numa casinha ao lado.",
    highlights: [
      "Pérgola de madeira sobre todo o deck",
      "Bar de travertino com seis banquetas",
      "Três salas com sofá em L e mesa de pedra",
      "Espreguiçadeiras nas pontas, viradas para o mar",
      "Guarda-corpo de vidro e floreira pendente",
    ],
    facts: [
      ["Cobertura", "54 × 14 m"],
      ["Pérgola", "37 × 9,4 m"],
      ["Bar", "7 m de travertino"],
      ["Altura", "27 m"],
    ],
    shard: [[18, 0], [100, 0], [92, 40], [100, 86], [40, 100], [0, 90], [8, 30]],
  },
  {
    id: "dune",
    slug: "suite-duna",
    photo: "suite-dune",
    group: "suite",
    title: "Suíte Duna",
    kicker: "Bloco central",
    cta: "Ver a suíte em 3D",
    summary:
      "O quarto de casal clássico: cabeceira ripada de cumaru, linho cru, cortina de voal e uma varanda com guarda-corpo de cobogó.",
    description:
      "O quarto de casal clássico, no bloco central. Atrás da cama king, uma cabeceira de 35 ripas de cumaru; dos lados, criados-mudos com abajur de cerâmica. O banheiro fica num canto, com bancada de travertino, cuba de cerâmica e box de vidro. Há um armário de três portas, uma escrivaninha com cadeira de couro e uma poltrona de bouclé. A porta de vidro, com cortina de linho e voal, abre para uma varanda com duas cadeiras de rattan e guarda-corpo de cobogó.",
    highlights: [
      "Cabeceira ripada de cumaru",
      "Banheiro com bancada de travertino e box de vidro",
      "Escrivaninha e poltrona de bouclé",
      "Varanda com duas cadeiras de rattan",
      "Guarda-corpo de cobogó e brise de madeira",
    ],
    facts: [
      ["Área", "22 m² + varanda 6 m²"],
      ["Hóspedes", "2"],
      ["Cama", "king, 180 × 200 cm"],
      ["Banheiro", "chuveiro, cuba de cerâmica"],
    ],
    shard: [[0, 4], [68, 0], [100, 30], [94, 100], [22, 95], [3, 62], [8, 30]],
    price: 1280,
  },
  {
    id: "tide",
    slug: "suite-mare",
    photo: "suite-tide",
    group: "suite",
    title: "Suíte Maré",
    kicker: "Alas",
    cta: "Ver a suíte em 3D",
    summary:
      "Luz em bolinhas pela tela de cobogó, armário de palhinha, banheira de imersão e um banheiro de travertino com duas cubas de pedra.",
    description:
      "A suíte grande das alas. A cama king fica de frente para a varanda, com uma parede de ripas atrás; por trás dela está o banheiro, com bancada dupla, dois espelhos redondos e um chuveiro separado por cobogó. Ao lado da janela, uma banheira de imersão recebe a luz em bolinhas da tela de cobogó. A sala tem sofá de linho, duas poltronas, mesa redonda e um aparador-bar de travertino. O armário tem portas de palhinha. Na varanda, uma cama de dossel com voal e duas cadeiras.",
    highlights: [
      "Banheira de imersão junto da tela de cobogó",
      "Banheiro com bancada dupla e chuveiro de cobogó",
      "Sala com sofá, poltronas e aparador-bar",
      "Armário com portas de palhinha",
      "Varanda com cama de dossel de voal",
    ],
    facts: [
      ["Área", "41 m² + varanda 15 m²"],
      ["Hóspedes", "2 + 1 criança"],
      ["Cama", "king, 190 × 205 cm"],
      ["Banheiro", "banheira e duas cubas"],
    ],
    shard: [[8, 0], [100, 10], [90, 62], [100, 100], [38, 93], [0, 80], [6, 30]],
    price: 2150,
  },
  {
    id: "terrace",
    slug: "suite-terraco",
    photo: "suite-terrace",
    group: "suite",
    title: "Suíte Terraço",
    kicker: "Degraus das alas",
    cta: "Ver a suíte em 3D",
    summary:
      "No telhado de um degrau da ala: o quarto abre para um terraço com piscina privativa, pérgola, espreguiçadeiras e o pôr do sol.",
    description:
      "Fica no telhado de um dos degraus da ala, então o quarto tem um terraço só seu. Dentro, um painel ripado de madeira atrás da cama king, dois criados-mudos com pendentes, uma poltrona de vime e um vidro de 7 metros com voal. Lá fora, 55 m² de deck com uma piscina privativa de pedra escura, uma pérgola de madeira sobre duas espreguiçadeiras e floreiras com plantas pendentes nos três lados. É a suíte do pôr do sol.",
    highlights: [
      "Piscina privativa de 2,6 × 5 m",
      "Pérgola de madeira com duas espreguiçadeiras",
      "Floreiras com plantas pendentes em volta",
      "Vidro de 7 m do quarto para o terraço",
      "Painel ripado atrás da cama",
    ],
    facts: [
      ["Área", "42 m² + terraço 55 m²"],
      ["Hóspedes", "2"],
      ["Cama", "king, 200 × 210 cm"],
      ["Lá fora", "piscina privativa e pérgola"],
    ],
    shard: [[4, 10], [62, 0], [100, 18], [100, 86], [58, 100], [10, 96], [0, 50]],
    price: 3600,
  },
  {
    id: "facade",
    slug: "fachada",
    photo: "front-facade",
    group: "extra",
    title: "Fachada e praia",
    kicker: "Exterior · praia",
    cta: "Ver a fachada em 3D",
    summary:
      "A frente do hotel vista da areia: as alas em degraus, o bloco de vidro no fundo, o calçadão de ondas, o quiosque e o mar.",
    description:
      "É o que você vê chegando pela praia. Na frente, o mar e a faixa de areia com guarda-sóis de lona, pares de espreguiçadeiras e um quiosque de madeira com telhado de quatro águas e três banquetas. Três passarelas de deck atravessam a restinga até o calçadão de ondas pretas e brancas, que tem postes de luz e bancos de madeira a cada 12 metros. Atrás dele começa o hotel: as duas alas descem em degraus dos lados, com floreiras e plantas pendentes em cada andar, e no meio a borda infinita da piscina aponta para você. No fundo, o bloco de oito andares mostra as varandas de vidro e as ripas de madeira.",
    highlights: [
      "Faixa de areia com guarda-sóis e espreguiçadeiras",
      "Quiosque de madeira com balcão de travertino",
      "Três passarelas de deck sobre a restinga",
      "Calçadão de ondas com postes e bancos",
      "As fachadas das alas e do bloco viradas para o mar",
    ],
    facts: [
      ["Frente", "82 m de praia"],
      ["Calçadão", "6,5 m de largura"],
      ["Quiosque", "3,6 × 3 m"],
      ["Postes", "a cada 12 m"],
    ],
    shard: [[0, 10], [56, 0], [100, 6], [96, 64], [100, 100], [30, 94], [4, 100]],
  },
  {
    id: "wing",
    slug: "ala",
    photo: "side-steps",
    group: "extra",
    title: "A ala em degraus",
    kicker: "Exterior · lateral",
    cta: "Ver a ala em 3D",
    summary:
      "Uma ala sozinha, vista de lado: cinco andares no fundo descendo até um na praia, com um terraço-jardim em cada degrau.",
    description:
      "Só a ala do leste, separada do resto do hotel. Ela tem 14 metros de largura e 46 de comprimento e desce em quatro degraus: cinco andares junto do bloco dos fundos, depois três, dois e um, já de frente para a areia. O telhado de cada degrau vira o terraço de uma suíte, com deck de madeira, floreiras com plantas pendentes e, nos degraus do meio, duas piscinas privativas de pedra. A fachada de fora é de pedra clara com rasgos verticais de vidro e ripas de madeira. Do lado de fora corre um caminho de paralelepípedo entre coqueiros e restinga, e na frente ficam a areia e o mar.",
    highlights: [
      "Quatro degraus: 5, 3, 2 e 1 andar",
      "Terraço-jardim no telhado de cada degrau",
      "Piscinas privativas nos terraços do meio",
      "Fachada de pedra com rasgos de vidro e ripas",
      "Caminho de paralelepípedo entre coqueiros",
    ],
    facts: [
      ["Ala", "14 × 46 m"],
      ["Degraus", "5, 3, 2 e 1 andar"],
      ["Andar tipo", "3,2 m"],
      ["Altura", "20,5 m no ponto mais alto"],
    ],
    shard: [[8, 0], [100, 12], [92, 56], [100, 96], [44, 100], [0, 88], [6, 40]],
  },
  {
    id: "plan",
    slug: "planta",
    photo: "aerial-view",
    group: "extra",
    title: "A planta do térreo",
    kicker: "Exterior · de cima",
    cta: "Ver a planta em 3D",
    summary:
      "O hotel inteiro visto de cima e cortado a 2,9 m do chão, como uma planta de arquitetura: dá para ver o que tem dentro.",
    description:
      "A vista de cima, só que com o telhado tirado: o hotel foi cortado a 2,9 metros do chão e as paredes cortadas ficam brancas, como numa maquete de planta. Assim aparece o térreo inteiro. No bloco dos fundos, o lobby com o balcão de travertino, os elevadores e quatro salas de estar com sofás, poltronas e tapetes. Na ala do leste, de frente para a praia, o restaurante com dez mesas de toalha e o bar com banquetas; atrás dele, uma sala de leitura e a academia. Na ala do oeste, o bar da piscina, o spa com três macas e uma bacia de pedra, e a outra academia. No meio do U, o pátio com a piscina e as copas das palmeiras desenhadas como círculos verdes.",
    highlights: [
      "Lobby com balcão, elevadores e quatro salas de estar",
      "Restaurante com dez mesas e bar com banquetas",
      "Spa com três macas e uma bacia de pedra",
      "Duas academias e uma sala de leitura",
      "Pátio com a piscina e as copas das palmeiras",
    ],
    facts: [
      ["Corte", "a 2,9 m do chão"],
      ["Térreo", "82 × 46 m"],
      ["Lobby", "54 × 14 m"],
      ["Pátio", "54 × 32 m"],
    ],
    shard: [[4, 0], [60, 6], [100, 0], [94, 58], [100, 100], [20, 96], [0, 60]],
  },
  {
    id: "model",
    slug: "maquete",
    photo: "white-model",
    group: "extra",
    title: "A maquete",
    kicker: "Ateliê · escala 1:100",
    cta: "Ver a maquete em 3D",
    summary:
      "O hotel inteiro em escala 1:100, de papel branco e balsa, em cima da mesa de um ateliê de arquitetura.",
    description:
      "Antes de existir, um hotel vira maquete. Aqui ele está em escala 1:100: cada metro de verdade é um centímetro, então o hotel inteiro cabe numa placa de 1,1 por 0,8 metro. As paredes são de papel branco, os decks e as ripas de madeira balsa, a água da piscina é azul e as palmeiras são de serragem verde. A maquete está numa mesa grande de madeira, junto de um tapete de corte verde com régua de metal e lápis, uma pilha de folhas, livros de arquitetura, uma caneca e uma luminária articulada. Atrás, uma estante com maquetes de estudo e dois quadros na parede.",
    highlights: [
      "Maquete do hotel inteiro em escala 1:100",
      "Papel branco, balsa, água azul e árvores de serragem",
      "Tapete de corte, régua de metal e lápis",
      "Livros, caneca e luminária articulada",
      "Estante com maquetes de estudo",
    ],
    facts: [
      ["Escala", "1:100"],
      ["Base", "1,1 × 0,8 m"],
      ["Mesa", "2,8 × 1,7 m"],
      ["Hotel na maquete", "82 × 53 cm"],
    ],
    shard: [[0, 6], [44, 0], [100, 10], [100, 70], [70, 100], [10, 92], [3, 50]],
  },
] as const satisfies readonly Place[];

export type PlaceId = (typeof PLACES)[number]["id"];

const PLACES_LIST: readonly Place[] = PLACES;

export const HOTEL = PLACES[0];

export const JOURNEY_PLACES = PLACES_LIST.filter(
  (place) => place.group === "journey" && place.id !== "hotel",
);

export const RING_PLACES = PLACES_LIST.filter(
  (place) => place.group === "journey",
);

export const SUITES = PLACES_LIST.filter((place) => place.group === "suite");

export function getPlace(id: PlaceId): Place {
  return PLACES_LIST.find((place) => place.id === id) ?? HOTEL;
}

export function getPlaceBySlug(slug: string) {
  return PLACES_LIST.find((place) => place.slug === slug);
}

export function photoSrc(photo: string) {
  return `/photos/${photo}.webp`;
}

export function thumbSrc(photo: string) {
  return `/photos/thumbs/${photo}.webp`;
}

export function shardPath(shard: Shard) {
  return shard.map(([x, y]) => `${x}% ${y}%`).join(", ");
}

export function formatPrice(value: number) {
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

"use client";

import { useEffect, useState } from "react";

/*
 * Que tipo de aparelho a pessoa está usando: toque (celular/tablet), mouse
 * (computador) ou controle remoto (TV). O CSS sozinho erra em alguns
 * celulares: os Samsung com S Pen, por exemplo, dizem "pointer: fine" e
 * passavam por computador. Então a decisão junta três pistas e ainda é
 * confirmada pelo primeiro toque ou movimento de mouse de verdade.
 */
export type PointerKind = "mouse" | "touch" | "remote";

const TV_QUERY = "(min-width: 2560px)";

/*
 * Pedaços do user agent que só TVs costumam mandar. A comparação é feita em
 * minúsculas (isTvDevice converte o user agent antes), por isso estão todos
 * escritos assim. O "tizen" ficou de fora de propósito: o sistema Tizen também
 * roda nos relógios Galaxy Watch, e a TV Samsung já se identifica por
 * "smart-tv". No Fire TV, o "; " antes de "aft" faz casar só o começo do código
 * do modelo (AFTMM, AFTKA...), e não palavras como "after".
 */
const TV_USER_AGENT_MARKERS: readonly string[] = [
  // Genéricos: o padrão HbbTV, o termo "smart tv" e o navegador Opera TV
  "hbbtv", "smarttv", "smart tv", "opera tv",

  // Samsung: o navegador da TV se apresenta como "SMART-TV"
  "smart-tv",

  // LG: os sistemas webOS e NetCast
  "web0s", "netcast",

  // Google: os sistemas Android TV e Google TV
  "android tv", "googletv",

  // Sony: a linha de TVs Bravia
  "bravia",

  // Xiaomi: as linhas de aparelhos Mi TV e Mi Box
  "mitv", "mibox",

  // Amazon Fire TV: o começo do código de modelo (AFTMM, AFTKA...)
  "; aft",

  // Chromecast: o aparelho se apresenta como "CrKey"
  "crkey",

  // Firefox OS: o sistema das TVs que rodavam Firefox
  "tv; rv:",
];

/*
 * O aparelho é uma TV? Sim quando o user agent traz um dos marcadores acima, ou
 * quando não há ponteiro nem toque (só o controle de setas). O
 * "(pointer: none)" olha só o ponteiro principal, o que o navegador escolhe
 * como entrada primária; o "any-pointer" olharia todos. A largura da tela não
 * entra: a TV costuma ter menos pixels CSS que um monitor grande.
 * Só chame no navegador (dentro de um useEffect ou de um evento): no servidor
 * não há aparelho para ler, e a resposta não bateria com a do navegador na
 * hidratação. Limitação conhecida: um PC sem mouse também cai na segunda regra.
 */
export function isTvDevice(): boolean {
  const lowerUserAgent = navigator.userAgent.toLowerCase();

  const userAgentSaysTv = TV_USER_AGENT_MARKERS.some((marker) => lowerUserAgent.includes(marker));
  const keysOnly =
    navigator.maxTouchPoints === 0 &&
    window.matchMedia("(pointer: none)").matches;

  return userAgentSaysTv || keysOnly;
}

function guessKind(): PointerKind {
  if (window.matchMedia(TV_QUERY).matches) return "remote";
  const coarse =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(any-pointer: coarse)").matches;
  if (navigator.maxTouchPoints > 0 && coarse) return "touch";
  if (window.matchMedia("(hover: none)").matches) return "touch";
  return "mouse";
}

export function usePointerKind(): PointerKind {
  const [kind, setKind] = useState<PointerKind>("mouse");

  useEffect(() => {
    const tv = window.matchMedia(TV_QUERY);
    let current = guessKind();
    setKind(current);

    const set = (next: PointerKind) => {
      if (tv.matches) next = "remote";
      if (next === current) return;
      current = next;
      setKind(next);
    };

    // A prova real: o primeiro evento diz se veio de um dedo ou de um mouse.
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") set("mouse");
      else if (event.pointerType === "touch" || event.pointerType === "pen") set("touch");
    };
    const onScreen = () => set(guessKind());

    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    tv.addEventListener("change", onScreen);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointermove", onPointer);
      tv.removeEventListener("change", onScreen);
    };
  }, []);

  return kind;
}

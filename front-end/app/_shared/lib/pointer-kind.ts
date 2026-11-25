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

"use client";

import { useEffect, useState } from "react";
import type { PointerKind } from "./settings-routes";

const QUERIES: readonly [PointerKind, string][] = [
  ["remote", "(min-width: 2560px)"],
  ["touch", "(hover: none) and (pointer: coarse)"],
];

export function usePointerKind(): PointerKind {
  const [kind, setKind] = useState<PointerKind>("mouse");

  useEffect(() => {
    const lists = QUERIES.map(
      ([name, query]) => [name, window.matchMedia(query)] as const,
    );

    function update() {
      setKind(lists.find(([, list]) => list.matches)?.[0] ?? "mouse");
    }

    update();
    lists.forEach(([, list]) => list.addEventListener("change", update));
    return () =>
      lists.forEach(([, list]) => list.removeEventListener("change", update));
  }, []);

  return kind;
}

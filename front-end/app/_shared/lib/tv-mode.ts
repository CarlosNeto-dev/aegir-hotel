"use client";

import { useEffect, useState } from "react";
import { usePointerKind } from "./pointer-kind";

const PREVIEW_HASH = "#tv";

/*
 * A landing está no modo TV? Sim quando o aparelho é uma TV (controle remoto)
 * ou quando o endereço termina em #tv (para ver a versão da TV em qualquer
 * tela). Quem usa: a troca de landing (LandingScreen) e o painel de Ajustes,
 * que na TV mostra só o essencial.
 */
export function useTvMode() {
  const kind = usePointerKind();
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const check = () => setPreview(window.location.hash === PREVIEW_HASH);
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  return kind === "remote" || preview;
}

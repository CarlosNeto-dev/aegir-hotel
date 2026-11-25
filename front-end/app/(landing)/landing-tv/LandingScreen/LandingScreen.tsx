"use client";

import { useEffect, type ReactNode } from "react";
import { useTvMode } from "@/app/_shared/lib/tv-mode";

/*
 * Decide qual landing aparece. Na TV (controle remoto), a página comprida dá
 * lugar ao coverflow curvo: ninguém precisa rolar a página inteira com a seta.
 * No computador e no celular, fica a landing de sempre. Para ver a versão da
 * TV em qualquer tela, basta abrir o endereço com #tv no fim.
 *
 * O servidor sempre desenha a landing normal; a troca acontece depois, por
 * baixo da tela de carregamento, então ninguém vê a troca.
 */
export default function LandingScreen({ tv, children }: { tv: ReactNode; children: ReactNode }) {
  const onTv = useTvMode();

  // A marca no <html> esconde o header e trava a rolagem (veja _tv.scss).
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-tv-landing", onTv);
    return () => root.removeAttribute("data-tv-landing");
  }, [onTv]);

  return onTv ? tv : children;
}

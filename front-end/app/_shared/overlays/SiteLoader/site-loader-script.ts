/*
 * A tela de carregamento aparece em TODA visita e em toda atualização (F5),
 * porque é nela que as fotos e as fontes carregam. Quando ela termina, marca
 * o <html> com data-site-loader="done": o botão "Role para baixo" espera essa
 * marca, e numa navegação interna de volta para a landing (sem recarregar)
 * a tela não aparece de novo, porque tudo já está carregado.
 */
export const LOADER_DONE = "done";

export const loaderNoScript = "[data-loader-screen]{display:none!important}";

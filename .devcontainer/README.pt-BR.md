# 🧩 `.devcontainer/` — dev-container VS Code / Codespaces

<p>
  <img alt="Dev Containers" src="https://img.shields.io/badge/Dev%20Containers-via%20compose-007ACC?logo=visualstudiocode&logoColor=white">
  <img alt="Service" src="https://img.shields.io/badge/servi%C3%A7o-website-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

```
.devcontainer/
└── frontend/
    └── devcontainer.json     # dev-container do cliente web
```

> Este é o **passo 1** do fluxo de contribuição — guia completo em
> [`../.github/CONTRIBUTING.pt-BR.md`](../.github/CONTRIBUTING.pt-BR.md).

---

## O que faz

`frontend/devcontainer.json` **não** define uma imagem própria. Ele aponta para
[`../docker/docker-compose.yml`](../docker/docker-compose.yml) e conecta o editor
ao serviço **`website`** (o estágio `debugger` do `docker/Dockerfile.frontend`).

Ao usar **Reopen in Container**:

1. `website` + `tests` são construídos e iniciados via Compose.
2. O editor abre um shell em `/app`.
3. `postCreateCommand` roda `pnpm install` — isso resolve e grava o
   `app/pnpm-lock.yaml` (que está no `.gitignore`) do zero; não há lock
   versionado pra sincronizar.
4. `overrideCommand: true` mantém o container como um shell simples de longa
   duração em vez de rodar o comando de dev-server do Compose — você mesmo inicia
   `pnpm dev` pelo terminal integrado.

Portas encaminhadas: `5173` (Vite), `4173` (preview), `51204` (UI do Vitest),
`9229` (inspetor do Node) — iguais às do `docker/.env`.

---

## Extensões instaladas no container

| Extensão | Para |
|----------|------|
| `dbaeumer.vscode-eslint` | lint |
| `esbenp.prettier-vscode` | formatação (format-on-save) |
| `glenn2223.live-sass` | compilação opcional de SCSS → CSS isolado |
| `stylelint.vscode-stylelint` | lint de SCSS |
| `ms-azuretools.vscode-docker` | ferramentas Docker / Compose |
| `vitest.explorer` | rodar testes pelo editor |
| `slevesque.shader` | sintaxe GLSL (shaders r3f no futuro) |

As configurações do Live Sass Compiler (`liveSassCompile.settings.*`) geram um
`.css` `expanded` + source map em **uma pasta dedicada**,
[`app/src/styles/css/`](../app/src/styles) (o `savePath` é relativo ao workspace,
e o `workspaceFolder` é `/app`) — não ao lado de cada `.scss`. O `*.module.scss`
está na `excludeList`: os estilos de componente são compilados só pelo Vite. O
conteúdo da pasta é ignorado pelo git (a pasta em si é mantida por `.gitkeep`) —
veja [`../.gitignore`](../.gitignore).

Esse CSS é para inspeção / uso isolado; **o app nunca importa ele**. O Vite
compila `.scss` no import (`src/main.tsx` → `import "./styles/main.scss"`).

### `files.autoSave: onFocusChange`

Definido de propósito. O padrão do editor é `off` — um buffer não salvo nunca
chega no arquivo do bind mount, então o HMR do Vite não tem o que reagir até
você fechar a aba. `onFocusChange` grava o arquivo assim que você troca pro
navegador ou pro terminal, que é exatamente quando você quer o HMR disparando.
Recarregue a janela depois de mudar isso (não precisa `Rebuild` — é config de
editor).

---

## Por que uma subpasta `frontend/`?

Dev Containers suporta múltiplas configurações, uma por subpasta de
`.devcontainer/`. O projeto é só front-end hoje; se algum serviço separado
precisar do próprio container, ele ganha uma pasta irmã e o editor mostra um
seletor no "Reopen in Container".

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🤝 Fluxo de contribuição](../.github/CONTRIBUTING.pt-BR.md) ·
[🎨 app/](../app/README.pt-BR.md) ·
[🐳 docker/](../docker/README.pt-BR.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](README.md)

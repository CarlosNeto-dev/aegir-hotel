# 🎨 `app/` — o cliente web

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.83-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

Esta pasta é todo o front-end. Ela é **montada como volume em `/app`** dentro do
container (veja [`../docker/README.pt-BR.md`](../docker/README.pt-BR.md)), então
tudo que você faz aqui é o que roda.

---

## 🗂️ Estrutura de pastas

```
app/
├── index.html                 # documento de entrada do Vite (fica na raiz de app/, NÃO em src/)
├── package.json               # dependências + scripts (já commitado)
├── package-lock.json          # árvore exata de dependências — commite; o `npm ci` precisa
├── eslint.config.js           # config flat do ESLint 9 (TS + react-hooks + react-refresh)
├── .prettierrc.json           # opções do Prettier   (.prettierignore exclui *.md)
├── .stylelintrc.json          # config do Stylelint (SCSS)
├── vite.config.ts             # já commitado — Vite + React, HMR por polling no Docker
├── tsconfig.json · tsconfig.node.json
├── public/                    # servido como está em "/" — favicon, robots.txt, models/
│   └── models/                # .glb / .gltf para react-three-fiber (futuro)
└── src/
    ├── main.tsx               # bootstrap da aplicação (monta <App/>)
    ├── App.tsx
    ├── vite-env.d.ts
    ├── assets/                # imagens / fontes importadas (empacotadas, com hash)
    ├── components/            # UI reutilizável — uma pasta por componente
    │   └── Button/
    │       ├── Button.tsx
    │       ├── Button.module.scss
    │       └── Button.test.tsx
    ├── pages/                 # telas de rota
    ├── hooks/                 # hooks React customizados (useXxx)
    ├── lib/                   # helpers agnósticos de framework (setup do GSAP, formatadores…)
    ├── scenes/                # cenas react-three-fiber (futuro)
    ├── styles/                # SOMENTE SCSS GLOBAL: _tokens, _mixins, _reset, main.scss
    └── types/                 # tipos TypeScript compartilhados
```

### 📐 Regras da estrutura

1. **Por funcionalidade, co-localizado.** O `.tsx` de um componente, seu
   `.module.scss` e seu `.test.tsx` ficam na **mesma pasta**. Não crie um `ts/`
   global nem um `styles/` global para código de componente — mover ou apagar uma
   funcionalidade deve mexer em exatamente uma pasta.
2. **`src/styles/` é só para globais** — tokens de design, mixins, resets, o
   `main.scss` raiz importado uma vez no `main.tsx`. Nada específico de componente.
3. **`index.html` fica na raiz de `app/`.** O Vite o trata como documento de
   entrada e resolve `/src/main.tsx` a partir dali.
4. **`public/` vs `src/assets/`** — `public/` é copiado literalmente (URLs
   estáveis, arquivos de modelos 3D); `src/assets/` é importado no código e
   recebe hash/bundle.
5. **Alias de path:** `@/` → `src/` (configurado em `tsconfig.json` +
   `vite.config.ts`).

---

## 💅 SCSS — dois jeitos suportados

| | Vite nativo *(padrão / caminho de build)* | Live Sass Compiler *(opcional)* |
|-|-------------------------------------------|--------------------------------|
| Como | `import "./Button.module.scss"` no componente | extensão `glenn2223.live-sass` → clicar em **Watch Sass** |
| Saída | compilado em memória pelo Vite, HMR instantâneo | um `Button.css` (+ `.map`) real escrito ao lado do `.scss` |
| Escopo | `*.module.scss` → nomes de classe com hash | CSS puro, sem escopo a menos que importe o `.css` como módulo |
| Quando | estilização diária de componentes | quando quer uma folha de estilo isolada e inspecionável |

Arquivos `.css` / `.css.map` gerados em `src/` são **ignorados pelo git** (veja
`../.gitignore`). O Vite já usa a API moderna do compilador Dart Sass — definido
em `vite.config.ts`:

```ts
css: { preprocessorOptions: { scss: { api: "modern-compiler" } } }
```

---

## 📦 Saída de build (`dist/`)

`npm run build` roda `tsc -b` e depois `vite build`. Saída verificada para um app
mínimo:

```
dist/
├── index.html                    # minificado, tags de asset injetadas
└── assets/
    ├── index-<hash>.css           # TODO .scss unido → um arquivo minificado
    └── index-<hash>.js            # empacotado + minificado (esbuild)
```

- **Nenhum `.scss` chega ao `dist/`.** O Sass é compilado para CSS no build; os
  arquivos `.scss` de origem nunca são publicados.
- **`dist/` é minificado** por padrão em modo produção — espaços do CSS removidos
  (`opacity:.8`), JS "mangled", tamanhos gzip reportados pelo build.
- Cada `main.scss` global **e** cada `*.module.scss` colapsam num único
  `assets/index-<hash>.css` com hash. Classes de módulo mantêm o nome com hash
  (`_title_sr706_1`).
- `dist/` é gerado, ignorado pelo git e produzido do zero pela CI a cada tag de
  release — nunca commite.

---

## 🚀 Bootstrap da aplicação

O container roda `npm install` ao subir, então você só precisa criar os arquivos
de código. Faça isto **uma vez**, a partir de `app/`.

### 1. `package.json` — já commitado

`package.json`, `package-lock.json` e as configs de lint/formatação
(`eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `.stylelintrc.json`)
já estão no repo. Traz React 19, GSAP, Vite 6, Vitest 2, Sass, mais o ferramental
que o pipeline de release espera (ESLint, Prettier, Stylelint, `typescript`).

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage --passWithNoTests",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:styles": "stylelint \"src/**/*.{css,scss}\" --allow-empty-input",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc -b"
  }
}
```

> `lint`, `format:check` e `test` já passam no scaffold atual.
> `typecheck` e `build` dependem dos passos 3/4 abaixo (leem `tsconfig.json`).
> O `.github/workflows/release.yml` roda `lint → format:check → typecheck → test
> → build` a cada tag `v*.*.*` — crie os arquivos abaixo **antes** de marcar um
> release ou o quality gate falha.

### 2. `vite.config.ts` — já commitado

Está no repo. Reproduzido aqui como referência. O HMR pelo bind mount do Docker
está verificado com este arquivo: editar um `.tsx`, um `*.module.scss`, um
`.scss` global ou o próprio arquivo faz hot-reload (o último reinicia o servidor).

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    host: true,          // 0.0.0.0 para a porta do container ser acessível
    port: 5173,
    strictPort: true,
    watch: { usePolling: true, interval: 100 },   // obrigatório p/ HMR no Docker
  },
  preview: { host: true, port: 4173, strictPort: true },
  css: { preprocessorOptions: { scss: { api: "modern-compiler" } } },
  test: { environment: "jsdom", globals: true },
});
```

### 3. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

### 5. `index.html` (na raiz de `app/`) — já ligado

Um `index.html` + `src/main.tsx` mínimos já estão no repo: `#root` no body e
`main.tsx` montando o export default de `./app` com `createRoot`. **Sem esse
mount, editar o componente recarrega via HMR mas nada aparece na tela.** Os
trechos aqui são o alvo mais completo (`<title>` próprio, import do SCSS global).

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aegir Hotel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 6. Arquivos de entrada em `src/`

`src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

`src/styles/main.scss` (tokens globais + reset)

```scss
$bg: #0f172a;
$fg: #e2e8f0;

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: $bg;
  color: $fg;
}
```

`src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx`

```tsx
export default function App() {
  return <h1>Aegir Hotel</h1>;
}
```

### 7. Suba

```bash
cd ../docker
docker compose -f docker-compose.yml up --build
```

Abra <http://localhost:5173>. Edite `src/App.tsx` ou qualquer `.scss` e a página
atualiza sem recarregar.

---

## ✅ Verificando o hot reload (o que foi testado)

| Mudança | Resultado |
|---------|-----------|
| editar uma string em `src/App.tsx` | módulo trocado no navegador, estado do React mantido, log: `[vite] hmr update /src/App.tsx` |
| editar uma cor em `src/App.module.scss` | estilo reinjetado, sem reload |
| editar `src/styles/main.scss` | estilo global reinjetado |
| editar `vite.config.ts` | servidor de dev reinicia sozinho |
| editar um `*.test.tsx` com o `tests` no ar | testes afetados re-executam, UI do Vitest atualiza |

O único requisito é `server.watch.usePolling: true` no `vite.config.ts` — bind
mounts do Docker no Windows/WSL2/macOS não entregam eventos de arquivo de outra
forma.

---

## 🧭 Convenções

- **Componentes:** pasta e arquivos em `PascalCase`; export default do componente.
- **Hooks:** `useCoisa.ts`, um hook por arquivo.
- **Estilos:** `Coisa.module.scss` ao lado de `Coisa.tsx`; globais só em `src/styles/`.
- **Testes:** `Coisa.test.tsx` ao lado do componente; `@testing-library/react`.
- **Imports:** use `@/…` para qualquer coisa dentro de `src/`.
- **GSAP:** crie timelines em `lib/` ou dentro de hooks `useGsap*`; destrua-as no cleanup.

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🤝 Fluxo de contribuição](../.github/CONTRIBUTING.pt-BR.md) ·
[🐳 docker/](../docker/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](README.md)

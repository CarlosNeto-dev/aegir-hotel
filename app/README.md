# 🎨 `app/` — the web client

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.83-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

This folder is the entire front-end. It is **bind-mounted into `/app`** inside the
container (see [`../docker/README.md`](../docker/README.md)), so anything you do
here is what runs.

---

## 🗂️ Folder structure

```
app/
├── index.html                 # Vite entry document (stays at app/ root, NOT in src/)
├── package.json               # dependencies + scripts (already committed)
├── package-lock.json          # exact dependency tree — commit it, `npm ci` needs it
├── eslint.config.js           # ESLint 9 flat config (TS + react-hooks + react-refresh)
├── .prettierrc.json           # Prettier options    (.prettierignore excludes *.md)
├── .stylelintrc.json          # Stylelint (SCSS) config
├── vite.config.ts             # already committed — Vite + React, Docker-polling HMR
├── tsconfig.json · tsconfig.node.json
├── public/                    # served as-is at "/" — favicon, robots.txt, models/
│   └── models/                # .glb / .gltf for react-three-fiber (future)
└── src/
    ├── main.tsx               # app bootstrap (mounts <App/>)
    ├── App.tsx
    ├── vite-env.d.ts
    ├── assets/                # imported images / fonts (bundled, hashed)
    ├── components/            # reusable UI — one folder per component
    │   └── Button/
    │       ├── Button.tsx
    │       ├── Button.module.scss
    │       └── Button.test.tsx
    ├── pages/                 # route-level views
    ├── hooks/                 # custom React hooks (useXxx)
    ├── lib/                   # framework-agnostic helpers (GSAP setup, formatters…)
    ├── scenes/                # react-three-fiber scenes (future)
    ├── styles/                # GLOBAL SCSS ONLY: _tokens, _mixins, _reset, main.scss
    └── types/                 # shared TypeScript types
```

### 📐 Rules of the structure

1. **Feature-first, co-located.** A component's `.tsx`, its `.module.scss` and its
   `.test.tsx` live in the **same folder**. Do not create a global `ts/` or a
   global `styles/` bucket for component code — moving or deleting a feature
   should touch exactly one folder.
2. **`src/styles/` is for globals only** — design tokens, mixins, resets, the
   root `main.scss` imported once in `main.tsx`. Nothing component-specific.
3. **`index.html` stays at `app/` root.** Vite treats it as the entry document
   and resolves `/src/main.tsx` from there.
4. **`public/` vs `src/assets/`** — `public/` is copied verbatim (stable URLs,
   3D model files); `src/assets/` is imported in code and gets hashed/bundled.
5. **Path alias:** `@/` → `src/` (configured in `tsconfig.json` + `vite.config.ts`).

---

## 💅 SCSS — two supported ways

| | Vite native *(default / build path)* | Live Sass Compiler *(optional)* |
|-|--------------------------------------|--------------------------------|
| How | `import "./Button.module.scss"` in the component | `glenn2223.live-sass` extension → click **Watch Sass** |
| Output | compiled in-memory by Vite, instant HMR | a real `Button.css` (+ `.map`) written next to the `.scss` |
| Scoping | `*.module.scss` → hashed class names | plain CSS, no scoping unless you import the `.css` as a module |
| When | everyday component styling | when you want an inspectable standalone stylesheet |

Generated `.css` / `.css.map` under `src/` are **git-ignored** (see
`../.gitignore`). Vite already uses the modern Dart Sass compiler API — set in
`vite.config.ts`:

```ts
css: { preprocessorOptions: { scss: { api: "modern-compiler" } } }
```

---

## 📦 Build output (`dist/`)

`npm run build` runs `tsc -b` then `vite build`. Verified output for a minimal
app:

```
dist/
├── index.html                    # minified, asset tags injected
└── assets/
    ├── index-<hash>.css           # ALL .scss merged → one minified file
    └── index-<hash>.js            # bundled + minified (esbuild)
```

- **No `.scss` reaches `dist/`.** Sass is compiled to CSS at build time; the
  source `.scss` files are never shipped.
- **`dist/` is minified** by default in production mode — CSS whitespace
  stripped (`opacity:.8`), JS mangled, gzip sizes reported by the build.
- Every global `main.scss` **and** every `*.module.scss` collapse into a single
  hashed `assets/index-<hash>.css`. Module classes keep their hashed names
  (`_title_sr706_1`).
- `dist/` is generated, git-ignored, and produced fresh by CI on every release
  tag — never commit it.

---

## 🚀 Bootstrap the app

The container runs `npm install` on start, so you only need to create the source
files. Do this **once**, from `app/`.

### 1. `package.json` — already committed

`package.json`, `package-lock.json` and the lint/format configs
(`eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `.stylelintrc.json`)
are already in the repo. It ships React 19, GSAP, Vite 6, Vitest 2, Sass, plus
the toolchain the release pipeline expects (ESLint, Prettier, Stylelint,
`typescript`).

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

> `lint`, `format:check` and `test` are green on the current scaffold.
> `typecheck` and `build` need step 3/4 below (they read `tsconfig.json`).
> `.github/workflows/release.yml` runs `lint → format:check → typecheck → test →
> build` on every `v*.*.*` tag — create the files below **before** tagging a
> release or the quality gate fails.

### 2. `vite.config.ts` — already committed

In the repo. Reproduced here for reference. Docker bind-mount HMR is verified
with this file: editing a `.tsx`, a `*.module.scss`, a global `.scss` or this
file itself all hot-reload (the last restarts the dev server).

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
    host: true,          // 0.0.0.0 so the container port is reachable
    port: 5173,
    strictPort: true,
    watch: { usePolling: true, interval: 100 },   // required for HMR in Docker
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

### 5. `index.html` (at `app/` root) — already wired

A minimal `index.html` + `src/main.tsx` are in the repo: `#root` in the body,
`main.tsx` mounts the default export of `./app` with `createRoot`. **Without
that mount, editing the component reloads via HMR but nothing renders.** The
snippets here are the fuller target (own `<title>`, global SCSS import).

```html
<!doctype html>
<html lang="en">
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

### 6. `src/` entry files

`src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

`src/styles/main.scss` (global tokens + reset)

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

### 7. Run

```bash
cd ../docker
docker compose -f docker-compose.yml up --build
```

Open <http://localhost:5173>. Edit `src/App.tsx` or any `.scss` and the page
updates without a reload.

---

## ✅ Verifying hot reload (what was tested)

| Change | Result |
|--------|--------|
| edit a string in `src/App.tsx` | browser module swapped, React state kept, log: `[vite] hmr update /src/App.tsx` |
| edit a colour in `src/App.module.scss` | style re-injected, no reload |
| edit `src/styles/main.scss` | global style re-injected |
| edit `vite.config.ts` | dev server auto-restarts |
| edit a `*.test.tsx` with `tests` up | affected tests re-run, Vitest UI updates |

The one requirement is `server.watch.usePolling: true` in `vite.config.ts` —
Docker bind mounts from Windows/WSL2/macOS do not deliver file events otherwise.

---

## 🧭 Conventions

- **Components:** `PascalCase` folder + files; default-export the component.
- **Hooks:** `useThing.ts`, one hook per file.
- **Styles:** `Thing.module.scss` next to `Thing.tsx`; globals only in `src/styles/`.
- **Tests:** `Thing.test.tsx` next to the component; `@testing-library/react`.
- **Imports:** use `@/…` for anything under `src/`.
- **GSAP:** create timelines in `lib/` or inside `useGsap*` hooks; kill them on cleanup.

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/CONTRIBUTING.md) ·
[🐳 docker/](../docker/README.md) ·
[🧩 .devcontainer/](../.devcontainer/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)

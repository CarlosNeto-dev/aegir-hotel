# CLAUDE.md — `app/`

Agent notes for the web client. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

## State

Scaffold only: folder skeleton (`.gitkeep`) + `index.html` (empty) + these docs.
No `package.json` yet — the exact files to create are in `README.md` §Bootstrap.
Do **not** scaffold the app unless asked; if asked, use those exact configs.

## Structure rules (enforce on any code you add)

- **Feature-first, co-located:** `Foo.tsx` + `Foo.module.scss` + `Foo.test.tsx`
  in one folder under `src/components/` (or `pages/`, `scenes/`).
- `src/styles/` = **global SCSS only** (tokens, mixins, reset, `main.scss`).
- `index.html` stays at `app/` root (Vite entry) — never move it to `src/`.
- Import alias `@/` → `src/`.
- `public/` = verbatim assets (3D models); `src/assets/` = imported/bundled.

## Vite / build facts (verified)

- `server.watch.usePolling: true` is **mandatory** — no HMR in the Docker bind
  mount without it.
- `css.preprocessorOptions.scss.api: "modern-compiler"` — silences the legacy
  Dart Sass deprecation.
- `npm run build` → `dist/` is minified, contains **no `.scss`**; all styles
  (global + every `*.module.scss`) merge into one hashed `assets/index-*.css`.
- `dist/`, `node_modules/`, and Live-Sass-generated `src/**/*.css` are
  git-ignored.

## When editing

- Changing a port/version → also update `docker/.env(.example)`, compose,
  `Dockerfile.frontend`, devcontainer, and the docker READMEs.
- Keep `README.md` and `README.pt-BR.md` in sync (both carry the config blocks).

# 🐳 `docker/` — container reference

<p>
  <img alt="Base image" src="https://img.shields.io/badge/base-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Prod image" src="https://img.shields.io/badge/prod-nginx%3A1.27--alpine-009639?logo=nginx&logoColor=white">
  <img alt="Compose" src="https://img.shields.io/badge/Compose-v2-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

Container definitions for the project — **front-end only** for now.

> Quick start, port table live in the root
> [`README.md`](../README.md). This page is the container internals only.

| File | Role |
|------|------|
| `Dockerfile.frontend` | multi-stage image: `base → debugger → build → production` |
| `docker-compose.yml` | services `website` + `tests` |
| `.env` / `.env.example` | the only place to change ports and versions |

Build **context is the repo root** (`context: ..` in Compose), so the single
`.dockerignore` lives there. Run Compose commands from `docker/` (or pass
`-f docker/docker-compose.yml`).

---

## 🧱 The multi-stage image

```bash
docker build -f docker/Dockerfile.frontend --target debugger  -t aegir-web:dev  .   # from repo root
docker build -f docker/Dockerfile.frontend --target production -t aegir-web:prod .
```

| Stage | From | Contains | Shipped? |
|-------|------|----------|----------|
| `base` | `node:24-bookworm-slim` | the Node runtime + Corepack-enabled `pnpm` + `WORKDIR /app` — one place the Node version is set | no |
| `debugger` | `base` | `base` + `git`, `curl`, `procps`, `serve`, `source-map-explorer` | dev / CI |
| `build` | `base` | `pnpm install` + `pnpm run build` → `/app/dist` | no |
| `production` | `nginx:1.27-alpine` | **only** the built static site + SPA fallback + asset caching | ✅ |

- `debugger` is what Compose and the dev-container use.
- `build` / `production` need `app/package.json`. On a bare scaffold, only
  `debugger` builds — which is all Compose needs.
- **pnpm via Corepack** — the version is pinned by `"packageManager"` in
  `app/package.json` (not in the image). pnpm 12 refuses to finish an install while a
  dependency has an undecided build script, so each one is listed in
  `app/pnpm-workspace.yaml` (`allowBuilds`). Change with `pnpm approve-builds <pkg>`.

---

## ⚙️ How the services are wired

Shared config is defined once as YAML anchors (`x-frontend-build`,
`x-frontend-service`, `x-frontend-healthcheck`) and merged with `<<:`.

| | `website` | `tests` |
|-|-----------|---------|
| command | `pnpm install && next dev …` | `pnpm install && vitest --ui …` |
| runs as | `node` (uid 1000) | same |
| volume | `../app → /app` **only** | same |
| ports | `5173`, `4173`, `9229` | `51204` |
| healthcheck | `node -e "process.exit(0)"` (liveness) | same |
| restart | `unless-stopped` | `on-failure` |
| depends_on | — | `website` |

- **`pnpm install` in the command:** deps install into the bind-mounted `app/` on
  every start. No lock file is committed (`app/pnpm-lock.yaml` is
  git-ignored) — pnpm resolves from `package.json` and writes the lock into the
  bind mount each run.
- **`user: "node"`** — the shared anchor pins both services to the image's
  unprivileged user, the same identity the dev-container uses (`remoteUser:
  node`). Without it `docker compose up` writes a **root-owned** `node_modules`
  that a later "Reopen in Container" (running as `node`) cannot modify —
  `EACCES` on `node_modules`. If you already hit that, wipe
  it once: `docker compose run --rm -u 0 website rm -rf node_modules`.
- **`tests` exits with no test files** (Vitest behaviour, exit 0). `restart:
  on-failure` means that clean exit does not loop; the UI stays resident on
  `51204` once a `*.test.tsx` exists.

---

## 🔥 Hot-reload workflow (verified end-to-end)

```bash
cd docker && docker compose -f docker-compose.yml up -d --build
docker compose logs -f website        # wait for "VITE vX ready in …"
```

| Edit | Result |
|------|--------|
| `app/src/**/*.tsx` | `[vite] (client) hmr update …`, module swapped, React state kept |
| `.scss` / `.module.scss` | style re-injected, no reload, class hashes stable |
| `app/vite.config.ts` | Vite restarts the dev server itself |
| `*.test.tsx` (with `tests` up) | affected tests re-run, Vitest UI updates |

Hot reload across the bind mount needs polling in `app/vite.config.ts`:

```ts
server: { host: true, watch: { usePolling: true, interval: 100 } }
```

```bash
docker compose down          # or  down -v  to also drop volumes
```

---

## 🩺 Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Edits don't hot-reload | (1) the editor never saved to disk — dev-container needs `files.autoSave` (set to `onFocusChange` in `.devcontainer/frontend/devcontainer.json`); (2) `usePolling` missing in `vite.config.ts`; (3) you edited a file outside `app/` (only `app/` is mounted); (4) an import whose casing differs from the file name — Vite serves it but drops HMR |
| `tests` container keeps stopping | expected with zero test files — add one under `src/` |
| Port already allocated | change the value in `docker/.env` and `docker compose up` again |
| `ERR_PNPM_IGNORED_BUILDS` | a dependency has an undecided build script — `pnpm approve-builds <pkg>` (or `!<pkg>` to deny) writes it to `app/pnpm-workspace.yaml` |
| Stale `node_modules` after changing deps | `docker compose down -v` then `up` |

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/CONTRIBUTING.md) ·
[🎨 app/](../app/README.md) ·
[🧩 .devcontainer/](../.devcontainer/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)

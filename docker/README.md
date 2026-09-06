# 🐳 `docker/` — container reference

<p>
  <img alt="Base image" src="https://img.shields.io/badge/base-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Prod image" src="https://img.shields.io/badge/prod-nginx%3A1.27--alpine-009639?logo=nginx&logoColor=white">
  <img alt="Compose" src="https://img.shields.io/badge/Compose-v2-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

Container definitions for the project — **front-end only** for now.

> Quick start, port table and GPU summary live in the root
> [`README.md`](../README.md). This page is the container internals only.

| File | Role |
|------|------|
| `Dockerfile.frontend` | multi-stage image: `base → debugger → build → production` |
| `docker-compose.yml` | services `website` + `tests` |
| `docker-compose.override.yml` | opt-in NVIDIA GPU passthrough (auto-merged) |
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
| `base` | `node:24-bookworm-slim` | **only** the Node runtime + `WORKDIR /app` — one place the Node version is set | no |
| `debugger` | `base` | `base` + `git`, `curl`, `procps`, `serve`, `source-map-explorer` | dev / CI |
| `build` | `base` | `npm ci` + `npm run build` → `/app/dist` | no |
| `production` | `nginx:1.27-alpine` | **only** the built static site + SPA fallback + asset caching | ✅ |

- `debugger` is what Compose and the dev-container use.
- `build` / `production` need `app/package.json` (+ lock). On a bare scaffold,
  only `debugger` builds — which is all Compose needs.
- **npm is not upgraded** — the version bundled with the Node image is kept. It
  blocks package install-scripts by default (fine for React / Vite / Sass /
  Vitest / GSAP). Approve a genuine need with `npm install-scripts approve <pkg>`.

---

## ⚙️ How the services are wired

Shared config is defined once as YAML anchors (`x-frontend-build`,
`x-frontend-service`, `x-frontend-healthcheck`) and merged with `<<:`.

| | `website` | `tests` |
|-|-----------|---------|
| command | `npm install && vite` | `npm install && vitest --ui …` |
| volume | `../app → /app` **only** | same |
| ports | `5173`, `4173`, `9229` | `51204` |
| healthcheck | `node -e "process.exit(0)"` (liveness) | same |
| restart | `unless-stopped` | `on-failure` |
| depends_on | — | `website` |

- **`npm install` in the command:** no lock file is vendored into the image yet,
  so deps install into the bind-mounted `app/` on every start. Once
  `app/package-lock.json` is committed, bake `npm ci` into the image and drop the
  install step.
- **`tests` exits with no test files** (Vitest behaviour, exit 0). `restart:
  on-failure` means that clean exit does not loop; the UI stays resident on
  `51204` once a `*.test.tsx` exists.

---

## 🎮 GPU

`docker-compose.override.yml` gives the `website` container NVIDIA GPU access —
for future hardware-accelerated react-three-fiber / WebGL and headless Blender
renders. Compose merges it automatically on a bare `docker compose up`.

```
Machine WITH NVIDIA GPU + Container Toolkit
    docker compose up                        → base + override (GPU on)

Machine WITHOUT GPU support
    docker compose -f docker-compose.yml up   → base only, override ignored
    (or delete / rename docker-compose.override.yml)
```

Requirements: NVIDIA driver on the host, the
[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/), and
(Docker Desktop) GPU enabled with the WSL2 backend. Verify with `nvidia-smi`
inside the container.

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
| Edits don't hot-reload | `usePolling` missing in `vite.config.ts`, or you edited a file outside `app/` (only `app/` is mounted) |
| `tests` container keeps stopping | expected with zero test files — add one under `src/` |
| Port already allocated | change the value in `docker/.env` and `docker compose up` again |
| `could not select device driver "nvidia"` | no GPU runtime — use `docker compose -f docker-compose.yml up` |
| `npm warn install-scripts … blocked` | intentional; `npm install-scripts approve <pkg>` if really needed |
| Stale `node_modules` after changing deps | `docker compose down -v` then `up` |

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/README.md) ·
[🎨 app/](../app/README.md) ·
[🧩 .devcontainer/](../.devcontainer/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)

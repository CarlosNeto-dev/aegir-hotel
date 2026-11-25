# 🐳 `docker/` — container reference

<p>
  <img alt="Base image" src="https://img.shields.io/badge/base-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Prod image" src="https://img.shields.io/badge/prod-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Compose" src="https://img.shields.io/badge/Compose-v2-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

Container definitions for the project — **front-end only** for now.

> The quick start and the port table live in the root
> [`README.md`](../README.md). This page covers the container internals only.

| File | Role |
|------|------|
| `Dockerfile.frontend` | multi-stage image: `base → debugger → build → production` |
| `docker-compose.yml` | the `website` service |
| `.env.example` | the only place to change ports and versions; copy it to `.env` |
| `.env` *(local, git-ignored)* | your copy of `.env.example`, read by Compose |
| `docker-compose.override.yml` *(local, git-ignored, optional)* | NVIDIA GPU passthrough — see [GPU override](#-gpu-override-optional) |

The build **context is the repo root** (`context: ..` in Compose), so the single
`.dockerignore` lives there. Run Compose commands from `docker/`, or pass
`-f docker/docker-compose.yml`.

---

## 🧱 The multi-stage image

```bash
docker build -f docker/Dockerfile.frontend --target debugger  -t aegir-web:dev  .   # from repo root
docker build -f docker/Dockerfile.frontend --target production -t aegir-web:prod .
```

| Stage | From | Contains | Shipped? |
|-------|------|----------|----------|
| `base` | `node:24-bookworm-slim` | the Node runtime + Corepack-enabled `pnpm` + `WORKDIR /app` — the one place the Node version is set | no |
| `debugger` | `base` | `base` + `git`, `curl`, `procps`, `serve`, `source-map-explorer` | dev |
| `build` | `base` | `pnpm install` + `pnpm run build` → `/app/.next` (standalone output) | no |
| `production` | `node:24-bookworm-slim` | **only** the standalone Next.js server (`server.js`) + `.next/static` + `public/`, run as `node` on port `3000` | ✅ |

- **`debugger`** is what Compose and the dev-container use. It is all Compose
  needs day to day.
- **`build` / `production`** compile the app (`pnpm install` + `next build`).
  They need network access the first time, because `next/font` downloads the
  Google fonts during the build.
- **CI does not use these images.** `release.yml` runs on a plain Ubuntu runner
  with `setup-node`.
- **pnpm comes via Corepack.** Its version is pinned by `"packageManager"` in
  `front-end/package.json`, not in the image. pnpm 12 refuses to finish an install
  while a dependency has an undecided build script, so each one is listed in
  `front-end/pnpm-workspace.yaml` (`allowBuilds`). Change it with
  `pnpm approve-builds <pkg>`.

---

## ⚙️ How the service is wired

Shared config is defined once as YAML anchors (`x-frontend-build`,
`x-frontend-service`, `x-frontend-healthcheck`) and merged with `<<:`. There is only
one service today, `website`. A `tests` service existed before but was removed: it
wired up a Vitest UI that was never actually installed, so it did nothing.

| | `website` |
|-|-----------|
| container | `aegir-website` |
| command | `pnpm install && pnpm run dev -H 0.0.0.0 -p 5173` |
| runs as | `node` (uid 1000) |
| volume | `../front-end → /app` **only** |
| ports | `5173`, `4173`, `9229` |
| healthcheck | `node -e "process.exit(0)"` (liveness) |
| restart | `unless-stopped` |

- **`pnpm install` in the command.** Dependencies install into the bind-mounted
  `front-end/` on every start. No lock file is committed
  (`front-end/pnpm-lock.yaml` is git-ignored): pnpm resolves from `package.json`
  and writes the lock into the bind mount on each run.
- **`user: "node"`.** The shared anchor pins the service to the image's
  unprivileged user, the same identity the dev-container uses
  (`remoteUser: node`).
  - Without it, `docker compose up` writes a **root-owned** `node_modules`.
  - A later "Reopen in Container" (running as `node`) cannot modify it, and you
    get `EACCES` on `node_modules`.
  - If you already hit that, wipe it once:
    `docker compose run --rm -u 0 website rm -rf node_modules`.
- **No named volumes.** `node_modules` lives in the bind mount
  (`front-end/node_modules`), so `docker compose down -v` removes nothing extra.

---

## 🔥 Hot-reload workflow (verified end-to-end)

```bash
cd docker && docker compose -f docker-compose.yml up -d --build
docker compose logs -f website        # wait for "✓ Ready in …"
```

| Edit | Result (verified 2026-11-13) |
|------|-------------------------------|
| `front-end/app/**/*.tsx` | `✓ Compiled / in …`, page refreshed, React state kept |
| `.scss` / `.module.scss` | `✓ Compiled in …`, style re-injected, no full reload |
| `front-end/next.config.ts` | `⚠ Found a change in next.config.ts. Restarting the server to apply the changes…` — Next restarts itself |

Hot reload across the bind mount needs polling. It is set with an env var (not a
config file) in `docker-compose.yml`:

```yaml
environment:
  WATCHPACK_POLLING: "true"
```

```bash
docker compose down
```

---

## 🎮 GPU override (optional)

`docker-compose.override.yml` is a **local, git-ignored** file. It adds NVIDIA GPU
access to `website`, for later hardware-accelerated WebGL / react-three-fiber work
and headless Blender renders.

| Command | What runs |
|---------|-----------|
| `docker compose up` | `docker-compose.yml` **+ the override**, when the file exists (GPU on) |
| `docker compose -f docker-compose.yml up` | the base file only (no GPU) |

The GPU path needs:

- the NVIDIA driver on the host;
- the NVIDIA Container Toolkit;
- on Docker Desktop, the GPU enabled for the WSL2 backend.

Check it inside the container with `nvidia-smi`. On a machine without these, use
`-f docker-compose.yml` (or rename the file). The dev-container only lists
`docker-compose.yml`, so it never gets the GPU.

---

## 🩺 Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Edits don't hot-reload | (1) the editor never saved to disk — the dev-container needs `files.autoSave` (set to `onFocusChange` in `.devcontainer/frontend/devcontainer.json`); (2) `WATCHPACK_POLLING=true` is missing from the `website` service's `environment` in `docker-compose.yml`; (3) you edited a file outside `front-end/` (only `front-end/` is mounted); (4) an import whose casing differs from the file name — not verified for Next, but worth checking first if you suspect it |
| Port already allocated | change the value in `docker/.env` and run `docker compose up` again |
| `ERR_PNPM_IGNORED_BUILDS` | a dependency has an undecided build script — `pnpm approve-builds <pkg>` (or `!<pkg>` to deny) writes it to `front-end/pnpm-workspace.yaml` |
| Stale `node_modules` after changing deps | `docker compose run --rm website rm -rf node_modules`, then `up` (it reinstalls) |
| `docker/.env` mentions Vite or `TEST_UI_PORT` | the local `.env` is older than `.env.example` — run `cp .env.example .env` again |
| `could not select device driver "nvidia"` | the GPU override is being merged on a machine without the NVIDIA toolkit — use `docker compose -f docker-compose.yml up` |

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/CONTRIBUTING.md) ·
[🎨 app/](../front-end/README.md) ·
[🧩 .devcontainer/](../.devcontainer/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)

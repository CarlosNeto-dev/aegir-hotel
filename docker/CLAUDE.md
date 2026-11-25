# CLAUDE.md — `docker/`

Agent notes for the container setup. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

## Files

| File | Tracked? | Notes |
|------|----------|-------|
| `Dockerfile.frontend` | yes | `base → debugger → build → production` |
| `docker-compose.yml` | yes | one service, `website` |
| `.env.example` | yes | the template; CI (`release.yml`) reads `NODE_VERSION` from it |
| `.env` | **no** (git-ignored) | a local copy of `.env.example`; it never refreshes by itself |
| `docker-compose.override.yml` | **no** (git-ignored, "local machine only") | optional NVIDIA GPU passthrough for `website` |

## Invariants

- **Front-end only.** There is no `Dockerfile.backend` and no Python service. The
  stack list mentions Python as *future* pipeline tooling. Do not add it to the
  containers unless asked.
- **The build context is the repo root** (`context: ..`). `.dockerignore` is at
  the repo root; keep it there.
  - It excludes `.github`, `.devcontainer`, `docker`, `scripts`, every `*.md` and
    every `*.blend`.
- **`Dockerfile.frontend` stages:** `base → debugger → build → production`.
  - `base` (`node:${NODE_VERSION}-bookworm-slim`) is the single place
    `NODE_VERSION` resolves.
  - Re-declare `ARG` after each `FROM`.
- **`production` ships the Next.js standalone server** (`front-end/next.config.ts`
  has `output: "standalone"`), not a static site. There is no nginx stage anymore.
  - `build` must NOT set `NODE_ENV=production` before `pnpm install`. `sass` and
    `typescript` are devDependencies the build needs, and production mode skips
    devDependencies.
  - The build command itself, however, MUST run as
    `NODE_ENV=production pnpm run build`. Under the inherited "development",
    `next build` fails prerendering /404 ("<Html> should not be imported outside
    of pages/_document").
  - `production` copies `.next/standalone`, `.next/static` and `public/`
    separately, because standalone bundles neither of the last two.
  - It runs `node server.js` as the `node` user, on the `PORT`/`HOSTNAME` env vars
    (`WEB_PROD_PORT`, default `3000`).
  - Its HEALTHCHECK `fetch`es `http://127.0.0.1:$PORT`.
- **Ports flow** from `.env` → compose `args` → Dockerfile `ARG`/`EXPOSE`. Change a
  port in **all** of these:
  - `.env.example` (and your local `.env`);
  - `docker-compose.yml`;
  - `Dockerfile.frontend`;
  - `.devcontainer/frontend/devcontainer.json`;
  - both root and docker READMEs.
- **There is only one service, `website`.** A `tests` service existed before. It
  was removed on 2026-11-13 because it ran `pnpm run test:ui`, a script that never
  existed (no test runner is installed), so it did nothing. Add it back, with a
  real test runner, only when asked. The override file still carries a
  commented-out `tests` block; leave it commented.
- **The `x-frontend-service` anchor pins `user: "node"`** (uid 1000). Then the
  bind-mounted `node_modules` written by `docker compose up` and by the
  dev-container (`remoteUser: node`) share one owner. Removing it brings back the
  root-owned `node_modules` → `EACCES` on the next `node`-user install.
- **`front-end/pnpm-lock.yaml` is git-ignored.** Every `pnpm install` resolves it
  fresh: the service command, the `build` stage and CI.
  - Canonical resolution happens in the container (Linux).
  - A host-generated lock is never committed. On Windows it would only be a
    flakiness source anyway (OneDrive/Defender locks).
- **pnpm comes from Corepack** (`RUN corepack enable` in `base`).
  - Its version lives in `front-end/package.json` `"packageManager"`, never in the
    image.
  - pnpm 12 fails `pnpm install` (`ERR_PNPM_IGNORED_BUILDS`) on any undecided
    dependency build script. The decisions live in `front-end/pnpm-workspace.yaml`
    (`allowBuilds`), so the `build` stage must `COPY` that file with
    `package.json`.
  - The two global CLIs in `debugger` (`serve`, `source-map-explorer`) still use
    the image's bundled npm. That npm is intentionally not upgraded.
- **GPU override.** A bare `docker compose …` merges `docker-compose.override.yml`
  automatically when the file exists. It gives `website` every NVIDIA GPU. It
  needs the NVIDIA driver and the NVIDIA Container Toolkit, and on Docker Desktop
  the WSL2 GPU setting.
  - `docker compose -f docker-compose.yml …` skips it.
  - The dev-container lists only `docker-compose.yml`, so it never gets the GPU.
  - Use `-f docker-compose.yml` for verification, so results don't depend on the
    machine.

## Before saying "done" after a container/compose change

```bash
cd docker
docker compose -f docker-compose.yml config -q    # compose file valid
docker build -f Dockerfile.frontend --check ..    # Dockerfile lint
```

Then:

1. run `up -d website`;
2. confirm the Next.js dev server reports ready in the logs;
3. edit a `.tsx` and a `.scss`, and check that the page updates (Fast Refresh);
4. run `down`.

## Docs

`README.md` and `README.pt-BR.md` are the **lean** container reference. The
overview, quick start and ports belong to the root README, not here. Keep both in
sync.

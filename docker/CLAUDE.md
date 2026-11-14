# CLAUDE.md — `docker/`

Agent notes for the container setup. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

## Invariants

- **Front-end only.** No `Dockerfile.backend`, no Python service. The stack list
  mentions Python as *future* pipeline tooling — do not add it to the containers
  unless asked.
- Build `context: ..` (repo root). `.dockerignore` is at the repo root; keep it
  there.
- `Dockerfile.frontend` stages: `base → debugger → build → production`. `base` is
  the single place `NODE_VERSION` resolves. Re-declare `ARG` after each `FROM`.
- `production` ships the Next.js **standalone** server (`front-end/next.config.ts`
  has `output: "standalone"`), not a static site — there is no nginx stage
  anymore. `build` must NOT set `NODE_ENV=production` before `pnpm install`:
  `sass` and `typescript` are devDependencies the build needs, and production
  mode skips devDependencies. `production` copies `.next/standalone`,
  `.next/static` and `public/` separately (standalone bundles neither) and runs
  `node server.js` as the `node` user on `PORT`/`HOSTNAME` env vars.
- Ports flow from `.env` → compose `args` → Dockerfile `ARG`/`EXPOSE`. Change a
  port in **all** of: `.env`, `.env.example`, `docker-compose.yml`,
  `Dockerfile.frontend`, `.devcontainer/frontend/devcontainer.json`, and both
  root + docker READMEs.
- There is only one service, `website` — a `tests` service existed before but
  was removed 2026-11-13: it ran `pnpm run test:ui`, a script that never
  existed (no test runner is installed), so it did nothing. Add it back (with
  a real test runner) only when asked.
- The `x-frontend-service` anchor pins `user: "node"` (uid 1000) so the
  bind-mounted `node_modules` written by `docker compose up` and by the
  dev-container (`remoteUser: node`) share one owner. Removing it reintroduces
  the root-owned-`node_modules` → `EACCES` on the next `node`-user install.
- `front-end/pnpm-lock.yaml` is **git-ignored** — every `pnpm install` (service
  commands, devcontainer `postCreateCommand`, the `build` stage, CI) resolves it
  fresh. Canonical resolution is in-container (Linux); a host-generated lock is
  never committed and would only be a Windows flakiness source anyway
  (OneDrive/Defender locks).
- pnpm comes from **Corepack** (`RUN corepack enable` in `base`); the version lives
  in `front-end/package.json` `"packageManager"`, never in the image. pnpm 12 fails
  `pnpm install` (`ERR_PNPM_IGNORED_BUILDS`) on any undecided dependency build
  script, so decisions live in `front-end/pnpm-workspace.yaml` (`allowBuilds`) — the
  `build` stage must `COPY` that file with `package.json`. The two global CLIs
  (`serve`, `source-map-explorer`) still use the image's bundled npm, which is
  intentionally not upgraded.

## Before saying "done" after a container/compose change

```bash
cd docker
docker compose config -q                          # compose file valid
docker build -f Dockerfile.frontend --check ..    # Dockerfile lint
```
Then `up -d website`, confirm the Next.js dev server reports ready in the logs,
edit a `.tsx` + a `.scss`, check the page updates (Fast Refresh), `down`.

## Docs

`README.md` and `README.pt-BR.md` are the **lean** container reference — overview
/ quick-start / ports belong to the root README, not here. Keep both in sync.

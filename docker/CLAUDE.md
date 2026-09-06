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
- Ports flow from `.env` → compose `args` → Dockerfile `ARG`/`EXPOSE`. Change a
  port in **all** of: `.env`, `.env.example`, `docker-compose.yml`,
  `Dockerfile.frontend`, `.devcontainer/frontend/devcontainer.json`, and both
  root + docker READMEs.
- `docker-compose.override.yml` = GPU only, opt-in, auto-merged. Non-GPU users
  pass `-f docker-compose.yml`.
- `tests` uses `restart: on-failure` (overrides the anchor's `unless-stopped`)
  because Vitest exits 0 on an empty project.
- npm is **not** upgraded in the image (install-scripts blocked by default —
  intentional).

## Before saying "done" after a container/compose change

```bash
cd docker
docker compose -f docker-compose.yml config -q   # base valid
docker compose config -q                          # merged (with GPU) valid
docker build -f Dockerfile.frontend --check ..    # Dockerfile lint
```
Then `up -d`, confirm `VITE … ready`, edit a `.tsx` + a `.scss`, check
`[vite] hmr update` in logs, `down`.

## Docs

`README.md` and `README.pt-BR.md` are the **lean** container reference — overview
/ quick-start / ports belong to the root README, not here. Keep both in sync.

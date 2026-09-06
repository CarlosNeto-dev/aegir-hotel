# CLAUDE.md — `.devcontainer/`

Agent notes for the dev-container. Root guidance: [`../CLAUDE.md`](../CLAUDE.md).

## Facts

- `frontend/devcontainer.json` is **compose-based** (`dockerComposeFile:
  ../../docker/docker-compose.yml`, `service: website`). It defines no image.
- `overrideCommand: true` is required — the compose `command` runs the dev
  server; the dev-container needs a long-lived shell instead.
- `forwardPorts` / `portsAttributes` must mirror `docker/.env`
  (`5173 / 4173 / 51204 / 9229`). No Python/backend ports — front-end only.
- Extensions list is deliberate; `glenn2223.live-sass` + its
  `liveSassCompile.settings.*` are the SCSS-standalone path (output is
  git-ignored).
- It's JSONC — comments are allowed; keep it parseable
  (`node -e "JSON.parse(stripComments(...))"`).

## When editing

- Change a port here → change it in `docker/.env(.example)`,
  `docker/docker-compose.yml`, `docker/Dockerfile.frontend` and both docker
  READMEs too.
- A second dev-container (e.g. a future service) goes in a **sibling subfolder**
  (`.devcontainer/<name>/`), not by editing `frontend/`.
- Keep `README.md` and `README.pt-BR.md` in sync.

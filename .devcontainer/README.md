# 🧩 `.devcontainer/` — VS Code / Codespaces dev-container

<p>
  <img alt="Dev Containers" src="https://img.shields.io/badge/Dev%20Containers-compose--based-007ACC?logo=visualstudiocode&logoColor=white">
  <img alt="Service" src="https://img.shields.io/badge/service-website-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

```
.devcontainer/
└── frontend/
    └── devcontainer.json     # web-client dev-container
```

> This is **step 1** of the contributor workflow — diagrams in
> [`../.github/README.md`](../.github/README.md) and [`../README.md`](../README.md).

---

## What it does

`frontend/devcontainer.json` does **not** define its own image. It points at
[`../docker/docker-compose.yml`](../docker/docker-compose.yml) and attaches the
editor to the **`website`** service (the `debugger` stage of
`docker/Dockerfile.frontend`).

On **Reopen in Container**:

1. `website` + `tests` are built and started via Compose.
2. The editor opens a shell in `/app`.
3. `postCreateCommand` runs `npm install`.
4. `overrideCommand: true` keeps the container a plain long-lived shell instead
   of running the Compose dev-server command — you start `npm run dev` yourself
   from the integrated terminal.

Forwarded ports: `5173` (Vite), `4173` (preview), `51204` (Vitest UI),
`9229` (Node inspector) — matching `docker/.env`.

---

## Extensions installed in the container

| Extension | For |
|-----------|-----|
| `dbaeumer.vscode-eslint` | linting |
| `esbenp.prettier-vscode` | formatting (format-on-save) |
| `glenn2223.live-sass` | optional standalone SCSS → CSS compilation |
| `stylelint.vscode-stylelint` | SCSS linting |
| `ms-azuretools.vscode-docker` | Docker / Compose tooling |
| `vitest.explorer` | run tests from the editor |
| `slevesque.shader` | GLSL syntax (future r3f shaders) |

The Live Sass Compiler settings (`liveSassCompile.settings.*`) emit an
`expanded` `.css` + source map next to each `.scss`. Those files are git-ignored
— see [`../.gitignore`](../.gitignore).

---

## Why a `frontend/` subfolder?

Dev Containers supports multiple configs, one per subfolder of `.devcontainer/`.
The project is front-end only today; if a separate service ever needs its own
container, it gets a sibling folder and the editor shows a picker on
"Reopen in Container".

---

## 🧭 Related docs

[🏠 Project overview](../README.md) ·
[🤝 Contribution workflow](../.github/README.md) ·
[🎨 app/](../app/README.md) ·
[🐳 docker/](../docker/README.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇧🇷 [Português](README.pt-BR.md)

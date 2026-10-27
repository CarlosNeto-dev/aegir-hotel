# 🏨 Aegir Hotel

<p>
  <img alt="Node" src="https://img.shields.io/badge/Node-24.x-339933?logo=node.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-1.83-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose%20v2-2496ED?logo=docker&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  <img alt="Status" src="https://img.shields.io/badge/status-scaffold-blue">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

---

## 📖 Overview

Aegir Hotel is a **front-end** web project built with **React + TypeScript +
SCSS**, animated with **GSAP** and bundled by **Vite**. Everything runs inside
Docker, so any machine gets the exact same toolchain with a single command.

Planned for later — already accounted for in the stack and the container setup:
**react-three-fiber / three.js** 3D scenes, **Blender**-exported assets, a
**database**, and **Python** tooling for the asset/data pipeline. GPU passthrough
is already wired (opt-in) for that work.

> ℹ️ The repo is currently a **scaffold**: the container setup is complete and
> verified, `app/` holds the agreed folder structure, and the application code is
> added by following [`app/README.md`](app/README.md).

---

## 🧱 Tech stack

| Area | Choice | Notes |
|------|--------|-------|
| Runtime | Node.js `24.x` | pinned in `docker/.env` (`NODE_VERSION`) |
| UI | React `19` + TypeScript `5.7` | |
| Styling | SCSS (`sass` `1.83`) | Vite compiles it natively; `glenn2223.live-sass` optional |
| Animation | GSAP `3` | |
| Build tool | Vite `6` | dev server + HMR + `vite preview` |
| Tests | Vitest `2` + `@vitest/ui` | runs in its own container |
| Containers | Docker + Compose v2 | multi-stage image, GPU override |
| 3D *(future)* | react-three-fiber, three.js, Blender assets | |
| Pipeline *(future)* | Python (asset/data tooling), a database | not yet in the containers |

---

## 🗂️ Repository layout

```
aegir-hotel/
├── .github/
│   ├── CONTRIBUTING.md · CONTRIBUTING.pt-BR.md   # 📘 THE workflow guide (branches · issues · PRs · release)
│   ├── CLAUDE.md                      # agent notes for CI / templates
│   ├── CODEOWNERS                     # required reviewers per path (5-person roster)
│   ├── ISSUE_TEMPLATE/                # bug / feature / task forms (GitHub Projects)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/release.yml          # CI — runs ONLY on a v*.*.* tag
├── .devcontainer/
│   ├── frontend/devcontainer.json     # VS Code / Codespaces dev-container (reuses compose)
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── app/                               # the web client — bind-mounted into the container
│   ├── index.html                     # Vite entry document
│   ├── public/                        # static assets served as-is
│   ├── src/
│   │   ├── assets/ components/ hooks/ lib/ pages/ scenes/ styles/ types/
│   │   └── …                          # feature-first: Foo.tsx + Foo.module.scss together
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── docker/
│   ├── Dockerfile.frontend            # multi-stage: base → debugger → build → production
│   ├── docker-compose.yml             # services: website + tests
│   ├── docker-compose.override.yml    # opt-in NVIDIA GPU passthrough
│   ├── .env / .env.example            # every port & version knob
│   └── README.md · README.pt-BR.md · CLAUDE.md
├── scripts/check-docs.sh              # validates every Mermaid diagram + local links
├── LICENSE                            # MIT
├── .dockerignore · .gitignore
├── README.md · README.pt-BR.md
└── CLAUDE.md                          # notes for the Claude Code agent
```

Every folder ships an English `README.md` **and** a `README.pt-BR.md`, plus a
`CLAUDE.md` with agent-facing notes.

---

## 🚀 Quick start

**Requirements:** Docker Desktop (or Docker Engine + Compose v2). Nothing else —
not even Node — is installed on the host.

```bash
git clone <this-repo> aegir-hotel
cd aegir-hotel/docker
cp .env.example .env

docker compose -f docker-compose.yml up      # no NVIDIA GPU
docker compose up                            # with NVIDIA GPU + Container Toolkit
```

| URL | What |
|-----|------|
| <http://localhost:5173> | the website (Vite dev server, hot reload) |
| <http://localhost:51204/__vitest__/> | the Vitest UI *(after the first test file exists)* |
| <http://localhost:4173> | `vite preview` (production-like) |
| `localhost:9229` | Node.js inspector |

```bash
docker compose down          # stop
docker compose down -v        # stop + drop volumes
```

Container internals, GPU notes, the multi-stage build and the hot-reload
walkthrough live in [`docker/README.md`](docker/README.md).

---

## 💻 Local development without Docker (optional)

Needs Node `24.x` on the host and the app already bootstrapped
([`app/README.md`](app/README.md)).

```bash
cd app && pnpm install && pnpm dev
```

The Docker path is the supported one.

---

## 🔌 Ports

Defined once in `docker/.env`, reused by the Dockerfile, Compose and the
dev-container.

| Var | Default | Purpose |
|-----|---------|---------|
| `WEB_DEV_PORT` | `5173` | Vite dev server |
| `WEB_PREVIEW_PORT` | `4173` | `vite preview` |
| `TEST_UI_PORT` | `51204` | Vitest UI |
| `NODE_DEBUG_PORT` | `9229` | Node.js inspector |

---

## 🎮 GPU

`docker/docker-compose.override.yml` adds NVIDIA GPU access to the `website`
container and is **merged automatically** by a bare `docker compose up`. Machines
without a GPU runtime run `docker compose -f docker-compose.yml up` (or delete the
override file). Detail in [`docker/README.md`](docker/README.md#-gpu).

---

## 🤝 Contributing

The **entire contribution workflow** — dev environment, branch model, issues &
GitHub Projects, pull requests, versioning and the release pipeline — lives in
one place:

### → [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) · [Português](.github/CONTRIBUTING.pt-BR.md)

In short: work on a fork, branch off `develop`, open a PR, get a
[CODEOWNERS](.github/CODEOWNERS) review from Neto, and a `v*.*.*` tag on `main`
triggers [the release workflow](.github/workflows/release.yml) that publishes a
GitHub Release.

---

## 📚 Documentation map

| File | Contents |
|------|----------|
| `README.md` · [`README.pt-BR.md`](README.pt-BR.md) | project overview (this page) |
| [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) · [pt-BR](.github/CONTRIBUTING.pt-BR.md) | **the workflow guide**: environment, branches, issues, PRs, releases |
| [`app/README.md`](app/README.md) · [pt-BR](app/README.pt-BR.md) | folder structure + step-by-step app bootstrap guide |
| [`docker/README.md`](docker/README.md) · [pt-BR](docker/README.pt-BR.md) | images, Compose, GPU, hot-reload workflow, troubleshooting |
| [`.devcontainer/README.md`](.devcontainer/README.md) · [pt-BR](.devcontainer/README.pt-BR.md) | the VS Code dev-container |
| [`CLAUDE.md`](CLAUDE.md) | conventions for the Claude Code agent |

Every local link — and any Mermaid diagram — is validated by
[`scripts/check-docs.sh`](scripts/check-docs.sh).

---

## 📄 License

[MIT](LICENSE) © 2026 Carlos Neto

# 🏨 Aegir Hotel

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-black?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose%20v2-2496ED?logo=docker&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  <img alt="Status" src="https://img.shields.io/badge/status-work%20in%20progress-orange">
</p>

**🌐 Language:** **English** · [Português](README.pt-BR.md)

> ⚠️ **Work in progress:** this project changes constantly.


---

## 📖 Overview

**Aegir** is a fictional beachfront hotel in Bahia, Brazil, shaped like a U open to the sea. The website tells its story section by section, and **every photo opens the place in 3D**.

This is a university team project at **UNIESP**, developed by a team of 5.

- **Live prototype:** [claude.ai/artifact/ExkmZoV4JgsG6WztkNgNVN](https://claude.ai/artifact/ExkmZoV4JgsG6WztkNgNVN)
- **Production version:** in progress in this repository, with **Next.js**, **React** and **TypeScript**.

---

## ✨ What the prototype already does

- **Scroll-driven landing page** with GSAP and ScrollTrigger: a loading screen, a hero that breaks into photo fragments, and one section for each place in the hotel.
- **3D viewer with Three.js:** 14 scenes loaded on demand (rooms, ground floor plan, 1:100 scale model and facade), with orbit controls and a details panel.
- **Day and sunset lighting:** two baked light setups per scene, switched with one click.
- **Suites:** a rotating 3D CSS prism and a comparison table.
- **"A day at Aegir":** a sticky clock that follows the scroll through seven moments of the day.
- **Booking flow:** dates, guests and suite with an instant estimate, plus a sign-in step before payment.
- **Settings panel and dark theme:** theme, cursor, effects and graphics quality, with the dark theme applied before the page appears.
- **Mobile:** the menu becomes a fan of cards you swipe through, and every section adapts to one column.

---

## 🧱 Tech stack

- **Framework:** Next.js with React 19 and TypeScript.
- **Styling:** SCSS.
- **Animation:** GSAP and ScrollTrigger.
- **3D:** Three.js (GLTFLoader, OrbitControls, baked lightmaps).
- **Tests:** Vitest.
- **Containers:** Docker and Docker Compose v2, with a multi-stage image and opt-in NVIDIA GPU passthrough.
- **Workflow:** Gitflow, GitHub Projects, CODEOWNERS reviews and a release pipeline with GitHub Actions.
- **Planned:** Blender-exported assets, a database and Python tooling for the asset and data pipeline.

---

## 🗂️ Repository layout

```
aegir-hotel/
├── .github/          # contribution guide, CODEOWNERS, issue and PR templates, release workflow
├── .devcontainer/    # VS Code / Codespaces dev container
├── app/              # the web client (Next.js)
├── docker/           # Dockerfile, Compose files and the .env with ports and versions
├── docs/images/      # images used in this README
├── scripts/          # check-docs.sh: validates Mermaid diagrams and local links
├── LICENSE
└── README.md · README.pt-BR.md
```

Every folder has an English `README.md` and a Portuguese `README.pt-BR.md`.

---

## 🚀 Quick start

**Requirements:** Docker Desktop (or Docker Engine with Compose v2). Nothing else needs to be installed on your computer, not even Node.

```bash
git clone https://github.com/CarlosNeto-dev/aegir-hotel.git
cd aegir-hotel/docker
cp .env.example .env

docker compose -f docker-compose.yml up      # without an NVIDIA GPU
docker compose up                            # with an NVIDIA GPU and the Container Toolkit
```

Then open the address shown in the terminal. Every port and version is defined once in `docker/.env`.

To stop:

```bash
docker compose down          # stop
docker compose down -v       # stop and remove the volumes
```

Container details, GPU notes and the hot-reload workflow are in [`docker/README.md`](docker/README.md).

---

## 🤝 Contributing

The whole workflow (environment, branches, issues, pull requests, versioning and releases) is in [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) · [Português](.github/CONTRIBUTING.pt-BR.md).

In short: work on a fork, branch off `develop`, open a pull request and get a [CODEOWNERS](.github/CODEOWNERS) review. A `v*.*.*` tag on `main` triggers [the release workflow](.github/workflows/release.yml), which publishes a GitHub Release.

---

## 📄 License

[MIT](LICENSE) © 2026 Carlos Neto

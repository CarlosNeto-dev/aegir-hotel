# 🏨 Aegir Hotel

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-black?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
  <img alt="Sass" src="https://img.shields.io/badge/SCSS-CC6699?logo=sass&logoColor=white">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-3-88CE02?logo=greensock&logoColor=black">
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose%20v2-2496ED?logo=docker&logoColor=white">
  <img alt="Licença" src="https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow.svg">
  <img alt="Status" src="https://img.shields.io/badge/status-em%20andamento-orange">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

> ⚠️ **Em andamento:** este projeto muda o tempo todo.

---

## 📖 Visão geral

O **Aegir** é um hotel fictício de frente para o mar, no litoral da Bahia, em forma de U aberto para o mar. O site conta a história dele seção por seção, e **cada foto abre o lugar em 3D**.

É um projeto de equipe da faculdade, na **UNIESP**, desenvolvido por 5 pessoas.

- **Protótipo no ar:** [claude.ai/artifact/ExkmZoV4JgsG6WztkNgNVN](https://claude.ai/artifact/ExkmZoV4JgsG6WztkNgNVN)
- **Versão final:** em desenvolvimento neste repositório, com **Next.js**, **React** e **TypeScript**.

---

## ✨ O que o protótipo já faz

- **Página animada pela rolagem** com GSAP e ScrollTrigger: tela de carregamento, uma abertura que se quebra em fragmentos de foto e uma seção para cada lugar do hotel.
- **Visualizador 3D com Three.js:** 14 cenas carregadas sob demanda (quartos, planta do térreo, maquete em escala 1:100 e fachada), com controles de órbita e um painel de detalhes.
- **Luz de dia e de pôr do sol:** duas iluminações prontas em cada cena, trocadas com um clique.
- **Suítes:** um prisma 3D em CSS que gira e uma tabela de comparação.
- **"Um dia no Aegir":** um relógio fixo que acompanha a rolagem por sete momentos do dia.
- **Reserva:** datas, hóspedes e suíte com estimativa na hora, e uma etapa de login antes do pagamento.
- **Painel de ajustes e tema escuro:** tema, cursor, efeitos e qualidade gráfica, com o tema escuro aplicado antes de a página aparecer.
- **Celular:** o menu vira um leque de cartas que se arrasta para o lado, e cada seção se adapta a uma coluna.

---

## 🧱 Tecnologias

- **Framework:** Next.js com React 19 e TypeScript.
- **Estilo:** SCSS.
- **Animação:** GSAP e ScrollTrigger.
- **3D:** Three.js (GLTFLoader, OrbitControls e iluminação pré-calculada).
- **Testes:** Vitest.
- **Contêineres:** Docker e Docker Compose v2, com imagem multi-stage e acesso opcional à GPU NVIDIA.
- **Fluxo de trabalho:** Gitflow, GitHub Projects, revisão por CODEOWNERS e publicação de versões com GitHub Actions.
- **Previsto:** modelos exportados do Blender, um banco de dados e ferramentas em Python para o pipeline de modelos e dados.

---

## 🗂️ Estrutura do repositório

```
aegir-hotel/
├── .github/          # guia de contribuição, CODEOWNERS, modelos de issue e PR, workflow de release
├── .devcontainer/    # dev container do VS Code / Codespaces
├── app/              # o site (Next.js)
├── docker/           # Dockerfile, arquivos do Compose e o .env com portas e versões
├── docs/images/      # imagens usadas neste README
├── scripts/          # check-docs.sh: valida diagramas Mermaid e links locais
├── LICENSE
└── README.md · README.pt-BR.md
```

Cada pasta tem um `README.md` em inglês e um `README.pt-BR.md` em português.

---

## 🚀 Como rodar

**Requisitos:** Docker Desktop (ou Docker Engine com Compose v2). Nada mais precisa ser instalado no seu computador, nem mesmo o Node.

```bash
git clone https://github.com/CarlosNeto-dev/aegir-hotel.git
cd aegir-hotel/docker
cp .env.example .env

docker compose -f docker-compose.yml up      # sem GPU NVIDIA
docker compose up                            # com GPU NVIDIA e o Container Toolkit
```

Depois, abra o endereço que aparece no terminal. Todas as portas e versões ficam definidas em um só lugar: `docker/.env`.

Para parar:

```bash
docker compose down          # para os contêineres
docker compose down -v       # para e apaga os volumes
```

Detalhes dos contêineres, da GPU e do recarregamento automático estão em [`docker/README.pt-BR.md`](docker/README.pt-BR.md).

---

## 🤝 Como contribuir

Todo o fluxo de trabalho (ambiente, branches, issues, pull requests, versões e releases) está em [`.github/CONTRIBUTING.pt-BR.md`](.github/CONTRIBUTING.pt-BR.md) · [English](.github/CONTRIBUTING.md).

Resumindo: trabalhe num fork, crie a branch a partir da `develop`, abra um pull request e aguarde a revisão do [CODEOWNERS](.github/CODEOWNERS). Uma tag `v*.*.*` na `main` dispara [o workflow de release](.github/workflows/release.yml), que publica uma GitHub Release.

---

## 📄 Licença

[MIT](LICENSE) © 2026 Carlos Neto

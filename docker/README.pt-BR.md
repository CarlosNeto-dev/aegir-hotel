# 🐳 `docker/` — referência de containers

<p>
  <img alt="Base image" src="https://img.shields.io/badge/base-node%3A24--bookworm--slim-339933?logo=node.js&logoColor=white">
  <img alt="Prod image" src="https://img.shields.io/badge/prod-nginx%3A1.27--alpine-009639?logo=nginx&logoColor=white">
  <img alt="Compose" src="https://img.shields.io/badge/Compose-v2-2496ED?logo=docker&logoColor=white">
</p>

**🌐 Idioma:** [English](README.md) · **Português**

Definições de containers do projeto — **somente front-end** por enquanto.

> Início rápido, tabela de portas e resumo de GPU estão no
> [`README.pt-BR.md`](../README.pt-BR.md) da raiz. Esta página é só o interior
> dos containers.

| Arquivo | Papel |
|---------|-------|
| `Dockerfile.frontend` | imagem multi-stage: `base → debugger → build → production` |
| `docker-compose.yml` | serviços `website` + `tests` |
| `docker-compose.override.yml` | repasse opcional de GPU NVIDIA (mesclado automaticamente) |
| `.env` / `.env.example` | o único lugar para mudar portas e versões |

O **contexto de build é a raiz do repositório** (`context: ..` no Compose), então
o único `.dockerignore` fica lá. Rode os comandos do Compose a partir de
`docker/` (ou passe `-f docker/docker-compose.yml`).

---

## 🧱 A imagem multi-stage

```bash
docker build -f docker/Dockerfile.frontend --target debugger  -t aegir-web:dev  .   # da raiz do repo
docker build -f docker/Dockerfile.frontend --target production -t aegir-web:prod .
```

| Estágio | A partir de | Contém | Vai p/ produção? |
|---------|-------------|--------|------------------|
| `base` | `node:24-bookworm-slim` | **apenas** o runtime do Node + `WORKDIR /app` — único lugar onde a versão do Node é definida | não |
| `debugger` | `base` | `base` + `git`, `curl`, `procps`, `serve`, `source-map-explorer` | dev / CI |
| `build` | `base` | `npm ci` + `npm run build` → `/app/dist` | não |
| `production` | `nginx:1.27-alpine` | **apenas** o site estático compilado + fallback SPA + cache de assets | ✅ |

- O `debugger` é o que o Compose e o dev-container usam.
- `build` / `production` precisam de `app/package.json` (+ lock). Num esqueleto
  novo, só o `debugger` compila — que é tudo que o Compose precisa.
- **O npm não é atualizado** — mantém-se o que vem na imagem do Node. Ele bloqueia
  install-scripts de pacotes por padrão (ok para React / Vite / Sass / Vitest /
  GSAP). Aprove uma necessidade real com `npm install-scripts approve <pacote>`.

---

## ⚙️ Como os serviços são montados

A configuração compartilhada é definida uma vez como âncoras YAML
(`x-frontend-build`, `x-frontend-service`, `x-frontend-healthcheck`) e mesclada
com `<<:`.

| | `website` | `tests` |
|-|-----------|---------|
| comando | `npm install && vite` | `npm install && vitest --ui …` |
| volume | `../app → /app` **apenas** | igual |
| portas | `5173`, `4173`, `9229` | `51204` |
| healthcheck | `node -e "process.exit(0)"` (liveness) | igual |
| restart | `unless-stopped` | `on-failure` |
| depends_on | — | `website` |

- **`npm install` no comando:** ainda não há lock file embutido na imagem, então
  as deps são instaladas no `app/` montado a cada start. Quando `app/package-lock.json`
  for versionado, coloque `npm ci` na imagem e remova a instalação do comando.
- **`tests` sai sem arquivos de teste** (comportamento do Vitest, código 0).
  `restart: on-failure` faz essa saída limpa não entrar em loop; a UI fica
  residente na `51204` assim que existir um `*.test.tsx`.

---

## 🎮 GPU

`docker-compose.override.yml` dá ao container `website` acesso à GPU NVIDIA —
para o trabalho futuro com react-three-fiber / WebGL acelerado e renders headless
do Blender. O Compose o mescla automaticamente num `docker compose up` simples.

```
Máquina COM GPU NVIDIA + Container Toolkit
    docker compose up                        → base + override (GPU ligada)

Máquina SEM suporte a GPU
    docker compose -f docker-compose.yml up   → só base, override ignorado
    (ou apague / renomeie docker-compose.override.yml)
```

Requisitos: driver NVIDIA no host, o
[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/) e
(Docker Desktop) GPU habilitada com o backend WSL2. Verifique com `nvidia-smi`
dentro do container.

---

## 🔥 Fluxo de hot-reload (verificado de ponta a ponta)

```bash
cd docker && docker compose -f docker-compose.yml up -d --build
docker compose logs -f website        # aguarde "VITE vX ready in …"
```

| Edição | Resultado |
|--------|-----------|
| `app/src/**/*.tsx` | `[vite] (client) hmr update …`, módulo trocado, estado do React mantido |
| `.scss` / `.module.scss` | estilo reinjetado, sem reload, hashes de classe estáveis |
| `app/vite.config.ts` | o Vite reinicia o servidor de dev sozinho |
| `*.test.tsx` (com `tests` no ar) | testes afetados re-executam, UI do Vitest atualiza |

O hot reload através do bind mount precisa de polling em `app/vite.config.ts`:

```ts
server: { host: true, watch: { usePolling: true, interval: 100 } }
```

```bash
docker compose down          # ou  down -v  para remover volumes também
```

---

## 🩺 Solução de problemas

| Sintoma | Causa / correção |
|---------|------------------|
| Edições não fazem hot-reload | falta `usePolling` no `vite.config.ts`, ou você editou fora de `app/` (só `app/` é montado) |
| O container `tests` fica parando | esperado com zero arquivos de teste — adicione um em `src/` |
| Porta já alocada | mude o valor em `docker/.env` e rode `docker compose up` de novo |
| `could not select device driver "nvidia"` | sem runtime de GPU — use `docker compose -f docker-compose.yml up` |
| `npm warn install-scripts … blocked` | intencional; `npm install-scripts approve <pkg>` se realmente precisar |
| `node_modules` velho após mudar dependências | `docker compose down -v` e depois `up` |

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🤝 Fluxo de contribuição](../.github/CONTRIBUTING.pt-BR.md) ·
[🎨 app/](../app/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](README.md)

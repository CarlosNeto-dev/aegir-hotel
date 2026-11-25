# 🤝 Contribuindo com o Aegir Hotel

<p>
  <img alt="CI" src="https://img.shields.io/badge/CI-por%20tag-2088FF?logo=githubactions&logoColor=white">
  <img alt="Reviews" src="https://img.shields.io/badge/revis%C3%A3o-CODEOWNERS-24292e?logo=github&logoColor=white">
  <img alt="Issues" src="https://img.shields.io/badge/issues-s%C3%B3%20formul%C3%A1rio-0969da?logo=github&logoColor=white">
  <img alt="Versioning" src="https://img.shields.io/badge/versionamento-SemVer%20(v*)-orange">
</p>

**🌐 Idioma:** [English](CONTRIBUTING.md) · **Português**

A **fonte única da verdade do fluxo de contribuição**: ambiente de dev, branches,
issues, pull requests, versionamento e releases. A visão geral do projeto está no
[`README.pt-BR.md`](../README.pt-BR.md) da raiz.

> _Os diagramas do fluxo foram removidos temporariamente e serão readicionados aqui._

---

## 📁 O que tem em `.github/`

| Caminho | Finalidade |
|---------|------------|
| [`CODEOWNERS`](CODEOWNERS) | revisores obrigatórios por path — roster de 5 (placeholders; troque pelos handles reais) |
| [`ISSUE_TEMPLATE/`](ISSUE_TEMPLATE) | **formulários** de issue — `bug_report`, `feature_request`, `task`; `config.yml` desativa issues em branco |
| [`PULL_REQUEST_TEMPLATE.md`](PULL_REQUEST_TEMPLATE.md) | o checklist que todo PR deve cumprir |
| [`workflows/release.yml`](workflows/release.yml) | o **único** workflow de CI — roda numa tag `v*.*.*`, nunca em branch ou PR |

---

## 1 · 🧰 Prepare seu ambiente

O **único** fluxo suportado é o dev-container.

```bash
# 1. faça o fork no GitHub, depois:
git clone https://github.com/<voce>/aegir-hotel.git
cd aegir-hotel
git remote add upstream https://github.com/CarlosNeto-dev/aegir-hotel.git

# 2. abra o editor pelo terminal
cursor .            # ou:  code .

# 3. no editor:  Ctrl/Cmd + Shift + P
#    → "Dev Containers: Reopen in Container"
#    → escolha  .devcontainer/frontend
```

<!-- diagram (flowchart) removed on request — to be re-added later -->

O container é o mesmo que o `docker compose` roda, então o que você vê é o que a
CI e a produção recebem. Veja [`../docker/README.pt-BR.md`](../docker/README.pt-BR.md)
e [`../.devcontainer/README.pt-BR.md`](../.devcontainer/README.pt-BR.md).

---

## 2 · 🌿 Branches

`main` = produção (com tag). `develop` = integração. Todo o resto sai de
`develop` e volta para `develop`.

| Branch | Finalidade | Sai de | Volta para | Protegida |
|--------|-----------|--------|------------|-----------|
| `main` | produção; todo commit é "releasável" e recebe tag | — | — | ✅ |
| `develop` | integração do trabalho concluído | `main` | `main` (via PR de release) | ✅ |
| `feature/<slug>` | funcionalidade de uma issue | `develop` | `develop` | — |
| `fix/<slug>` | correção de bug não urgente | `develop` | `develop` | — |
| `chore/<slug>` | ferramentas / deps / docs | `develop` | `develop` | — |
| `release/v<x.y.z>` | teste final de uma versão: só correções e docs, nada novo | `develop` | `main` (tag), depois de volta para `develop` | — |
| `hotfix/<slug>` | correção urgente numa versão lançada | `main` | `main` **e** `develop` | — |

<!-- diagram (gitGraph) removed on request — to be re-added later -->

- O nome real da branch carrega a issue (`feature/1234-cena-lobby`); `fix/*` e
  `hotfix/*` seguem o mesmo formato da tabela acima.
- Branches de vida curta. Faça rebase em `develop` antes de abrir o PR.
- Uma issue leva a uma branch, que leva a um PR.
- Apague a branch depois que o PR entrar. Os commits e o PR ficam no histórico;
  só a etiqueta some.
- **Produção** é a última tag `v*.*.*` na `main`. Antes da primeira tag não há o
  que corrigir com hotfix: bugs vão em `fix/*`.
- `main` e `develop` são protegidas por um ruleset: não podem ser apagadas, não
  aceitam force push e só mudam por PR.

---

## 3 · 🧩 Issues & GitHub Projects

<!-- diagram (stateDiagram-v2) removed on request — to be re-added later -->

1. Abra uma issue com um formulário
   ([bug](ISSUE_TEMPLATE/bug_report.yml) ·
   [feature](ISSUE_TEMPLATE/feature_request.yml) ·
   [task](ISSUE_TEMPLATE/task.yml)). Issues em branco estão desativadas.
2. Um mantenedor aplica labels e adiciona a issue ao
   [board do GitHub Projects](https://github.com/users/CarlosNeto-dev/projects/3)
   (`To do` → `In Progress` → `In Review` → `Done`; `Canceled` para trabalho
   descartado). Os formulários ainda não colocam a issue no board sozinhos: a
   chave `projects:` deles está comentada.
3. Pegue um card em **To do**, se atribua, mova para **In Progress**.
4. Seu PR fecha a issue: coloque `Closes #<id>` na descrição. O merge move o card
   para **Done** automaticamente.

---

## 4 · 🔁 Pull requests — fork → revisão → merge

<!-- diagram (sequenceDiagram) removed on request — to be re-added later -->

```bash
git switch develop && git pull upstream develop
git switch -c feature/1234-cena-lobby

# ...trabalhe, commitando aos poucos...

# dentro do dev-container; ainda não existe script de lint nem de teste
pnpm typecheck && pnpm build

git push -u origin feature/1234-cena-lobby
# abra o PR no GitHub, base = develop, preencha o template
```

**Regras de PR**

- A branch base é **`develop`** (só PRs de release miram `main`).
- O checklist do [template de PR](PULL_REQUEST_TEMPLATE.md) deve estar completo.
- Um dono do **[CODEOWNERS](CODEOWNERS)** (o Neto) revisa todo PR. O ruleset
  só obriga que a mudança chegue por PR (0 aprovações exigidas), então isso é
  uma regra do time, não um bloqueio do GitHub.
- Não há checks no PR: a CI só roda com uma tag `v*.*.*`. Rode os comandos acima
  antes do push. Squash-merge; o título do PR vira a linha de changelog.
  **Exceção:** PRs de release, e PRs que sincronizam a `main` com a `develop`,
  usam **"Create a merge commit"**. Um squash ali faz as duas branches divergirem.
- Atualize a documentação — `README.md` **e** `README.pt-BR.md` — no mesmo PR.
- Rode [`scripts/check-docs.sh`](../scripts/check-docs.sh) se mexeu em algum
  diagrama Mermaid.

**Mensagens de commit** — [Conventional Commits](https://www.conventionalcommits.org):
`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `ci:` … Use `!` para
mudança que quebra compatibilidade.

---

## 5 · 🏷️ Versionamento & release

[SemVer](https://semver.org): `MAJOR.MINOR.PATCH`, prefixo de tag `v`
(pré-lançamentos: `v1.2.0-rc.1`).

<!-- diagram (sequenceDiagram) removed on request — to be re-added later -->

```bash
# 1. corte a branch de release a partir da develop
git switch develop && git pull upstream develop
git switch -c release/v1.2.0
# teste em todos os dispositivos; aqui só entram correções e docs
git push -u origin release/v1.2.0
# abra um PR: base = main, mescle com "Create a merge commit"

# 2. traga a release de volta para a develop
#    (abra um PR main -> develop, também com merge commit)

# 3. em main, depois que o PR de release entrou:
git switch main && git pull upstream main
git tag v1.2.0
git push upstream v1.2.0        # ← único gatilho do GitHub Actions
```

[`workflows/release.yml`](workflows/release.yml) roda **apenas** numa tag
`v*.*.*`. Pipeline: `detect` (acha `front-end/package.json`, lê `NODE_VERSION` de
`docker/.env.example`) → `quality` (`pnpm install`, depois lint · format · typecheck ·
test · `pnpm audit` · build, cada um `--if-present`) → `release` (`gh release
create` com notas geradas e o `dist/` compilado zipado). Enquanto não existir
`front-end/package.json`, o `quality` é pulado e o workflow ainda publica um Release
para a tag. **Esse Release é o artefato final entregável.**

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🎨 app/](../front-end/README.pt-BR.md) ·
[🐳 docker/](../docker/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](../CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](CONTRIBUTING.md)

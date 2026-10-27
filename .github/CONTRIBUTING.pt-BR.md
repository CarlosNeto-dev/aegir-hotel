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
| `hotfix/<slug>` | correção urgente em produção | `main` | `main` **e** `develop` | — |

<!-- diagram (gitGraph) removed on request — to be re-added later -->

- O nome real da branch carrega a issue (`feature/1234-cena-lobby`); `fix/*` e
  `hotfix/*` seguem o mesmo formato da tabela acima.
- Branches de vida curta. Faça rebase em `develop` antes de abrir o PR.
- Uma issue leva a uma branch, que leva a um PR.

---

## 3 · 🧩 Issues & GitHub Projects

<!-- diagram (stateDiagram-v2) removed on request — to be re-added later -->

1. Abra uma issue com um formulário
   ([bug](ISSUE_TEMPLATE/bug_report.yml) ·
   [feature](ISSUE_TEMPLATE/feature_request.yml) ·
   [task](ISSUE_TEMPLATE/task.yml)). Issues em branco estão desativadas.
2. Um mantenedor faz a triagem, aplica labels e coloca no board do
   **GitHub Projects** (`Triage → Todo → In progress → In review → Done`).
   Preencha a chave `projects:` em cada formulário quando o board existir.
3. Pegue um card em **Todo**, se atribua, mova para **In progress**.
4. Seu PR fecha a issue: coloque `Closes #<id>` na descrição. O merge move o card
   para **Done** automaticamente.

---

## 4 · 🔁 Pull requests — fork → revisão → merge

<!-- diagram (sequenceDiagram) removed on request — to be re-added later -->

```bash
git switch develop && git pull upstream develop
git switch -c feature/1234-cena-lobby

# ...trabalhe, commitando aos poucos...

pnpm lint && pnpm typecheck && pnpm test && pnpm build

git push -u origin feature/1234-cena-lobby
# abra o PR no GitHub, base = develop, preencha o template
```

**Regras de PR**

- A branch base é **`develop`** (só PRs de release miram `main`).
- O checklist do [template de PR](PULL_REQUEST_TEMPLATE.md) deve estar completo.
- Pelo menos uma aprovação de **[CODEOWNERS](CODEOWNERS)**.
- Todos os checks verdes. Squash-merge; o título do PR vira a linha de changelog.
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
# em main, depois que o PR de release entrou:
git switch main && git pull upstream main
git tag v1.2.0
git push upstream v1.2.0        # ← único gatilho do GitHub Actions
```

[`workflows/release.yml`](workflows/release.yml) roda **apenas** numa tag
`v*.*.*`. Pipeline: `detect` (acha `app/package.json`, lê `NODE_VERSION` de
`docker/.env.example`) → `quality` (`pnpm install`, depois lint · format · typecheck ·
test · `pnpm audit` · build, cada um `--if-present`) → `release` (`gh release
create` com notas geradas e o `dist/` compilado zipado). Enquanto não existir
`app/package.json`, o `quality` é pulado e o workflow ainda publica um Release
para a tag. **Esse Release é o artefato final entregável.**

---

## 🧭 Documentação relacionada

[🏠 Visão geral](../README.pt-BR.md) ·
[🎨 app/](../app/README.pt-BR.md) ·
[🐳 docker/](../docker/README.pt-BR.md) ·
[🧩 .devcontainer/](../.devcontainer/README.pt-BR.md) ·
[🤖 CLAUDE.md](../CLAUDE.md)
&nbsp;&nbsp;|&nbsp;&nbsp; 🇬🇧 [English](CONTRIBUTING.md)

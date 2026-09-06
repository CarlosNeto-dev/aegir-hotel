#!/usr/bin/env bash
# =============================================================================
#  check-docs.sh · validate every Markdown doc in the repo
# -----------------------------------------------------------------------------
#  1. Every ```mermaid block renders without error (mermaid-cli via Docker).
#  2. Every relative Markdown link resolves to a file that exists.
#
#  Requires: Docker (pulls ghcr.io/mermaid-js/mermaid-cli on first run) + node.
#  Best run inside the dev-container or CI (Linux). Usage:
#      bash scripts/check-docs.sh
#  Exit: 0 = all good · 1 = at least one problem
# =============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MMDC_IMAGE="ghcr.io/mermaid-js/mermaid-cli/mermaid-cli:11.4.2"
# Repo-local scratch dir (avoids /tmp path translation on Git Bash for Windows).
WORK="$ROOT/.docs-check-tmp"
export WORK
rm -rf "$WORK"; mkdir -p "$WORK"
trap 'rm -rf "$WORK"' EXIT
fail=0

# Docker needs a Windows-style host path for the bind mount on Git Bash.
if command -v cygpath >/dev/null 2>&1; then
  WORK_MOUNT="$(cygpath -w "$WORK")"
else
  WORK_MOUNT="$WORK"
fi

mapfile -t MD_FILES < <(find . \
  -type d \( -name node_modules -o -name dist -o -name .git \) -prune -o \
  -type f -name '*.md' -print | sed 's|^\./||' | sort)
echo "▶ ${#MD_FILES[@]} Markdown files"

# ---------------------------------------------------------------------------
# 1 · Mermaid diagrams
# ---------------------------------------------------------------------------
node -e '
  const fs = require("fs");
  const files = process.argv.slice(1);
  const blocks = [];
  for (const f of files) {
    let m, i = 0;
    const re = /```mermaid\n([\s\S]*?)```/g;
    const src = fs.readFileSync(f, "utf8");
    while ((m = re.exec(src))) blocks.push({ f, i: i++, code: m[1] });
  }
  blocks.forEach((b, n) => fs.writeFileSync(`${process.env.WORK}/d${n}.mmd`, b.code));
  fs.writeFileSync(`${process.env.WORK}/labels`,
    blocks.map((b, n) => `d${n}\t${b.f}\t#${b.i}`).join("\n"));
  console.log(blocks.length);
' "${MD_FILES[@]}" | sed "s/^/▶ /;s/$/ Mermaid diagrams/"

while IFS=$'\t' read -r id file idx; do
  [ -z "${id:-}" ] && continue
  if MSYS_NO_PATHCONV=1 docker run --rm -v "$WORK_MOUNT:/data" "$MMDC_IMAGE" \
       -i "/data/$id.mmd" -o "/data/$id.svg" >"$WORK/err" 2>&1 \
     && [ -s "$WORK/$id.svg" ]; then
    :
  else
    echo "  ✗ $file (mermaid $idx) failed:"
    grep -iE 'error|exception|parse' "$WORK/err" | head -3 | sed 's/^/      /'
    fail=1
  fi
done < "$WORK/labels"

# ---------------------------------------------------------------------------
# 2 · Local Markdown links
# ---------------------------------------------------------------------------
node -e '
  const fs = require("fs"), path = require("path");
  let bad = 0;
  for (const f of process.argv.slice(1)) {
    const dir = path.dirname(f);
    for (const m of fs.readFileSync(f, "utf8").matchAll(/\]\(([^)]+)\)/g)) {
      const t = m[1].trim();
      if (/^(https?:|mailto:|#)/.test(t)) continue;
      const anchor = t.split("#")[0];
      if (anchor && !fs.existsSync(path.join(dir, anchor))) {
        console.log(`  ✗ ${f} → ${t}`);
        bad++;
      }
    }
  }
  process.exit(bad ? 1 : 0);
' "${MD_FILES[@]}" || fail=1
echo "▶ local links checked"

# ---------------------------------------------------------------------------
if [ "$fail" -eq 0 ]; then echo "✅ docs OK"; else echo "❌ docs have problems"; fi
exit "$fail"

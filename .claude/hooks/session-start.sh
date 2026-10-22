#!/bin/bash
# Prepara las sesiones de Claude Code en la nube: instala el toolkit de
# contribucion (businext-apm -> .claude/skills: /story, /implement, /verify...)
# y las dependencias del monorepo.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Misma version de apm que fija apm.lock.yaml.
APM_VERSION="$(sed -n 's/^apm_version: *//p' apm.lock.yaml)"
if ! command -v apm >/dev/null 2>&1 || ! apm --version | grep -q "$APM_VERSION"; then
  pip install --quiet --break-system-packages "apm-cli==${APM_VERSION}"
fi

# Sin GITHUB_TOKEN/GH_TOKEN el clone pasa por el proxy git de la sesion, que
# ya autentica; con ellos apm los usa como PAT y GitHub los rechaza.
# --no-policy: la sesion no puede leer businext-sys/.github-private.
env -u GITHUB_TOKEN -u GH_TOKEN apm install --frozen --target claude --no-policy

pnpm install

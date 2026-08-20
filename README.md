# businext (monorepo)

Monorepo de Businext: web, mobile (en construccion) y logica compartida.

Ver el plan maestro completo en `.specify/PLAN.md` y el board de GitHub
Projects de la organizacion `businext-sys` para el estado de cada fase.

## Estructura

```text
apps/
  web/                 Next.js 15 (App Router). Antes "businext-frontend".
  mobile/              Expo/React Native (Fase 5, aun sin codigo).
packages/
  shared-core/         Tipos de dominio y logica de negocio pura,
                       compartidos entre apps/web y apps/mobile.
                       Ver packages/shared-core/README.md.
```

## Requisitos

- Node.js >= 20
- pnpm >= 9 (`npm i -g pnpm`)

## Comandos

```bash
# Instalar dependencias de todo el monorepo
pnpm install

# Desarrollo de la web
pnpm dev:web

# Build de la web
pnpm build:web

# Lint / type-check de la web
pnpm lint:web
pnpm type-check:web

# Type-check / tests de shared-core
pnpm type-check:shared-core
pnpm test:shared-core
```

## Especificaciones tecnicas (spec-kit)

Los features no triviales siguen el flujo de `.specify/` (`/speckit.specify`
-> `/speckit.plan` -> `/speckit.tasks` -> `/speckit.implement`). Ver
`specs/001-extraer-core-compartido/` para el detalle de la extraccion de
logica compartida a `packages/shared-core` (issues #13-#20 del board).

## Integracion con Claude Code Action

El repo usa la GitHub App oficial de Anthropic (`anthropics/claude-code-action`)
en vez de opencode. Hay 2 workflows en `.github/workflows/`:

- **`claude.yml`**: responde a menciones `@claude` en comentarios de issues,
  PRs y reviews. Tambien implementa un issue de forma autonoma cuando se le
  aplica la etiqueta `claude-implement`.
- **`claude-ci-autofix.yml`**: cuando falla un workflow de CI en un PR, crea
  una branch con el fix y abre un PR. **Queda inerte hasta que exista un
  workflow llamado `CI`** (lint/type-check/test) en `.github/workflows/` -
  hoy no hay ninguno; ver issue de creacion de CI en el board.

### Setup (una sola vez, requiere admin del repo)

1. Instalar la GitHub App en <https://github.com/apps/claude> sobre este
   repositorio.
2. Configurar el secret `ANTHROPIC_API_KEY` en Settings -> Secrets and
   variables -> Actions -> New repository secret.

### Uso

- Comentar `@claude <instruccion>` en cualquier issue o PR.
- Etiquetar un issue con `claude-implement` para que lo implemente de forma
  autonoma y abra un PR.
- Abrir un PR: se revisa automaticamente sin pasos adicionales.

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

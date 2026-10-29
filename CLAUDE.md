# businext

Monorepo de Businext: `apps/web` (Next.js), `apps/mobile` (Expo) y `packages/shared-core`.
Setup, variables y comandos en `README.md`; convenciones de cada parte en sus README.
Antes de crear o cambiar UI en web o móvil, lee `DESIGN.md`: es la identidad visual (tokens y
reglas) y no se usan valores fuera de ella.

## Proceso de contribución

Este repo sigue el proceso de `businext-sys/businext-apm` (`docs/contributing-standard.md`),
instalado con `apm install` en `.claude/` (no se commitea: cada persona lo instala): `/story` → `/implement <n>` → `/verify <n>`, con las
stories en el tablero Businext System Build y la etiqueta `repo:businext`.

- Ramas `<tipo>/<NNN>-<slug>` (`feat/059-agenda-semanal`); commits y PRs con
  `Refs businext-sys/businext#<n>`.
- Validación antes del PR: `pnpm type-check:shared-core`, `pnpm test:shared-core`,
  `pnpm type-check:web`, `pnpm lint:web` y `pnpm build:web` (y los de mobile si cambia). No hay CI
  de PR que lo haga por ti.
- Solo pnpm: `npm install` rompe los enlaces `workspace:*`.
- `@claude` y la etiqueta `claude-implement` disparan `.github/workflows/claude.yml`, el camino
  automático. No se mezclan con este proceso.
- Actualizar el toolkit: `apm update --yes` y commitear `apm.lock.yaml`.

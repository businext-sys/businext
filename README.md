# businext (monorepo)

Monorepo de Businext: web (Next.js), mobile (Expo/React Native) y la logica de
dominio compartida entre ambas.

El backend (FastAPI) vive en un repo aparte:
[`businext-sys/businext-backend`](https://github.com/businext-sys/businext-backend).
Los tests E2E / carga / API en
[`businext-sys/businext-qa-runner`](https://github.com/businext-sys/businext-qa-runner).

## Estructura

```text
apps/
  web/                 Next.js 15 (App Router) + React 19. Puerto 3000.
  mobile/              Expo SDK 57 + Expo Router. Metro en 8081.
packages/
  shared-core/         Tipos de dominio, schemas, mappers y hooks puros,
                       consumidos por apps/web y apps/mobile via
                       "workspace:*". Ver packages/shared-core/README.md.
```

Cada app tiene su propio README con las convenciones internas
(`apps/web/README.md`, `apps/mobile/README.md`). **Las instrucciones de
arranque local viven solo aqui.**

## Requisitos

| Herramienta | Version | Para |
|---|---|---|
| Node.js | >= 20 | web, mobile, shared-core |
| pnpm | >= 9 (`npm i -g pnpm`) | todo el monorepo |
| Python | 3.12 (la misma que CI y el Dockerfile) | backend |
| [uv](https://docs.astral.sh/uv/) | cualquiera | crear el venv de 3.12 sin instalar Python a mano |
| [Expo Go](https://expo.dev/go) | app de iOS/Android | probar mobile sin build nativo |

> **pnpm, no npm.** Las apps se resuelven como workspaces; un `npm install`
> dentro de `apps/web` rompe el link `workspace:*` a `@businext/shared-core`.

## Levantar el entorno local

Los tres servidores son independientes, pero web y mobile no hacen nada util
sin el backend: arranca en ese orden.

### 0. Dependencias del monorepo

```bash
pnpm install     # desde la raiz, instala web + mobile + shared-core
```

### 1. Backend (FastAPI, puerto 8000)

En el repo `businext-backend`, con su `.env` ya configurado (ver
[su README](https://github.com/businext-sys/businext-backend#readme)):

```bash
cd ../businext-backend
uv venv --python 3.12 && source .venv/bin/activate
uv pip install -r requirements.txt -r requirements-dev.txt
uvicorn src.main:app --reload --port 8000
```

Verifica con `curl http://localhost:8000/health` → `{"status":"ok"}`.

`src/main.py` solo permite CORS desde `http://localhost:3000` y desde el
dominio de produccion; si sirves la web en otro puerto hay que anadirlo ahi.

### 2. Web (Next.js, puerto 3000)

```bash
pnpm dev:web     # equivale a: pnpm --filter @businext/web dev
```

Variables en `apps/web/.env.local` (gitignored):

```env
# Requeridas para arrancar y autenticar
NEXT_PUBLIC_API_BASE=http://localhost:8000        # URL del backend, SIN /api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<anon/publishable key>

# Subida de imagenes de producto (Supabase Storage, server-side)
SUPABASE_SERVICE_ROLE_KEY=<service role key>

# Flujo de suscripcion (solo si tocas /payment y el webhook de Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRODUCT=

# Formulario de contacto de la landing (opcional)
GMAIL_BUSINEXT_USER=
GMAIL_BUSINEXT_PASSWORD=
```

`NEXT_PUBLIC_API_BASE` la consume el middleware (`src/middleware.ts`) y los
route handlers de `src/app/api/*`, que hacen de BFF hacia FastAPI. Sin ella el
login parece funcionar pero toda peticion de datos falla.

### 3. Mobile (Expo)

```bash
pnpm --filter @businext/mobile start
```

Variables en `apps/mobile/.env` (gitignored, las lee el CLI de Expo
automaticamente y las expone via `Constants.expoConfig.extra`):

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key>
EAS_PROJECT_ID=<projectId de expo.dev>
```

Mismo proyecto de Supabase que `apps/web`.

**Si pruebas en un telefono fisico con Expo Go, `localhost` apunta al
telefono, no a tu maquina.** Usa tu IP de LAN y expon uvicorn en todas las
interfaces:

```bash
# backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
# apps/mobile/.env
EXPO_PUBLIC_API_BASE_URL=http://192.168.x.x:8000
```

En emulador de Android el host de la maquina anfitriona es `http://10.0.2.2:8000`.

### Migraciones: no corras Alembic en local

`alembic/versions/` esta en el `.gitignore` del backend y **nunca se
commiteo**: el repo no contiene ninguna revision. La base de datos real, en
cambio, tiene su `alembic_version` sellada en la revision `014`, asi que
`alembic upgrade head` **falla** con `Can't locate revision identified by
'014'`. Falla al resolver el grafo de revisiones, antes de tocar el esquema
(no es destructivo), pero no funciona.

Consecuencias practicas:

- Apunta `DATABASE_URI` a la base de Supabase ya migrada. No intentes levantar
  un Postgres local vacio esperando que Alembic lo pueble: contra una base
  vacia no fallaria, pero no aplicaria nada.
- Si arrancas el backend en Docker, usa `RUN_MIGRATIONS=0`: el entrypoint corre
  con `set -eu`, asi que el fallo de Alembic mata el contenedor antes de que
  uvicorn arranque.
- Cualquier tabla nueva (p. ej. `push_token`, issue #031) hay que crearla a
  mano en Supabase hasta que se versionen las migraciones.

Detalle completo y como salir de ahi: ver la seccion de migraciones del
[README del backend](https://github.com/businext-sys/businext-backend#migraciones).

## Comandos

```bash
# Web
pnpm dev:web
pnpm build:web
pnpm lint:web
pnpm type-check:web

# Mobile
pnpm --filter @businext/mobile start
pnpm --filter @businext/mobile type-check
pnpm --filter @businext/mobile lint

# shared-core
pnpm type-check:shared-core
pnpm test:shared-core
pnpm generate:types      # regenera los tipos desde el OpenAPI del backend
```

`generate:types` necesita el backend corriendo (o `OPENAPI_URL` apuntando a
uno desplegado); ver `packages/shared-core/scripts/generate-types.mjs`.

## Especificaciones tecnicas (spec-kit)

Los features no triviales siguen el flujo de `.specify/` (`/speckit.specify`
-> `/speckit.plan` -> `/speckit.tasks` -> `/speckit.implement`). El plan
maestro completo esta en `.specify/PLAN.md` y el estado de cada fase en el
board de GitHub Projects de la organizacion `businext-sys`.

## Integracion con Claude Code Action

El repo usa la GitHub App oficial de Anthropic
(`anthropics/claude-code-action`). Hay 2 workflows en `.github/workflows/`:

- **`claude.yml`**: responde a menciones `@claude` en comentarios de issues,
  PRs y reviews. Tambien implementa un issue de forma autonoma cuando se le
  aplica la etiqueta `claude-implement`.
- **`claude-ci-autofix.yml`**: cuando falla un workflow de CI en un PR, crea
  una branch con el fix y abre un PR. **Queda inerte hasta que exista un
  workflow llamado `CI`** (lint/type-check/test) en `.github/workflows/` -
  hoy no hay ninguno para web/mobile; ver issue de creacion de CI en el board.

Otros workflows: `generate-types.yml` (regenera los tipos de `shared-core`
desde el OpenAPI del backend) y `mobile-build.yml` (EAS Build de `apps/mobile`).

### Setup (una sola vez, requiere admin del repo)

1. Instalar la GitHub App en <https://github.com/apps/claude> sobre este
   repositorio.
2. Configurar el secret `ANTHROPIC_API_KEY` en Settings -> Secrets and
   variables -> Actions -> New repository secret.

### Uso

- Comentar `@claude <instruccion>` en cualquier issue o PR.
- Etiquetar un issue con `claude-implement` para que lo implemente de forma
  autonoma y abra un PR.

La review automatica de cada PR se elimino en #65: hoy la review solo ocurre
si alguien menciona `@claude` explicitamente en el PR.

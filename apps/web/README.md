# @businext/web

App web de Businext: Next.js 15 (App Router) + React 19 + TypeScript.

**Arranque local, variables de entorno y requisitos: ver el
[README de la raiz del monorepo](../../README.md).** Este documento cubre solo
las convenciones internas de la web.

## Stack

- **Next.js 15** App Router — las rutas de `src/app/api/*` actuan como BFF
  hacia el backend FastAPI (`NEXT_PUBLIC_API_BASE`).
- **React 19**
- **Tailwind CSS 4** — utility-first, mobile-first
- **MUI + Headless UI** — date pickers y primitivas accesibles
- **SWR** — data fetching, cache y updates optimistas
- **React Hook Form** + **Zod** — formularios y validacion
- **Supabase** (`@supabase/ssr`) — autenticacion y storage
- **Stripe** — suscripciones
- **Lucide React** — iconos
- **`@businext/shared-core`** — tipos de dominio, schemas y hooks compartidos
  con `apps/mobile`

## Estructura

```text
src/
├── app/
│   ├── api/               # Route handlers (BFF hacia FastAPI)
│   ├── configuration/     # Configuracion del negocio
│   ├── finances/          # Finanzas
│   ├── products/          # Productos
│   ├── reservation/       # Reservas
│   ├── login/             # Auth
│   └── layout.tsx         # Root layout (AppShell + ErrorBoundary)
├── components/
│   ├── common/
│   │   ├── AppShell.tsx         # Layout shell (visibilidad del sidebar)
│   │   ├── ConfirmDialog.tsx    # Modal de confirmacion accesible
│   │   ├── SkeletonLoader.tsx   # Skeletons por seccion
│   │   ├── Toast.tsx            # Notificaciones no bloqueantes
│   │   ├── Sidebar.tsx          # Navegacion
│   │   └── ...
│   ├── configuration/
│   ├── finances/
│   └── reservation/
├── hooks/
│   ├── useAccessContext.ts  # Rol + capabilities del usuario (SWR compartido)
│   ├── useConfiguration.ts  # CRUD de configuracion (SWR + UI optimista)
│   ├── useProduct.ts        # CRUD de productos
│   ├── useFinances.ts       # CRUD de finanzas
│   └── useReservation.ts    # CRUD de reservas
├── lib/
│   ├── auth/              # Helpers de sesion en servidor
│   ├── fetcher.ts         # Fetcher de SWR con retry (3 intentos, backoff)
│   └── utils.ts           # Mappers de API (snake_case -> camelCase)
└── middleware.ts          # Middleware de auth de Supabase + access context
```

Que codigo va aqui y que va en `packages/shared-core`: ver
[`packages/shared-core/README.md`](../../packages/shared-core/README.md).

## Patrones clave

### Data fetching — SWR

Todos los hooks usan SWR y hacen fetch al montar. **No** llames a los metodos
de refresh dentro de un `useEffect` con array de dependencias vacio:

```typescript
// ❌ Mal — provoca una peticion duplicada
useEffect(() => { getAllProducts(); }, []);

// ✅ Bien — SWR hace fetch al montar automaticamente
const { productData, loading } = useProduct();
```

### UI optimista

Todas las operaciones CRUD actualizan la UI al instante via
`mutate(asyncFn, { optimisticData, rollbackOnError: true })`. No hace falta
spinner para operaciones sobre un item individual.

### Access context

`useAccessContext()` llama a `/api/auth/me` una vez cada 60 segundos y comparte
el resultado entre todos los componentes (AppShell, Sidebar, paginas). **Nunca
llames a `/api/auth/me` directamente.**

Encadena los fetches protegidos por permisos detras de `!contextLoading`:

```typescript
useEffect(() => {
  if (!contextLoading && capabilities.canManageTeam) loadTeam();
}, [contextLoading, capabilities.canManageTeam]);
```

La matriz de permisos por rol (owner / manager / employee) es la del backend:
ver `src/api/auth.py` en `businext-backend`.

### Componentes de UI compartidos

- **`ConfirmDialog`** — sustituye a `window.confirm`. Accesible, Escape para
  cancelar, foco gestionado.
- **`Toast` + `useToast`** — sustituye a `window.alert`. Auto-dismiss,
  `aria-live`, variantes success/error.
- **`SectionSkeleton` / `ProductGridSkeleton` / `TeamListSkeleton`** — estados
  de carga por seccion.

## Landing (`src/app/page.tsx`)

Un vuelo continuo por la barbería enganchado al scroll, con la plantilla
`narrativa` de `businext-sys/businext-web-system` (piloto `kuberse-web`). Cinco
paradas: Businext, asistente telefónico con IA, tendencias y publicación
automática, control con IA y avisos en tiempo real, y reservas y caja. Después
aterriza en la whitelist (precio tachado, orientativo entre 50 y 70 €/mes), los
dos anuncios de web (incluida en la suscripción, o solo la web desde 150 €, con
La Perla y Sito como ejemplos) y las preguntas frecuentes.

- **Guion** en `src/components/landingpage/flight/stops.ts`; pantallas de la app
  que entran pieza a pieza en `screens.tsx`; el escenario fijo y el scrubbing del
  vídeo en `FlightStage.tsx`. Cada parada expone `--progress` (0–1) y todo lo que
  se mueve lo usa: el vídeo, la salida del texto y cada `.ui-item` (`--at`).
- **Assets por MCP de Comfy**: planchas con Nano Banana Pro y la plancha del
  personaje (`assets-src/landing/character-reference.png`) como referencia; tramos
  con Wan 2.7 de primer a último fotograma, así que cada tramo termina exactamente
  en la plancha siguiente. Todo registrado en `public/assets.manifest.json`; el
  concepto anterior queda archivado ahí con sus prompts e ids.
- **Vídeo**: `scripts/encode-leg.sh` quita el audio y codifica AV1 para
  escritorio y H.264 (keyframe cada 4 fotogramas) para móvil. Sin JavaScript, sin
  clip o con `prefers-reduced-motion` se queda la plancha. El hosting tiene que
  servir peticiones por rango (`Range`) o el vídeo no se puede buscar.
- **Whitelist**: el formulario envía a `/api/whitelist`, que manda un email con el
  mismo transporte de Gmail que `/api/send-contact-email`.
- **Self-check**: `pnpm check:landing` avisa (no bloquea) de contraste de tokens,
  peso por orientación (presupuesto 3 MB con vídeo), huecos en el manifest y alt
  sin escribir.

## Comandos

Desde la raiz del monorepo (o con `pnpm --filter @businext/web <script>`):

```bash
pnpm dev:web
pnpm build:web
pnpm lint:web
pnpm type-check:web
```

`build` dispara `postbuild` (`next-sitemap`), que genera
`public/sitemap*.xml` y `public/robots.txt` — ambos gitignored.

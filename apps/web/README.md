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
│   ├── useReservation.ts    # CRUD de reservas
│   └── useVoiceAgentConfig.ts # Agente de voz: numeros, activado y modo de reserva (solo owner)
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

Una portada y cuatro capítulos: asistente telefónico con IA, tendencias y
publicación automática, control con IA y avisos en tiempo real, y reservas y
caja. Después, la whitelist (precio tachado, orientativo entre 50 y 70 €/mes),
los dos anuncios de web (incluida en la suscripción, o solo la web desde 150 €,
con La Perla y Sito como ejemplos) y las preguntas frecuentes.

- **Guion** en `src/components/landingpage/flight/stops.ts`; pantallas de la app
  en `screens.tsx`; los capítulos en `Story.tsx`.
- **Scroll nativo, nada por fotograma.** El primer concepto movía vídeo, texto y
  desenfoques con cada fotograma de scroll y se notaba con retraso. Ahora un
  capítulo se activa una sola vez, al cruzar el centro de la pantalla
  (`IntersectionObserver`), y ese cambio cambia la escena, reproduce a su
  velocidad el tramo que vuela hasta ella y monta su pantalla de la app. Todas
  las transiciones son de opacidad o posición. En escritorio la escena y la
  pantalla van en un panel fijo junto al texto; en móvil cada capítulo lleva la
  suya.
- **Assets por MCP de Comfy**: planchas con Nano Banana Pro y la plancha del
  personaje (`assets-src/landing/character-reference.png`) como referencia; tramos
  con Wan 2.7 de primer a último fotograma, así que cada tramo termina exactamente
  en la plancha siguiente. Todo registrado en `public/assets.manifest.json`; el
  concepto anterior queda archivado ahí con sus prompts e ids.
- **Vídeo**: `scripts/encode-leg.sh` quita el audio y codifica AV1 para
  escritorio y H.264 para móvil. Cada tramo se reproduce una vez al llegar a su
  capítulo; volviendo hacia atrás se queda la plancha. Sin JavaScript, sin clip o
  con `prefers-reduced-motion` también.
- **Paleta**: medianoche y zafiro, solo en la landing (`.landing` en
  `globals.css` redefine los tokens; la app conserva los suyos). Los botones usan
  `bg-brand`. Las planchas y los tramos llevan la misma corrección de color
  (cian → zafiro con `huesaturation`, anotada en el manifest) para casar con ella.
- **Movimiento**, con cuentagotas: el wordmark de Businext entra letra a letra al
  cargar y la marca pequeña de la barra aparece al dejar la portada; en
  escritorio el capítulo activo se ilumina y los demás se atenúan; los bloques
  del final aparecen al entrar en pantalla. Los logos de TikTok, Instagram y
  YouTube son los reales (`SocialLogo.tsx`, trazados de Simple Icons, CC0). Todo
  se apaga con `prefers-reduced-motion`.
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

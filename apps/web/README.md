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

### Tema: oscuro y claro

La identidad está en [`DESIGN.md`](../../DESIGN.md). Los colores viven en
`src/app/globals.css`: el `@theme` es el modo oscuro *Noche de barrio* (por
defecto) y `:root[data-theme="light"]` el claro *Taller*, con los mismos valores
que `themeColors` de `@businext/shared-core/theme`. Las utilidades (`bg-surface`,
`text-primary`…) cambian solas con el modo; no se escriben hex ni clases de la
paleta por defecto de Tailwind.

- El modo se elige en **Configuración → Apariencia** y se guarda en el navegador
  (`src/lib/theme-mode.ts`); un script en `<head>` lo aplica antes de pintar.
- `useThemeMode()` da el modo activo a lo que no lee CSS: el theme de MUI
  (`createMuiTheme(mode)`) y los charts (`theme-tokens.ts` vacía su caché al
  cambiar).
- La landing (`.landing`) se ve siempre en oscuro: fija los tokens de *Noche de barrio*
  aunque la app esté en claro.

## Landing (`src/app/page.tsx`)

Explica Businext como la app que impulsa la barbería, con la estructura de
`kuberse/kujobs-web`: la app superpuesta a la escena, un flujo animado y un
recorrido por capítulos. Secciones: portada, asistente de voz (llamada →
agenda), la app (cinco capítulos), tu web (La Perla y Sito como ejemplo),
«Pregúntale a tu negocio», clientes fundadores y whitelist. Sin precios.

- **Solo funciones que existen.** Todo lo que muestran las pantallas está hecho
  (agente de voz, solicitudes con push y email, respuesta a reseñas con IA, chat
  del asistente, Inteligencia, caja). Las cifras son de ejemplo y la página lo
  dice. Textos y datos en `src/components/landingpage/content.ts`.
- **La app en un móvil**: `AppScreens.tsx` dibuja cada pantalla con los tokens
  de la app; sus piezas entran en orden (`--d`) cada vez que la pantalla se
  monta. `HeroShowcase` las recorre en la portada con su notificación,
  `CallFlow` repite la llamada mientras está en pantalla y `Walkthrough` pasa de
  capítulo cuando se llena su barra (`animationend`).
- **Sin vídeo.** Las escenas `public/landing/stop1-5` son imágenes fijas con una
  deriva lenta por CSS. Llevan grabada la corrección a zafiro del concepto
  anterior (`public/assets.manifest.json`); `.landing-scene` la compensa con un
  filtro. Los tramos de vídeo se borraron y siguen archivados en el manifest.
- **Webs de ejemplo**: capturas de página completa en `public/landing/webs`
  (escritorio y móvil) que hacen scroll solas. Al cambiar una web, se vuelven a
  capturar y se ajusta `end` en `content.ts`.
- **Estilo**: tokens y tipografías de `DESIGN.md`, sin degradados ni brillos.
  Las animaciones son de opacidad y posición y se apagan con
  `prefers-reduced-motion`.
- **Whitelist**: el formulario envía a `/api/whitelist`, que manda un email con el
  mismo transporte de Gmail que `/api/send-contact-email`.
- **Self-check**: `pnpm check:landing` avisa (no bloquea) de contraste de tokens,
  peso por orientación (presupuesto 3 MB), huecos en el manifest y alt sin
  escribir.

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

## Despliegue

Vercel despliega `main` a producción en el proyecto `businext-frontend` (team
`daniflorezms-projects`), servido en `https://businext.greenfourtech.com`. Cada
merge crea un deployment de producción del commit; el dominio pasa a él cuando
termina el build, unos minutos después.

Si el build falla en `src/app/fonts.ts` con `An error occurred in next/font` y
`Cannot read properties of null (reading '1')`, suele ser Google Fonts devolviendo
una respuesta rara en ese momento: relanza el build (Redeploy en Vercel o un commit
nuevo). Si se repite, mira qué CSS devuelve `fonts.googleapis.com` para esas familias.

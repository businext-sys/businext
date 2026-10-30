# Radar de tendencias · Web (`apps/web`)

> Visión general en [README.md](README.md). Depende de los hooks de
> [shared-core](shared-core.md).

## Rutas BFF (`src/app/api/trends/`)

Proxies finos hacia el backend, igual que `src/app/api/intelligence/summary`:
`insight`, `insight/refresh`, `suggestions`, `suggestions/[id]`, `preferences`,
`posts`, `posts/[id]`, `posts/[id]/approve`, `posts/[id]/cancel`,
`posts/upload-url`, y `src/app/api/social/accounts` (+ `[network]/connect`,
`[id]`). Los endpoints `/internal/*` del backend **no** se exponen.

El vídeo **no** pasa por el BFF (límite de tamaño del cuerpo en Vercel): el
navegador lo sube directo a Supabase Storage con la URL firmada que devuelve
`posts/upload-url`. No se reutiliza `api/products/upload-image`, que sube por
el BFF a un bucket público.

## Pantallas

### Inteligencia → pestaña "Tendencias" (`src/app/intelligence/page.tsx`)

La sección ya existe (resumen semanal, clientes, equipo); se añade una pestaña
con `components/ui/tabs.tsx`:

1. **Radar**: lista de tendencias con red, crecimiento y enlace a la fuente.
   Etiqueta de fecha de captura ("datos de hoy, 05:00").
2. **Para tu barbería**: el `analysis` del insight, con los servicios que
   encajan resaltados (`matchedServices`).
3. **Próximas publicaciones**: tarjetas de `content_suggestion` con red,
   formato, idea, texto sugerido (botón copiar), audio y hora. Acciones:
   "Subir vídeo", "Ya lo publiqué", "No me interesa".
4. **Mis publicaciones**: los `content_post` con su estado (borrador,
   programado, publicado con enlace, fallido con el motivo, cancelado).
5. Botón "Actualizar análisis" (1 al día; el error del backend se muestra con
   `useToast`).

Grabar es cosa del móvil; en web el barbero **sube** un vídeo ya grabado. El
flujo desde "Subir vídeo" es el mismo que en móvil:

1. Sin red conectada para esa sugerencia → CTA a "Redes conectadas".
2. Elegir el fichero, subirlo con barra de progreso y crear el borrador.
3. **Aprobar el texto**: diálogo con la vista previa del vídeo, el texto
   sugerido editable (contador de 2.200), la hora (por defecto la de la
   sugerencia), el formato (Reel o Trial Reel en Instagram) y la marca de
   contenido generado con IA (desactivada por defecto).
4. "Aprobar y programar" → `approve`; el error de Metricool se muestra con
   `useToast` tal cual. Si falla un Trial Reel, la tarjeta ofrece
   "Publicar como Reel normal".
5. Mientras está programado: cambiar texto u hora, o cancelar.

Estados: `SectionSkeleton` mientras carga; vacío con `empty-state.tsx` y la
explicación de que el radar se llena tras la primera ingesta; desactivado con
CTA a preferencias si `enabled=false`.

La pestaña reutiliza las maquetas de la landing como referencia visual
(`components/landingpage/story/mockups.tsx` → `TrendsMock`), pero con
componentes de `components/ui/` y datos reales.

### Notificaciones (`src/app/notifications/page.tsx`)

Nueva sección "Ideas de contenido" debajo de "Solicitudes de reserva", con las
sugerencias `sent` y no descartadas, y las publicaciones que acaban de salir o
han fallado. El badge del `Sidebar` suma las sugerencias y los fallos además de
las solicitudes pendientes.

### Configuración → "Contenido y redes"

Formulario con React Hook Form + el schema Zod de shared-core: activar, redes,
máximo al día, horario silencioso, zona horaria, idioma y país (precargados
desde la ubicación activa). Solo con `canViewTrends`.

Bloque **Redes conectadas**: una fila por Instagram y TikTok con su estado y
`@usuario`. "Conectar" abre el enlace de autorización de Metricool en una
pestaña nueva; al volver, `useSocialAccounts` revalida. "Desconectar" pide
confirmación con un diálogo de `components/ui/`. Una red `expired` muestra
"Volver a conectar".

## Navegación y permisos

- Las capabilities se leen de `useAccessContext()`; nunca se llama a
  `/api/auth/me` directamente.
- `employee` no ve la pestaña ni la sección de configuración.

## Landing

Cuando la fase 2 esté en producción: quitar `upcoming` del capítulo `trends` en
`chapters.ts`, el "· próximamente" de `TimeList` y ajustar la FAQ y el bloque
de oferta, que hoy dicen que llega "en una próxima versión".

## Verificación

`pnpm lint:web`, `pnpm type-check:web`, y prueba manual con el backend local
sembrando un `trend_snapshot` de ejemplo (script de seed en el backend). La
publicación se prueba con una cuenta de Instagram de Businext: subir, aprobar,
programar a +5 min y ver el paso a publicado con enlace.

# Radar de tendencias · Web (`apps/web`)

> Visión general en [README.md](README.md). Depende de los hooks de
> [shared-core](shared-core.md).

## Rutas BFF (`src/app/api/trends/`)

Proxies finos hacia el backend, igual que `src/app/api/intelligence/summary`:
`insight`, `insight/refresh`, `suggestions`, `suggestions/[id]`, `preferences`.
Los endpoints `/internal/*` del backend **no** se exponen.

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
   "Ya lo publiqué", "No me interesa".
4. Botón "Actualizar análisis" (1 al día; el error del backend se muestra con
   `useToast`).

Estados: `SectionSkeleton` mientras carga; vacío con `empty-state.tsx` y la
explicación de que el radar se llena tras la primera ingesta; desactivado con
CTA a preferencias si `enabled=false`.

La pestaña reutiliza las maquetas de la landing como referencia visual
(`components/landingpage/story/mockups.tsx` → `TrendsMock`), pero con
componentes de `components/ui/` y datos reales.

### Notificaciones (`src/app/notifications/page.tsx`)

Nueva sección "Ideas de contenido" debajo de "Solicitudes de reserva", con las
sugerencias `sent` y no descartadas. El badge del `Sidebar` suma estas además
de las solicitudes pendientes.

### Configuración → "Contenido y redes"

Formulario con React Hook Form + el schema Zod de shared-core: activar, redes,
máximo al día, horario silencioso, zona horaria, región (precargada desde la
ubicación activa). Solo con `canViewTrends`.

## Navegación y permisos

- Las capabilities se leen de `useAccessContext()`; nunca se llama a
  `/api/auth/me` directamente.
- `employee` no ve la pestaña ni la sección de configuración.

## Landing

Cuando la fase 2 esté en producción: quitar `upcoming` del capítulo `trends` en
`chapters.ts` y el "Concepto" del pie de `TrendsMock`.

## Verificación

`pnpm lint:web`, `pnpm type-check:web`, y prueba manual con el backend local
sembrando un `trend_snapshot` de ejemplo (script de seed en el backend).

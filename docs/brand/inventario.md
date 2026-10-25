# Inventario del estado visual

Estado de la web y la app móvil antes de redefinir la identidad
([`analisis.md`](analisis.md), businext-sys/businext#124).

## Fuentes de estilo

| Dónde | Qué define |
|---|---|
| `apps/web/src/app/globals.css` | tokens de Tailwind 4 (`@theme`): colores, tipografía, radios, sombras; solo tema oscuro |
| `apps/web/src/app/fonts.ts` | Sora (titulares) y DM Sans (texto) |
| `apps/web/src/lib/mui-theme.ts` | espejo en TS de los colores para los date pickers de MUI |
| `apps/web/src/components/ui/` | botón, tarjeta, input, modal, tabs, tabla, toast, etc. |
| `apps/mobile/src/theme/colors.ts` | copia a mano de los colores de `globals.css` |
| `apps/mobile/app.config.ts` | `userInterfaceStyle: "light"`, splash `#E6F4FE` (por defecto de Expo) |

## Incoherencias encontradas en el código

### Marca

- **Dos colores de marca en la web.** La app usa turquesa (`--color-primary` `#41d9d6`) y la
  landing un zafiro (`--color-brand` `#2c4a8a`) para sus llamadas a la acción.
- **Icono y splash de la app móvil por defecto de Expo** (`apps/mobile/assets/icon.png`).
- **Logo a tamaño pequeño** (33×22 px en login, 42×28 px en el sidebar): el graffiti pierde el
  detalle.

### App móvil: dos apps visualmente distintas

- **El chat** (16 ficheros importan `theme/colors.ts`) es oscuro y turquesa.
- **Agenda, login y detalle de reserva** usan grises claros escritos a mano, sin tokens:
  `#fff`, `#111`, `#888`, `#999`, `#ddd`, `#f5f5f5`, rojo `#c0392b`, y verdes y ámbar de la
  paleta de Tailwind (`#D1FAE5`, `#065F46`, `#FEF3C7`, `#92400E`). Concentrados en
  `src/screens/AgendaScreen.tsx` (17), `src/components/ReservationListItem.tsx` (12),
  `app/reservation/[id].tsx` (10) y `app/login.tsx` (10).
- **La app se declara clara** (`userInterfaceStyle: "light"`) pero su paleta es oscura.
- **Sin tipografía propia**: el móvil usa la del sistema; la web, Sora y DM Sans.
- **Radios sueltos**: 4, 8, 10, 12, 14, 18, 22 y 999 px, sin escala.

### Web

- **Colores fuera de tokens**: `app/login/page.tsx` repite hex de la paleta (`#41d9d6`,
  `#22b8c8`, …) y un fondo propio `#07080f`; `app/configuration/page.tsx` tiene 4 hex sueltos;
  29 `rgba(...)` en componentes.
- **Clases de la paleta por defecto de Tailwind** que el `@theme` anula (`--color-*: initial`):
  `bg-red-500`, `text-red-400`, `text-white`, `border-white` en `app/book/[businessId]/page.tsx`
  y `bg-black`, `text-white` en `components/common/Sidebar.tsx`. Con el reset, esas clases no
  generan color: o no se pintan o heredan.
- **Radios**: se usan los seis de la escala (`rounded-md` a `rounded-3xl`) más `rounded-full`,
  repartidos casi a partes iguales; no hay una regla de qué radio lleva cada componente.
- **Sin modo claro**: `globals.css` no tiene variante clara.

## Capturas

Pendiente: requiere levantar la web y la app con un owner de prueba (ver *Cómo empezar* en la
story). Las capturas no deben mostrar datos de clientes reales, porque el repo es público.

| Pantalla | Web | Móvil |
|---|---|---|
| Login | | |
| Inicio | | — |
| Reservas / agenda | | |
| Finanzas | | — |
| Productos | | — |
| Configuración | | |
| Reserva pública `book/[businessId]` | | — |
| Chat y sus tarjetas | — | |

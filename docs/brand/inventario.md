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

### App móvil

- Resuelto en #124 y #128: el chat, la agenda, la lista y el detalle de reservas, el
  login y la pantalla de carga usan el tema (`ThemeContext` + `themedStyles`) en
  oscuro y claro, sin hex sueltos.
- Icono y splash: siguen los de Expo por defecto (#129).

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

En `capturas/`, sin datos de clientes reales (el repo es público). "Antes" es
producción con `main`; "después", la rama en local.

| Pantalla | Antes | Después (oscuro) | Después (claro) |
|---|---|---|---|
| Login web | [web-login-antes](capturas/web-login-antes.jpg) | [web-login-despues-oscuro](capturas/web-login-despues-oscuro.jpg) | [web-login-despues-claro](capturas/web-login-despues-claro.jpg) |
| KPIs de Reservas (#127) | [web-kpis-antes](capturas/web-kpis-antes.jpg) (claro) | — | [web-kpis-despues](capturas/web-kpis-despues.jpg) |
| Reserva pública, datos (#127) | — | [web-reserva-publica-datos-oscuro](capturas/web-reserva-publica-datos-oscuro.jpg) | — |

Las pantallas de la app móvil se capturan en #128.

# @businext/shared-core

Logica de negocio y tipos de dominio compartidos entre `apps/web` (Next.js) y
`apps/mobile` (Expo, en construccion). Ver el plan completo en
`specs/001-extraer-core-compartido/` y en `.specify/PLAN.md` (Fase 3).

## Que va aqui (y que no)

Pregunta en orden para decidir donde vive una pieza de codigo nueva:

1. **¿Depende de Next.js** (rutas, `next/headers`, middleware), **del DOM del
   navegador** (`window`, `document`, `Blob` de descarga), **de React**, o **de
   una libreria de estilos** (Tailwind, `clsx`)?
   → Va en `apps/web` (o el equivalente en `apps/mobile`), **no** aqui.
2. **¿Es un tipo de dominio o una funcion que solo transforma datos ya
   obtenidos** (recibe datos como argumentos, devuelve datos, sin I/O)?
   → Va en `packages/shared-core`.
3. **¿Hace una llamada de red (fetch/HTTP) asumiendo un mecanismo de
   transporte especifico de una plataforma** (por ejemplo, una ruta relativa
   `/api/...` del BFF de Next.js)?
   → Va en `apps/web`/`apps/mobile`. `shared-core` nunca asume un mecanismo de
   transporte concreto.

Detalle completo, con ejemplos ya clasificados, en
`specs/001-extraer-core-compartido/contracts/core-public-api.md`.

## Estado actual

Este paquete esta en construccion (Fase 3 del plan maestro, issues #12-#20 en
`businext-sys/businext`). El contenido se mueve incrementalmente desde
`apps/web/src/lib/*`:

- [ ] #13 Tipos de dominio (Reservation, Finances, Configuration, Product,
      Location, WorkingHours, BookingRequest, Employee/AccessRole, ...)
- [ ] #14 Schemas zod
- [ ] #15 Mappers snake_case <-> camelCase
- [ ] #16 apiClient + hooks SWR
- [ ] #17 Servicios de negocio (disponibilidad de horarios, scoring de
      clientes, matriz de capacidades por rol)
- [ ] #18 Generacion de tipos TS desde OpenAPI del backend
- [ ] #19 Migracion de moment-timezone a dayjs
- [ ] #20 Verificacion de regresion cero en `apps/web`

## Uso desde `apps/web`

```ts
import { computeClientProfiles } from "@businext/shared-core/intelligence";
import type { Reservation } from "@businext/shared-core/reservation";
```

(Los sub-paths exactos se confirman a medida que se completan las issues
anteriores.)

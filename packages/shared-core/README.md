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

- [x] #13 Tipos de dominio (Reservation, Finances, Configuration, Product,
      Location, WorkingHours, BookingRequest, Employee/AccessRole, ...)
- [x] #14 Schemas zod
- [x] #15 Mappers snake_case <-> camelCase
- [x] #16 apiClient + hooks SWR
- [x] #17 Servicios de negocio (conflictos de reserva, generacion de finance
      records, timezone, capabilities)
- [x] #18 Generacion de tipos TS desde OpenAPI del backend
- [ ] #19 Migracion de moment-timezone a dayjs
- [ ] #20 Verificacion de regresion cero en `apps/web`

## Uso desde `apps/web`

```ts
import { computeClientProfiles } from "@businext/shared-core/intelligence";
import type { Reservation } from "@businext/shared-core/reservation";
import { useReservation } from "@businext/shared-core/hooks";
import { detectReservationConflict } from "@businext/shared-core/services";
```

## Generacion de tipos desde OpenAPI (issue #018)

`src/api/generated-types.ts` **se genera automaticamente** desde el OpenAPI
schema de `businext-backend` — **no se edita a mano**.

### Regenerar localmente

```bash
# Contra un backend corriendo en localhost:8000 (default)
pnpm --filter @businext/shared-core generate:types

# Contra una URL especifica
OPENAPI_URL=https://api.businext.app/openapi.json pnpm --filter @businext/shared-core generate:types

# Desde un archivo openapi.json ya descargado/exportado
pnpm --filter @businext/shared-core generate:types -- --from-file ./openapi.json
```

Para exportar el `openapi.json` del backend sin necesidad de arrancar el
servidor completo (ni conexion a base de datos), desde `businext-backend`:

```bash
python -c "import json; from src.main import app; print(json.dumps(app.openapi()))" > openapi.json
```

### Como se usan los tipos generados

Los mappers (`src/mappers/*.ts`) usan los tipos de `generated-types.ts`
(`components["schemas"]["XxxPublic"]`) como referencia de la forma real que
devuelve el backend, para detectar divergencias entre lo que el frontend
asume y el contrato real. Ejemplo real encontrado gracias a esto (issue
#018): `EmployeePublic` en el backend usa **camelCase**
(`businessId`, `memberUserId`, `displayName`...), a diferencia de casi
todas las demas entidades que usan snake_case — el mapper `mapEmployeeFromApi`
originalmente asumia snake_case (issue #015) y se corrigio al verificar
contra el schema real.

### Automatizacion (pendiente de activar)

El workflow `.github/workflows/generate-types.yml` en este repo esta
preparado para dispararse via `repository_dispatch` desde
`businext-backend` cuando se mergea a `main`, regenerar los tipos, y abrir
un PR automatico. Requiere que `businext-backend` dispare el evento
(`gh workflow` o `repository_dispatch` API) y que `OPENAPI_URL` este
configurado como variable/secret del repo apuntando al backend desplegado.

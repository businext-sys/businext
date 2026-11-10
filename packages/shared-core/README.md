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

## Agente de voz (Fase 8, issue #118)

`voiceAgentApi` (`get`, `update`) y `useVoiceAgentConfig()` consumen
`GET`/`PATCH /voice-agent/config` del backend (solo owner; 403 al resto).
`VoiceAgentConfig` es `{ enabled, bookingMode: "request" | "confirm",
phoneNumbers }`; los numeros los asigna Businext y no se cambian desde aqui.
En web pasa por el BFF `apps/web/src/app/api/voice-agent/config/route.ts`.

## Recordatorios de cita (Fase 14, issue #184)

`configurationApi.getReminders()` / `updateReminders()` y `useRemindersSetting()`
consumen `GET`/`PUT /configuration/reminders` del backend (owner y manager; 403 a
employee). `RemindersSetting` es `{ remindersEnabled }`. En web pasa por el BFF
`apps/web/src/app/api/configuration/reminders/route.ts`.

## Radar de tendencias (Fase 13, issue #169)

`@businext/shared-core/trends` tiene los tipos (`TrendInsight`,
`ContentSuggestion`, `ContentPreferences`); `trendsApi` y los hooks
`useTrendInsight()`, `useContentSuggestions(status?)` y `useContentPreferences()`
consumen `/trends/insight`, `/trends/insight/refresh`, `/trends/suggestions` y
`/trends/preferences` del backend (owner y manager, capability `canViewTrends`).

- `getInsight()` devuelve `null` si el negocio aún no tiene análisis (404).
- `refreshInsight()` y el `refresh()` del hook devuelven el `detail` del backend
  como mensaje (429 si ya se actualizó hoy, 409 si el radar está apagado).
- `updateSuggestion` sigue `resourcePath`: en web el BFF recibe `?id=`.
- `ContentPreferencesFormSchema` valida el formulario (1-3 avisos al día, al
  menos una red, horas `HH:mm` distintas); las horas llegan del backend como
  `HH:mm:ss` y el mapper las deja en `HH:mm`.

Las cuentas sociales y las publicaciones van en #172.

## Mensaje a clientes en riesgo (Fase 14, issue #186)

`computeClientProfiles` (`@businext/shared-core/intelligence`) agrupa las
reservas completadas por nombre y marca a cada cliente `fiel`, `en_riesgo` o
`nuevo`; `customerEmail` es el email de su última reserva que lo tiene. La web
(Inteligencia → Tus clientes) y el móvil (`clients-at-risk`) usan el mismo cálculo.

`customerMessageApi` consume el backend (`businext-backend#48`, owner y manager):

- `getDraft(email)` → `GET /customer-messages/draft?email=` con el texto propuesto.
- `send(email, message)` → `POST /customer-messages/` (máximo 2000 caracteres).
- Los errores son `CustomerMessageError` con el `detail` del backend y su
  `status`: 404 si el email no es de ningún cliente, 429 si ya se le escribió en
  los últimos 7 días, 502 si el email no salió, 403 para employee.

En web pasa por el BFF `apps/web/src/app/api/customer-messages/`.

## Tema (issue #124)

`@businext/shared-core/theme` exporta los tokens de [`DESIGN.md`](../../DESIGN.md):
`themeColors.dark` (*Noche de barrio*, por defecto) y `themeColors.light`
(*Taller*), `fontFamilies`, `radii` y `spacing`. Son datos, sin dependencias de
estilos: la web los replica en `globals.css` y el móvil los usa directamente. Un
test comprueba que cada par de texto pasa WCAG AA en los dos modos.

## Uso desde `apps/web`

```ts
import { computeClientProfiles } from "@businext/shared-core/intelligence";
import type { Reservation } from "@businext/shared-core/reservation";
import { useReservation } from "@businext/shared-core/hooks";
import { detectReservationConflict } from "@businext/shared-core/services";
```

## Contrato del asistente conversacional (Fase 7, issue #75)

`src/schemas/assistant.ts` define el protocolo del chat de la app movil y
`@businext/shared-core/assistant` sus tipos y funciones de parseo. Se propuso
desde aqui antes de que existiera el ADR del backend
(`businext-sys/businext-backend#19`): **el backend debe implementar esta
forma** (snake_case, como el resto de su API). Cuando publique los endpoints,
se regenera `generated-types.ts` y se contrasta con estos schemas.

**Mensaje:** `{ id, conversation_id, role: "user" | "assistant", blocks, created_at }`.

**Bloques** (campo `type`); todos admiten un `fallback_text` opcional:

| `type` | Campos |
|---|---|
| `text` | `text` |
| `reservation_list` | `title \| null`, `reservations[]: { id, client_name, service, start_time, end_time \| null, employee_name \| null, status }` |
| `cash_summary` | `period_label`, `total_income`, `total_expense`, `balance`, `previous_balance?` (periodo anterior, para la comparativa), `currency` |
| `booking_request` | `request: { id, client_name, service, requested_date, employee_name \| null, status }` |
| `confirmation` | `action_id`, `title`, `description`, `status: pending \| confirmed \| cancelled \| expired` |
| `quick_replies` | `options[]: { label, message }` |

Un bloque de tipo desconocido o mal formado no rompe la app:
`parseChatBlock` lo convierte en un bloque `text` con su `fallback_text` (o un
aviso generico). Asi el backend puede anadir bloques nuevos sin forzar una
version nueva de la app.

**Eventos SSE** (cada `data:` es un JSON con `type`): `message_start
{ conversation_id, message_id }`, `text_delta { message_id, delta }`,
`block { message_id, block }`, `tool_status { message_id, label | null }`
(herramienta en curso, p. ej. «Consultando reservas…»; `null` la limpia),
`message_end { message_id }`,
`error { code, message }`. `parseChatEvent` devuelve `null` para eventos
desconocidos, que se ignoran.

**Peticiones:** `ChatRequest { conversation_id?, message }`,
`ConfirmActionRequest { conversation_id, decision: "confirm" | "cancel" }`,
`ConversationSummary { id, title, last_message_preview \| null, updated_at }` y
`Conversation { id, title, messages, updated_at }`.

**Acciones rapidas** (issue #80): `QUICK_ACTIONS` y
`quickActionsFor(context)` dan los chips del chat filtrados con el contexto
de `/auth/me`: la caja y el resumen semanal solo para owner y manager (el rol
employee tiene `canManageFinances`, pero el asistente no le da la caja);
solicitudes y nueva reserva con `canManageReservations`; resenas con
`canManageReviews`. Es solo UX: los permisos reales los aplica el backend en
cada herramienta (matriz en el README de `businext-backend`).

**Endpoints** (`assistantApi`, issue #76): `POST /assistant/chat` y
`POST /assistant/actions/{action_id}/confirm` responden en SSE;
`GET /assistant/conversations`, `GET` y `DELETE /assistant/conversations/{id}`.

**Historial:** `useAssistantConversations({ client })` lista las
conversaciones (SWR) y `deleteConversation(id)` las borra de forma optimista,
con rollback si falla.

**Uso:** `useAssistantChat({ client })` (de `@businext/shared-core/hooks`)
devuelve `messages`, `status` (`idle` | `streaming` | `error`), `error`
(distingue sin conexion de un fallo del servidor), `activity` (la
herramienta en curso),
`conversationId`, `send`, `confirm`, `stop` y `retry`. La logica vive en
`createAssistantChat` (`@businext/shared-core/assistant`), sin React, y es lo
que cubren los tests. Reintenta solo si la peticion falla antes de recibir
eventos (red o 5xx). En mobile se le pasa `assistantClient`
(`apps/mobile/src/lib/assistantClient.ts`), creado con `expo/fetch`, porque el
`fetch` global de React Native no expone el body como stream.

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

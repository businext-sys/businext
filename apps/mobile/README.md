# @businext/mobile

App movil de Businext: Expo SDK 57 + React Native + Expo Router.

**Arranque local, variables de entorno y requisitos: ver el
[README de la raiz del monorepo](../../README.md)** (incluida la nota sobre
por que `localhost` no sirve al probar en un telefono fisico). Este documento
cubre solo lo especifico de Expo: configuracion, distribucion via EAS y estado
de las features nativas.

## Configuracion

`app.config.ts` es la unica fuente de configuracion. Lee del entorno y expone
los valores a la app via `Constants.expoConfig.extra`:

| Variable | Se expone como | Consumido en |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | `extra.apiBaseUrl` | `src/lib/bootstrapApiClient.ts` |
| `EXPO_PUBLIC_SUPABASE_URL` | `extra.supabaseUrl` | `src/lib/supabaseAuth.ts` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `extra.supabaseAnonKey` | `src/lib/supabaseAuth.ts` |
| `EAS_PROJECT_ID` | `extra.eas.projectId` | `src/lib/pushNotifications.ts`, EAS Build/Update |
| `EXPO_PUBLIC_ASSISTANT_CHAT` | `extra.assistantChatEnabled` | `src/lib/featureFlags.ts` (`"false"` apaga el chat y la home vuelve a ser la agenda) |

`runtimeVersion` usa la politica `appVersion` a proposito: resuelve igual
tenga o no `EAS_PROJECT_ID` definido, para que todos los builds y updates sean
comparables (evita el "Runtime version mismatch" de EAS Update). Con
`EAS_PROJECT_ID` vacio se omite el bloque `updates` — Expo Go y el flujo de
desarrollo siguen funcionando, solo no hay OTA updates.

Los bundle identifiers (`com.businext.mobile` en iOS y Android) son
placeholders y deben confirmarse antes de un build distribuible (issue #33).

## Estructura

`app/` son las rutas (Expo Router) y `src/` el codigo compartido entre ellas.
Ver [`src/README.md`](./src/README.md) para el detalle de convenciones.

La logica de dominio no se reescribe aqui: las pantallas consumen
`useReservation`, `useFinances` y `useProduct` de
[`@businext/shared-core`](../../packages/shared-core/README.md), los mismos
hooks que usa `apps/web`.

## Comandos

```bash
pnpm --filter @businext/mobile start        # Metro + QR para Expo Go
pnpm --filter @businext/mobile android      # abre en emulador Android
pnpm --filter @businext/mobile ios          # abre en simulador iOS
pnpm --filter @businext/mobile type-check
pnpm --filter @businext/mobile lint
```

Con Metro corriendo, `a` / `i` / `w` abren en emulador Android, simulador iOS
o navegador.

## Distribucion via EAS

`eas.json` tiene 3 perfiles:

- **`development`** — dev client, para debug con Metro, apunta a `localhost:8000`.
- **`preview`** — build interno instalable via link/QR.
- **`production`** — autoincrementa la version.

Solo existe un backend desplegado (Render,
`https://businext-backend.onrender.com`), asi que `preview` y `production`
apuntan ambos a esa URL en `EXPO_PUBLIC_API_BASE_URL`. Los dominios
`api-staging.businext.app` / `api.businext.app` que estaban antes en `eas.json`
eran placeholders sin DNS ni nada corriendo detras; si en el futuro se separan
los entornos, actualizar cada perfil con su URL real.

```bash
pnpm --filter @businext/mobile build:development
pnpm --filter @businext/mobile build:preview
pnpm --filter @businext/mobile build:production
pnpm --filter @businext/mobile update:preview
pnpm --filter @businext/mobile update:production
```

### Estado del setup de EAS

Cuenta de Expo (`daniflorezm`) y proyecto
[businext-mobile](https://expo.dev/accounts/daniflorezm/projects/businext-mobile)
creados; `projectId` guardado en `apps/mobile/.env` (gitignored). Token de
acceso configurado como secret `EXPO_TOKEN` del repo, y el workflow
`.github/workflows/mobile-build.yml` corre `--platform all` en push a `main`
(el `workflow_dispatch` acepta `android`/`ios` para una sola plataforma).

Builds de Android verificados en CI (keystore remoto creado automaticamente) y
credenciales de iOS ya generadas via `eas credentials` (certificado de
distribucion, perfil de aprovisionamiento y UDID del iPhone de prueba
registrado), guardadas en el servidor de Expo para que los builds no
interactivos las reutilicen.

**Pendiente:** definir `EAS_PROJECT_ID` como *Variable* del repo (Settings →
Secrets and variables → Actions → pestana Variables) — no es un secret, el
projectId no es sensible. `mobile-build.yml` ya la referencia via
`vars.EAS_PROJECT_ID` para que `eas-cli` resuelva `app.config.ts` igual que en
local.

## Notificaciones push (issue #031)

`src/lib/pushNotifications.ts` + `src/hooks/usePushRegistration.ts`: registro
automatico del token al autenticarse, manejo explicito del rechazo de permisos
(banner en la home) y deep link al tocar una notificacion, tambien con la app
cerrada (`useLastNotificationResponse`). Con el chat activo (issue #83), la
push de una solicitud (`{ type: "booking_request", bookingRequestId }`) abre
el chat en una conversacion nueva con un mensaje que la explica y su tarjeta
con Aceptar/Rechazar; si la push trae `conversationId`, abre esa
conversacion. Con el chat apagado, abre la agenda.

Backend: `POST`/`DELETE /users/{id}/push-tokens` en `businext-backend`, mas el
envio de notificacion al crear un `BookingRequest`.

**Limitacion actual:** la tabla `push_token` no tiene migracion de Alembic
porque `alembic/versions/` esta gitignored en el backend y nunca se commiteo
(ver la nota de migraciones en el [README de la raiz](../../README.md)). Hay
que crearla a mano en Supabase.

## Pantallas

- **Chat del asistente** (`app/index.tsx` → `src/screens/ChatScreen.tsx`,
  issue #78) — la home tras el login. Usa `useAssistantChat` de shared-core
  con `assistantClient` (`expo/fetch`, streaming). Componentes en
  `src/components/chat/`: burbujas con markdown basico, indicador de
  escribiendo/herramienta, input con enviar y parar, error con reintento y
  chips de acciones rapidas (`quickActionsFor` de shared-core, por rol) en el
  estado vacio y sobre el input; las `quick_replies` del asistente tambien se
  muestran como chips. Los bloques ricos son tarjetas nativas en
  `src/components/chat/cards/`: reservas (abren `reservation/[id]`), caja
  (balance, ingresos frente a gastos y comparativa), solicitud de reserva
  (Aceptar/Rechazar contra `/booking-requests`) y confirmacion de acciones
  (Confirmar/Cancelar llama a `confirm` del chat).
  Colores de `src/theme/colors.ts` (paleta BN de la web). Sin tabs: el menu de la
  cabecera lleva a nueva conversacion, historial, agenda, ajustes y cerrar sesion. Si
  `EXPO_PUBLIC_ASSISTANT_CHAT=false` (hoy en los perfiles `preview` y
  `production` de `eas.json`), la home es la agenda.
- **Historial** (`app/conversations.tsx`, issue #82) — conversaciones con el
  asistente (`useAssistantConversations`): abrir (`/?conversation=<id>`),
  borrar con confirmacion o empezar una nueva (`/?conversation=new`).
- **Ajustes** (`app/settings.tsx`) — cuenta y cierre de sesion.
- **Agenda** (`src/screens/AgendaScreen.tsx`, en `/agenda`, issue #030) — reservas del dia agrupadas por
  hora, navegacion entre dias y pull-to-refresh.
- **Detalle de reserva** (`app/reservation/[id].tsx`) — acciones reales del
  dominio: Completar / Revertir / Eliminar. El modelo no tiene un estado
  "cancelada" distinto (ver la nota en el propio archivo).
- **Login** (issue #029) — Supabase Auth con token en `expo-secure-store`.

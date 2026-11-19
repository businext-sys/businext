# @businext/mobile

App movil de Businext: Expo SDK 58 + React Native + Expo Router.

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

El `projectId` de EAS no es secreto y va fijo en `app.config.ts`
(`extra.eas.projectId` y `updates.url`): así lo ven igual el CLI en local, el
runner de GitHub y los workers de EAS, que vuelven a leer la config en sus
servidores. `runtimeVersion` usa la politica `appVersion` a proposito, para que
todos los builds y updates sean comparables (evita el "Runtime version
mismatch" de EAS Update).

El identificador de la app es `com.businext.mobile` en iOS y Android y es
definitivo: las credenciales de firma de las dos plataformas están creadas con
él y no se puede cambiar una vez publicada.

## Estructura

`app/` son las rutas (Expo Router) y `src/` el codigo compartido entre ellas.
Ver [`src/README.md`](./src/README.md) para el detalle de convenciones.

La logica de dominio no se reescribe aqui: las pantallas consumen
`useReservation`, `useFinances` y `useProduct` de
[`@businext/shared-core`](../../packages/shared-core/README.md), los mismos
hooks que usa `apps/web`.

## Tema

La identidad está en [`DESIGN.md`](../../DESIGN.md): oscuro *Noche de barrio* por
defecto y claro *Taller*. `src/theme/ThemeContext.tsx` lee los colores de
`@businext/shared-core/theme` y guarda el modo en el dispositivo; se cambia en
**Ajustes → Apariencia**. Los estilos que usan colores se declaran con
`themedStyles((colors) => ({ ... }))`, que devuelve un hook (`useStyles()`) con la
hoja del modo activo; nada de hex sueltos.

Las fuentes (Big Shoulders para titulares, DM Sans para el texto) se cargan con
`expo-font` en `app/_layout.tsx` desde `src/theme/fonts.ts`. El plugin `expo-font`
cambia el binario: tras este cambio hace falta un build nuevo de EAS.

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

`lint` es `expo lint`, y la app aún no tiene configuración de ESLint: el comando
la crea e instala `eslint-config-expo`, lo que deja `eslint-plugin-react-hooks@7` en
la raíz de `node_modules`. Con eso `pnpm lint:web` y `pnpm build:web` fallan en
código que no ha cambiado. Si pasa, no commitees esos cambios: deja
`pnpm-lock.yaml` y `package.json` como en `main` y ejecuta `pnpm install`.
Con esa configuración temporal, `lint` sale limpio desde #218 (se quitaron el
`set-state-in-effect` de `ChatScreen.tsx` y el falso positivo de `AndroidImportance`).

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
creados; `projectId` fijo en `app.config.ts`. Token de
acceso configurado como secret `EXPO_TOKEN` del repo, y el workflow
`.github/workflows/mobile-build.yml` corre `--platform all` en push a `main`
(el `workflow_dispatch` acepta `android`/`ios` para una sola plataforma).

Builds de Android verificados en CI (keystore remoto creado automaticamente) y
credenciales de iOS ya generadas via `eas credentials` (certificado de
distribucion, perfil de aprovisionamiento y UDID del iPhone de prueba
registrado), guardadas en el servidor de Expo para que los builds no
interactivos las reutilicen.

`mobile-build.yml` envía los builds sin esperar a que terminen: el run sale en
verde en cuanto EAS los acepta. Para ver cómo van, desde `apps/mobile`:

```bash
npx eas-cli build:view <id> --json
```

Los ids salen en el log del run (`See Android logs: …/builds/<id>`).

Para probar una rama en un dispositivo antes del merge (sin simulador ni
`react-native-web` no hay otra forma de ver la UI), lanza el workflow sobre ella:
`gh workflow run mobile-build.yml --ref <rama> -f profile=preview -f platform=android`.

## Notificaciones push (issue #031)

`src/lib/pushNotifications.ts` + `src/hooks/usePushRegistration.ts`: registro
automatico del token al autenticarse, manejo explicito del rechazo de permisos
(banner en la home) y deep link al tocar una notificacion, tambien con la app
cerrada (`useLastNotificationResponse`). La push de una solicitud
(`{ type: "booking_request", bookingRequestId }`, issue #83) abre el asistente
(`/`) en una conversacion nueva con un mensaje que la explica y su tarjeta
con Aceptar/Rechazar; si la push trae `conversationId`, abre esa
conversacion. Sin `bookingRequestId`, abre la agenda.

La push de una idea de contenido (`{ type: "content_suggestion", id }`, canal
Android `content`, "Ideas de contenido", separado del `default` de las reservas)
abre su detalle (`/trends/<id>`) si el usuario tiene `canViewTrends`.

Backend: `POST`/`DELETE /users/{id}/push-tokens` en `businext-backend`, mas el
envio de notificacion al crear un `BookingRequest`.

La tabla `pushtoken` no tiene migración de Alembic (ver la nota de
migraciones en el [README de la raiz](../../README.md)); está creada a mano en
Supabase con `docs/sql/031-push-token.sql` del backend.

## Pantallas

Navegación por pestañas con iconos (`app/(tabs)/_layout.tsx`, issue #218): **Asistente**,
**Agenda** (con `canManageReservations`), **Caja** (con `canManageFinances` y sin ser
employee), **Tendencias** (con `canViewTrends`) y **Ajustes**. Las pestañas sin permiso se
ocultan (`href: null`). El resto de pantallas se apilan encima, con título propio y botón
de volver sin texto; las acciones de cabecera son iconos (`src/components/HeaderIconButton.tsx`).

- **Asistente** (`app/(tabs)/index.tsx` → `src/screens/ChatScreen.tsx`, issues #78, #86 y
  #218) — inicio tras el login. Cabecera con el avatar, el nombre del negocio
  (`useConfiguration`) y los iconos de historial y nueva conversación. Usa
  `useAssistantChat` de shared-core con `assistantClient` (`expo/fetch`, streaming). Las
  tarjetas que el historial guarda como texto `[tarjeta mostrada al usuario: {...}]` se
  convierten de nuevo en tarjetas (`expandTextBlocks` de shared-core) y nunca se ve el JSON;
  una confirmación pendiente se puede pulsar aunque venga de un mensaje anterior.
  **Dictado:** sin texto escrito, el botón de enviar es un micrófono
  (`src/hooks/useDictation.ts`, `expo-speech-recognition`, es-ES, en el dispositivo si lo
  admite): toca para hablar y toca la flecha para enviar, o mantén pulsado y suelta. La
  transcripción se ve en vivo. Un binario sin el módulo nativo oculta el micrófono.
- **Historial** (`app/conversations.tsx`, issues #82 y #218) — título, hora y una línea de
  vista previa (sin tarjetas internas). Desliza a la izquierda o mantén pulsado para borrar.
- **Agenda** (`app/(tabs)/agenda.tsx` → `src/screens/AgendaScreen.tsx`) — reservas del día
  con su franja (`12:00–12:45`), filtro de pendientes, pull-to-refresh y, en la cabecera,
  compartir el enlace público de reservas (owner y manager) y nueva reserva. Acepta
  `?date=YYYY-MM-DD&filter=pending` (lo usan las push).
- **Detalle de reserva** (`app/reservation/[id].tsx`) — llamar, WhatsApp y email al
  cliente; completar y cobrar (de hoy o pasadas; crea el ingreso como en la web), «No vino»
  (estado `NO_SHOW`, cuando ya ha pasado la hora), volver a pendiente (una completada solo
  el owner), cancelar (borra la reserva) y editar en la cabecera. El nombre abre la ficha.
- **Formulario de reserva** (`app/reservation/form.tsx`) — crea (`?date=`, o con
  `?name=&phone=&email=` desde la ficha) o edita (`?id=`). El cliente autocompleta con
  `customersApi.search` (`GET /customers/`) y rellena teléfono y email; sin email avisa de
  que no habrá recordatorios. La duración sale del servicio (`durationMinutes`, 30 por
  defecto) y la hora se elige entre los huecos libres (`getAvailableSlots` de shared-core,
  inicios cada 15 min donde cabe el servicio, con el horario del encargado o el general) o
  con «Otra hora». Avisa de solapes con `detectReservationConflict`.
- **Clientes** (`app/customers.tsx`) y **ficha de cliente** (`app/customer.tsx?name=`) —
  buscador y ficha (`GET /customers/detail`): contacto, visitas, «no vino», gasto, próxima
  cita, historial y «Nueva reserva» con el cliente puesto. Si el backend aún no tiene la
  ficha, se monta con las reservas cargadas.
- **Caja** (`app/(tabs)/cash.tsx` y `app/cash/new.tsx`) — balance, ingresos y gastos de hoy,
  la semana o el mes y sus movimientos. Quien no es owner ve sus ingresos netos de comisión.
  Solo el owner añade (icono +) y borra (deslizar o mantener pulsado); uno que viene de una
  reserva no se borra hasta revertirla.
- **Tendencias** (`app/(tabs)/trends.tsx`, `app/trends/`, issue #171) — análisis del día
  con las tendencias en tarjetas con el logo de su red, próximas ideas y preferencias
  (icono de la cabecera). `[id].tsx`: idea, guion, copiar texto, publicada y descartar.
- **Ajustes** (`app/(tabs)/settings.tsx`) — cuenta, clientes, clientes en riesgo y
  compartir enlace de reservas (owner y manager), **Notificaciones**
  (`src/components/NotificationsSection.tsx`, `GET/PUT /notification-preferences`:
  interruptor general, próxima cita con minutos, resumen de la mañana con hora, cambios en
  reservas y cierre del día; si el permiso del sistema está denegado, avisa con «Abrir
  ajustes»), agente de voz (owner), apariencia, privacidad, cerrar sesión y borrar cuenta.
- **Clientes en riesgo** (`app/clients-at-risk.tsx`, issue #186) — igual que antes.
- **Push** (`src/hooks/usePushRegistration.ts`) — al tocar una notificación, también con la
  app cerrada: `reservation_id` abre el detalle; `daily_summary`, `upcoming` y
  `reservation_changed` abren la Agenda en `date`; `day_close`, la Agenda con solo
  pendientes.
- **Login** (issue #029) — Supabase Auth con token en `expo-secure-store`.

## Publicar en App Store y Google Play

La fase está en el tablero como «Publicar la app en App Store y Google Play».
Lo que ya está en el repo:

- Versión `1.0.0`, solo iPhone (`supportsTablet: false`, así la ficha no pide
  capturas de iPad) y `ITSAppUsesNonExemptEncryption: false` para no responder
  a la pregunta de cifrado en cada envío.
- Borrado de cuenta en Ajustes y páginas públicas en la web:
  `https://businext.greenfourtech.com/privacidad` y
  `https://businext.greenfourtech.com/eliminar-cuenta` (las piden las fichas).
- Textos de las fichas en [`docs/fichas-tiendas.md`](./docs/fichas-tiendas.md).
- `submit.production` en `eas.json`: Android sube a la pista interna de Play
  como borrador.

Lo que hay que hacer fuera del repo, una vez:

1. Variables de Supabase en el entorno `production` de EAS (como las de
   `preview`, ver más abajo).
2. `STRIPE_SECRET_KEY` en el backend de Render: sin ella, un owner con
   suscripción activa no puede borrar su cuenta.
3. **iOS:** crear la app en App Store Connect con el bundle id
   `com.businext.mobile`. El primer `eas submit` pide el Apple ID y el id de la
   app; después se puede fijar `submit.production.ios.ascAppId` en `eas.json`.
4. **Android:** crear la app en Play Console y subir el primer `.aab` a mano
   (Google no deja que la API cree la app). Después, crear una service account
   con acceso a Play Console y guardar su JSON como
   `apps/mobile/google-play-service-account.json` (está en `.gitignore`).
5. Rellenar en cada tienda la ficha, la privacidad («App Privacy» y «Seguridad
   de los datos»), la clasificación por edad y la cuenta de prueba para la
   revisión (un owner con datos de ejemplo).

Y para cada versión:

```bash
cd apps/mobile
npx eas-cli build --platform all --profile production
npx eas-cli submit --platform ios --latest
npx eas-cli submit --platform android --latest
```

Prueba primero en TestFlight y en la pista interna de Play antes de mandar a
revisión.

## Chat desde la agenda (issue #86)

La agenda es el inicio para todos y el chat es un extra que se abre desde su
boton. No hay flag ni lista de negocios piloto: el chat esta disponible para
todos. Volver a poner el chat como inicio es cambiar `app/index.tsx`.

Para un build `preview`, el entorno `preview` de EAS necesita
`EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`; no estan en el
repo:

```bash
cd apps/mobile
npx eas-cli env:list --environment preview
npx eas-cli env:create --environment preview --name EXPO_PUBLIC_SUPABASE_URL --value <url> --visibility plaintext
npx eas-cli env:create --environment preview --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <anon-key> --visibility plaintext
```

## Tests E2E (Maestro, issues #32 y #85)

Flows base en `.maestro/flows/`: `launch.yaml` (la app abre en el login, sin
credenciales), `login.yaml` (login → agenda) y `agenda.yaml` (agenda →
boton «Asistente» → chat → menu → Agenda).

**En CI:** Actions → `qa-mobile` → Run workflow (suite `base`, `chat` o
`all`). Construye el APK (`expo prebuild` + Gradle, solo
`x86_64`), lo instala en un emulador Android (API 34) y ejecuta los flows; el
informe JUnit y las capturas de los fallos quedan en el artefacto
`maestro-results`. Necesita, en Settings → Secrets and variables → Actions:

| Tipo | Nombre | Para que |
|---|---|---|
| Variable | `QA_API_BASE_URL` | Backend contra el que se prueba (para `chat`, uno con `ASSISTANT_LLM_MODE=mock`) |
| Variable | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Login |
| Secret | `QA_MAESTRO_EMAIL`, `QA_MAESTRO_PASSWORD` | Usuario de prueba |

Sin el usuario de prueba solo corre `launch.yaml` (humo del pipeline).

Flows del chat en `.maestro/flows/` (el login es el subflow
`.maestro/subflows/login.yaml`):

- `chat-reservas-hoy.yaml` — chip «Reservas de hoy» → tarjeta de reservas.
- `chat-confirmar-cancelacion.yaml` — pedir una cancelacion → Confirmar →
  «Confirmada».
- `chat-aceptar-solicitud.yaml` — chip «Solicitudes pendientes» → Aceptar →
  «Aceptada».

Cada flow espera el `testID` de su tarjeta (`card-reservation-list`,
`card-confirmation`, `card-booking-request`), asi que falla si un chip deja de
devolverla. Entran al chat por el boton de la agenda. Necesitan un build instalado en un emulador o
dispositivo y un backend con el LLM simulado, para que las respuestas sean
deterministas (`businext-backend`, ver su README, «E2E del chat»):

```bash
# en businext-backend, contra una base de pruebas
ASSISTANT_LLM_MODE=mock uvicorn src.main:app --port 8000
python -m src.services.assistant.e2e_seed --business-id <user id del owner de prueba>

# en businext, con la app apuntando a ese backend
maestro test -e MAESTRO_EMAIL=<email> -e MAESTRO_PASSWORD=<password> apps/mobile/.maestro/flows
```

En CI, con la suite `chat` de `qa-mobile`.


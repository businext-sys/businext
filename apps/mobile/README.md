# @businext/mobile

Aplicacion movil de Businext (Expo + React Native + Expo Router). Fase 5
del plan maestro (issues #27-#33 en `businext-sys/businext`).

## Requisitos

- Node.js >= 20, pnpm >= 9 (mismos que el resto del monorepo)
- [Expo Go](https://expo.dev/go) instalado en tu telefono (iOS/Android)
  para probar sin build nativo

## Variables de entorno

Definir antes de correr `expo start` (mismo proyecto de Supabase que usa
`apps/web`):

```bash
export EXPO_PUBLIC_API_BASE_URL="http://localhost:8000"   # backend real, sin /api
export EXPO_PUBLIC_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
export EXPO_PUBLIC_SUPABASE_ANON_KEY="<anon-key-publica>"
```

Se leen en `app.config.ts` y se exponen a la app via
`Constants.expoConfig.extra` (ver `src/lib/bootstrapApiClient.ts` y
`src/lib/supabaseAuth.ts`).

## Desarrollo

Desde la raiz del monorepo:

```bash
pnpm install
pnpm --filter @businext/mobile start
```

Escanea el QR con la app Expo Go (Android) o la camara (iOS) para abrir
la app en tu telefono. Tambien puedes presionar `a`/`i`/`w` en la terminal
para abrir en emulador Android, simulador iOS o navegador respectivamente.

Otros comandos:

```bash
pnpm --filter @businext/mobile type-check
pnpm --filter @businext/mobile lint
```

## Estructura

Ver `src/README.md` para el detalle de convenciones (`app/` para rutas
via Expo Router, `src/components/` para UI compartida).

## Distribucion via EAS Build (issue #033)

`eas.json` ya tiene los 3 perfiles configurados: `development`
(dev client, para debug con Metro, apunta a `localhost:8000`),
`preview` (build interno instalable via link/QR) y `production`
(autoincrementa version). **Nota:** por ahora solo existe un backend
real desplegado, en Render (`https://businext-backend.onrender.com`),
asi que tanto `preview` como `production` apuntan a esa misma URL en
`EXPO_PUBLIC_API_BASE_URL`. Los dominios `api-staging.businext.app` /
`api.businext.app` que estaban antes en `eas.json` eran placeholders
que nunca se aprovisionaron (no existe DNS ni nada corriendo ahi) —
si en el futuro se separan los entornos de staging/produccion en
Render (o donde sea), actualizar cada perfil con su URL real.

### ⚠️ Pasos manuales pendientes (requieren una cuenta de Expo real)

Todo lo anterior en este repo (`eas.json`, el workflow
`.github/workflows/mobile-build.yml`, `expo-updates`/`expo-dev-client`
instalados, `app.config.ts` preparado para leer un `projectId`) esta
listo. Estado actual:

1. ✅ Cuenta creada en [expo.dev](https://expo.dev) (`daniflorezm`).
2. ✅ `npx eas-cli login` + `npx eas-cli init` ya corridos desde
   `apps/mobile/`. Proyecto creado:
   [businext-mobile](https://expo.dev/accounts/daniflorezm/projects/businext-mobile),
   `projectId = 468dbb33-6433-4484-842e-41f65d74121f`. Ya esta guardado
   localmente en `apps/mobile/.env` (gitignored) como
   `EAS_PROJECT_ID=468dbb33-6433-4484-842e-41f65d74121f`, y lo carga
   automaticamente el CLI de Expo (`expo start`, `eas build`, etc. leen
   `.env` por defecto).

   **Pendiente:** definir esa misma clave como **Variable** (no secret,
   el projectId no es sensible) del repo `businext-sys/businext` en
   Settings → Secrets and variables → Actions → pestaña **Variables**
   → `EAS_PROJECT_ID` = `468dbb33-6433-4484-842e-41f65d74121f`. El
   workflow `mobile-build.yml` ya la referencia
   (`env.EAS_PROJECT_ID: ${{ vars.EAS_PROJECT_ID }}`) para que
   `eas-cli` resuelva `app.config.ts` igual que en local.
3. ✅ Token de acceso generado en expo.dev → Account settings → Access
   tokens, configurado como secret **`EXPO_TOKEN`** en Settings →
   Secrets and variables → Actions → pestaña **Secrets** del repo
   `businext-sys/businext`.
4. ✅ Build de validacion corrido via `workflow_dispatch` en CI
   (issue #033): `eas whoami` autentica correctamente
   (`daniflorezm (authenticated using EXPO_TOKEN)`), y el build
   **Android** se genero y subio a EAS sin problema (keystore remoto
   creado automaticamente, ver
   [builds](https://expo.dev/accounts/daniflorezm/projects/businext-mobile/builds)).
5. ⬜ **Pendiente real:** el build de **iOS** en CI falla con
   `Failed to set up credentials. You're in non-interactive mode. EAS
   CLI couldn't find any credentials suitable for internal
   distribution.` — es el primer build de iOS del proyecto, y EAS no
   puede generar el certificado/perfil de distribucion en modo no
   interactivo. Hay que correr una vez, de forma interactiva, con la
   cuenta de Apple Developer real:
   ```bash
   cd apps/mobile
   npx eas-cli login
   npx eas-cli credentials --platform ios
   ```
   (o simplemente `npx eas-cli build --platform ios --profile preview`
   sin `--non-interactive`, que genera las credenciales la primera vez
   si no existen). Una vez creadas, quedan guardadas en el servidor de
   Expo y los builds de iOS en CI (no interactivos) las reutilizan
   automaticamente.
6. Mientras el paso 5 no este resuelto, `mobile-build.yml` usa
   `--platform android` por defecto (tanto en el push automatico a
   `main` como en el input `platform` de `workflow_dispatch`, que
   tambien acepta `ios` o `all` una vez existan credenciales de iOS).
   Cuando completes el paso 5, cambia el default de `platform` en
   `.github/workflows/mobile-build.yml` de vuelta a `all`.

### Verificado en este entorno (sin cuenta real)

- `eas.json` es JSON valido con los 3 perfiles requeridos
- `npx eas-cli build:configure` confirma que, sin login, EAS pide
  credenciales de forma explicita (comportamiento esperado, no un bug)
- `expo-updates` y `expo-dev-client` instalados y `expo-doctor` sigue en
  20/20 tras anadirlos
- El bundling con Metro (`expo export`) sigue funcionando sin cambios

## Uso de `@businext/shared-core`

Este paquete declara `"@businext/shared-core": "workspace:*"` como
dependencia, igual que `apps/web`. Ver `packages/shared-core/README.md`
para el criterio de que codigo va en `shared-core` vs en `apps/mobile`.

**Estado (issue #31):** notificaciones push con Expo Notifications
(`src/lib/pushNotifications.ts`, `src/hooks/usePushRegistration.ts`):
registro automatico del token al autenticarse, manejo explicito de
rechazo de permisos (banner en la Agenda), y deep link basico al tocar
una notificacion. **Pendiente real de EAS (#033)**: `getExpoPushTokenAsync`
necesita un `projectId` de EAS que aun no existe en este repo — hasta
entonces, el registro devuelve `no-project-id` de forma controlada.
Backend: nuevo endpoint `POST/DELETE /users/{id}/push-tokens` en
`businext-backend` + envio de notificacion al crear un `BookingRequest`
(ver commit correspondiente en ese repo) — **la migracion de Alembic
para la tabla `push_token` sigue pendiente** porque `alembic/versions/`
esta gitignored en ese repo (hallazgo documentado, no resuelto aqui).

Pantalla de Agenda (`app/index.tsx`, issue #030) con lista de reservas
del dia agrupadas por hora, navegacion entre dias, pull-to-refresh y
detalle de reserva (`app/reservation/[id].tsx`) con acciones reales del
dominio (Completar / Revertir / Eliminar — el modelo no tiene un estado
"cancelada" distinto, ver nota en el propio archivo). Usa `useReservation`,
`useFinances` y `useProduct` de `@businext/shared-core/hooks` sin
reescritura. Login funcional desde #029.

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
(dev client, para debug con Metro), `preview` (build interno instalable
via link/QR, apunta a un backend de staging), y `production`
(autoincrementa version, apunta al backend real).

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
3. ⬜ **Pendiente:** generar un token de acceso (`npx eas-cli
   account:login` con un [robot
   user](https://docs.expo.dev/accounts/programmatic-access/) o desde
   expo.dev → Account settings → Access tokens) y configurarlo como
   secret **`EXPO_TOKEN`** en Settings → Secrets and variables →
   Actions → pestaña **Secrets** del repo `businext-sys/businext`. Sin
   este secret, el workflow `mobile-build.yml` falla explicitamente en
   el paso "Verificar login de EAS" (no falla de forma confusa mas
   adelante).
4. ⬜ Para iOS: se necesita una cuenta de Apple Developer ($99/año) antes
   de poder generar builds `preview`/`production` para iPhone. Sin ella,
   se puede seguir usando `--platform android` unicamente.
5. ⬜ Correr el primer build manualmente para validar la configuracion:
   ```bash
   cd apps/mobile
   npx eas-cli login
   npx eas-cli build --platform android --profile preview
   ```
   Al terminar, `eas-cli` imprime un link + QR para instalar el build
   directamente en un dispositivo Android (sin Play Store). Para iOS,
   el mismo comando con `--platform ios` genera un build instalable via
   TestFlight interno o un perfil ad-hoc (requiere el dispositivo
   registrado en el Apple Developer account).
6. Una vez configurado el secret `EXPO_TOKEN` y la variable
   `EAS_PROJECT_ID` del repo, el workflow `mobile-build.yml` dispara
   automaticamente un build `preview` en cada push a `main` que toque
   `apps/mobile/` o `packages/shared-core/`.

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

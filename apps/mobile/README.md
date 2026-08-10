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

# Convenciones de `apps/mobile`

Este proyecto usa **Expo Router** (recomendado por la issue #27 sobre
React Navigation puro), asi que la estructura difiere ligeramente de lo
descrito originalmente en la issue:

- `app/` — rutas de la aplicacion (file-based routing de Expo Router).
  Cada archivo/carpeta aqui define una pantalla y su ruta. Sustituye a lo
  que en otros stacks seria `src/screens/` + `src/navigation/`.
- `src/components/` — componentes de UI reutilizables entre pantallas
  (equivalente a `apps/web/src/components/`).
- `src/screens/` — (reservado) para logica de pantalla que se quiera
  separar del archivo de ruta en `app/` cuando una pantalla crezca mucho;
  el archivo en `app/` importa desde aqui.

## Uso de `@businext/shared-core`

Igual que `apps/web`, este paquete depende de
`"@businext/shared-core": "workspace:*"`. Ver
`packages/shared-core/README.md` para el criterio de que codigo va en
`shared-core` vs en `apps/mobile`.

Pendiente (issue #28): verificar que los hooks de `@businext/shared-core/hooks`
(SWR + `fetch` nativo) funcionan sin polyfills adicionales en React Native,
y configurar el `apiClient` con el `baseURL` del backend (via
`Constants.expoConfig.extra.apiBaseUrl`, ver `app.config.ts`) y el
`getAuthToken` leyendo de `expo-secure-store`.

# @businext/mobile

Aplicacion movil de Businext (Expo + React Native + Expo Router). Fase 5
del plan maestro (issues #27-#33 en `businext-sys/businext`).

## Requisitos

- Node.js >= 20, pnpm >= 9 (mismos que el resto del monorepo)
- [Expo Go](https://expo.dev/go) instalado en tu telefono (iOS/Android)
  para probar sin build nativo

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

**Estado (issue #27):** setup base de Expo + Expo Router + TypeScript
completo, con una pantalla "hello world". La integracion real con
`shared-core` (auth con SecureStore, hooks de datos) es el alcance de la
issue #28.

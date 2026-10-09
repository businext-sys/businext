# Capturas de la app para la landing

Las imágenes de `public/landing/screens/` salen de aquí: la app web real, con los datos de una
barbería ficticia (Barbería El Faro). No hace falta backend, Supabase ni cuenta.

- `fixtures.mjs` responde a todas las rutas `/api/*` que piden las vistas, con la misma forma que
  devuelve el BFF. Los datos se generan a partir de la fecha de hoy y son estables durante el día.
- `capture.mjs` levanta un sustituto local de Supabase y de `/auth/me` en el puerto 8765 (el
  middleware los llama desde el servidor), abre cada vista con Playwright y guarda las capturas
  de escritorio (1440×900) y móvil (390×844 @2x).

## Uso

En una terminal, la web apuntando al sustituto:

```bash
cd apps/web
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8765 \
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:8765 \
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=demo \
NEXT_PUBLIC_APP_URL=http://localhost:3000 \
pnpm dev
```

En otra, con Playwright disponible (`PW` puede apuntar a una instalación concreta):

```bash
TZ=Europe/Madrid node apps/web/scripts/landing-capture/capture.mjs /tmp/capturas
TZ=Europe/Madrid node apps/web/scripts/landing-capture/capture.mjs /tmp/capturas agenda,finanzas
```

`TZ` tiene que coincidir con el `timezoneId` del navegador (Europe/Madrid) para que las horas de
la agenda cuadren.

Después se convierten a WebP (calidad 80; móvil reducido a 390×844) y se copian a
`public/landing/screens/` con el nombre que espera `components/landingpage/showcase/screens.ts`.

## Límites conocidos

- El reparto de citas completadas/pendientes de hoy depende de la hora a la que se capture.
- Finanzas: el importe de «Balance general» no se lee (usa `text-accent`, `#123d47` sobre fondo
  oscuro). Es un fallo de la app, no de las capturas; por eso la captura arranca en «Resumen del día».
- `/products` redirige a `/configuration`.

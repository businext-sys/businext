# Radar de tendencias · Móvil (`apps/mobile`)

> Visión general en [README.md](README.md). Depende de los hooks de
> [shared-core](shared-core.md). Aquí es donde la funcionalidad tiene más
> valor: el aviso llega al bolsillo del barbero mientras trabaja.

## Push

La infraestructura existe (`src/lib/pushNotifications.ts`,
`src/hooks/usePushRegistration.ts`, Expo Push en el backend). Cambios:

- **Canal Android propio** `content` ("Ideas de contenido"), separado del de
  reservas, para que el barbero pueda silenciar uno sin el otro desde el
  sistema.
- **Deep link** según `data.type`: `content_suggestion` → pantalla de la
  sugerencia (`app/trends/[id].tsx`); al abrirla se hace
  `PATCH status=opened`.
- Dependencia previa: la migración de Alembic de `push_token` (la incluye el
  plan de backend).

## Pantallas (Expo Router)

```text
app/trends/index.tsx     Radar + análisis + próximas publicaciones (mismo contenido que la pestaña web)
app/trends/[id].tsx      Detalle de una sugerencia
app/trends/settings.tsx  Preferencias (mismo schema que web)
```

Detalle de sugerencia, pensado para usarse con una mano entre cliente y
cliente:

- Hora recomendada y red, la idea en una frase y el guion en 3 pasos
  (gancho, antes/después, cierre).
- Botón **Copiar texto** (texto sugerido + hashtags).
- Botón **Abrir cámara**: abre la cámara del sistema con `expo-image-picker`
  en modo vídeo; Businext no publica por el usuario en esta fase.
- **Ya lo publiqué** / **No me interesa**: actualizan el estado; el análisis
  del día siguiente lo tiene en cuenta.

Entrada a la sección: tarjeta en la Agenda (`app/index.tsx`) cuando hay una
sugerencia para hoy, y desde el banner de la notificación.

## Permisos y fallos

- Si el usuario no concedió notificaciones, la tarjeta de la Agenda explica que
  sin ellas no llegarán los avisos, con botón a ajustes.
- Sin `canViewTrends`, no se registra la pantalla ni se muestra la tarjeta.

## Verificación

Probar con un build de desarrollo (las push de Expo Go tienen límites):
recibir una sugerencia programada a +2 min con el dispatcher en local, tocarla
en frío y en caliente, y comprobar el deep link y el cambio de estado.

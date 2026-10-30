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
  `PATCH status=opened`. `content_post` → la publicación
  (`app/trends/posts/[id].tsx`), con el enlace si salió o el motivo si falló.
- Dependencia previa: la migración de Alembic de `push_token` (la incluye el
  plan de backend).

## Pantallas (Expo Router)

```text
app/trends/index.tsx         Radar + análisis + próximas publicaciones + mis publicaciones (mismo contenido que la pestaña web)
app/trends/[id].tsx          Detalle de una sugerencia
app/trends/[id]/publish.tsx  Grabar, aprobar y programar
app/trends/posts/[id].tsx    Estado de una publicación
app/trends/settings.tsx      Preferencias y redes conectadas (mismo schema que web)
```

Detalle de sugerencia, pensado para usarse con una mano entre cliente y
cliente:

- Hora recomendada y red, la idea en una frase y el guion en 3 pasos
  (gancho, antes/después, cierre).
- Botón **Grabar vídeo**: abre el flujo de publicación de abajo.
- Botón **Copiar texto** (texto sugerido + hashtags), para quien prefiera
  publicar a mano.
- **Ya lo publiqué** / **No me interesa**: actualizan el estado; el análisis
  del día siguiente lo tiene en cuenta.

## Grabar, aprobar y programar

Businext publica por el barbero, siempre con su aprobación. Flujo en
`app/trends/[id]/publish.tsx`:

1. **Red conectada**: si la red de la sugerencia no está conectada, pantalla
   que explica por qué y botón **Conectar Instagram/TikTok**, que abre el
   enlace de Metricool con `expo-web-browser` (dependencia nueva); al volver, `useSocialAccounts`
   revalida.
2. **Grabar**: cámara del sistema en modo vídeo con `expo-image-picker`
   (dependencia nueva), o elegir un vídeo de la galería. Vertical, con el
   límite de duración de la red.
3. **Subir**: pide la URL firmada (`createUploadUrl`) y sube el fichero con
   `expo-file-system` (dependencia nueva) en segundo plano, con progreso. Se crea el borrador.
4. **Aprobar el texto**: vista previa del vídeo, el texto sugerido editable,
   la hora (por defecto la recomendada), el formato (Reel o Trial Reel en
   Instagram) y la marca de contenido generado con IA, desactivada por
   defecto.
5. **Programar**: "Aprobar y programar" llama a `approve`. Confirmación con la
   hora y la red.
6. **Seguir el estado** (`app/trends/posts/[id].tsx`): programado → publicado
   (botón para abrirlo en Instagram/TikTok) o fallido con el motivo de
   Metricool. Si falla un Trial Reel, botón **Publicar como Reel normal**.
   Mientras está programado se puede cambiar texto u hora, o cancelar. Push al
   publicarse o fallar.

Si la subida se corta (sin cobertura entre cliente y cliente), el borrador
queda sin vídeo y la tarjeta de la sugerencia ofrece reintentar; nunca se
programa un post sin vídeo.

Entrada a la sección: tarjeta en la Agenda (`app/index.tsx`) cuando hay una
sugerencia para hoy, y desde el banner de la notificación.

## Permisos y fallos

- Si el usuario no concedió notificaciones, la tarjeta de la Agenda explica que
  sin ellas no llegarán los avisos, con botón a ajustes.
- Permisos de cámara y micrófono: se piden al pulsar **Grabar vídeo**, no al
  abrir la app; si se deniegan, queda la opción de elegir de la galería.
- Sin `canViewTrends`, no se registra la pantalla ni se muestra la tarjeta.

## Verificación

Probar con un build de desarrollo (las push de Expo Go tienen límites):
recibir una sugerencia programada a +2 min con el dispatcher en local, tocarla
en frío y en caliente, y comprobar el deep link y el cambio de estado. Después,
grabar un vídeo desde la sugerencia, aprobarlo para +5 min en una cuenta de
Instagram de Businext y comprobar el push y el enlace al publicarse.

# Radar de tendencias · Backend (`businext-sys/businext-backend`)

> Este plan vive en el monorepo porque el resto de piezas están aquí; el código
> va en `businext-backend`. Visión general en [README.md](README.md).

## 1. Dependencias y configuración

- Añadir `anthropic` a `requirements.txt` (convive con `openai`; ver la decisión
  pendiente en el README).
- Variables nuevas (en el `.env` y en el hosting, nunca en el repo):

| Variable | Uso |
|---|---|
| `ANTHROPIC_API_KEY` | Messages API |
| `TRENDS_MCP_VIDIQ_URL` / `TRENDS_MCP_VIDIQ_TOKEN` | MCP de vidIQ, cuenta de Businext |
| `TRENDS_MCP_METRICOOL_URL` / `TRENDS_MCP_METRICOOL_TOKEN` | MCP de Metricool, cuenta de Businext (mejor hora) |
| `METRICOOL_API_URL` / `METRICOOL_USER_TOKEN` / `METRICOOL_USER_ID` | API de Metricool para marcas y publicación, cuenta de Businext |
| `CONTENT_VIDEOS_BUCKET` | Bucket privado de Supabase Storage para los vídeos (`content-videos`) |
| `TRENDS_JOB_SECRET` | Firma de los endpoints internos que lanza el cron |
| `TRENDS_ENABLED` | Interruptor global; con `false` los jobs no hacen nada |
| `PUBLISHING_ENABLED` | Interruptor de la publicación; con `false` no se programa nada en Metricool |

## 2. Modelos y migración

Una migración de Alembic que crea estas tablas (y, de paso, la de
`push_token`, que hoy no la tiene):

```text
trend_snapshot          una fila por (niche, language, country, source, date)
  id, niche, language, country, source, captured_at, payload JSONB, summary TEXT
  UNIQUE (niche, language, country, source, captured_at::date)

trend_insight           análisis por negocio y día
  id, business_id, date, trends_used JSONB, analysis TEXT,
  matched_services JSONB, model, input_tokens, output_tokens, created_at
  UNIQUE (business_id, date)

content_suggestion      lo que se notifica
  id, business_id, insight_id, network (instagram|tiktok),
  format (reel|short|carrusel|story), idea TEXT, caption_hint TEXT,
  audio_hint TEXT NULL, publish_at TIMESTAMPTZ, source_trend_ids JSONB,
  status (pending|sent|opened|dismissed|published), sent_at, created_at

content_preferences     una por negocio
  business_id PK, enabled, networks JSONB, max_per_day (1),
  quiet_from TIME, quiet_to TIME, timezone ('Europe/Madrid'),
  niche ('barberia'), language ('es'), country ('ES')
```

`niche`, `language` y `country` se rellenan al activar la funcionalidad: nicho
por defecto `barberia`; país desde la `location` activa e idioma del país, los
dos editables. No se usa la ciudad: vidIQ no tiene esa granularidad (ver el
spike en el README).

Una segunda migración, para la fase de publicación:

```text
social_account          una por (negocio, red) conectada
  id, business_id, network (instagram|tiktok), provider ('metricool'),
  provider_brand_id, handle, status (pending|connected|expired|revoked),
  connected_at, last_checked_at, created_at
  UNIQUE (business_id, network)

content_post            un vídeo que el barbero quiere publicar
  id, business_id, suggestion_id NULL, social_account_id,
  network, format (reel|trial_reel|tiktok), video_path (en Storage),
  caption TEXT, is_ai_generated BOOL (false),
  publish_at TIMESTAMPTZ, approved_by, approved_at,
  provider_post_id NULL, status (draft|scheduled|published|failed|cancelled),
  error TEXT NULL, published_url NULL, created_at, updated_at
```

Businext no guarda credenciales de Instagram ni TikTok: la conexión vive en
la marca de Metricool del negocio (`provider_brand_id`). `content_post` pasa a
`published` y, si viene de una sugerencia, la marca también como `published`.

## 3. Servicios

### `src/services/trend_sources.py`

Una función por fuente que devuelve una estructura común
(`TrendItem: title, network, metric, growth_pct, url, observed_at`, más
`hook`, `format`, `audio` y `effort`, que vidIQ ya da analizados). La primera
implementación usa la Messages API con el conector MCP y la herramienta
`vidiq_instagram_tiktok_outlier_search` (Instagram y TikTok); YouTube Shorts y
`vidiq_keyword_research` quedan fuera por el resultado del spike:

```python
client.beta.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    betas=["mcp-client-2025-11-20"],
    mcp_servers=[{
        "type": "url",
        "url": settings.TRENDS_MCP_VIDIQ_URL,
        "name": "vidiq",
        "authorization_token": settings.TRENDS_MCP_VIDIQ_TOKEN,
    }],
    tools=[{"type": "mcp_toolset", "mcp_server_name": "vidiq"}],
    output_config={"effort": "low", "format": {...TrendItem[] JSON schema...}},
    system="Extrae tendencias reales del nicho indicado con vidiq_instagram_tiktok_outlier_search. Usa solo lo que devuelvan las herramientas; si no hay datos, devuelve una lista vacía.",
    messages=[{"role": "user", "content": f"Nicho: {niche}. Idioma: {language}. País: {country}. Últimos 7 días."}],
)
```

- Una consulta a vidIQ cuesta 5 créditos; el plan gratuito (150 al mes) da
  para una al día. La ingesta hace **una sola llamada a la herramienta por
  (nicho, idioma, país)** y no reintenta en el mismo día.
- Salida estructurada (`output_config.format`) para no parsear texto libre.
- `effort: "low"`: es extracción, no razonamiento.
- Comprobar `stop_reason` antes de leer el contenido (incluido `refusal`).
- Errores tipados del SDK (`RateLimitError`, `APIStatusError`,
  `APIConnectionError`), con el mismo patrón de degradación de
  `push_notification_service.py`: se loguea a Sentry y el job sigue con el
  siguiente nicho.

### `src/services/trend_analysis.py`

Para cada negocio con `content_preferences.enabled`:

1. Agrega sus datos de los últimos 28 días: top servicios por ingreso y
   volumen, franjas horarias y días con más reservas, ticket medio, tendencia
   semana contra semana (reutilizar los cálculos de `intelligence.py`, que hoy
   están dentro del router: moverlos a un servicio).
2. Llama a Claude con el `summary` de los `trend_snapshot` de su nicho, idioma
   y país (bloque estable → `cache_control`, se comparte entre negocios) y los
   agregados del negocio (bloque variable, al final).
3. Salida estructurada: `analysis` (texto para la pantalla) y 1-3
   `suggestions` con red, formato, idea, texto sugerido, audio y franja
   recomendada, cada una con los `source_trend_ids` que la justifican.
4. Calcula `publish_at`: dentro de la franja recomendada, respetando horario
   silencioso y `max_per_day`; si el día ya está cubierto, pasa al siguiente.
   La franja sale de las horas con más reservas del negocio.
   `getBestTimeToPostByNetwork` solo se usa si el negocio tiene una
   `social_account` conectada y Metricool devuelve valores distintos de 0 (en
   cuentas sin historial devuelve 0 en todas las franjas).

Nada de datos personales de clientes en el prompt: solo agregados.

### `src/services/suggestion_dispatcher.py`

Cada 15 minutos: `content_suggestion` con `status=pending` y
`publish_at - 45 min <= now`. Envía push con `send_push_notifications`
(`data: {type: "content_suggestion", id}` para el deep link) y marca `sent`.
La notificación web sale del mismo registro (endpoint de abajo).

### `src/services/social_accounts.py`

Conexión de las redes del barbero a través de Metricool, con la cuenta de
Businext:

1. Al conectar la primera red, crea la marca del negocio en Metricool y guarda
   su id en `social_account.provider_brand_id`.
2. Devuelve el enlace de autorización de Metricool para la red pedida; el
   barbero autoriza en Instagram/TikTok y vuelve a la app.
3. Comprueba la conexión leyendo la marca (`handle`, `status=connected`). El
   job de seguimiento la revisa de nuevo y la marca `expired` o `revoked` si
   Metricool la pierde, con aviso al barbero.
4. Desconectar quita la red de la marca y deja la fila `revoked`.

El mecanismo exacto de autorización depende del plan de API de Metricool
(decisión pendiente en el README); el resto del backend solo ve
`social_account`.

### `src/services/content_publisher.py`

1. **Subida:** genera una URL firmada de subida a `CONTENT_VIDEOS_BUCKET`
   (`<business_id>/<uuid>.mp4`). El cliente sube el vídeo directo a Storage,
   nunca a través del BFF ni del backend.
2. **Borrador:** crea el `content_post` en `draft` con el vídeo, la red, el
   texto (relleno con el `caption_hint` de la sugerencia) y el `publish_at` de
   la sugerencia.
3. **Aprobar y programar:** solo con aprobación explícita de `owner` o
   `manager` (`approved_by`, `approved_at`). Genera una URL firmada de lectura
   de corta duración y llama a `createScheduledPost` de Metricool con la marca
   del negocio, el texto, la hora, el formato (Reel, Trial Reel o TikTok) e
   `isAiGenerated` explícito. Metricool copia el vídeo a su CDN en ese momento,
   así que la URL no tiene que durar hasta la publicación. Guarda
   `provider_post_id` y pasa a `scheduled`.
4. **Cancelar o cambiar:** mientras está `scheduled`, cambiar texto u hora
   actualiza el post en Metricool; cancelar lo borra allí y pasa a `cancelled`.
5. **Errores:** el mensaje de Metricool se guarda en `error` tal cual. Si un
   Trial Reel falla (p. ej. `The Instagram account is restricted.`), el post
   pasa a `failed` y la app ofrece repetirlo como Reel normal; nunca se
   reintenta solo con otro formato.

Con `PUBLISHING_ENABLED=false` no se llama a Metricool y aprobar devuelve
`503`.

## 4. Jobs

No usar `asyncio` en el `lifespan` para esto: con varias instancias se
duplicaría el trabajo. Endpoints internos protegidos con `TRENDS_JOB_SECRET`,
llamados por un cron del hosting (o GitHub Actions programado):

| Endpoint | Frecuencia | Hace |
|---|---|---|
| `POST /internal/trends/ingest` | diario, 05:00 Europe/Madrid | `trend_snapshot` por cada (nicho, idioma, país) con negocios activos |
| `POST /internal/trends/analyze` | diario, 06:00 | `trend_insight` + `content_suggestion` por negocio |
| `POST /internal/trends/dispatch` | cada 15 min | envía las sugerencias que tocan |
| `POST /internal/trends/posts/sync` | cada 15 min | lee de Metricool el estado de los `content_post` `scheduled` con `publish_at` pasado y de las `social_account` conectadas; marca `published` (con `published_url`) o `failed` (con `error`) y envía push (`data: {type: "content_post", id}`) |

Idempotentes por las restricciones `UNIQUE` y por el estado: relanzar un job
no duplica filas ni avisos.

## 5. API pública (para web y móvil)

Todas con `Depends(require_subscription)`, como `/intelligence`:

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/trends/insight` | último `trend_insight` + tendencias usadas |
| GET | `/trends/suggestions?status=` | sugerencias del negocio |
| PATCH | `/trends/suggestions/{id}` | `status`: `opened`, `dismissed`, `published` |
| GET / PUT | `/trends/preferences` | `content_preferences` |
| POST | `/trends/insight/refresh` | regenera el análisis (límite: 1 al día, como la sincronización de reseñas) |
| GET | `/social/accounts` | redes del negocio con su estado |
| POST | `/social/accounts/{network}/connect` | enlace de autorización de Metricool |
| DELETE | `/social/accounts/{id}` | desconecta la red |
| POST | `/trends/posts/upload-url` | URL firmada de subida a Storage y `video_path` |
| GET | `/trends/posts?status=` | publicaciones del negocio |
| POST | `/trends/posts` | crea el borrador (`suggestion_id` opcional, `video_path`, `network`, `format`) |
| PATCH | `/trends/posts/{id}` | cambia texto, hora o formato (en `draft` o `scheduled`) |
| POST | `/trends/posts/{id}/approve` | aprueba y programa en Metricool |
| POST | `/trends/posts/{id}/cancel` | cancela una publicación programada |

Permisos: `owner` y `manager` ven y editan; `employee` no (añadir la
capability `canViewTrends` en `src/api/auth.py`). Conectar redes y aprobar
publicaciones usan la misma capability.

Regenerar `generated-types.ts` en shared-core con `src/export_schema.py`.

## 6. Tests (`tests/`)

- Servicios de tendencias con el cliente de Anthropic mockeado: salida válida,
  lista vacía, `refusal`, `RateLimitError`.
- Cálculo de `publish_at`: horario silencioso, `max_per_day`, cambio de día,
  zona horaria con cambio de hora.
- Endpoints: permisos por rol, idempotencia de los internos, firma del secreto.
- El prompt de análisis no contiene `customer_name` (test que inspecciona el
  request construido).
- `publish_at` con `getBestTimeToPostByNetwork` a 0: sale de las reservas.
- Publicación con el cliente de Metricool mockeado: no se programa sin
  aprobación, error de Trial Reel → `failed` con el mensaje, cancelar,
  `PUBLISHING_ENABLED=false`, y el sync no repite avisos.

## 7. Orden de trabajo

1. Spike (fase 0) fuera del repo; decidir proveedor. **Hecho el 29-oct-2026**:
   vidIQ para tendencias y Metricool para mejor hora y publicación.
2. Migración + modelos + preferencias (sin IA): se puede desplegar apagado.
3. `trend_sources` + job de ingesta, con `TRENDS_ENABLED=false` en producción y
   probado en staging.
4. `trend_analysis` + `GET /trends/insight` → habilita la fase 1 en clientes.
5. Dispatcher + endpoints de sugerencias → fase 2.
6. Migración de publicación + `social_accounts` + `content_publisher` + job de
   sync, con `PUBLISHING_ENABLED=false` hasta cerrar el plan de Metricool →
   fase 3.

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
| `TRENDS_MCP_METRICOOL_URL` / `TRENDS_MCP_METRICOOL_TOKEN` | MCP de Metricool, cuenta de Businext |
| `TRENDS_JOB_SECRET` | Firma de los endpoints internos que lanza el cron |
| `TRENDS_ENABLED` | Interruptor global; con `false` los jobs no hacen nada |

## 2. Modelos y migración

Una migración de Alembic que crea estas tablas (y, de paso, la de
`push_token`, que hoy no la tiene):

```text
trend_snapshot          una fila por (niche, region, source, date)
  id, niche, region, source, captured_at, payload JSONB, summary TEXT
  UNIQUE (niche, region, source, captured_at::date)

trend_insight           análisis por negocio y día
  id, business_id, date, trends_used JSONB, analysis TEXT,
  matched_services JSONB, model, input_tokens, output_tokens, created_at
  UNIQUE (business_id, date)

content_suggestion      lo que se notifica
  id, business_id, insight_id, network (tiktok|instagram|youtube),
  format (reel|short|carrusel|story), idea TEXT, caption_hint TEXT,
  audio_hint TEXT NULL, publish_at TIMESTAMPTZ, source_trend_ids JSONB,
  status (pending|sent|opened|dismissed|published), sent_at, created_at

content_preferences     una por negocio
  business_id PK, enabled, networks JSONB, max_per_day (1),
  quiet_from TIME, quiet_to TIME, timezone ('Europe/Madrid'),
  niche ('barberia'), region (derivada de location.address, editable)
```

`niche` y `region` se rellenan al activar la funcionalidad: nicho por defecto
`barberia`; región desde la `location` activa (ciudad), con país como respaldo.

## 3. Servicios

### `src/services/trend_sources.py`

Una función por fuente que devuelve una estructura común
(`TrendItem: title, network, metric, growth_pct, url, observed_at`). La primera
implementación usa la Messages API con el conector MCP:

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
    system="Extrae tendencias reales del nicho indicado. Usa solo lo que devuelvan las herramientas; si no hay datos, devuelve una lista vacía.",
    messages=[{"role": "user", "content": f"Nicho: {niche}. Región: {region}. Últimos 7 días."}],
)
```

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
2. Llama a Claude con el `summary` de los `trend_snapshot` de su nicho y región
   (bloque estable → `cache_control`, se comparte entre negocios) y los
   agregados del negocio (bloque variable, al final).
3. Salida estructurada: `analysis` (texto para la pantalla) y 1-3
   `suggestions` con red, formato, idea, texto sugerido, audio y franja
   recomendada, cada una con los `source_trend_ids` que la justifican.
4. Calcula `publish_at`: dentro de la franja recomendada, respetando horario
   silencioso y `max_per_day`; si el día ya está cubierto, pasa al siguiente.

Nada de datos personales de clientes en el prompt: solo agregados.

### `src/services/suggestion_dispatcher.py`

Cada 15 minutos: `content_suggestion` con `status=pending` y
`publish_at - 45 min <= now`. Envía push con `send_push_notifications`
(`data: {type: "content_suggestion", id}` para el deep link) y marca `sent`.
La notificación web sale del mismo registro (endpoint de abajo).

## 4. Jobs

No usar `asyncio` en el `lifespan` para esto: con varias instancias se
duplicaría el trabajo. Endpoints internos protegidos con `TRENDS_JOB_SECRET`,
llamados por un cron del hosting (o GitHub Actions programado):

| Endpoint | Frecuencia | Hace |
|---|---|---|
| `POST /internal/trends/ingest` | diario, 05:00 Europe/Madrid | `trend_snapshot` por cada (nicho, región) con negocios activos |
| `POST /internal/trends/analyze` | diario, 06:00 | `trend_insight` + `content_suggestion` por negocio |
| `POST /internal/trends/dispatch` | cada 15 min | envía las sugerencias que tocan |

Idempotentes por las restricciones `UNIQUE`: relanzar un job no duplica filas.

## 5. API pública (para web y móvil)

Todas con `Depends(require_subscription)`, como `/intelligence`:

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/trends/insight` | último `trend_insight` + tendencias usadas |
| GET | `/trends/suggestions?status=` | sugerencias del negocio |
| PATCH | `/trends/suggestions/{id}` | `status`: `opened`, `dismissed`, `published` |
| GET / PUT | `/trends/preferences` | `content_preferences` |
| POST | `/trends/insight/refresh` | regenera el análisis (límite: 1 al día, como la sincronización de reseñas) |

Permisos: `owner` y `manager` ven y editan; `employee` no (añadir la
capability `canViewTrends` en `src/api/auth.py`).

Regenerar `generated-types.ts` en shared-core con `src/export_schema.py`.

## 6. Tests (`tests/`)

- Servicios de tendencias con el cliente de Anthropic mockeado: salida válida,
  lista vacía, `refusal`, `RateLimitError`.
- Cálculo de `publish_at`: horario silencioso, `max_per_day`, cambio de día,
  zona horaria con cambio de hora.
- Endpoints: permisos por rol, idempotencia de los internos, firma del secreto.
- El prompt de análisis no contiene `customer_name` (test que inspecciona el
  request construido).

## 7. Orden de trabajo

1. Spike (fase 0) fuera del repo; decidir proveedor.
2. Migración + modelos + preferencias (sin IA): se puede desplegar apagado.
3. `trend_sources` + job de ingesta, con `TRENDS_ENABLED=false` en producción y
   probado en staging.
4. `trend_analysis` + `GET /trends/insight` → habilita la fase 1 en clientes.
5. Dispatcher + endpoints de sugerencias → fase 2.

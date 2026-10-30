# Plan: radar de tendencias, avisos y publicación de contenido

> Estado: **spike hecho, nada implementado**. La landing ya lo anuncia como
> "Nuevo · Próximamente" (capítulo 04). Fecha: 13-oct-2026; actualizado el
> 30-oct-2026 con el [resultado del spike](#resultado-del-spike-29-oct-2026) y
> la publicación. Fase del tablero: businext-sys/businext#161.

## Qué es

Una funcionalidad nueva de Businext, en web y en móvil, que hace cuatro cosas:

1. **Recoge tendencias de redes sociales** (Instagram y TikTok) del nicho
   barbería/peluquería en el idioma y país del negocio, a través de servidores
   MCP de análisis de tendencias.
2. **Las cruza con los datos del propio negocio** (servicios estrella, horas y
   días con más reservas, ticket medio, equipo, resumen semanal) y genera un
   análisis inteligente: qué tendencias encajan con *esta* barbería y por qué.
3. **Avisa al barbero de cuándo publicar, en qué formato y con qué idea**, por
   notificación push en el móvil y en el centro de notificaciones de la web,
   para maximizar el alcance.
4. **Publica por él**: el barbero conecta su Instagram/TikTok, graba el vídeo
   desde la app, aprueba el texto y Businext lo programa a la hora recomendada
   y le avisa de si salió o falló.

Encaja en la narrativa de la landing: Businext no solo digitaliza la barbería,
automatiza la parte de empresario del barbero. El contenido es la parte de ese
trabajo que hoy nadie le resuelve.

## Punto de partida (verificado el 13-oct-2026)

| Pieza | Estado hoy |
|---|---|
| Conectores de la cuenta de Claude | Comfy, Gmail y Vercel conectados; Google Calendar y Drive sin conectar. **Ninguno de tendencias en redes.** |
| Candidatos en el registro de MCP | **vidIQ** (`vidiq_trending_videos`, `vidiq_outliers`, `vidiq_keyword_research`; YouTube, Instagram y TikTok), **Metricool** (`getBestTimeToPostByNetwork`, analítica, programación de posts), Supermetrics y Windsor.ai (analítica de cuentas propias), TikTok for Business (anuncios, no tendencias orgánicas). |
| IA en el backend | `src/services/ai_service.py` usa OpenAI (`gpt-4o-mini`) para respuestas a reseñas y el resumen semanal (`/intelligence/summary`). |
| Push | Expo Push (`push_notification_service.py`, tabla `push_token`), hoy solo para `BookingRequest`. La tabla aún no tiene migración de Alembic (ver `apps/mobile/README.md`). |
| Tareas periódicas | Solo `expire_old_requests` en el `lifespan` de FastAPI, con `asyncio`. No hay cron. |
| Datos del negocio | `reservation` (`service`, `in_charge`, fechas, `status`), `finances`, `product`, `weekly_summary` (`kpis` en JSON), `location` (`address`). |

### Lo que hay que tener claro antes de empezar

**Los conectores de claude.ai están autorizados en la cuenta de una persona y
solo los usa Claude dentro de claude.ai/Claude Code.** El backend de Businext en
producción no puede "heredarlos". Hay dos formas de que el backend llegue a
esos mismos servidores MCP:

- **A. Messages API de Claude con el conector MCP** (recomendada). El backend
  llama a `POST /v1/messages` pasando el servidor remoto en `mcp_servers`
  (`type: "url"`, `url`, `name`, `authorization_token`) y un
  `{"type": "mcp_toolset", "mcp_server_name": ...}` en `tools`, con la beta
  `mcp-client-2025-11-20`. Claude llama a las herramientas del MCP y devuelve
  el análisis en el mismo request. El token OAuth de vidIQ/Metricool lo guarda
  el backend como secreto.
- **B. API REST de cada proveedor** directamente desde el backend, y el LLM solo
  para el análisis. Más código propio por proveedor, sin dependencia de que el
  proveedor mantenga su MCP.

Se elige **A** porque es lo que pide la idea (datos que vienen de MCP de
tendencias), reutiliza el mismo servidor que ya se puede probar desde Claude, y
añadir una fuente nueva es añadir una entrada a `mcp_servers`, no un cliente
nuevo. **B** queda como plan de contingencia si un proveedor retira su MCP.

## Resultado del spike (29-oct-2026)

Hecho desde Claude con los MCP de vidIQ y Metricool, con la cuenta de Instagram
`businextsolutions` (nueva, 25 seguidores, 0 publicaciones).

### Tendencias (vidIQ)

| Herramienta | Resultado |
|---|---|
| `vidiq_instagram_tiktok_outlier_search` | **Fuente principal.** Devuelve vídeos de barbería reales de Instagram y TikTok con gancho, formato, audio y esfuerzo de producción ya analizados. |
| Tendencias de YouTube Shorts | Descartadas: mucho ruido fuera del nicho. |
| `vidiq_keyword_research` (rising, español) | Descartado: sin datos para las palabras del nicho en español. |

- **Región por idioma y país, no por ciudad.** Casi todo el contenido es
  latinoamericano y no hay granularidad de ciudad: la región se fija como
  idioma (`es`) y país, y la ciudad no se usa.
- **Coste:** 5 créditos por consulta. El plan gratuito da 150 créditos al mes,
  es decir, una consulta al día para una sola combinación de nicho y región.
- **vidIQ no sirve para publicar** por los clientes: publica Reels solo al
  momento y ligado a la cuenta de vidIQ de una persona.

### Mejor hora (Metricool)

`getBestTimeToPostByNetwork` devuelve 0 en todas las franjas para cuentas sin
historial. Para una cuenta nueva **la hora sale de las reservas del negocio**
(franjas con más actividad); el dato de Metricool solo se usa cuando trae
valores.

### Publicación (Metricool)

- `createScheduledPost` **copia el vídeo a su CDN** (`static.metricool.com`) al
  programar y publica a la hora indicada. Basta con darle una URL accesible en
  ese momento: el vídeo del barbero va a Supabase Storage y se entrega por URL
  firmada de corta duración.
- Soporta **Trial Reel** (Reel que solo ven quienes no siguen la cuenta) y el
  aviso de contenido generado con IA (`isAiGenerated`).
- La prueba como Trial Reel falló con `The Instagram account is restricted.`;
  el mismo vídeo como **Reel normal** se publicó sin problema
  (<https://www.instagram.com/reel/DfF8vTEAY8i/>). Instagram no ofrece Trial
  Reels a todas las cuentas y responde con ese error genérico: Trial Reel es
  opcional y, si falla, se ofrece publicarlo como Reel normal.

### Flujo de publicación resultante

1. **Conectar redes**: el barbero autoriza su Instagram/TikTok una vez.
2. **Grabar y subir**: desde la sugerencia, graba con la cámara del móvil (o
   sube un vídeo desde la web).
3. **Aprobar el texto**: el texto sugerido viene relleno y se puede editar;
   nada sale sin su aprobación.
4. **Programar**: Businext lo programa en Metricool a la hora recomendada (o
   la que elija).
5. **Seguir el estado**: programado → publicado (con enlace) o fallido (con el
   motivo), con aviso push en ambos casos.

### Decisiones pendientes (dueño del producto)

- **Proveedor de publicación:** plan y precio de la API de Metricool con una
  marca por barbería. Alternativa: Graph API de Meta + Content Posting API de
  TikTok, que exigen revisión de app por parte de Meta y TikTok.
- **Plan de pago de vidIQ:** el gratuito solo cubre una consulta al día.
- **SDK de Anthropic:** el backend usa OpenAI. El conector MCP es de la API de
  Claude, así que esta funcionalidad introduce el SDK `anthropic` en el
  backend. Las opciones son convivir (OpenAI para lo existente, Claude para el
  radar) o migrar también `ai_service.py`. El plan asume **convivir**; migrar
  es otra tarea.

## Arquitectura

```text
            (1 vez al día, cron)                       (por negocio, tras el 1)
 ┌──────────────────────────────┐            ┌──────────────────────────────────┐
 │ trend_ingest                 │            │ trend_analysis                   │
 │ Claude + MCP (vidIQ)         │──trends──▶ │ Claude + datos del negocio       │
 │ nicho × idioma/país          │  (tabla)   │ (reservas, finanzas, resumen)    │
 └──────────────────────────────┘            └──────────────┬───────────────────┘
                                                            │ content_suggestion
                                                            ▼ (con publish_at)
                                             ┌──────────────────────────────────┐
                                             │ suggestion_dispatcher (cada 15') │
                                             │ push Expo + notificación web     │
                                             └──────────────┬───────────────────┘
                                                            │ el barbero graba,
                                                            ▼ sube y aprueba
 ┌──────────────────────────────┐            ┌──────────────────────────────────┐
 │ content_post_sync (cada 15') │            │ content_publisher                │
 │ estado en Metricool → push   │◀─post_id── │ URL firmada de Storage →         │
 │ publicado / fallido          │            │ Metricool createScheduledPost    │
 └──────────────────────────────┘            └──────────────────────────────────┘
```

- **Las tendencias son compartidas**, no por usuario: se ingieren una vez por
  nicho e idioma/país y se cachean. Así el coste de MCP + LLM no crece con el
  número de barberías, y la cuenta de vidIQ es una sola, de Businext.
- **El análisis sí es por negocio**, pero barato: un request por negocio y día,
  con las tendencias ya resumidas como entrada.
- **El "cuándo publicar"** sale de los datos del negocio (horas con más
  reservas y actividad de clientes); `getBestTimeToPostByNetwork` de Metricool
  solo cuenta cuando la cuenta del barbero tiene historial (sin él devuelve 0).
- **La publicación** usa la cuenta de Businext en Metricool, con una marca por
  barbería a la que el barbero conecta sus redes. Businext nunca guarda las
  credenciales de Instagram o TikTok.

## Fases

Las fases 1 a 3 son la fase del tablero businext-sys/businext#161.

| Fase | Alcance | Resultado visible |
|---|---|---|
| **0. Spike** (hecho, 29-oct-2026) | Probar vidIQ y Metricool desde Claude con una cuenta de Businext; medir calidad de datos para "barbería España", coste por request y límites. | [Resultado del spike](#resultado-del-spike-29-oct-2026). |
| **1. Radar + análisis** | Ingesta diaria de Instagram y TikTok, análisis por negocio, pantalla "Tendencias" en web (dentro de Inteligencia) y móvil, solo lectura. | El barbero ve tendencias y por qué le encajan. |
| **2. Avisos** | Sugerencias con `publish_at`, envío por push y en `/notifications`, preferencias (canales, horario silencioso, frecuencia). | "Publica hoy a las 19:30: …" en el móvil. |
| **3. Publicación** | Conectar Instagram/TikTok del barbero (marca de Metricool), grabar y subir el vídeo, aprobar el texto, programar en Metricool y seguir el estado. | "Tu Reel se publicó a las 19:30" con enlace, sin salir de Businext. |
| **4. Aprendizaje** (fase siguiente) | Analítica de lo publicado; mejor hora con la audiencia real; el análisis aprende de sus resultados. | Recomendaciones que aprenden de sus resultados. |

## Planes por área

- [Backend](backend.md): modelos, migraciones, servicios, jobs y endpoints en
  `businext-sys/businext-backend`.
- [shared-core](shared-core.md): tipos, schemas y API client compartidos.
- [Web](web.md): pantalla de tendencias, notificaciones, preferencias, redes
  conectadas y publicaciones.
- [Móvil](mobile.md): pantalla, push, deep links y grabar, aprobar y programar.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| El MCP del proveedor cambia o desaparece | Capa `trend_sources` con un adaptador por fuente; contingencia B (REST directo). |
| Datos de tendencias pobres para un nicho local | Confirmado en el spike: no hay granularidad de ciudad. Se trabaja a nivel nicho + idioma/país. |
| Créditos de vidIQ | El plan gratuito cubre una consulta al día; más regiones o nichos exigen el plan de pago (decisión pendiente). |
| Instagram rechaza la publicación (cuenta restringida, Trial Reel no disponible) | El error de Metricool se guarda y se muestra tal cual; si falla un Trial Reel se ofrece publicarlo como Reel normal. Aviso push en cada fallo. |
| Coste de la API de Metricool por marca | Decisión pendiente; contingencia: Graph API de Meta + Content Posting API de TikTok, con su revisión de app. |
| Vídeos grandes | Subida directa del cliente a Supabase Storage con URL firmada; nunca a través del BFF de Vercel (límite de tamaño del cuerpo). |
| Publicar algo que el barbero no ha visto | Nada se programa sin aprobación explícita del texto y del vídeo. |
| Coste del LLM | Ingesta compartida, análisis 1×día por negocio, prompt caching del bloque de tendencias (es idéntico para todos los negocios del mismo nicho y zona). |
| Fatiga de notificaciones | Máximo configurable (por defecto 1 al día), horario silencioso y botón "no me interesa" que alimenta el siguiente análisis. |
| Recomendaciones inventadas | Salida estructurada con la fuente de cada tendencia; si el MCP no devuelve datos, no se genera sugerencia (nunca se rellena con suposiciones). |
| Privacidad | Al modelo solo van agregados del negocio (servicios, franjas, volúmenes), nunca nombres ni teléfonos de clientes. |

## Criterios de éxito (fase 2)

- ≥ 40 % de los negocios activos abre la pantalla de tendencias al menos una
  vez por semana.
- ≥ 15 % de las notificaciones de contenido se abren.
- Coste de IA + MCP por negocio y mes por debajo de 0,50 €.
- Cero sugerencias sin fuente trazable en una muestra revisada de 50.

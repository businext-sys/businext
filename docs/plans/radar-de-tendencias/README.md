# Plan: radar de tendencias y avisos de contenido

> Estado: **propuesta**, nada implementado. La landing ya lo anuncia como
> "Nuevo · Próximamente" (capítulo 05). Fecha: 13-oct-2026.

## Qué es

Una funcionalidad nueva de Businext, en web y en móvil, que hace tres cosas:

1. **Recoge tendencias de redes sociales** (TikTok, Instagram, YouTube) del
   nicho barbería/peluquería y de la zona del negocio, a través de servidores
   MCP de análisis de tendencias.
2. **Las cruza con los datos del propio negocio** (servicios estrella, horas y
   días con más reservas, ticket medio, equipo, resumen semanal) y genera un
   análisis inteligente: qué tendencias encajan con *esta* barbería y por qué.
3. **Avisa al barbero de cuándo publicar, en qué formato y con qué idea**, por
   notificación push en el móvil y en el centro de notificaciones de la web,
   para maximizar el alcance.

Encaja en la narrativa de la landing: Businext no solo digitaliza la barbería,
automatiza la parte de empresario del barbero. El contenido es la parte de ese
trabajo que hoy nadie le resuelve.

## Punto de partida (verificado en esta sesión)

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

**Decisión pendiente (dueño del producto):** el backend usa OpenAI. El conector
MCP es de la API de Claude, así que esta funcionalidad introduce el SDK
`anthropic` en el backend. Las opciones son convivir (OpenAI para lo existente,
Claude para el radar) o migrar también `ai_service.py`. El plan asume
**convivir**; migrar es otra tarea.

## Arquitectura

```text
            (1 vez al día, cron)                       (por negocio, tras el 1)
 ┌──────────────────────────────┐            ┌──────────────────────────────────┐
 │ trend_ingest                 │            │ trend_analysis                   │
 │ Claude + MCP (vidIQ, ...)    │──trends──▶ │ Claude + datos del negocio       │
 │ nicho × país/ciudad          │  (tabla)   │ (reservas, finanzas, resumen)    │
 └──────────────────────────────┘            └──────────────┬───────────────────┘
                                                            │ content_suggestion
                                                            ▼ (con publish_at)
                                             ┌──────────────────────────────────┐
                                             │ suggestion_dispatcher (cada 15') │
                                             │ push Expo + notificación web     │
                                             └──────────────────────────────────┘
```

- **Las tendencias son compartidas**, no por usuario: se ingieren una vez por
  nicho y zona y se cachean. Así el coste de MCP + LLM no crece con el número de
  barberías, y la cuenta de vidIQ es una sola, de Businext.
- **El análisis sí es por negocio**, pero barato: un request por negocio y día,
  con las tendencias ya resumidas como entrada.
- **El "cuándo publicar"** sale, en la fase 1, de los datos del negocio (horas
  con más reservas y actividad de clientes) más el `getBestTimeToPostByNetwork`
  general de Metricool. En la fase 3, de la audiencia real del barbero si
  conecta su cuenta.

## Fases

| Fase | Alcance | Resultado visible |
|---|---|---|
| **0. Spike** (2-3 días) | Probar vidIQ y Metricool desde Claude con una cuenta de Businext; medir calidad de datos para "barbería España", coste por request y límites. | Informe con muestras y decisión de proveedor. Sin código de producto. |
| **1. Radar + análisis** | Ingesta diaria, análisis por negocio, pantalla "Tendencias" en web (dentro de Inteligencia) y móvil, solo lectura. | El barbero ve tendencias y por qué le encajan. |
| **2. Avisos** | Sugerencias con `publish_at`, envío por push y en `/notifications`, preferencias (canales, horario silencioso, frecuencia). | "Publica hoy a las 19:30: …" en el móvil. |
| **3. Cuenta propia** | El barbero conecta su Instagram/TikTok (Metricool por OAuth, o Meta Graph API); mejor hora calculada con su audiencia; seguimiento de si publicó y qué rindió. | Recomendaciones que aprenden de sus resultados. |

## Planes por área

- [Backend](backend.md): modelos, migraciones, servicios, jobs y endpoints en
  `businext-sys/businext-backend`.
- [shared-core](shared-core.md): tipos, schemas y API client compartidos.
- [Web](web.md): pantalla de tendencias, notificaciones y preferencias.
- [Móvil](mobile.md): pantalla, push y deep links.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| El MCP del proveedor cambia o desaparece | Capa `trend_sources` con un adaptador por fuente; contingencia B (REST directo). |
| Datos de tendencias pobres para un nicho local | Spike de la fase 0 antes de comprometer; si vidIQ no llega a nivel ciudad, se trabaja a nivel país + nicho. |
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

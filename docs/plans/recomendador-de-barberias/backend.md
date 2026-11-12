# Recomendador de barberías · Backend (`businext-sys/businext-backend`)

> El plan vive en el monorepo con el resto de piezas; el código va en
> `businext-backend`. Visión general en [README.md](README.md).

## 1. Configuración

| Variable | Uso |
|---|---|
| `GOOGLE_PLACES_API_KEY` | Places API (New), restringida por IP del backend y solo a Places |
| `DISCOVER_GOOGLE_ENABLED` | Con algo distinto de `true`, el buscador solo devuelve clientes Businext |
| `DISCOVER_JOB_SECRET` | Firma de `POST /internal/discover/refresh` (mismo patrón que `TRENDS_JOB_SECRET` y `REMINDERS_JOB_SECRET`) |

No hacen falta dependencias nuevas: `httpx` ya está, y el LLM de la fase 2-3
usa el SDK que ya hay en el backend.

## 2. Modelos

Las tablas se crean a mano en Supabase con un SQL en `docs/sql/` (ver
"Migraciones" en el README del backend) y **con RLS activado**.

```text
public_profile            una por location que activa el perfil (fase 0)
  location_id PK FK location.id, business_id, enabled, slug UNIQUE,
  city, neighbourhood, lat, lng,
  google_place_id NULL         -- para fusionar con el resultado de Places
  description TEXT, specialties JSONB  -- lista cerrada, ver shared-core
  languages JSONB              -- "es", "en", "fr"... (clave para quien viaja)
  price_from NUMERIC NULL, walk_ins BOOL, photos JSONB (Supabase Storage)
  created_at, updated_at

barber_profile            opt-in de cada barbero (fase 2)
  member_id PK FK member.id, enabled, display_name, specialties JSONB,
  photos JSONB, consent_at TIMESTAMPTZ, consent_revoked_at NULL

location_signals          precalculado por el job nocturno (fase 2)
  location_id PK, repeat_rate, completion_rate, bookings_90d,
  next_slot_at NULL, verified_up, verified_down,
  google_rating_90d NULL, style_mentions JSONB  -- {"degradado": 12, "barba": 7}
  computed_at

visit_feedback            reseña verificada tras la cita (fase 2)
  id, reservation_id UNIQUE, location_id, member_id NULL,
  liked BOOL, style NULL, comment NULL, created_at

discover_event            analítica mínima, sin datos personales
  id, kind (search|click|book|claim), city, style NULL,
  location_id NULL, google_place_id NULL, created_at
```

`google_place_id` sale del perfil de Google que el cliente ya conecta en
`/reviews` (`google_business_profile.google_id` es el id de Maps; el
`place_id` de Places se resuelve una vez con Text Search y se guarda, que sí
está permitido).

## 3. Nota de confianza

Función pura en `src/services/discover_score.py`, con tests. Sin LLM.

**Capa 1 (todas las barberías):**

```text
bayes = (v / (v + m)) · R + (m / (v + m)) · C
  R = nota de Google, v = nº de reseñas
  C = media de las barberías de la búsqueda (≈ 4,5), m = 50
reputacion = escala(bayes, 3,5 → 0, 5,0 → 100)
```

**Encaje con la búsqueda:** penalización por distancia (suave hasta 1 km,
fuerte desde 3 km), 0 si está cerrada en la franja pedida, bonus si la
especialidad buscada está declarada en `public_profile`/`barber_profile` o
mencionada en reseñas (`style_mentions`, solo clientes).

**Capa 2 (clientes con señales):** `repeat_rate`, `completion_rate`, % de 👍
en `visit_feedback` (con su propia media bayesiana) y tendencia de nota en 90
días. Un cliente sin historial suficiente se puntúa solo con la capa 1: tener
Businext no da puntos por sí mismo.

Pesos iniciales: reputación 50 %, encaje 30 %, señales Businext 20 %. Se
ajustan con los clics y los 👍 de la fase 2.

Cada resultado lleva `reasons`: 1-3 frases generadas con plantillas a partir
de los números ("4,8 en 900 reseñas", "El 62 % de sus clientes repite"), no
con LLM.

## 4. Endpoints

Router nuevo `src/routers/discover.py`, **público** (sin JWT), con rate limit
por IP.

| Método y ruta | Qué hace |
|---|---|
| `GET /discover/search?lat&lng\|q&style&open_at&radius` | Une clientes con `public_profile.enabled` cercanos (consulta por bounding box sobre lat/lng; PostGIS no hace falta a este volumen) y una llamada a Places Nearby/Text Search con `FieldMask` mínima. Fusiona por `google_place_id`, calcula la nota y devuelve 10-20 resultados. |
| `GET /discover/profile/{slug}` | Ficha pública de un cliente: perfil, barberos con consentimiento, señales, enlace a `/book/{businessId}`. |
| `POST /discover/claim` | "¿Es tu barbería?": `google_place_id` + email → lead (tabla o email al equipo con Resend). |
| `POST /discover/feedback/{token}` | Reseña verificada desde el enlace post-cita (token firmado, un uso). |
| `POST /discover/events` | Analítica (`discover_event`). |
| Autenticados: `GET/PUT /public-profile`, `GET/PUT /barber-profile/me` | Gestión del perfil por el owner/manager y opt-in del barbero, según la matriz de permisos de `auth.py`. |
| `POST /internal/discover/refresh` | Job nocturno firmado: recalcula `location_signals` y etiqueta reseñas nuevas por estilo. |

La respuesta de Places **no se guarda** (ni en tabla ni en caché persistente);
la de clientes sí se puede cachear unos minutos en memoria.

## 5. Jobs

- **Refresh nocturno** (fase 2): desde el mismo cron externo que ya llama a
  tendencias y recordatorios. Por location con perfil activo: agrega
  `reservation` de 90 días (repetición = clientes con ≥2 citas / clientes;
  cumplimiento = completadas / (completadas + canceladas + no-show)), busca el
  próximo hueco con `availability_service.py` y etiqueta con un LLM pequeño
  solo las `google_review` nuevas desde la última pasada (lista cerrada de
  estilos, salida JSON). Coste: céntimos por barbería y mes.
- **Pregunta post-cita** (fase 2): en `reminder_service.py`, cuando una
  reserva pasa a completada y tiene contacto (`docs/sql/181`), se envía el
  enlace de `visit_feedback` una sola vez.

## 6. Tests

- `discover_score`: casos de la media bayesiana, distancia, cerrado,
  especialidad, cliente sin historial.
- Router: búsqueda con Places mockeado (`httpx`), `DISCOVER_GOOGLE_ENABLED=false`,
  fusión por `place_id`, perfil deshabilitado no aparece, barbero sin
  consentimiento no aparece, token de feedback de un solo uso.

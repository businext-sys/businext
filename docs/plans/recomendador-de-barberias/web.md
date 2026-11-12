# Recomendador de barberías · Web (`apps/web`)

> Visión general en [README.md](README.md). Toda la UI sigue `DESIGN.md`
> (tokens y componentes existentes; nada de valores fuera de él).

## 1. Páginas públicas (sin login)

Pensadas primero para el móvil: quien las usa está en la calle, con datos
móviles y sin la app instalada.

| Ruta | Fase | Contenido |
|---|---|---|
| `/barberias` | 1 | Buscador: "Usar mi ubicación" o barrio/ciudad, chips de estilo (lista cerrada de `shared-core`, los que suben en el radar primero), "Abierto ahora / Mañana / Elegir hora". Lista de resultados con nota, distancia, "por qué" y botón principal: **Reservar** (cliente) o **Ver en Google Maps** (no cliente). |
| `/barberias/[ciudad]` | 0 | Página estática/ISR con los clientes con perfil activo de la ciudad. Solo datos propios (sin Google), para SEO local. `generateMetadata` + JSON-LD `HairSalon`/`LocalBusiness`. |
| `/b/[slug]` | 0 | Ficha pública del cliente: fotos, especialidades, idiomas, barberos con consentimiento, señales ("El 62 % repite") y **Reservar** → `/book/[businessId]` existente. |
| `/barberias/reclamar` | 1 | "¿Es tu barbería?": formulario corto → `POST /discover/claim` y paso al alta normal. |
| `/valorar/[token]` | 2 | Reseña verificada post-cita: 👍/👎, estilo, comentario opcional. |

Detalles:

- **Atribución de Google** visible en los resultados que vienen de Places, y
  enlace a la ficha de Maps de cada no cliente.
- Los no clientes llevan una etiqueta discreta "Aún no reserva con Businext";
  los clientes, el badge "Reserva online" y sus señales propias.
- "Cómo ordenamos" enlazado bajo la lista: explica la nota de confianza.
- Ubicación del navegador solo al pulsar el botón; nunca se guarda.
- Añadir las rutas públicas a `sitemap` y revisar el middleware de auth para
  que no las proteja.

## 2. Parte autenticada (dueño y barbero)

| Dónde | Fase | Qué |
|---|---|---|
| `/configuration` → sección "Perfil público" | 0 | Activar por location, slug, descripción, especialidades, idiomas, precio desde, fotos, marcar el punto en el mapa. Vista previa de la ficha y enlace para compartir. |
| `/configuration` → "Mi perfil de barbero" (rol employee) | 2 | Aceptar/retirar consentimiento, especialidades y portfolio propio. |
| `/intelligence` | 2 | Bloque "Cómo te ven en Businext": búsquedas en las que apareces, clics, reservas desde el buscador, 👍 de reseñas verificadas. Es el argumento de valor para renovar. |

## 3. shared-core

- `Specialty`: lista cerrada y traducible (degradado bajo/medio/alto, taper,
  buzz cut, mullet, rizado/afro, barba, afeitado clásico, diseño/líneas,
  infantil, color...). La comparten perfil, búsqueda, etiquetado y radar.
- Schemas zod de `DiscoverResult`, `PublicProfile`, `BarberProfile`,
  `VisitFeedback`, y el mapper de la respuesta del backend.

## 4. Validación antes del PR

`pnpm type-check:shared-core`, `pnpm test:shared-core`, `pnpm type-check:web`,
`pnpm lint:web` y `pnpm build:web`; probar `/barberias` en viewport de móvil.

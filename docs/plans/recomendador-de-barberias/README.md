# Plan: recomendador de barberías y barberos ("Encuentra tu barbero")

> Estado: **propuesta, nada implementado**. Fecha: 12-nov-2026. Sin fase en el
> tablero todavía: las stories salen de este plan con `/story`.
> Detalle técnico en [backend.md](backend.md) y [web.md](web.md).

## El problema

Quien está en una ciudad que no es la suya, o no tiene barbero fijo, no sabe
a dónde ir. Hoy lo resuelve con Google Maps: ordena por nota y ve barberías
con 4,8 y 40 reseñas al lado de otras con 4,6 y 1.200. Eso le deja tres
problemas sin resolver:

1. **La nota de Google no dice quién corta bien lo que él quiere.** Una
   barbería con 4,7 puede tener un barbero excelente en degradados y otro que
   no. La gente elige *barbero*, no local.
2. **No hay señal de confianza real.** Las reseñas se pueden comprar, son
   viejas o hablan del trato y no del corte.
3. **Encontrar el sitio no es reservar.** Del mapa hay que pasar a llamar,
   escribir por WhatsApp o buscar el enlace de Booksy, cada barbería con el
   suyo.

## Qué es

Una búsqueda pública (web, sin registro, pensada para el móvil) donde alguien
escribe *dónde* está y *qué* quiere ("degradado bajo con barba, cerca de Sol,
mañana por la tarde") y Businext le devuelve una lista corta y explicada:

- **Barberías ordenadas por una nota de confianza propia**, no por la media
  bruta de Google: corrige el volumen de reseñas, pesa más las recientes y,
  cuando la barbería usa Businext, añade señales que nadie más tiene (clientes
  que repiten, citas cumplidas, reseñas verificadas tras una cita).
- **Por qué te la recomendamos**, en una frase: "4,8 en 900 reseñas; 12 de
  las últimas 50 mencionan degradados; el 62 % de sus clientes repite".
- **Barbero recomendado dentro de la barbería**, cuando la barbería lo activa
  y el barbero da su consentimiento.
- **Reserva en un toque** si la barbería usa Businext (reutiliza `/book`). Si
  no, se enlaza a Google Maps con el botón "¿Es tu barbería? Únete a Businext".

Las "tendencias" entran de dos formas: los estilos que suben en redes (lo que
ya recoge el [radar de tendencias](../radar-de-tendencias/README.md)) se
ofrecen como chips de búsqueda ("Low fade", "Mullet moderno", "Buzz cut"), y
las barberías que los hacen bien suben para esa búsqueda.

## Por qué tiene sentido para Businext (oportunidad)

Businext es hoy un SaaS B2B para el dueño de la barbería. Este recomendador
le añade un **lado consumidor que alimenta al lado B2B**, que es el que paga:

| Para quién | Qué gana |
|---|---|
| Cliente final | Una recomendación en la que confiar, explicada, y reserva directa. Gratis. |
| Barbería cliente de Businext | **Clientes nuevos** que llegan ya con cita: el argumento de venta más fuerte que puede tener la suscripción ("Businext te trae clientes", no solo "te organiza"). |
| Barbería que no es cliente | Aparece con datos públicos de Google y un "Reclama tu perfil": **captación B2B de coste casi cero**. |
| Businext | Un canal de adquisición propio, SEO local ("mejores barberías en Valencia centro") y datos de calidad que los competidores no tienen. |

### Competencia y hueco

- **Google Maps**: tiene los datos, pero ordena por cercanía/nota bruta, no
  entiende de estilos ni de barberos y no reserva en casi ninguna barbería.
- **Booksy, Fresha, Treatwell**: tienen marketplace y reservas, pero solo de
  sus clientes, sus reseñas son internas y el ranking mezcla visibilidad
  pagada. Ninguno se centra en "qué barbero corta bien *este* estilo".
- **Instagram/TikTok**: es donde se descubren estilos, no donde se reserva.

El hueco es **la recomendación de barbero por estilo con una nota en la que se
puede confiar**, especialmente para quien está de paso (turistas, viajes de
trabajo, estudiantes recién llegados). Ese usuario no va a instalar una app:
por eso el primer producto es **web móvil**, no la app de Expo (que es la del
barbero).

> Antes de invertir más allá de la fase 1 conviene confirmar con datos
> (búsquedas reales y reservas desde el buscador) que el hueco existe en las
> ciudades donde ya hay clientes. Ver [Métricas](#métricas-de-éxito).

## Principios

1. **Barato al principio.** Nada de rastrear ciudades enteras. Se consulta
   solo lo que alguien busca, se reutiliza lo que ya hay (Outscraper, `/book`,
   radar de tendencias, recordatorios) y la IA solo entra donde aporta.
2. **El orden no se compra.** La nota de confianza es la misma pague o no la
   barbería. Si algún día hay posiciones patrocinadas, van aparte y marcadas
   como tales. Sin esto el producto pierde lo único que lo diferencia.
3. **Datos de Google dentro de sus términos.** Las barberías que no son
   clientes se muestran con la API oficial de Google Places, en vivo y con
   atribución; de ellas no se guarda más que su `place_id`. Outscraper se sigue
   usando solo para las barberías clientes, que conectan su propio perfil
   (como hoy en `/reviews`). Ver [Riesgos](#riesgos).
4. **Opt-in del negocio y del barbero.** Una barbería cliente sale con perfil
   completo solo si lo activa. Un barbero sale con nombre y valoración propia
   solo si él lo acepta (RGPD: es una persona física).

## Cómo se calcula la recomendación

Una **nota de confianza** de 0 a 100 por barbería, con tres capas que se van
sumando por fases. Detalle y pesos iniciales en
[backend.md](backend.md#3-nota-de-confianza).

| Capa | Fuente | Fase | Qué aporta |
|---|---|---|---|
| **Reputación pública** | Google: nota y nº de reseñas (Places API para todas; Outscraper con texto y fechas para clientes) | 1 | Media bayesiana: 4,9 con 12 reseñas no gana a 4,7 con 800. Para clientes, además, tendencia de los últimos 90 días. |
| **Encaje con lo que buscas** | Distancia, horario abierto, especialidades declaradas, menciones del estilo en reseñas (clientes) | 1-2 | Que lo recomendado sirva para *esta* búsqueda. |
| **Señales de Businext** | Reservas: tasa de repetición, citas cumplidas vs. canceladas/no-show, hueco disponible pronto, reseñas verificadas tras cita | 2 | La señal que nadie más tiene: si los clientes **vuelven**, es que les cortan como les gusta. |

La "reseña verificada" es una pregunta corta tras la cita, enviada con el
mismo sistema que los recordatorios (`reminder_service.py`): "¿Te cortaron
como querías? 👍/👎 + estilo". Solo la puede dejar quien tuvo cita, así que no
se puede inflar.

## Arquitectura (resumen)

```text
 Usuario (web pública /barberias)
   │  ubicación + estilo (+ texto libre en fase 3)
   ▼
 GET /discover/search  (backend, público, con rate limit)
   ├─ Barberías Businext con perfil público activo  ─▶ Postgres (lat/lng, señales precalculadas)
   ├─ Barberías cercanas de Google                  ─▶ Places API (Nearby/Text Search), en vivo
   │     └─ si el place_id es de un cliente → se fusiona con su ficha Businext
   ├─ Nota de confianza + "por qué"                 ─▶ cálculo en Python, sin LLM
   └─ Respuesta: lista ordenada, cliente = reservable, no cliente = "ver en Maps"
                                                          + "¿Es tu barbería?"
 Job nocturno (como los de tendencias/recordatorios, POST /internal/... firmado)
   └─ recalcula señales de Businext por location y etiqueta reseñas por estilo (LLM barato, solo clientes)
```

## Fases

| Fase | Alcance | Coste mensual aprox.* | Resultado visible |
|---|---|---|---|
| **0. Validación** (1-2 semanas) | Perfil público opt-in para clientes (especialidades, fotos, idiomas que habla el equipo); geolocalizar sus `location`. Página `/barberias/[ciudad]` estática solo con clientes, para medir tráfico SEO e interés. | ~0 € | Los clientes ven su ficha pública y la comparten. Sabemos cuántos la activan. |
| **1. Buscador híbrido (MVP)** | `/discover/search` con clientes + Google Places en vivo, nota de confianza capa 1, filtros (estilo por chips, abierto ahora, distancia), reserva vía `/book`, "Reclama tu perfil" → alta. | 0-80 € (Places API, ver tabla) | Cualquiera busca barbería cerca y reserva en las que usan Businext. |
| **2. Señales propias y barbero** | Repetición, cumplimiento y disponibilidad por location; reseña verificada post-cita; etiquetado de reseñas por estilo con LLM; perfil de barbero opt-in con portfolio. | +5-20 € (LLM) | "Te recomendamos a Carlos en Barbería X: especialista en degradados, el 70 % repite." |
| **3. Concierge IA y tendencias** | Búsqueda en lenguaje natural (un LLM pequeño traduce texto → filtros), chips de estilos desde el radar, foto de referencia opcional ("quiero esto"). Planteable también dentro de la app móvil si hay demanda. | +10-30 € | "Low fade texturizado cerca de Sol, mañana 18:00" → tres opciones con hueco. |
| **4. Monetización** (si las métricas lo justifican) | Posición patrocinada marcada, ficha premium para clientes, informe "cómo te ven" para captar no clientes. | — | Ingresos directos además del canal de captación. |

\* Estimaciones orientativas a precios públicos de noviembre de 2026; hay que
confirmarlas en la consola de Google Cloud antes de la fase 1.

### Coste de la fase 1, en detalle

El único coste variable relevante es Google Places. Para tenerlo controlado:

- **Una sola llamada por búsqueda** (Nearby Search o Text Search con
  `includedType=barber_shop`) pidiendo solo los campos necesarios con
  `X-Goog-FieldMask` (id, nombre, ubicación, nota, nº de reseñas, horario,
  enlace a Maps). Pedir `rating` y `userRatingCount` sube la llamada al SKU de
  más precio, así que se pide solo en la búsqueda, nunca en el detalle.
- **Sin reseñas de Google para no clientes**: el texto de reseñas es el campo
  más caro y no hace falta para ordenar.
- Google da una **cuota gratuita mensual por SKU**; con un volumen de prueba
  (unas miles de búsquedas al mes) el coste es cercano a cero, y por encima
  ronda 30-40 $ por cada 1.000 búsquedas.
- **Límite de presupuesto** en Google Cloud + rate limit por IP en el
  endpoint + un interruptor `DISCOVER_GOOGLE_ENABLED` que deja el buscador en
  "solo clientes Businext" si se dispara el gasto.
- Outscraper ya está pagado para los clientes que conectan su perfil; esta
  funcionalidad no añade llamadas para no clientes.

## Métricas de éxito

La métrica que importa es la del negocio B2B; las demás la explican.

| Métrica | Para qué |
|---|---|
| **Altas de barberías desde "Reclama tu perfil" / "Únete"** | ¿Es un canal de captación? (métrica principal) |
| Reservas creadas desde el buscador, por cliente | ¿Les trae clientes? Es lo que se enseña en la venta. |
| Búsquedas/semana y % que hace clic en una barbería | ¿Hay demanda? |
| % de clientes Businext que activan perfil público | ¿El lado oferta se suma? (umbral para seguir: >30 %) |
| Coste de Google + LLM por búsqueda y por reserva | ¿Escala sin romper el margen? |
| % de 👍 en reseñas verificadas | ¿La recomendación acierta? |

**Criterio para pasar de fase 1 a 2**: al menos una ciudad con búsquedas
recurrentes y reservas desde el buscador en varias barberías cliente. Si no
llega, el plan se queda en ficha pública + SEO (fase 0), que ya tiene valor
para el cliente y casi no cuesta.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| **Huevo y gallina**: pocas barberías cliente en una ciudad → el buscador sale vacío. | Por eso es híbrido: Google rellena el mapa desde el día 1 y los clientes destacan por ser reservables y tener más señales. Lanzar ciudad a ciudad donde ya hay clientes. |
| **Términos de Google Maps Platform**: no se puede guardar el contenido de Places (nota, reseñas, horarios) más allá de lo permitido, ni mostrarlo sin atribución, ni mezclarlo con mapas de terceros. | Solo se persiste el `place_id`; lo demás se usa en la respuesta. Atribución "Datos de Google" visible. Revisar los términos vigentes antes de la fase 1. Las páginas SEO estáticas (fase 0) usan solo datos propios de clientes. |
| **Outscraper para no clientes** sería scraping de Google sin consentimiento del negocio. | No se usa para no clientes. Se mantiene solo para el perfil que el propio cliente conecta, como hoy. |
| **Conflicto con los clientes**: a una barbería puede no gustarle salir junto a la competencia. | El cliente sale primero en igualdad de nota (es reservable) y siempre con más información. El perfil público es opt-in. |
| **Confianza**: si el orden parece comprado, el producto no vale nada. | Nota de confianza pública y explicada ("cómo ordenamos"), patrocinados aparte y marcados. |
| **RGPD**: valoraciones por barbero (persona física), geolocalización del usuario. | Barbero solo con consentimiento explícito y retirable. Ubicación del usuario: se pide en el navegador, se usa para la búsqueda y no se guarda; alternativa por texto (barrio/ciudad). Las reseñas verificadas se publican sin datos personales. |
| **Abuso del endpoint público** (scraping del propio buscador, gasto en Google). | Rate limit por IP, caché de la respuesta de clientes, tope de presupuesto e interruptor. |

## Decisiones pendientes (dueño del producto)

- **Nombre y ubicación en la web**: `businext.app/barberias` (propuesto) o
  subdominio propio. Afecta a SEO.
- **¿Mostrar no clientes desde el día 1?** El plan dice sí (sin ellos no hay
  producto en ciudades con pocos clientes). La alternativa es solo clientes,
  más barata y sin depender de Google, pero sin valor para el usuario fuera de
  las ciudades donde hay muchos clientes.
- **Proveedor de geocodificación** para las `location` de los clientes: tomar
  lat/lng del perfil de Google que ya trae Outscraper, o pedir al dueño que
  marque el punto en el mapa al activar el perfil (gratis y exacto).
- **LLM**: el backend ya convive con OpenAI y Anthropic. Para el etiquetado de
  reseñas y el concierge basta un modelo pequeño; elegir uno y no añadir un
  tercer proveedor.
- **Monetización**: confirmar que la fase 1-3 se mide como canal de
  captación (no como producto que factura) antes de plantear la fase 4.

## Planes por área

- [backend.md](backend.md): modelos, endpoints, nota de confianza, jobs.
- [web.md](web.md): páginas públicas, perfil público en configuración y
  experiencia móvil.
- `shared-core`: tipos y schemas de `DiscoverResult`, `PublicProfile` y
  `Specialty` (lista cerrada de estilos), consumidos por web y, en fase 3, por
  mobile.
- Mobile (app del barbero): en fase 0-2 solo la pantalla para activar el
  perfil público y aceptar el consentimiento de barbero; el buscador para el
  cliente final no va en esta app.

# Landing — guion y sistema

La landing aplica el sistema narrativo de `businext-web-system` (el mismo que usa `kuberse-web`):
**primero una historia que se recorre con el scroll, después una parte descriptiva que se lee
como cualquier web.** La historia vende el porqué; la parte descriptiva enseña el producto real.

## Idea

Businext no es «software de gestión». Es la herramienta que le **devuelve tiempo y dinero al dueño
de una barbería**: menos teléfono y menos papel, una caja que sabe lo que deja y una reputación que
trabaja sola. La página está escrita para esa persona, no para «cualquier negocio con citas».

| | |
|---|---|
| Público | Dueño de barbería, de uno a varios sillones. Usa el móvil entre corte y corte |
| Promesa | Más tiempo en el sillón, más dinero en la caja |
| Tono | Cercano, de tú, frases cortas. Situaciones concretas del día a día, nada de jerga |
| Altitud | Explicar cómo cambia el día, no enumerar funciones |
| Prohibido | Cifras inventadas («+40 % de ingresos»), testimonios falsos, «cualquier negocio» |

## Estructura

1. **Hero** (`VideoScrollHero`): el móvil que entra en pantalla. Promesa: *Tu barbería gana tiempo y dinero*.
2. **La historia** (`story/`): un plano continuo enganchado al scroll, en seis actos.
3. **Por dentro** (`showcase/`): capturas reales de la app, bloque a bloque, y tres pasos para empezar.
4. **Precio y CTA**, y **preguntas frecuentes**.

## La historia, acto por acto

Un solo clip (`public/story/story.{webm,mp4}`, 720 fotogramas) que avanza con el scroll; nunca se
reproduce solo. Cada acto ocupa un tramo del clip y una parte del scroll proporcional a ese tramo,
así que el texto y la imagen siempre hablan de lo mismo. Los textos viven en `story/acts.ts`.

| Acto | Fotogramas | Se ve | Titular |
|---|---|---|---|
| Tu día | 1–80 | Oscuridad; nace una burbuja | Tu barbería no para. *Tú* tampoco. |
| Agenda | 81–175 | Calendario dentro de la burbuja | La agenda se llena *sola*. |
| Caja | 176–310 | Fajo de billetes; la burbuja se multiplica | Sabes lo que *ganas*, cada día. |
| Reseñas | 311–400 | Logo de Google con estrellas | Tu fama trabaja *por ti*. |
| Asesor IA | 401–550 | Cerebro «IA» | Un asesor que conoce tu *barbería*. |
| Businext | 551–720 | «Businext» rompe la burbuja y se apaga | Más tiempo en el sillón. Más dinero en la *caja*. |

El primer acto es el problema (el sábado con la máquina en la mano y el teléfono sonando). Los
cuatro siguientes son lo que Businext le quita de encima. El último cierra la promesa.

## Reglas del sistema

- **El póster es el contenido y el respaldo.** Cada acto tiene su fotograma fijo en
  `public/story/*.webp`, renderizado en servidor. Es lo que se ve sin JavaScript, mientras carga el
  clip o con `prefers-reduced-motion` (en ese caso el clip ni se descarga).
- **El clip solo se pide cuando la historia está a una pantalla.** VP9 donde el navegador lo
  soporta, H.264 en el resto. Fotograma clave cada 6 para que el scrub sea fluido en móvil, y una
  sola búsqueda en vuelo a la vez.
- **El texto de cada acto queda fijo en pantalla** mientras su acto está en escena: un titular
  nunca se va a medio leer. Los puntos de cada acto llegan uno a uno con el scroll.
- **Navegación lateral**: un punto por acto, con su nombre y una línea al pasar el ratón o el foco.
- **Las capturas son de la app real**, con datos de una barbería ficticia. Ver
  `scripts/landing-capture/README.md` para regenerarlas. Todas llevan `alt` escrito.

## Assets

| Fichero | Origen |
|---|---|
| `public/story/story.webm` (5,3 MB), `story.mp4` (4,4 MB) | Los 720 fotogramas de `public/frames-full/` (115 MB), recodificados a 720 px de ancho con `ffmpeg` (VP9 CRF 42 / H.264 CRF 31, GOP 6) |
| `public/story/*.webp` | Fotogramas 70, 135, 230, 350, 500 y 590 de esa misma secuencia |
| `public/landing/screens/*.webp` | `scripts/landing-capture/capture.mjs`, convertidas a WebP calidad 80 |

`public/frames-full/` y `VideoScrollSection.tsx` ya no los usa la landing. Se pueden borrar cuando
se dé por buena la nueva versión.

## Pendiente

- Vídeo propio de barbería (manos, navaja, sillón) para el acto 1: el clip actual es genérico.
- Testimonio real de una barbería cliente, con permiso, en la parte descriptiva.

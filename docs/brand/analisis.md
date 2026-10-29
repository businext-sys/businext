# Análisis de identidad visual

Punto de partida para redefinir el estilo de Businext en la web (`apps/web`) y en la app móvil
(`apps/mobile`). Story: businext-sys/businext#124. El inventario del estado actual está en
[`inventario.md`](inventario.md).

## Activos de marca

### Logo

`apps/web/public/logo-bn.png`: las letras "BN" en graffiti 3D, con relieve, brillo y gotas.

| Papel | Color |
|---|---|
| Cara de las letras | `#50c8c8` → `#a0dcdc` (turquesa claro con brillo) |
| Volumen y sombra | `#148c8c`, `#145050` |
| Contorno | `#003c3c`, `#002828` (turquesa casi negro) |

Transmite calle, energía y barrio. Funciona grande; a 33×22 px (login) y 42×28 px (sidebar) el
relieve y las gotas se pierden y queda una mancha turquesa.

### Avatar de referencia

Una figura 3D en cuatro vistas (frente, tres cuartos, perfil, espalda): pelo con degradado
(fade) y barba perfilada, chaqueta de cuero coñac con puños de rayas y un monograma bordado,
camiseta blanca, pantalón negro, zapatillas blancas y negras, sobre fondo de estudio gris claro.
En el repo solo está el recorte de la cara, `docs/brand/assets/avatar-cara.png`; la hoja
completa no se sube porque las zapatillas llevan el logo de Nike.

| Papel | Color aproximado |
|---|---|
| Cuero, tono medio | `#8a5a3c` |
| Cuero, sombra | `#5a351e` |
| Rayas del puño, bordado | `#b8a08a` |
| Camiseta (blanco roto) | `#e8e6e3` |
| Pantalón, pelo | `#0f0e0c` (negro cálido) |
| Piel | `#dab49d` |
| Fondo de estudio | `#e0dfdf` |

Transmite oficio, cercanía y cuidado: un barbero de barrio con estilo, no una marca
corporativa. El material (cuero, algodón), la luz suave de estudio y las formas redondeadas
de figura coleccionable son tan identitarios como los colores.

### Cómo encajan

- **Turquesa y coñac son casi complementarios** (verde azulado frente a naranja tostado).
  Juntos dan contraste sin pelearse si uno domina y el otro acentúa.
- **Ambos comparten el negro profundo** (`#002828` en el logo, `#0f0e0c` en el avatar): sirve
  de tinta común.
- **Choque de registro:** el logo es graffiti brillante y agresivo; el avatar es cálido,
  mate y amable. La identidad tiene que decidir cuál manda y en qué contexto.

## Papel propuesto para cada activo

| Activo | Dónde | Por qué |
|---|---|---|
| Logo BN | landing, login, sidebar, splash | es el nombre; a tamaño pequeño necesita una versión simplificada (plana, sin gotas) |
| Avatar | cara del asistente de voz y del chat de la app, estados vacíos, onboarding | la landing vende "Tu barbería contesta": el asistente necesita cara, y el avatar ya tiene el oficio (fade, barba) |
| Icono de la app | `apps/mobile/assets/icon.png` | hoy es el de Expo por defecto; debe salir del logo simplificado o del avatar |

## Lo que dice el producto

- Público: dueños y equipos de barberías y peluquerías, en el día a día y desde el móvil.
- Promesa de la landing: "Tu barbería contesta, publica y cobra"; "Tú no sueltas la máquina".
- Consecuencia visual: legible de un vistazo con las manos ocupadas, con carácter de barbería
  (no de SaaS genérico) y coherente entre la web del ordenador y la app del móvil.

## Direcciones visuales

Tres propuestas que se prueban sobre la agenda web y el chat móvil antes de elegir. Cada una
fija qué color domina, cuál acentúa, la pareja tipográfica y la forma.

1. **Taller.** Base clara cálida (blanco roto del avatar), tinta negra, coñac como color
   principal y turquesa BN como acento puntual. Tipografía con serifa para titulares y sans
   para datos. Barbería clásica, oficio.
2. **Noche de barrio.** Evolución del tema oscuro actual: negro cálido en lugar del azul
   noche, turquesa BN como principal y coñac como acento cálido. Titulares condensados y
   rotundos que recogen el graffiti del logo. Calle, energía.
3. **Figura.** El estudio del render del avatar: gris claro de fondo, superficies redondeadas
   con sombra suave y relieve, negro y blanco para la estructura, coñac para la acción y
   turquesa solo en el logo. Cercana y táctil.

**Elegidas por el product owner (2026-10-29):** *Noche de barrio* para el modo oscuro, que es
el modo por defecto, y *Taller* para el modo claro. Comparten estructura, tipografía (la de
Noche de barrio) y forma; cambia la paleta. Están escritas en [`/DESIGN.md`](../../DESIGN.md)
(tokens + razones), que es lo que leen los agentes antes de generar UI.

## Cómo se usan los agentes para mantener la identidad

- **Tokens, no prosa.** "Usa los colores de marca" en un `CLAUDE.md` no basta: el agente vuelve
  a sus valores por defecto. La identidad va en `DESIGN.md` como tokens legibles por máquina
  (formato abierto de Google, `npx @google/design.md lint DESIGN.md`) con su porqué al lado,
  y el código consume los mismos tokens.
- **Dirección explícita.** Un color dominante con acento, una pareja tipográfica con contraste
  y una estética con nombre. Lo que no se hace (fuentes genéricas, degradados morados, valores
  sueltos) se escribe también.
- **Referencia visual y verificación.** El avatar es la referencia concreta. Tras cada cambio
  de UI, capturas (navegador en web, Maestro en móvil) comparadas con `DESIGN.md`.

## Pendiente

- **Avatar.** Permiso de uso confirmado por el product owner (2026-10-29). Solo se usan
  recortes sin las zapatillas, que llevan el logo de Nike.
- **Logo.** Resuelto en #129: el graffiti se queda para tamaños grandes y la landing, y
  hay un logo plano (`assets/logo-plano.svg`, letras de Big Shoulders Black) para el
  sidebar, el login, el icono de la app, el splash y el favicon.

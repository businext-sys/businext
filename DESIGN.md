---
version: alpha
name: Businext
description: Identidad visual de Businext para apps/web y apps/mobile. Oscuro "Noche de barrio" por defecto y claro "Taller".
colors:
  background: "#0F0E0C"
  surface: "#1C1A17"
  surface-raised: "#2A2621"
  sidebar: "#171513"
  border: "#3A3530"
  foreground: "#F4F1EC"
  foreground-muted: "#B5ABA0"
  primary: "#41D9D6"
  primary-hover: "#7FE8E5"
  primary-foreground: "#0F0E0C"
  accent: "#D08B5B"
  success: "#34D399"
  danger: "#F4574B"
  warning: "#F5A623"
  light-background: "#F4F1EC"
  light-surface: "#FBF9F6"
  light-surface-raised: "#EFE3D8"
  light-sidebar: "#F4F1EC"
  light-border: "#E2DBD2"
  light-border-strong: "#CFC5B9"
  light-foreground: "#14110E"
  light-foreground-muted: "#5E554D"
  light-primary: "#8A5A3C"
  light-primary-hover: "#74492F"
  light-primary-foreground: "#FBF9F6"
  light-accent: "#0E6E6E"
  light-accent-soft: "#DCEDEC"
  light-accent-soft-foreground: "#0B4F4F"
  light-success: "#1F7A4D"
  light-danger: "#B3261E"
  light-warning: "#8A5A00"
typography:
  display:
    fontFamily: Big Shoulders Display
    fontSize: 4rem
    fontWeight: 900
    lineHeight: 0.95
  h1:
    fontFamily: Big Shoulders Display
    fontSize: 2.75rem
    fontWeight: 800
    lineHeight: 1
  h2:
    fontFamily: Big Shoulders Display
    fontSize: 1.625rem
    fontWeight: 800
    lineHeight: 1.1
  metric:
    fontFamily: Big Shoulders Display
    fontSize: 2.75rem
    fontWeight: 800
    lineHeight: 1
  body-md:
    fontFamily: DM Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: DM Sans
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: DM Sans
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.4
  eyebrow:
    fontFamily: DM Sans
    fontSize: 0.8125rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.1em
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  bubble: 14px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 40px
  touch: 44px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: 44px
    padding: 0 20px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    height: 44px
    padding: 0 18px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 16px
  chat-bubble-user:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.bubble}"
    padding: 12px 14px
  chat-bubble-assistant:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.bubble}"
    padding: 12px 14px
  avatar-assistant:
    rounded: "{rounded.full}"
    size: 48px
  button-primary-light:
    backgroundColor: "{colors.light-primary}"
    textColor: "{colors.light-primary-foreground}"
    rounded: "{rounded.md}"
    height: 44px
    padding: 0 20px
  button-primary-light-hover:
    backgroundColor: "{colors.light-primary-hover}"
  card-light:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-foreground}"
    rounded: "{rounded.lg}"
    padding: 16px
---

# Businext

Fuente de la identidad visual de `apps/web` y `apps/mobile`. Todo agente o persona que genere o
cambie UI lee este fichero antes de escribir código y no usa valores fuera de estos tokens. El
porqué de cada decisión está en [`docs/brand/analisis.md`](docs/brand/analisis.md).

## Overview

Businext es la herramienta del día a día de una barbería: el dueño la mira de reojo entre corte
y corte. La identidad sale de dos activos:

- **El logo BN** (`apps/web/public/logo-bn.png`): graffiti turquesa. Calle, energía.
- **El avatar** (`docs/brand/assets/avatar-cara.png`): un barbero en figura 3D con chaqueta de
  cuero coñac. Oficio, cercanía. Es la cara del asistente de voz y del chat.

Dos modos con la misma estructura, tipografía y forma; cambia la paleta:

- **Oscuro, "Noche de barrio" (por defecto).** Negro cálido, turquesa BN como color de acción
  y coñac de acento. Titulares condensados y rotundos.
- **Claro, "Taller".** Blanco roto, tinta negra, coñac como color de acción y turquesa oscuro
  de acento. La misma barbería con la luz encendida.

## Colors

Los tokens sin prefijo son el modo oscuro; los `light-*` son su equivalente en modo claro, con
el mismo papel. Todos los pares de texto pasan WCAG AA (4.5:1) sobre su fondo.

- **Background / surface / surface-raised:** tres alturas de negro cálido (nunca azul noche).
  En claro, blanco roto, blanco de papel y un tinte coñac para lo destacado.
- **Primary:** la acción principal. Turquesa del logo en oscuro (con texto negro encima);
  coñac del cuero en claro (con texto blanco roto). Una sola acción primaria por vista.
- **Accent:** el otro color de la marca, siempre en poca superficie: etiquetas, fechas, datos
  destacados. Coñac en oscuro, turquesa oscuro en claro.
- **Lo que hace el asistente** (citas reservadas por él, sus métricas) se marca con el
  turquesa: relleno `primary` en oscuro, `light-accent-soft` en claro.
- **Success, danger, warning:** solo para estado; nunca decorativos.

## Typography

- **Big Shoulders Display** (800–900) para titulares, nombres de sección y cifras. En
  mayúsculas en los titulares grandes. Recoge el carácter del graffiti sin imitarlo.
- **DM Sans** (400, 500, 700) para todo lo demás: texto, etiquetas, botones, formularios.
- `eyebrow`: la línea pequeña en mayúsculas sobre un título (fecha, contexto), en color
  `accent`.
- Las cifras grandes (`metric`) van en Big Shoulders: se leen de un vistazo.

## Layout

- Escala de 4 px (`spacing`). Márgenes de página: 40 px en escritorio, 20 px en móvil.
- Web: menú lateral de 220–240 px que se apila arriba en móvil; contenido fluido.
- Rejillas con `auto-fit` y mínimo de 200 px por columna, para que la agenda por barbero se
  apile en pantallas estrechas.
- Toda zona táctil mide al menos 44 px (`spacing.touch`).

## Elevation & Depth

- Oscuro: la profundidad se marca con las alturas de color (`background` → `surface` →
  `surface-raised`), sin sombras.
- Claro: bordes de 1 px (`light-border`) sobre `light-surface`; sombras mínimas o ninguna.

## Shapes

- Radios cortos: `sm` (6 px) para botones e inputs, `md` (8 px) para tarjetas en oscuro y `lg`
  (12 px) en claro, `bubble` (14 px) para el chat, `full` para avatar y chips.
- Las burbujas del chat llevan la esquina del lado del emisor a 4 px.

## Components

- **Botón primario / secundario:** primario relleno de `primary`; secundario transparente con
  borde `border`. Altura 44 px.
- **Tarjeta:** `surface` sobre `background`, sin borde en oscuro; con borde en claro.
- **Cita en la agenda:** bloque relleno, sin borde lateral de color. Hora en negrita encima
  del servicio. Libre = transparente con texto `foreground-muted`.
- **Chat:** cabecera con el avatar del asistente (48 px, borde de 2 px en `primary`) y su
  estado. Las tarjetas dentro del chat (una cita reservada) usan `eyebrow` + `h2` + acciones.
- **Logo:** a menos de 64 px de ancho necesita una versión plana sin gotas (pendiente).

## Do's and Don'ts

- Usa los tokens: nada de hex, `rgba()` ni clases de la paleta por defecto de Tailwind escritas
  a mano en `apps/`.
- Usa el avatar solo como cara del asistente (chat, voz, estados vacíos, onboarding), nunca
  como decoración. Solo recortes sin las zapatillas.
- No mezcles los dos modos en una pantalla ni cambies de tipografía entre modos.
- No uses degradados de fondo, sombras de color ni brillos: la energía la ponen el turquesa y
  la tipografía.
- No uses Inter, Roboto ni la fuente del sistema como fuente de marca.
- Tras cambiar UI, haz capturas (navegador en web, Maestro en móvil) en los dos modos y
  compáralas con este fichero antes de dar el cambio por bueno.

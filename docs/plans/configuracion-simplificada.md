# Configuración simplificada

- **Fecha:** 2026-11-26
- **Rama:** `feat/config-simple`
- **Por qué:** «siento que ahora la configuración en Businext es extensa, dispersa y complicada,
  creo que se pueden crear menos apartados y hacerlos más fácil y entendible».

## 1. Mapa de antes

### Web (`apps/web`)

La página `/configuration` tenía **10 apartados** en un menú lateral, y había ajustes en otras
tres páginas. «Clics» cuenta desde cualquier pantalla de la app: entrar en Configuración en el
menú (1) + elegir el apartado (1) + lo que haga falta dentro.

| # | Dónde | Qué configura | Quién | Pantallas · clics |
|---|-------|---------------|-------|-------------------|
| 1 | Configuración › Mi perfil | Nada: nombre, email y teléfono de solo lectura | todos | 1 · 2 |
| 2 | Configuración › Negocio | Nombre, teléfono y email del negocio. **Aquí estaba también «Cancelar suscripción»** | owner edita, resto lee | 1 · 2 + guardar |
| 3 | Configuración › Locales | Alta, edición y baja de locales (nombre, teléfono, dirección, enlace de Maps) | owner | 1 · 3–4 por local |
| 4 | Configuración › Productos | Catálogo de servicios y productos (modal) **y comisiones del equipo** | `canManageProducts`; comisiones owner | 1 + modal · 4 por alta |
| 5 | Configuración › Horario | Horario general del negocio por día | owner | 1 · 2 + editar |
| 6 | Configuración › Equipo | Análisis del equipo, invitar (formulario siempre abierto), rol / estado / local por persona, horario de cada uno (modal) | `canManageTeam` | 1 + modal · 4 para el horario de alguien |
| 7 | Configuración › Reserva online | Enlace, vista previa en iframe y QR | owner | 1 · 2 |
| 8 | Configuración › Recordatorios | Recordatorio por email el día antes (sí/no) | owner, manager | 1 · 3 |
| 9 | Configuración › Contenido y redes | Radar de tendencias: activar, redes, ideas al día, horas sin avisos, tipo de negocio, zona horaria, idioma, país (9 campos a la vista) | `canViewTrends` | 1 · 2 + 9 campos |
| 10 | Configuración › Apariencia | Modo oscuro / claro (en este navegador) | todos | 1 · 3 |
| 11 | Agente de voz › pestaña Configuración | Número asignado, activar el agente, modo de reserva (solicitud / confirmar) | owner | otra página · 3 |
| 12 | Reseñas | Enlace de la ficha de Google Maps (solo se pide la primera vez) | `canManageReviews` | otra página · 2 |
| 13 | Tendencias | Enlace a «Contenido y redes» | `canViewTrends` | otra página · 3 |
| — | `/products` | Redirigía a `/configuration` (sin apartado) | — | — |
| — | `/payment` | Alta de la suscripción (Stripe); a ella lleva el middleware si no hay suscripción | owner | — |
| — | Notificaciones | No es configuración: bandeja de solicitudes e ideas | — | — |

Problemas:

- **Demasiados apartados al mismo nivel** (10) y con nombres técnicos («Reserva online»,
  «Contenido y redes», «Mi perfil» sin nada que cambiar).
- **Cosas en el sitio equivocado:** las comisiones (del equipo) dentro de Productos; cancelar la
  suscripción dentro del formulario del negocio; los ajustes del agente de voz en una pestaña de
  otra página.
- **Todo a la vista:** 9 campos del radar de tendencias, el formulario de invitar siempre abierto,
  una vista previa en iframe que carga al entrar.
- **Bug:** guardar los datos del negocio mandaba las comisiones a `null`
  (`mapConfigurationToApi` envía `commission_* ?? null` y el backend aplica `exclude_unset`).

### Móvil (`apps/mobile`)

Una sola pantalla de **Ajustes** (pestaña) con filas: Clientes, Clientes en riesgo, Compartir
enlace de reservas, Notificaciones (push: activar, minutos de aviso, hora del resumen), Agente de
voz (owner: número y llamar), Apariencia, Política de privacidad, Cerrar sesión y Borrar cuenta.
Las preferencias del radar están aparte, en Tendencias › Preferencias (`/trends/settings`).
Ya es corta y no comparte estructura con la web: casi todo lo que se configura en web (negocio,
locales, catálogo, horario, equipo, comisiones, recordatorios) no existe en móvil.

## 2. Propuesta (implementada en web)

**Seis apartados** con nombres de la barbería, no del sistema. Cada apartado es una página de
tarjetas; cada tarjeta dice en una línea para qué sirve. Lo que casi nadie toca va plegado en
**«Más opciones»** (divulgación progresiva). Los valores por defecto no cambian (10 sellos,
«Corte gratis», modo oscuro, recordatorios como estén).

| Apartado | Tarjetas | Plegado en «Más opciones» |
|----------|----------|---------------------------|
| **Tu negocio** | Datos del negocio · Locales | — |
| **Equipo y horarios** | Horario del negocio · Tu equipo (con el horario de cada uno) · Comisiones | Invitar (se abre con «Invitar a alguien») · «Ver cómo rinde el equipo» |
| **Servicios y productos** | Catálogo | — |
| **Reservas y clientes** | Tu enlace de reservas · Recordatorios · **Tarjeta de fidelidad** | QR y vista previa del enlace · colores del texto del pase |
| **Asistente y redes** | Agente de voz · Ideas para tus redes · Reseñas de Google (enlace) | Ideas al día, horas sin avisos, tipo de negocio, zona horaria, idioma y país |
| **Cuenta y plan** | Tus datos · Apariencia · Suscripción | Cancelar la suscripción |

Reglas:

- **Mismos permisos que antes**, bloque a bloque (`canSeeSettingsBlock`): un empleado ve «Tu
  negocio» (solo lectura) y «Cuenta y plan» sin suscripción; un manager ve además recordatorios y
  fidelidad (solo lectura), y equipo, catálogo, ideas y reseñas según sus capacidades. Un
  apartado sin bloques visibles no sale.
- **Nada se borra ni cambia de endpoint.** Las tarjetas son los mismos componentes y hooks.
- **Enlaces de antes:** `/configuration?section=<antiguo>` abre el apartado nuevo y baja hasta su
  tarjeta (`LEGACY_SETTINGS_SECTIONS` y `LEGACY_SETTINGS_BLOCKS`). `/products` va a «Servicios y
  productos». La página del agente de voz conserva Resumen y Llamadas y enlaza a «Ajustes del
  agente». «Preferencias» de Tendencias abre «Asistente y redes».
- Las anclas son `#bloque-<id>` (p. ej. `/configuration?section=asistente#bloque-voiceAgent`).

### Fidelidad (en «Reservas y clientes»)

Interruptor (se guarda al pulsarlo), sellos para el premio (1–50, 10 por defecto), premio
(≤ 40 letras), color de la tarjeta, colores del texto plegados y una vista aproximada del pase.
Recuerda las decisiones del 26-11: solo cuentan las visitas desde que se activa, los sellos no
caducan, el pase llega en el email de confirmación y cualquiera del equipo entrega el premio.
Usa `useLoyaltyProgram` de `@businext/shared-core` (rama `feat/loyalty-web`) y `PUT
/loyalty/program` del backend (`feat/loyalty-wallet`). El manager la ve en solo lectura.

### Dónde vive

- Mapa y permisos: `packages/shared-core/src/services/settingsSections.ts` (puro, con tests en
  `tests/services/settingsSections.test.ts`), para que móvil lo reutilice.
- Página: `apps/web/src/app/configuration/page.tsx`; apartados en
  `apps/web/src/components/configuration/sections/`; tarjeta, «Más opciones» y fila de ajuste en
  `SettingsCard.tsx`; interruptor en `components/ui/switch.tsx`.

## 3. Móvil (implementado)

Solo cambia la pantalla de **Ajustes** (`apps/mobile/app/(tabs)/settings.tsx`): mismas filas y
secciones que antes, agrupadas con `SETTINGS_SECTIONS` y filtradas con `canSeeSettingsBlock` de
shared-core. No se ha reescrito ninguna pantalla ni componente.

| Apartado | En el móvil |
|----------|-------------|
| Tu negocio | «Datos del negocio y locales» → abre la web en `?section=negocio` (owner) |
| Equipo y horarios | «Horarios, equipo y comisiones» → web `?section=equipo` |
| Servicios y productos | «Servicios y productos» → web `?section=servicios` |
| Reservas y clientes | Clientes, Escanear tarjeta (con la fidelidad activa), Clientes en riesgo, Compartir enlace de reservas y «Recordatorios y tarjeta de fidelidad» → web `?section=reservas` |
| Asistente y redes | Agente de voz (owner, la sección que ya había) · «Ideas para tus redes» → `/trends/settings` · «Reseñas de Google» → web `/reviews` |
| Cuenta y plan | Notificaciones · Apariencia · Política de privacidad · Cerrar sesión (y Borrar cuenta al final) |

- Clientes y Escanear tarjeta siguen visibles para los empleados, como antes: un apartado sale si
  tiene alguna fila, aunque el empleado no vea sus bloques de la web.
- Lo que aún no tiene pantalla móvil (negocio, horarios, equipo, catálogo, recordatorios, ajustes
  de la tarjeta) se abre en la web, en su apartado. Siguiente paso, si se quiere: pantallas
  nativas para la tarjeta de fidelidad y los recordatorios con `useLoyaltyProgram` y
  `useRemindersSetting`, que ya están en shared-core.
- `apps/mobile` no tiene configuración de ESLint versionada: `expo lint` la instala la primera
  vez. Se pasó con esa configuración temporal (sin errores) y se deshizo para no meter
  dependencias en este cambio.

## 4. Capturas

**Pendientes.** La configuración exige sesión iniciada y no había nadie para iniciarla
(los agentes no escriben contraseñas). Para hacerlas: inicia sesión en `http://localhost:3000`
(`main`, antes) — la cookie vale también para `:3100` (esta rama, `pnpm dev:web -- -p 3100`) — y
guarda en `docs/plans/capturas-configuracion/`, en modo oscuro y claro:

| Antes (`:3000`) | Después (`:3100`) |
|-----------------|-------------------|
| `antes-negocio.png` — `/configuration?section=business` | `despues-negocio.png` — `?section=negocio` |
| `antes-productos.png` — `?section=products` (comisiones arriba) | `despues-equipo.png` — `?section=equipo` (comisiones aquí) |
| `antes-reserva-online.png` — `?section=booking` | `despues-reservas.png` — `?section=reservas` (con la tarjeta de fidelidad abierta) |
| `antes-contenido.png` — `?section=content` (9 campos) | `despues-asistente.png` — `?section=asistente` (con «Más opciones» plegado) |
| `antes-agente-voz.png` — `/voice-agent`, pestaña Configuración | `despues-cuenta.png` — `?section=cuenta` |
| `antes-empleado.png` — la misma página con un usuario empleado | `despues-empleado.png` — ídem |
| `antes-movil-ajustes.png` — pestaña Ajustes en `main` (Maestro o simulador) | `despues-movil-ajustes.png` — ídem en esta rama, owner y empleado |

Revisar también que `?section=content` en `:3100` abre «Asistente y redes» y baja a «Ideas para
tus redes».

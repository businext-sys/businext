# Plan: agente de llamadas con IA

> Estado: **propuesta**, nada implementado. La landing lo anuncia como
> "Nuevo · Próximamente" (capítulo 03). Fecha: 14-oct-2026.

## Qué es

Un agente de voz que contesta el teléfono de la barbería cuando el barbero no
puede: consulta huecos, crea la reserva, responde dudas (precios, horario,
dirección) y avisa al barbero con un resumen. Mismo resultado que una reserva
por enlace o QR, pero por teléfono.

## Piezas

| Pieza | Propuesta |
|---|---|
| Número | Número propio por barbería en un proveedor de telefonía (Twilio, Vonage o Telnyx), o desvío del número actual cuando no contesta. |
| Voz | Plataforma de agentes de voz (p. ej. ElevenLabs Agents, Vapi, Retell) o pipeline propio: voz a texto en streaming → LLM con herramientas → texto a voz. Se decide en el spike por latencia, calidad en español y coste por minuto. |
| Cerebro | LLM con herramientas que llaman a la API de Businext: `get_available_slots` (ya existe `availability_service.py`), `create_booking_request`, `get_business_info`. Nunca inventa huecos ni precios: si la herramienta no responde, toma el recado. |
| Backend (`businext-backend`) | Webhook del proveedor, tabla `call_log` (número enmascarado, duración, resultado, resumen, transcripción con retención limitada) y la reserva creada como `BookingRequest`, para que pase por el mismo flujo de aceptar/rechazar. |
| Web y móvil | Sección "Llamadas" en Notificaciones: resultado y resumen de cada llamada. Push al crear una reserva o dejar un recado (reutiliza Expo Push). Ajustes: horario del agente, saludo, desvío a humano. |

## Fases

1. **Spike (3-4 días):** dos plataformas de voz con una barbería de prueba;
   medir latencia de respuesta, tasa de reservas correctas y € por minuto.
2. **Recados:** el agente contesta, toma nombre y motivo y avisa. Sin acceso a
   la agenda.
3. **Reservas:** herramientas de disponibilidad y creación de `BookingRequest`.
4. **Ajustes y métricas:** configuración por negocio, llamadas atendidas,
   reservas creadas y minutos consumidos.

## Riesgos y decisiones abiertas

- **Coste por minuto** frente a 70 €/mes de suscripción: definir minutos
  incluidos y qué pasa al superarlos.
- **Legal (RGPD):** aviso al inicio de que contesta un asistente automático,
  consentimiento para grabar o transcribir, y retención corta.
- **Calidad en español** con ruido de barbería (secadores, música): validar en
  el spike con audio real.
- **Desvío a humano** siempre disponible ("pulse 1 / diga 'hablar con el
  barbero'").

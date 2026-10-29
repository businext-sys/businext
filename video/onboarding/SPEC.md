GOAL:    quien acaba de entrar en Businext sabe qué hace cada sección del menú y en qué orden las usará en un día normal.
OUTPUT:  HyperFrames, 1920 x 1080, 30 fps
TIME:    ~70 s x 30 = ~2100 frames. Sin música (no hay fuente de música en este entorno): efectos de UI en cada acción visible.
LOOK:    DESIGN.md, modo oscuro "Noche de barrio". Fondo #0F0E0C, superficies #1C1A17 / #2A2621, borde #24211D.
         Tinta #F4F1EC, apagada #D6CEC5. Acción primaria #41D9D6 (texto #0F0E0C encima), coñac #D08B5B para eyebrows y datos.
         Accent #12302F con #F4F1EC: solo lo que hace el asistente. Éxito #34D399. Sin degradados, sombras de color ni brillos.
         Titulares Big Shoulders 900 en mayúsculas, 96-120 px, tracking 0. Texto DM Sans 400/500/700.
         Medio: la propia interfaz de la app (escala 1.5 sobre la UI web) + las fotos 3D de /landing como mundo exterior.
         Profundidad solo por alturas de color, sin sombras (salvo el cursor: sombra 0 4px 10px 35%).
OBJECTS: el menú lateral real (logo plano BN, 7 entradas con iconos lucide, entrada activa rellena de turquesa);
         un cursor de flecha blanco con borde negro; la tarjeta de llamada, la cita de Carlos, el modal de completar,
         la caja del día, la tarjeta de reseña y el resumen semanal, cada uno con los textos reales de la app.
         Dato que viaja: "Carlos Ruiz · Corte + barba · 10:30 · 25 €" (ilustrativo).
MOTION:  entradas expo.out 0.5-0.7 s; cámara power2.inOut 0.9-1.2 s; salidas power3.in 0.3 s.
         Cursor: power3.inOut 0.6-0.8 s por desplazamiento, clic = escala 0.85 en 0.08 s y vuelta en 0.12 s.
         Títulos: palabra a palabra con blur 6 px -> 0 en 0.13 s, 0.08 s entre palabras; quietos al aterrizar.
SHOTS:
  0-5.5    foto stop1 (barbería de mañana) a pantalla completa, push lento 1.0->1.06. "9:00. SUENA EL TELÉFONO."
           Tarjeta "Llamada atendida" sale del móvil de la mesa. Zoom a través de la tarjeta -> app.
  5.5-15   AGENTE DE VOZ: la app entra con la entrada activa. Lista de llamadas, la de Carlos arriba; el cursor la abre:
           el detalle muestra resumen y "Reserva creada". Línea: "EL AGENTE DE VOZ CONTESTA POR TI".
  15-27    RESERVAS: clic en el menú; la agenda de hoy con la cita de Carlos en superficie accent (la creó el asistente).
           Clic -> modal de completar: método de pago, "Completar". Línea: "TU AGENDA DEL DÍA, EN UN VISTAZO".
  27-36    FINANZAS: clic; la caja del día sube 25 € en contador; el movimiento de Carlos entra arriba.
           Línea: "LO COBRADO ENTRA EN CAJA".
  36-47    RESEÑAS: aviso "Nueva reseña"; clic; tarjeta 5 estrellas de Carlos; "Responder con IA" escribe la respuesta;
           clic en publicar. Línea: "RESPONDE TUS RESEÑAS CON IA".
  47-56    INTELIGENCIA: clic; resumen semanal, cifras que aterrizan. Línea: "CADA SEMANA, CÓMO CRECES".
  56-64    EL MENÚ: la cámara se aleja hasta el menú entero; Notificaciones y Configuración se nombran una a una.
           Línea: "TODO EMPIEZA EN EL MENÚ".
  64-70    CIERRE: el logo graffiti BN entra con peso; "YA SABES MOVERTE POR BUSINEXT". Se mantiene 2.5 s.
BANNED:  vacío oscuro con UI pequeña flotando; brillos, partículas, degradados; tres tarjetas en fila; títulos que se mueven
         después de aterrizar; anillos de clic; logo en una esquina; todo entrando con fade y subida.
QA:      2.0 (gancho legible), 9.0 (detalle de llamada), 20.0 (cita accent), 24.0 (modal), 31.0 (caja), 42.0 (respuesta IA),
         51.0 (resumen), 60.0 (menú completo), 68.0 (cierre).

import type { Metadata } from "next";
import { CONTACT_EMAIL, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos trata Businext, para qué y cómo ejercer tus derechos.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidad" updated="12 de noviembre de 2026">
      <p>
        Esta política explica qué datos personales trata Businext en su web y en su app móvil, para
        qué los usa y qué derechos tienes. Se aplica el Reglamento General de Protección de Datos
        (RGPD) y la normativa española de protección de datos.
      </p>

      <h2>Responsable</h2>
      <p>
        Businext, con sede en Madrid (España). Contacto para cualquier cuestión de privacidad:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Qué datos tratamos</h2>
      <ul>
        <li>
          <strong>Cuenta:</strong> nombre, email, teléfono y contraseña (cifrada) de los dueños y
          empleados de cada negocio.
        </li>
        <li>
          <strong>Datos del negocio:</strong> reservas, servicios, productos, horarios, ubicaciones,
          finanzas y configuración.
        </li>
        <li>
          <strong>Clientes del negocio:</strong> nombre, teléfono, email e historial de citas de las
          personas que reservan en un negocio que usa Businext.
        </li>
        <li>
          <strong>Asistente y agente de voz:</strong> los mensajes que escribes al asistente y las
          llamadas que atiende el agente de voz del negocio, con su grabación y su transcripción.
        </li>
        <li>
          <strong>App móvil:</strong> el identificador del dispositivo para enviarte notificaciones.
          La app no usa la ubicación, la cámara ni los contactos.
        </li>
        <li>
          <strong>Pago:</strong> el estado de la suscripción. Los datos de la tarjeta los trata
          Stripe; Businext no los ve ni los guarda.
        </li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Prestar el servicio: gestionar reservas, el equipo, las finanzas y las comunicaciones del negocio (ejecución del contrato).</li>
        <li>Enviar avisos y notificaciones de la app y recordatorios de cita (ejecución del contrato).</li>
        <li>Cobrar la suscripción (ejecución del contrato y obligaciones legales).</li>
        <li>Mantener la seguridad y corregir errores (interés legítimo).</li>
      </ul>
      <p>
        No vendemos datos ni los usamos para publicidad. No hay seguimiento entre apps ni entre
        sitios web de terceros.
      </p>
      <p>
        Respecto a los datos de sus clientes, cada negocio es el responsable y Businext actúa como
        encargado del tratamiento: solo los trata para prestarle el servicio.
      </p>

      <h2>Con quién se comparten</h2>
      <p>Solo con los proveedores necesarios para prestar el servicio, que actúan como encargados:</p>
      <ul>
        <li>Supabase (base de datos y acceso), Render y Vercel (alojamiento).</li>
        <li>Stripe (pagos).</li>
        <li>Anthropic y OpenAI (respuestas del asistente).</li>
        <li>Retell y Twilio (agente de voz y llamadas).</li>
        <li>Resend (emails).</li>
        <li>Expo (envío de notificaciones a la app).</li>
        <li>Google (reseñas del negocio, si lo conectas).</li>
      </ul>
      <p>
        Algunos están fuera del Espacio Económico Europeo; en ese caso la transferencia se ampara en
        las cláusulas contractuales tipo de la Comisión Europea o en el Marco de Privacidad de Datos
        UE-EE. UU.
      </p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>
        Mientras la cuenta esté activa. Al borrarla se eliminan sus datos, salvo los que la ley nos
        obligue a conservar (por ejemplo, los de facturación).
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes acceder a tus datos, rectificarlos, borrarlos, oponerte a su tratamiento, limitarlo y
        pedir su portabilidad escribiendo a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        Para borrar tu cuenta, sigue <a href="/eliminar-cuenta">estos pasos</a>. Si crees que no
        hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de
        Datos (aepd.es).
      </p>

      <h2>Menores</h2>
      <p>Businext es una herramienta para negocios y no está dirigida a menores de 16 años.</p>

      <h2>Cambios</h2>
      <p>
        Si cambiamos esta política, actualizaremos la fecha de arriba y, si el cambio es importante,
        te avisaremos por email o en la app.
      </p>
    </LegalPage>
  );
}

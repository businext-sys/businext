import type { Metadata } from "next";
import { CONTACT_EMAIL, LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Borrar tu cuenta",
  description: "Cómo borrar tu cuenta de Businext y qué datos se eliminan.",
};

export default function DeleteAccountPage() {
  return (
    <LegalPage title="Borrar tu cuenta" updated="12 de noviembre de 2026">
      <h2>Desde la app</h2>
      <p>
        Abre la app de Businext, entra en <strong>Ajustes</strong> y pulsa{" "}
        <strong>Borrar cuenta</strong>. Al confirmar, la cuenta se borra en el momento.
      </p>

      <h2>Por email</h2>
      <p>
        Si no puedes usar la app, escribe a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
        desde el email de tu cuenta con el asunto «Borrar mi cuenta». La borramos en un máximo de
        30 días y te confirmamos cuando esté hecho.
      </p>

      <h2>Qué se borra</h2>
      <ul>
        <li>
          <strong>Si eres el dueño del negocio:</strong> se cancela la suscripción y se borran tu
          usuario, el negocio y todos sus datos: reservas, clientes, servicios, productos, finanzas,
          equipo, conversaciones con el asistente y llamadas del agente de voz. Tus empleados pierden
          el acceso.
        </li>
        <li>
          <strong>Si eres empleado o encargado:</strong> se borran tu usuario, tu acceso al negocio,
          tus conversaciones con el asistente y tus notificaciones. Los datos del negocio se quedan.
        </li>
      </ul>
      <p>
        Solo conservamos lo que la ley nos obligue a guardar, como los datos de facturación, durante
        el plazo que marque.
      </p>
    </LegalPage>
  );
}

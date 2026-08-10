import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useAccessContext } from "@businext/shared-core/hooks";
import { pushTokenApi } from "@businext/shared-core/api";
import { registerForPushNotificationsAsync } from "@/lib/pushNotifications";

export type PushRegistrationState =
  | { status: "idle" | "registering" | "granted" }
  | { status: "denied" | "unavailable"; message: string };

/**
 * Registra el dispositivo para notificaciones push apenas hay un usuario
 * autenticado, y maneja el deep link al tocar una notificacion (issue
 * #031).
 *
 * Devuelve el estado del registro para que la UI pueda mostrar un
 * mensaje explicativo si el usuario rechazo el permiso (criterio de
 * aceptacion explicito de la issue).
 */
export function usePushRegistration(): PushRegistrationState {
  const { context } = useAccessContext();
  const router = useRouter();
  const registeredRef = useRef(false);
  const [state, setState] = useState<PushRegistrationState>({ status: "idle" });

  // Registro del token en el backend.
  useEffect(() => {
    if (!context || registeredRef.current) return;
    registeredRef.current = true;
    setState({ status: "registering" });

    registerForPushNotificationsAsync().then((result) => {
      if (result.ok) {
        pushTokenApi.register(context.userId, result.token).catch(() => {
          // Best-effort: si falla el registro en el backend (red, backend
          // caido), se reintenta en el proximo montaje de la app.
          registeredRef.current = false;
        });
        setState({ status: "granted" });
        return;
      }

      registeredRef.current = result.reason !== "permission-denied";

      if (result.reason === "permission-denied") {
        setState({ status: "denied", message: result.message });
      } else if (result.reason === "not-a-device" || result.reason === "no-project-id") {
        // No es un rechazo del usuario; no hace falta mostrar UI de error,
        // solo se registra en consola para diagnostico.
        console.warn(`[push] ${result.reason}: ${result.message}`);
        setState({ status: "unavailable", message: result.message });
      } else {
        setState({ status: "unavailable", message: result.message });
      }
    });
  }, [context]);

  // Deep link: al tocar una notificacion de nueva solicitud de reserva.
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as
          | { type?: string; bookingRequestId?: number }
          | undefined;
        if (data?.type === "booking_request") {
          // NOTA: no existe todavia una pantalla de detalle de
          // BookingRequest en mobile (solo de Reservation, ver #030) —
          // se navega a la Agenda como destino razonable mientras tanto.
          router.push("/");
        }
      }
    );
    return () => subscription.remove();
  }, [router]);

  return state;
}

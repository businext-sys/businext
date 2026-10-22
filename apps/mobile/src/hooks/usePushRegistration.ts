import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useAccessContext } from "@businext/shared-core/hooks";
import { pushTokenApi } from "@businext/shared-core/api";
import { assistantChatEnabled } from "@/lib/featureFlags";
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

  // Deep link al tocar una notificacion. `useLastNotificationResponse`
  // incluye la que abrio la app estando cerrada, no solo las recibidas con
  // la app viva.
  const lastResponse = Notifications.useLastNotificationResponse();
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !lastResponse ||
      lastResponse.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      return;
    }
    const notificationId = lastResponse.notification.request.identifier;
    if (handledRef.current === notificationId) return;
    handledRef.current = notificationId;
    Notifications.clearLastNotificationResponse();

    const data = lastResponse.notification.request.content.data as
      | { type?: string; bookingRequestId?: number; conversationId?: string }
      | undefined;
    if (assistantChatEnabled && data?.conversationId) {
      router.navigate({ pathname: "/", params: { conversation: data.conversationId } });
    } else if (data?.type === "booking_request") {
      router.navigate(
        assistantChatEnabled && data.bookingRequestId
          ? { pathname: "/", params: { bookingRequest: String(data.bookingRequestId) } }
          : "/"
      );
    }
  }, [lastResponse, router]);

  return state;
}

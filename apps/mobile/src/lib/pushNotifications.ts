import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Registro de notificaciones push (issue #031).
 *
 * Separado en dos pasos, siguiendo la recomendacion de Expo:
 * 1. Pedir permiso al usuario (puede rechazar).
 * 2. Obtener el Expo push token del dispositivo (requiere un
 *    `projectId` de EAS — ver limitacion documentada abajo).
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type PushRegistrationResult =
  | { ok: true; token: string }
  | { ok: false; reason: "not-a-device" | "permission-denied" | "no-project-id" | "error"; message: string };

/**
 * Pide permiso y obtiene el Expo push token del dispositivo.
 *
 * NOTA sobre `no-project-id` (issue #033, EAS Build, aun no configurado
 * en este repo): `getExpoPushTokenAsync` requiere el `projectId` de EAS
 * para SDKs recientes de Expo. Mientras `apps/mobile/app.config.ts` no
 * tenga `extra.eas.projectId` (se anade al correr `eas init`/`eas build`
 * por primera vez), esta funcion devuelve `no-project-id` de forma
 * controlada en vez de fallar de forma opaca.
 */
export async function registerForPushNotificationsAsync(): Promise<PushRegistrationResult> {
  if (!Device.isDevice) {
    return {
      ok: false,
      reason: "not-a-device",
      message: "Las notificaciones push requieren un dispositivo fisico (no funcionan en simulador/emulador).",
    };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return {
      ok: false,
      reason: "permission-denied",
      message: "No podras recibir avisos de nuevas solicitudes de reserva sin permitir las notificaciones. Puedes activarlas mas tarde desde los ajustes del sistema.",
    };
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
  if (!projectId) {
    return {
      ok: false,
      reason: "no-project-id",
      message: "Falta configurar el proyecto de EAS (issue #033) para poder generar el push token.",
    };
  }

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    return { ok: true, token };
  } catch (error) {
    return {
      ok: false,
      reason: "error",
      message: error instanceof Error ? error.message : "Error desconocido al obtener el push token.",
    };
  }
}

import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

/**
 * Chat del asistente como home (issue #78). Mientras este apagado, la home
 * sigue siendo la agenda; es el rollback del lanzamiento (#86).
 */
export const assistantChatEnabled = extra.assistantChatEnabled !== false;

const pilotBusinesses: string[] = extra.assistantPilotBusinesses ?? [];

/**
 * Piloto del lanzamiento (issue #86): con la lista vacia, el chat es para
 * todos los negocios; si no, solo para los de la lista.
 */
export function isAssistantChatEnabledFor(businessId: string | null | undefined): boolean {
  if (!assistantChatEnabled) return false;
  if (pilotBusinesses.length === 0) return true;
  return Boolean(businessId) && pilotBusinesses.includes(businessId as string);
}

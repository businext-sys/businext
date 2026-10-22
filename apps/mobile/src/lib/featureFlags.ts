import Constants from "expo-constants";

/**
 * Chat del asistente como home (issue #78). Mientras este apagado, la home
 * sigue siendo la agenda; es el rollback del lanzamiento (#86).
 */
export const assistantChatEnabled =
  Constants.expoConfig?.extra?.assistantChatEnabled !== false;

import type { ExpoConfig } from "expo/config";

/**
 * Configuracion dinamica de Expo para @businext/mobile (issue #27, Fase 5).
 *
 * Bundle identifiers son placeholders — deben confirmarse antes de un
 * build real distribuible (EAS, issue #33).
 */
const config: ExpoConfig = {
  name: "Businext",
  slug: "businext-mobile",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "businext",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    // Placeholder — confirmar bundle id real antes de EAS Build (#33).
    bundleIdentifier: "com.businext.mobile",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    // Placeholder — confirmar package name real antes de EAS Build (#33).
    package: "com.businext.mobile",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-notifications",
      {
        // Icono/color placeholder para notificaciones Android — ajustar
        // cuando exista un icono de marca dedicado.
        icon: "./assets/icon.png",
        color: "#111111",
      },
    ],
  ],
  extra: {
    // Punto unico de configuracion del baseURL del backend consumido por
    // @businext/shared-core (createApiClient). Ver issue #28.
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
    // Credenciales de Supabase Auth (issue #029) — mismo proyecto que usa
    // apps/web (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).
    // Publicas por diseno (anon key), no son secretas.
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    // eas.projectId se agrega automaticamente al correr `eas init`/
    // `eas build` por primera vez (issue #033, aun no hecho). Hasta
    // entonces, registerForPushNotificationsAsync() en
    // src/lib/pushNotifications.ts devuelve `no-project-id` de forma
    // controlada en vez de fallar.
  },
};

export default config;

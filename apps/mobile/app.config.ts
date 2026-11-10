import type { ExpoConfig } from "expo/config";

/**
 * Configuracion dinamica de Expo para @businext/mobile (issue #27, Fase 5).
 *
 * Bundle identifiers son placeholders — deben confirmarse antes de un
 * build real distribuible (EAS, issue #33).
 */

// projectId de expo.dev (no es secreto): fijo para que los workers de EAS lo vean.
const EAS_PROJECT_ID = "468dbb33-6433-4484-842e-41f65d74121f";

const config: ExpoConfig = {
  name: "Businext",
  slug: "businext-mobile",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "businext",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    // Placeholder — confirmar bundle id real antes de EAS Build (#33).
    bundleIdentifier: "com.businext.mobile",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0F0E0C",
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
    "expo-font",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 200,
        backgroundColor: "#0F0E0C",
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/android-icon-monochrome.png",
        color: "#41D9D6",
      },
    ],
  ],
  // runtimeVersion depende solo de `version` para que todos los builds/updates
  // sean comparables (evita el "Runtime version mismatch" de EAS Update).
  runtimeVersion: { policy: "appVersion" as const },
  updates: { url: `https://u.expo.dev/${EAS_PROJECT_ID}` },
  extra: {
    // Punto unico de configuracion del baseURL del backend consumido por
    // @businext/shared-core (createApiClient). Ver issue #28.
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
    // Credenciales de Supabase Auth (issue #029) — mismo proyecto que usa
    // apps/web (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).
    // Publicas por diseno (anon key), no son secretas.
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    eas: { projectId: EAS_PROJECT_ID },
  },
};

export default config;

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
  plugins: ["expo-router"],
  extra: {
    // Punto unico de configuracion del baseURL del backend consumido por
    // @businext/shared-core (createApiClient). Ver issue #28.
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  },
};

export default config;

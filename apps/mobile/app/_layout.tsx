import { Stack } from "expo-router";
import { bootstrapApiClient } from "@/lib/bootstrapApiClient";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGate } from "@/context/AuthGate";

// Se ejecuta una unica vez, al cargar este modulo (que Expo Router carga
// antes de montar cualquier pantalla), configurando el apiClient
// compartido de shared-core antes de que cualquier hook lo use (#028).
bootstrapApiClient();

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </AuthProvider>
  );
}

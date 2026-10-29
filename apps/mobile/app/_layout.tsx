import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { bootstrapApiClient } from "@/lib/bootstrapApiClient";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGate } from "@/context/AuthGate";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";

// Se ejecuta una unica vez, al cargar este modulo (que Expo Router carga
// antes de montar cualquier pantalla), configurando el apiClient
// compartido de shared-core antes de que cualquier hook lo use (#028).
bootstrapApiClient();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate>
          <ThemedStack />
        </AuthGate>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ThemedStack() {
  const { mode, colors } = useTheme();

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.foreground,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="reservation/[id]"
          options={{ headerShown: true, title: "Detalle de reserva" }}
        />
        <Stack.Screen name="settings" options={{ headerShown: true, title: "Ajustes" }} />
        <Stack.Screen name="conversations" options={{ headerShown: true, title: "Historial" }} />
      </Stack>
    </>
  );
}

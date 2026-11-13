import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { bootstrapApiClient } from "@/lib/bootstrapApiClient";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGate } from "@/context/AuthGate";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { fontAssets } from "@/theme/fonts";

// Se ejecuta una unica vez, al cargar este modulo (que Expo Router carga
// antes de montar cualquier pantalla), configurando el apiClient
// compartido de shared-core antes de que cualquier hook lo use (#028).
bootstrapApiClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);
  if (!fontsLoaded) return null;

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
        <Stack.Screen name="agenda" options={{ headerShown: true, title: "Agenda" }} />
        <Stack.Screen
          name="reservation/[id]"
          options={{ headerShown: true, title: "Detalle de reserva" }}
        />
        <Stack.Screen name="reservation/form" options={{ headerShown: true, title: "Nueva reserva" }} />
        <Stack.Screen name="cash/index" options={{ headerShown: true, title: "Caja" }} />
        <Stack.Screen name="cash/new" options={{ headerShown: true, title: "Nuevo movimiento" }} />
        <Stack.Screen name="settings" options={{ headerShown: true, title: "Ajustes" }} />
        <Stack.Screen name="clients-at-risk" options={{ headerShown: true, title: "Clientes en riesgo" }} />
        <Stack.Screen name="conversations" options={{ headerShown: true, title: "Historial" }} />
        <Stack.Screen name="trends/index" options={{ headerShown: true, title: "Tendencias" }} />
        <Stack.Screen name="trends/[id]" options={{ headerShown: true, title: "Idea de contenido" }} />
        <Stack.Screen name="trends/settings" options={{ headerShown: true, title: "Preferencias" }} />
      </Stack>
    </>
  );
}

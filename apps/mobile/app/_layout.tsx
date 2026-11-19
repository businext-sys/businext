import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { bootstrapApiClient } from "@/lib/bootstrapApiClient";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGate } from "@/context/AuthGate";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { fontAssets, fonts } from "@/theme/fonts";

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
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: fonts.bodyBold, fontSize: 17 },
          headerBackButtonDisplayMode: "minimal",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Inicio" }} />
        <Stack.Screen name="login" options={{ headerShown: false, title: "Entrar" }} />
        <Stack.Screen name="reservation/[id]" options={{ title: "Reserva" }} />
        <Stack.Screen name="reservation/form" options={{ title: "Nueva reserva" }} />
        <Stack.Screen name="cash/new" options={{ title: "Nuevo movimiento" }} />
        <Stack.Screen name="clients-at-risk" options={{ title: "Clientes en riesgo" }} />
        <Stack.Screen name="customer" options={{ title: "Cliente" }} />
        <Stack.Screen name="customers" options={{ title: "Clientes" }} />
        <Stack.Screen name="conversations" options={{ title: "Historial" }} />
        <Stack.Screen name="trends/[id]" options={{ title: "Idea de contenido" }} />
        <Stack.Screen name="trends/settings" options={{ title: "Preferencias" }} />
      </Stack>
    </>
  );
}

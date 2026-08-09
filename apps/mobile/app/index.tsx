import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAccessContext } from "@businext/shared-core/hooks";

export default function HomeScreen() {
  // Smoke test de integracion con shared-core (issue #028): si esto
  // compila, se ejecuta y hace la peticion HTTP esperada (verificable con
  // el inspector de red de Expo / Metro), la integracion basica funciona.
  // Requiere un backend real accesible en `EXPO_PUBLIC_API_BASE_URL` (o
  // localhost:8000 por defecto) y un JWT valido guardado en SecureStore
  // para devolver datos reales — sin eso, mostrara el estado de error/401,
  // lo cual en si mismo confirma que la llamada llega al backend.
  const { context, loading } = useAccessContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Businext</Text>
      <Text style={styles.subtitle}>
        App movil en construccion (Fase 5). Hola mundo desde Expo Router.
      </Text>

      <View style={styles.debugBox}>
        <Text style={styles.debugTitle}>Debug: useAccessContext (#028)</Text>
        {loading ? (
          <ActivityIndicator />
        ) : context ? (
          <Text style={styles.debugText}>
            Autenticado como {context.role} en negocio {context.businessId}
          </Text>
        ) : (
          <Text style={styles.debugText}>
            Sin sesion activa (esperado sin login todavia — ver issue #029)
          </Text>
        )}
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  debugBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    gap: 8,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
  },
  debugText: {
    fontSize: 14,
    color: "#333",
  },
});

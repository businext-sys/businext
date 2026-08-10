import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAccessContext } from "@businext/shared-core/hooks";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const { logout } = useAuth();
  // Smoke test de integracion con shared-core (issue #028/#029): si esto
  // compila, se ejecuta y hace la peticion HTTP esperada (verificable con
  // el inspector de red de Expo / Metro), la integracion basica funciona.
  const { context, loading } = useAccessContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Businext</Text>
      <Text style={styles.subtitle}>
        App movil en construccion (Fase 5). Sesion iniciada correctamente.
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
            Sesion sin contexto de negocio (verificar backend/token)
          </Text>
        )}
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Cerrar sesion</Text>
      </Pressable>

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
  logoutButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c0392b",
  },
  logoutButtonText: {
    color: "#c0392b",
    fontWeight: "600",
  },
});

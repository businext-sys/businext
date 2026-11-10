import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAccessContext } from "@businext/shared-core/hooks";
import { useAuth } from "@/context/AuthContext";
import { VoiceAgentSection } from "@/components/VoiceAgentSection";
import { AppearanceSection } from "@/components/AppearanceSection";
import { themedStyles } from "@/theme/ThemeContext";

/**
 * Ajustes (issue #78): cuenta, agente de voz (solo owner), apariencia y
 * cierre de sesion.
 */
export default function SettingsScreen() {
  const styles = useStyles();
  const { logout } = useAuth();
  const { context } = useAccessContext();
  const router = useRouter();
  const canMessageClients = context?.role === "owner" || context?.role === "manager";

  return (
    <View style={styles.flex}>
      {context && (
        <View style={styles.section}>
          <Text style={styles.label}>Cuenta</Text>
          <Text style={styles.value}>{context.profile?.email ?? context.profile?.displayName}</Text>
        </View>
      )}
      {canMessageClients && (
        <Pressable
          style={styles.section}
          onPress={() => router.push("/clients-at-risk")}
          accessibilityRole="button"
        >
          <Text style={styles.value}>Clientes en riesgo</Text>
          <Text style={styles.label}>Escribe a quien hace tiempo que no viene</Text>
        </Pressable>
      )}
      {context?.role === "owner" && <VoiceAgentSection />}
      <AppearanceSection />
      <Pressable style={styles.logout} onPress={logout} accessibilityRole="button">
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  flex: { flex: 1, backgroundColor: colors.background, padding: 16, gap: 16 },
  section: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    gap: 4,
  },
  label: { fontSize: 12, color: colors.foregroundSubtle },
  value: { fontSize: 15, color: colors.foreground },
  logout: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: colors.danger },
}));

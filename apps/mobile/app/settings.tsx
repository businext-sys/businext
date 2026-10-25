import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAccessContext } from "@businext/shared-core/hooks";
import { useAuth } from "@/context/AuthContext";
import { VoiceAgentSection } from "@/components/VoiceAgentSection";
import { colors } from "@/theme/colors";

/**
 * Ajustes (issue #78): cuenta, agente de voz (solo owner) y cierre de sesion.
 */
export default function SettingsScreen() {
  const { logout } = useAuth();
  const { context } = useAccessContext();

  return (
    <View style={styles.flex}>
      {context && (
        <View style={styles.section}>
          <Text style={styles.label}>Cuenta</Text>
          <Text style={styles.value}>{context.profile?.email ?? context.profile?.displayName}</Text>
        </View>
      )}
      {context?.role === "owner" && <VoiceAgentSection />}
      <Pressable style={styles.logout} onPress={logout} accessibilityRole="button">
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

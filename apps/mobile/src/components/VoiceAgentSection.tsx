import { ActivityIndicator, Linking, Pressable, Text, View } from "react-native";
import { useVoiceAgentConfig } from "@businext/shared-core/hooks";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

/**
 * Agente de voz (issue #119): llama al numero del negocio desde el
 * marcador, asi la llamada pasa por el mismo webhook de entrada que la de
 * un cliente. Solo owners: `/voice-agent/config` rechaza al resto con 403.
 */
export function VoiceAgentSection() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { config, loading, error } = useVoiceAgentConfig();

  return (
    <View style={styles.section}>
      <Text style={styles.label}>Agente de voz</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : error || !config ? (
        <Text style={styles.error}>No se pudo cargar el agente de voz.</Text>
      ) : config.phoneNumbers.length === 0 ? (
        <Text style={styles.hint}>Aún no tienes un número asignado.</Text>
      ) : (
        <>
          <Text style={config.enabled ? styles.value : styles.warning}>
            {config.enabled
              ? "Activo: llama para probarlo."
              : "Desactivado: la llamada se rechazará. Actívalo en la configuración de la web."}
          </Text>
          {config.phoneNumbers.map((phoneNumber) => (
            <Pressable
              key={phoneNumber}
              style={styles.call}
              onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
              accessibilityRole="button"
            >
              <Text style={styles.callText}>Llamar al agente</Text>
              <Text style={styles.callNumber}>{phoneNumber}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  section: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    gap: 8,
  },
  label: { fontSize: 12, color: colors.foregroundSubtle },
  value: { fontSize: 15, color: colors.foreground },
  hint: { fontSize: 15, color: colors.foregroundMuted },
  warning: { fontSize: 15, color: colors.warning },
  error: { fontSize: 15, color: colors.danger },
  call: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  callText: { fontSize: 15, fontWeight: "600", color: colors.primaryForeground },
  callNumber: { fontSize: 12, color: colors.primaryForeground },
}));

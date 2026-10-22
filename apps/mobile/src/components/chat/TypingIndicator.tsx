import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export function TypingIndicator({ activity }: { activity: string | null }) {
  const label = activity ?? "Escribiendo…";
  return (
    <View
      style={styles.row}
      accessibilityLiveRegion="polite"
      accessibilityLabel={`Asistente: ${label}`}
      testID="chat-typing"
    >
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: { fontSize: 14, color: colors.foregroundMuted },
});

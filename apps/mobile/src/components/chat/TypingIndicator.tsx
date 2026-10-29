import { ActivityIndicator, Text, View } from "react-native";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

export function TypingIndicator({ activity }: { activity: string | null }) {
  const styles = useStyles();
  const { colors } = useTheme();
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

const useStyles = themedStyles((colors) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: { fontSize: 14, color: colors.foregroundMuted },
}));

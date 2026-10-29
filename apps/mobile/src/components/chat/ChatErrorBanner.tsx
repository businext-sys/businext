import { Pressable, Text, View } from "react-native";
import { themedStyles } from "@/theme/ThemeContext";

export function ChatErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  const styles = useStyles();
  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Text style={styles.text}>{message}</Text>
      <Pressable
        style={styles.retry}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Reintentar"
        testID="chat-retry"
      >
        <Text style={styles.retryText}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

const useStyles = themedStyles((colors) => ({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  text: { flex: 1, fontSize: 14, color: colors.foreground },
  retry: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.danger,
  },
  retryText: { fontSize: 14, fontWeight: "700", color: colors.primaryForeground },
}));

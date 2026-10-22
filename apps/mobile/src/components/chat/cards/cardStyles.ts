import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: 12,
    gap: 10,
  },
  title: { fontSize: 15, fontWeight: "700", color: colors.foreground },
  muted: { fontSize: 13, color: colors.foregroundMuted },
  subtle: { fontSize: 12, color: colors.foregroundSubtle },
  actions: { flexDirection: "row", gap: 8 },
  button: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  primaryButton: { backgroundColor: colors.primary },
  primaryButtonText: { fontSize: 14, fontWeight: "700", color: colors.primaryForeground },
  secondaryButton: { borderWidth: 1, borderColor: colors.border },
  secondaryButtonText: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.surfaceRaised,
  },
  pillText: { fontSize: 11, fontWeight: "700", color: colors.foregroundMuted },
});

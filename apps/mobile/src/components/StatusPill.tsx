import { Text, View } from "react-native";
import { StatusOptions } from "@businext/shared-core";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

export function StatusPill({ status }: { status: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const key = status.toUpperCase();
  const tone: Record<string, string> = {
    PENDING: colors.warning,
    COMPLETED: colors.success,
    NO_SHOW: colors.danger,
  };
  const color = tone[key];
  const label = StatusOptions[key as keyof typeof StatusOptions] ?? status;

  return (
    <View style={[styles.pill, { backgroundColor: color ? `${color}26` : colors.muted }]}>
      <Text style={[styles.text, { color: color ?? colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const useStyles = themedStyles(() => ({
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  text: { fontSize: 12, fontWeight: "700" },
}));

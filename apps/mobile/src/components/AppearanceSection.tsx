import { Pressable, Text, View } from "react-native";
import type { ThemeMode } from "@businext/shared-core/theme";
import { themedStyles, useTheme } from "@/theme/ThemeContext";

const MODES: { value: ThemeMode; label: string }[] = [
  { value: "dark", label: "Oscuro" },
  { value: "light", label: "Claro" },
];

/** Modo de color de la app; se guarda en el dispositivo. */
export function AppearanceSection() {
  const styles = useStyles();
  const { mode, setMode } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={styles.label}>Apariencia</Text>
      <View style={styles.options} accessibilityRole="radiogroup">
        {MODES.map((option) => {
          const selected = mode === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => setMode(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  options: { flexDirection: "row", gap: 8 },
  option: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { fontSize: 15, color: colors.foreground },
  optionTextSelected: { fontWeight: "700", color: colors.primaryForeground },
}));

import { Pressable, ScrollView, Text, View } from "react-native";
import { themedStyles } from "@/theme/ThemeContext";

type Chip = { label: string; message: string };

type Props = {
  chips: Chip[];
  onPress: (message: string) => void;
  wrap?: boolean;
  disabled?: boolean;
};

export function QuickActions({ chips, onPress, wrap = false, disabled = false }: Props) {
  const styles = useStyles();
  if (chips.length === 0) return null;

  const items = chips.map((chip) => (
    <Pressable
      key={chip.label}
      style={[styles.chip, disabled && styles.disabled]}
      onPress={() => onPress(chip.message)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      testID={`chip-${chip.label}`}
    >
      <Text style={styles.chipText}>{chip.label}</Text>
    </Pressable>
  ));

  if (wrap) return <View style={styles.wrap}>{items}</View>;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {items}
    </ScrollView>
  );
}

const useStyles = themedStyles((colors) => ({
  row: { gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
  wrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  chip: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.accent,
  },
  disabled: { opacity: 0.4 },
  chipText: { fontSize: 14, fontWeight: "600", color: colors.accentForeground },
}));
